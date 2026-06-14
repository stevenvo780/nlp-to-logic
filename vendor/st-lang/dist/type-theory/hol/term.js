"use strict";
// ============================================================
// HOL — Operaciones sobre términos
// ============================================================
//
// Type inference, α-equivalencia, sustitución capture-free,
// detección de variables libres, etc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkAbs = exports.mkComb = exports.mkConst = exports.mkVar = void 0;
exports.typeOf = typeOf;
exports.alphaEq = alphaEq;
exports.freeVars = freeVars;
exports.occursFree = occursFree;
exports.freshName = freshName;
exports.substTerm = substTerm;
exports.instTypeInTerm = instTypeInTerm;
exports.termToString = termToString;
exports.eqConst = eqConst;
exports.mkEq = mkEq;
exports.destEq = destEq;
exports.isEq = isEq;
exports.isIff = isIff;
const type_system_1 = require("./type-system");
// Constructores ergonómicos ------------------------------------
const mkVar = (name, type) => ({ kind: 'var', name, type });
exports.mkVar = mkVar;
const mkConst = (name, type) => ({ kind: 'const', name, type });
exports.mkConst = mkConst;
const mkComb = (fn, arg) => {
    // Bien-formado: el tipo de `fn` debe ser `T(arg) → ?` y los
    // dominios deben coincidir.
    const fnType = typeOf(fn);
    const argType = typeOf(arg);
    if (!(0, type_system_1.isFunType)(fnType)) {
        throw new Error(`mkComb: el lado izquierdo no es función: ${termToString(fn)} : ${(0, type_system_1.typeToString)(fnType)}`);
    }
    if (!(0, type_system_1.typeEq)((0, type_system_1.funDomain)(fnType), argType)) {
        throw new Error(`mkComb: tipos incompatibles. esperaba ${(0, type_system_1.typeToString)((0, type_system_1.funDomain)(fnType))}, ` +
            `recibido ${(0, type_system_1.typeToString)(argType)}`);
    }
    return { kind: 'comb', fn, arg };
};
exports.mkComb = mkComb;
const mkAbs = (param, paramType, body) => ({
    kind: 'abs',
    param,
    paramType,
    body,
});
exports.mkAbs = mkAbs;
// Type inference -----------------------------------------------
/**
 * Calcula el tipo de un término bien formado. Lanza si el
 * término está mal tipado (combinación con dominios disjuntos).
 */
function typeOf(t) {
    switch (t.kind) {
        case 'var':
        case 'const':
            return t.type;
        case 'abs':
            return (0, type_system_1.funTy)(t.paramType, typeOf(t.body));
        case 'comb': {
            const fnType = typeOf(t.fn);
            const argType = typeOf(t.arg);
            if (!(0, type_system_1.isFunType)(fnType)) {
                throw new Error(`typeOf: aplicación sobre no-función: ${termToString(t.fn)} : ${(0, type_system_1.typeToString)(fnType)}`);
            }
            if (!(0, type_system_1.typeEq)((0, type_system_1.funDomain)(fnType), argType)) {
                throw new Error(`typeOf: tipos incompatibles en aplicación: ` +
                    `${(0, type_system_1.typeToString)((0, type_system_1.funDomain)(fnType))} vs ${(0, type_system_1.typeToString)(argType)}`);
            }
            return (0, type_system_1.funCodomain)(fnType);
        }
    }
}
// α-equivalencia ----------------------------------------------
/**
 * Igualdad estructural módulo α-renaming. Implementación con
 * dos mapas de profundidad (de Bruijn implícito sobre nombres).
 */
function alphaEq(a, b) {
    return alphaEqAux(a, b, new Map(), new Map(), 0);
}
function alphaEqAux(a, b, envA, envB, depth) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'var': {
            const bb = b;
            // Misma variable: o ambas ligadas a la misma profundidad,
            // o ambas libres con mismo nombre y mismo tipo.
            const da = envA.get(a.name);
            const db = envB.get(bb.name);
            if (da !== undefined && db !== undefined) {
                return da === db && (0, type_system_1.typeEq)(a.type, bb.type);
            }
            if (da === undefined && db === undefined) {
                return a.name === bb.name && (0, type_system_1.typeEq)(a.type, bb.type);
            }
            return false;
        }
        case 'const': {
            const bb = b;
            return a.name === bb.name && (0, type_system_1.typeEq)(a.type, bb.type);
        }
        case 'comb': {
            const bb = b;
            return (alphaEqAux(a.fn, bb.fn, envA, envB, depth) && alphaEqAux(a.arg, bb.arg, envA, envB, depth));
        }
        case 'abs': {
            const bb = b;
            if (!(0, type_system_1.typeEq)(a.paramType, bb.paramType))
                return false;
            // Sombreamos en ambos environments con la misma profundidad
            // para que las ocurrencias del binder coincidan.
            const nextA = new Map(envA);
            const nextB = new Map(envB);
            nextA.set(a.param, depth);
            nextB.set(bb.param, depth);
            return alphaEqAux(a.body, bb.body, nextA, nextB, depth + 1);
        }
    }
}
/**
 * Devuelve las variables libres de `t` con su tipo. Una variable
 * con mismo nombre pero distinto tipo aparece dos veces.
 */
function freeVars(t, out = []) {
    const seen = new Set();
    const collect = (term, bound) => {
        switch (term.kind) {
            case 'var': {
                const boundType = bound.get(term.name);
                if (boundType !== undefined && (0, type_system_1.typeEq)(boundType, term.type))
                    return;
                const key = `${term.name}::${(0, type_system_1.typeToString)(term.type)}`;
                if (seen.has(key))
                    return;
                seen.add(key);
                out.push({ name: term.name, type: term.type });
                return;
            }
            case 'const':
                return;
            case 'comb':
                collect(term.fn, bound);
                collect(term.arg, bound);
                return;
            case 'abs': {
                const next = new Map(bound);
                next.set(term.param, term.paramType);
                collect(term.body, next);
                return;
            }
        }
    };
    collect(t, new Map());
    return out;
}
/**
 * Devuelve true si `name` aparece libre en `term` con tipo `ty`.
 */
function occursFree(name, ty, term) {
    return freeVars(term).some((v) => v.name === name && (0, type_system_1.typeEq)(v.type, ty));
}
/** Genera un nombre fresco respecto a un conjunto de nombres prohibidos. */
function freshName(base, forbidden) {
    if (!forbidden.has(base))
        return base;
    let i = 0;
    while (forbidden.has(`${base}'${i}`))
        i++;
    return `${base}'${i}`;
}
// Sustitución capture-free -----------------------------------
/**
 * Sustituye [v := value] en `term`. Renombra binders si haría
 * falta para evitar captura. `v` se identifica por nombre + tipo.
 */
function substTerm(name, ty, value, term) {
    if (!(0, type_system_1.typeEq)(typeOf(value), ty)) {
        throw new Error(`substTerm: el valor tiene tipo ${(0, type_system_1.typeToString)(typeOf(value))}, esperaba ${(0, type_system_1.typeToString)(ty)}`);
    }
    return substTermAux(name, ty, value, term, collectAllVarNames(value));
}
function substTermAux(name, ty, value, term, valueVars) {
    switch (term.kind) {
        case 'var':
            if (term.name === name && (0, type_system_1.typeEq)(term.type, ty))
                return value;
            return term;
        case 'const':
            return term;
        case 'comb':
            return {
                kind: 'comb',
                fn: substTermAux(name, ty, value, term.fn, valueVars),
                arg: substTermAux(name, ty, value, term.arg, valueVars),
            };
        case 'abs': {
            // Si el binder shadowsa exactamente la variable objetivo,
            // la sustitución es identidad dentro del body.
            if (term.param === name && (0, type_system_1.typeEq)(term.paramType, ty))
                return term;
            // Captura: el binder coincide con una variable libre de `value`.
            if (valueVars.has(term.param) && occursFree(name, ty, term.body)) {
                const forbidden = new Set([...valueVars, ...collectAllVarNames(term.body), name]);
                const fresh = freshName(term.param, forbidden);
                const renamedBody = renameBoundVar(term.param, term.paramType, fresh, term.body);
                return {
                    kind: 'abs',
                    param: fresh,
                    paramType: term.paramType,
                    body: substTermAux(name, ty, value, renamedBody, valueVars),
                };
            }
            return {
                kind: 'abs',
                param: term.param,
                paramType: term.paramType,
                body: substTermAux(name, ty, value, term.body, valueVars),
            };
        }
    }
}
/** Renombra ocurrencias libres de `(from : ty)` por `to` en `term`. */
function renameBoundVar(from, ty, to, term) {
    switch (term.kind) {
        case 'var':
            if (term.name === from && (0, type_system_1.typeEq)(term.type, ty)) {
                return { kind: 'var', name: to, type: term.type };
            }
            return term;
        case 'const':
            return term;
        case 'comb':
            return {
                kind: 'comb',
                fn: renameBoundVar(from, ty, to, term.fn),
                arg: renameBoundVar(from, ty, to, term.arg),
            };
        case 'abs': {
            if (term.param === from && (0, type_system_1.typeEq)(term.paramType, ty))
                return term;
            return {
                kind: 'abs',
                param: term.param,
                paramType: term.paramType,
                body: renameBoundVar(from, ty, to, term.body),
            };
        }
    }
}
function collectAllVarNames(term, out = new Set()) {
    switch (term.kind) {
        case 'var':
            out.add(term.name);
            return out;
        case 'const':
            return out;
        case 'comb':
            collectAllVarNames(term.fn, out);
            return collectAllVarNames(term.arg, out);
        case 'abs':
            out.add(term.param);
            return collectAllVarNames(term.body, out);
    }
}
// Sustitución de variables de tipo en términos ----------------
function instTypeInTerm(subst, term) {
    switch (term.kind) {
        case 'var':
            return { kind: 'var', name: term.name, type: (0, type_system_1.substType)(subst, term.type) };
        case 'const':
            return { kind: 'const', name: term.name, type: (0, type_system_1.substType)(subst, term.type) };
        case 'comb':
            return {
                kind: 'comb',
                fn: instTypeInTerm(subst, term.fn),
                arg: instTypeInTerm(subst, term.arg),
            };
        case 'abs':
            return {
                kind: 'abs',
                param: term.param,
                paramType: (0, type_system_1.substType)(subst, term.paramType),
                body: instTypeInTerm(subst, term.body),
            };
    }
}
// Pretty-printing --------------------------------------------
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'const':
            return t.name;
        case 'comb':
            return `(${termToString(t.fn)} ${termToString(t.arg)})`;
        case 'abs':
            return `(λ${t.param}:${(0, type_system_1.typeToString)(t.paramType)}. ${termToString(t.body)})`;
    }
}
// Igualdad como aplicación primitiva --------------------------
/**
 * Constructor de igualdad polimórfica `= : α → α → bool`.
 * Devuelve la `const` `=` instanciada al tipo del término.
 */
function eqConst(ty) {
    return (0, exports.mkConst)('=', (0, type_system_1.funTy)(ty, (0, type_system_1.funTy)(ty, type_system_1.TyBool)));
}
/** Construye el término `l = r` (chequea que sus tipos coincidan). */
function mkEq(l, r) {
    const ty = typeOf(l);
    if (!(0, type_system_1.typeEq)(ty, typeOf(r))) {
        throw new Error(`mkEq: tipos diferentes — ${(0, type_system_1.typeToString)(ty)} vs ${(0, type_system_1.typeToString)(typeOf(r))}`);
    }
    return (0, exports.mkComb)((0, exports.mkComb)(eqConst(ty), l), r);
}
/** Descompone `l = r` en `[l, r]` o null si no es igualdad. */
function destEq(t) {
    // Forma: ((= ty) l) r
    if (t.kind !== 'comb')
        return null;
    if (t.fn.kind !== 'comb')
        return null;
    const head = t.fn.fn;
    if (head.kind !== 'const' || head.name !== '=')
        return null;
    return [t.fn.arg, t.arg];
}
/** True si `t` es una igualdad de la forma `l = r`. */
function isEq(t) {
    return destEq(t) !== null;
}
/** True si `t` es una bi-implicación bool ↔ bool (sintácticamente `=` sobre bool). */
function isIff(t) {
    const parts = destEq(t);
    if (parts === null)
        return false;
    // El término-igualdad tiene tipo bool si los lados son bool.
    return (0, type_system_1.typeEq)(typeOf(parts[0]), type_system_1.TyBool);
}
//# sourceMappingURL=term.js.map