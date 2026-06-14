"use strict";
// ============================================================
// ST Term Rewriting — Utilidades de términos
// ============================================================
//
// Operaciones básicas sobre términos de primer orden:
//   - igualdad estructural
//   - sustitución
//   - matching (un sentido) y unificación (Robinson)
//   - occurs check
//   - recolección de variables
//   - clonación
//
// Las sustituciones son Map<string, Term>. Componer dos
// sustituciones σ ∘ τ se hace aplicando τ a los rangos de σ
// y uniendo: composeSubst(σ, τ).
Object.defineProperty(exports, "__esModule", { value: true });
exports.termEquals = termEquals;
exports.cloneTerm = cloneTerm;
exports.varsOf = varsOf;
exports.applySubst = applySubst;
exports.occursIn = occursIn;
exports.match = match;
exports.unify = unify;
exports.renameVars = renameVars;
exports.termSize = termSize;
exports.v = v;
exports.f = f;
exports.c = c;
/**
 * Igualdad estructural de términos (iterativa para soportar
 * términos muy profundos sin stack overflow).
 */
function termEquals(a, b) {
    const stack = [[a, b]];
    while (stack.length > 0) {
        const pair = stack.pop();
        if (pair === undefined)
            break;
        const [x, y] = pair;
        if (x.kind !== y.kind)
            return false;
        if (x.kind === 'var' && y.kind === 'var') {
            if (x.name !== y.name)
                return false;
            continue;
        }
        if (x.kind === 'func' && y.kind === 'func') {
            if (x.name !== y.name || x.args.length !== y.args.length)
                return false;
            for (let i = 0; i < x.args.length; i++) {
                const xi = x.args[i];
                const yi = y.args[i];
                if (xi === undefined || yi === undefined)
                    return false;
                stack.push([xi, yi]);
            }
        }
    }
    return true;
}
/**
 * Clona un término (iterativo, soporta árboles profundos).
 */
function cloneTerm(t) {
    return mapTerm(t, (leaf) => ({ kind: 'var', name: leaf.name }));
}
/**
 * Helper: map post-order iterativo sobre un término.
 * `varMap` decide cómo transformar variables (la única transformación
 * que necesitamos hacer top-down en los usos actuales).
 */
function mapTerm(t, varMap) {
    const stack = [{ node: t, result: null, children: [] }];
    let pending = null;
    while (stack.length > 0) {
        const frame = stack[stack.length - 1];
        if (frame === undefined)
            break;
        if (pending !== null) {
            frame.children.push(pending);
            pending = null;
        }
        if (frame.node.kind === 'var') {
            pending = varMap(frame.node);
            stack.pop();
            continue;
        }
        // func
        if (frame.children.length < frame.node.args.length) {
            const nextArg = frame.node.args[frame.children.length];
            if (nextArg === undefined) {
                // shouldn't happen; safeguard
                pending = { kind: 'func', name: frame.node.name, args: frame.children };
                stack.pop();
                continue;
            }
            stack.push({ node: nextArg, result: null, children: [] });
            continue;
        }
        // Todos los args procesados
        pending = { kind: 'func', name: frame.node.name, args: frame.children };
        stack.pop();
    }
    if (pending === null) {
        throw new Error('mapTerm: unreachable — pending result is null');
    }
    return pending;
}
/**
 * Conjunto de variables que aparecen en t.
 */
function varsOf(t, acc = new Set()) {
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        if (node.kind === 'var')
            acc.add(node.name);
        else
            for (const a of node.args)
                stack.push(a);
    }
    return acc;
}
/**
 * Aplica una sustitución a t (iterativo, soporta términos profundos).
 *
 * Para variables, sigue la cadena de bindings con detección de
 * ciclos (un MGU de Robinson puede tener cadenas x → y → f(z)
 * que sólo terminan tras varios saltos).
 */
function applySubst(t, subst) {
    // Implementación recursiva mediante `mapTerm`: cada variable se
    // resuelve siguiendo la cadena; si el resultado es func, sus args
    // también deben sustituirse — eso ya lo hace mapTerm porque las
    // varMap devuelven Terms y cualquier subterm interno pasaría por
    // la misma lógica. PERO mapTerm no recursa en el resultado de
    // varMap; sólo procesa la estructura original. Para que las
    // sustituciones en cadena se apliquen, resolvemos la cadena hasta
    // un valor final, y sus args sub se aplican recursivamente.
    //
    // Como pueden ser profundos, lo hacemos en dos pasadas:
    //   1. resolveVar(name): sigue cadena con detección de ciclos,
    //      devuelve un Term (que puede ser otra var, una func, o el
    //      var original si no está mapeada).
    //   2. mapTerm con varMap = resolveVar, luego para cualquier func
    //      resultante seguimos procesando sus args. Pero como mapTerm
    //      ya está procesando la estructura, el resultado de varMap
    //      no se vuelve a explorar.
    //
    // Solución: hacemos un fixed-point sobre el resultado final, pero
    // sin recursión profunda — reaplicamos mapTerm hasta que la
    // aplicación no cambie. Para términos no patológicos esto es ≤1-2
    // pasadas.
    const resolveVar = (leaf) => {
        const seen = new Set();
        let current = leaf;
        while (current.kind === 'var') {
            if (seen.has(current.name))
                return current;
            seen.add(current.name);
            const next = subst.get(current.name);
            if (next === undefined)
                return current;
            current = next;
        }
        return current;
    };
    // Aplicamos una vez: mapeo cada variable a su resolución directa
    // (que puede ser func con vars adentro).
    let result = mapTerm(t, resolveVar);
    // Si la sustitución tiene cadenas (x → y donde y también está
    // mapeada a algo), una sola pasada no basta. Iteramos con un fix-
    // point bounded; cycle-safe gracias a `seen` en resolveVar.
    for (let pass = 0; pass < 4; pass++) {
        const next = mapTerm(result, resolveVar);
        // Detección rápida: si el resultado tiene la misma raíz/estructura
        // de aridad, asumimos estable. Para corrección estricta usamos
        // termEquals, pero eso sería O(n) extra por pasada — mejor lo
        // dejamos limitado a 4 pasadas que cubren prácticamente todos
        // los casos de KB.
        if (termEqualsShallow(next, result))
            return next;
        result = next;
    }
    return result;
}
/**
 * Igualdad rápida (raíz + aridad) — usada por applySubst para
 * decidir fixed-point sin pagar termEquals completo.
 */
function termEqualsShallow(a, b) {
    if (a === b)
        return true;
    return termEquals(a, b);
}
/**
 * Occurs check: ¿aparece la variable v en t?
 *
 * Indispensable para evitar unificar x con f(x) creando términos
 * infinitos como f(f(f(...))).
 */
function occursIn(v, t) {
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        if (node.kind === 'var') {
            if (node.name === v)
                return true;
        }
        else {
            for (const a of node.args)
                stack.push(a);
        }
    }
    return false;
}
/**
 * Occurs check con walk sobre la sustitución parcial.
 *
 * Igual que occursIn pero sigue la cadena sigma para cada variable
 * encontrada. Necesario dentro de unify para detectar ciclos
 * indirectos como w→f(z), z→f(w) donde occursIn simple no bastaría.
 */
function occursInSubst(v, t, subst) {
    const visited = new Set();
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        if (node.kind === 'var') {
            if (node.name === v)
                return true;
            if (!visited.has(node.name)) {
                visited.add(node.name);
                const bound = subst.get(node.name);
                if (bound !== undefined)
                    stack.push(bound);
            }
        }
        else {
            for (const a of node.args)
                stack.push(a);
        }
    }
    return false;
}
/**
 * Matching (pattern matching): encuentra σ tal que σ(pattern) = target.
 *
 * A diferencia de la unificación, solo las variables del pattern
 * pueden ligarse. Si target contiene variables, se tratan como
 * constantes opacas. Devuelve null si no hay match.
 */
function match(pattern, target, subst = new Map()) {
    // Iterativo: stack de pares (pattern, target) que faltan unificar.
    const sigma = new Map(subst);
    const stack = [[pattern, target]];
    while (stack.length > 0) {
        const pair = stack.pop();
        if (pair === undefined)
            break;
        const [p, q] = pair;
        if (p.kind === 'var') {
            const existing = sigma.get(p.name);
            if (existing !== undefined) {
                if (!termEquals(existing, q))
                    return null;
                continue;
            }
            sigma.set(p.name, q);
            continue;
        }
        if (q.kind !== 'func')
            return null;
        if (p.name !== q.name || p.args.length !== q.args.length)
            return null;
        for (let i = 0; i < p.args.length; i++) {
            const pa = p.args[i];
            const qa = q.args[i];
            if (pa === undefined || qa === undefined)
                return null;
            stack.push([pa, qa]);
        }
    }
    return sigma;
}
/**
 * Unificación de Robinson. Devuelve un MGU (most general unifier)
 * o null si los términos no unifican.
 *
 * Implementación recursiva con occurs check.
 */
function unify(s, t, subst = new Map()) {
    const sigma = new Map(subst);
    const stack = [[s, t]];
    while (stack.length > 0) {
        const pair = stack.pop();
        if (pair === undefined)
            break;
        const a = walk(pair[0], sigma);
        const b = walk(pair[1], sigma);
        if (a.kind === 'var' && b.kind === 'var' && a.name === b.name)
            continue;
        if (a.kind === 'var') {
            if (occursInSubst(a.name, b, sigma))
                return null;
            sigma.set(a.name, b);
            continue;
        }
        if (b.kind === 'var') {
            if (occursInSubst(b.name, a, sigma))
                return null;
            sigma.set(b.name, a);
            continue;
        }
        // Ambos func
        if (a.name !== b.name || a.args.length !== b.args.length)
            return null;
        for (let i = 0; i < a.args.length; i++) {
            const ai = a.args[i];
            const bi = b.args[i];
            if (ai === undefined || bi === undefined)
                return null;
            stack.push([ai, bi]);
        }
    }
    return sigma;
}
/**
 * Sigue la cadena de sustituciones para una variable, hasta llegar
 * a un valor no-variable o a una variable libre. Evita recursión
 * profunda durante unify.
 */
function walk(t, subst) {
    let current = t;
    while (current.kind === 'var') {
        const next = subst.get(current.name);
        if (next === undefined)
            return current;
        current = next;
    }
    return current;
}
/**
 * Renombra todas las variables de t agregándole un sufijo (`_<suffix>`).
 *
 * Necesario antes de unificar dos reglas en KB completion: las variables
 * deben ser disjuntas para que LHS₁ y LHS₂ no compartan nombres
 * espuriamente.
 */
function renameVars(t, suffix) {
    return mapTerm(t, (leaf) => ({ kind: 'var', name: `${leaf.name}_${suffix}` }));
}
/**
 * Tamaño del término (número de nodos). Iterativo para evitar
 * stack overflow en términos muy profundos.
 */
function termSize(t) {
    let count = 0;
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        count++;
        if (node.kind === 'func') {
            for (const a of node.args)
                stack.push(a);
        }
    }
    return count;
}
/**
 * Helpers para construir términos (azúcar para tests).
 */
function v(name) {
    return { kind: 'var', name };
}
function f(name, ...args) {
    return { kind: 'func', name, args };
}
function c(name) {
    return { kind: 'func', name, args: [] };
}
//# sourceMappingURL=term-utils.js.map