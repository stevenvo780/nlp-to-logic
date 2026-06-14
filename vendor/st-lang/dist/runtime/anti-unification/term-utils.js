"use strict";
// ============================================================
// ST Anti-Unification — Utilidades de términos
// ============================================================
//
// Helpers locales al módulo de anti-unification. Se mantienen
// separados de term-rewriting/term-utils porque el shape de Term
// es distinto (admite `kind: 'const'` con `args?` opcional).
Object.defineProperty(exports, "__esModule", { value: true });
exports.termEquals = termEquals;
exports.termKey = termKey;
exports.varsOf = varsOf;
exports.applySubst = applySubst;
exports.termSize = termSize;
exports.v = v;
exports.c = c;
exports.f = f;
/**
 * Igualdad estructural de términos (iterativa, soporta árboles
 * profundos sin stack overflow).
 *
 * Tolera la dualidad const/func-con-args=[]: un `const a` y un
 * `func a` con args=[] cuentan como iguales para no penalizar al
 * cliente que mezcle ambas convenciones.
 */
function termEquals(a, b) {
    const stack = [[a, b]];
    while (stack.length > 0) {
        const pair = stack.pop();
        if (pair === undefined)
            break;
        const [x, y] = pair;
        // Variables: igualdad por nombre.
        if (x.kind === 'var' || y.kind === 'var') {
            if (x.kind !== y.kind)
                return false;
            if (x.name !== y.name)
                return false;
            continue;
        }
        // func/const con mismo nombre y misma aridad.
        if (x.name !== y.name)
            return false;
        const xa = x.args ?? [];
        const ya = y.args ?? [];
        if (xa.length !== ya.length)
            return false;
        for (let i = 0; i < xa.length; i++) {
            const xi = xa[i];
            const yi = ya[i];
            if (xi === undefined || yi === undefined)
                return false;
            stack.push([xi, yi]);
        }
    }
    return true;
}
/**
 * Serialización canónica de un término. Usada para comparar pares
 * (t1, t2) en la tabla de desacuerdos del algoritmo de Plotkin.
 *
 * Usa caracteres no-alfanuméricos como separadores para evitar
 * ambigüedades con nombres que contengan paréntesis o comas.
 */
function termKey(t) {
    // Iterativo con encoding postorden simple. Para términos típicos
    // el costo es lineal en el tamaño del término.
    const out = [];
    walkPreorder(t, (node) => {
        if (node.kind === 'var') {
            out.push(`§v⟨${node.name}⟩`);
        }
        else if (node.kind === 'const') {
            out.push(`§c⟨${node.name}⟩`);
        }
        else {
            out.push(`§f⟨${node.name}/${(node.args ?? []).length}⟩`);
        }
    });
    return out.join('');
}
/**
 * Recorrido preorden iterativo de un término.
 */
function walkPreorder(t, visit) {
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        visit(node);
        if (node.kind === 'func') {
            const args = node.args ?? [];
            // Push en orden inverso para que el recorrido salga izq→der.
            for (let i = args.length - 1; i >= 0; i--) {
                const a = args[i];
                if (a !== undefined)
                    stack.push(a);
            }
        }
    }
}
/**
 * Conjunto de variables que aparecen en t (iterativo).
 */
function varsOf(t, acc = new Set()) {
    const stack = [t];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined)
            break;
        if (node.kind === 'var') {
            acc.add(node.name);
        }
        else if (node.kind === 'func') {
            for (const a of node.args ?? [])
                stack.push(a);
        }
    }
    return acc;
}
/**
 * Aplica una sustitución a un término (no compone cadenas — la
 * sustitución es plana, no recursiva, porque las generadas por
 * antiUnify son siempre con vars frescas a la izquierda y términos
 * cerrados-respecto-a-vars-frescas a la derecha).
 */
function applySubst(t, subst) {
    if (t.kind === 'var') {
        const bound = subst.get(t.name);
        if (bound === undefined)
            return t;
        return bound;
    }
    if (t.kind === 'const')
        return t;
    const args = t.args ?? [];
    const newArgs = new Array(args.length);
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === undefined) {
            throw new Error('applySubst: arg undefined en términos func');
        }
        newArgs[i] = applySubst(a, subst);
    }
    return { kind: 'func', name: t.name, args: newArgs };
}
/**
 * Tamaño del término (cantidad de nodos).
 */
function termSize(t) {
    let n = 0;
    walkPreorder(t, () => {
        n++;
    });
    return n;
}
// ---------------------------------------------------------------
// Constructores azúcar para tests y uso directo.
// ---------------------------------------------------------------
/** Variable. */
function v(name) {
    return { kind: 'var', name };
}
/** Constante (sin args). */
function c(name) {
    return { kind: 'const', name };
}
/** Aplicación de función. */
function f(name, ...args) {
    return { kind: 'func', name, args };
}
//# sourceMappingURL=term-utils.js.map