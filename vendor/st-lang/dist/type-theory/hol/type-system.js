"use strict";
// ============================================================
// HOL — Sistema de tipos
// ============================================================
//
// Tipos simples polimórficos: variables de tipo, constantes y
// aplicaciones. La función `fun(A, B)` representa el flecha.
Object.defineProperty(exports, "__esModule", { value: true });
exports.funTyN = exports.funTy = exports.TyInd = exports.TyBool = exports.tapp = exports.tconst = exports.tvar = void 0;
exports.typeEq = typeEq;
exports.isFunType = isFunType;
exports.funDomain = funDomain;
exports.funCodomain = funCodomain;
exports.typeToString = typeToString;
exports.substType = substType;
exports.freeTypeVars = freeTypeVars;
/** Construye una variable de tipo `α`, `β`, etc. */
const tvar = (name) => ({ kind: 'tvar', name });
exports.tvar = tvar;
/** Constante de tipo: `bool`, `ind`, ... */
const tconst = (name) => ({ kind: 'tconst', name });
exports.tconst = tconst;
/** Aplicación de constructor de tipo (e.g. `fun`, `prod`). */
const tapp = (fn, args) => ({ kind: 'tapp', fn, args });
exports.tapp = tapp;
// Constantes predefinidas ------------------------------------
exports.TyBool = (0, exports.tconst)('bool');
exports.TyInd = (0, exports.tconst)('ind');
/** `A → B` */
const funTy = (from, to) => (0, exports.tapp)('fun', [from, to]);
exports.funTy = funTy;
/** Empareja `A → B → ...` de derecha a izquierda. */
const funTyN = (...types) => {
    if (types.length === 0) {
        throw new Error('funTyN: necesita al menos un tipo');
    }
    if (types.length === 1) {
        return types[0];
    }
    let acc = types[types.length - 1];
    for (let i = types.length - 2; i >= 0; i--) {
        acc = (0, exports.funTy)(types[i], acc);
    }
    return acc;
};
exports.funTyN = funTyN;
/**
 * Igualdad estructural de tipos. Las variables de tipo se
 * comparan por nombre (no hay α-renaming sobre tipos en HOL).
 */
function typeEq(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'tvar':
            return a.name === b.name;
        case 'tconst':
            return a.name === b.name;
        case 'tapp': {
            const bb = b;
            if (a.fn !== bb.fn)
                return false;
            if (a.args.length !== bb.args.length)
                return false;
            for (let i = 0; i < a.args.length; i++) {
                if (!typeEq(a.args[i], bb.args[i]))
                    return false;
            }
            return true;
        }
    }
}
/** Devuelve true si `t` es una flecha `A → B`. */
function isFunType(t) {
    return t.kind === 'tapp' && t.fn === 'fun' && t.args.length === 2;
}
/** Dominio de una flecha. Lanza si el tipo no es flecha. */
function funDomain(t) {
    if (!isFunType(t)) {
        throw new Error(`funDomain: el tipo no es una función: ${typeToString(t)}`);
    }
    return t.args[0];
}
/** Codominio de una flecha. Lanza si el tipo no es flecha. */
function funCodomain(t) {
    if (!isFunType(t)) {
        throw new Error(`funCodomain: el tipo no es una función: ${typeToString(t)}`);
    }
    return t.args[1];
}
/** Pretty-printer; útil para mensajes de error y tests. */
function typeToString(t) {
    switch (t.kind) {
        case 'tvar':
            return t.name;
        case 'tconst':
            return t.name;
        case 'tapp':
            if (t.fn === 'fun' && t.args.length === 2) {
                return `(${typeToString(t.args[0])} → ${typeToString(t.args[1])})`;
            }
            return `${t.fn}(${t.args.map(typeToString).join(', ')})`;
    }
}
/**
 * Sustitución sobre variables de tipo. Aplica `subst` a `t`
 * de manera capture-free (los tipos no tienen binders).
 */
function substType(subst, t) {
    switch (t.kind) {
        case 'tvar':
            return Object.prototype.hasOwnProperty.call(subst, t.name) ? subst[t.name] : t;
        case 'tconst':
            return t;
        case 'tapp':
            return (0, exports.tapp)(t.fn, t.args.map((a) => substType(subst, a)));
    }
}
/** Recolecta los nombres de las variables de tipo libres en `t`. */
function freeTypeVars(t, out = new Set()) {
    switch (t.kind) {
        case 'tvar':
            out.add(t.name);
            return out;
        case 'tconst':
            return out;
        case 'tapp':
            for (const a of t.args)
                freeTypeVars(a, out);
            return out;
    }
}
//# sourceMappingURL=type-system.js.map