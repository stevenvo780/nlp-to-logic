"use strict";
// ============================================================
// Refinement types — AST, tipos refinados y términos
// ============================================================
//
// Un tipo refinado expresa { x : B | P(x) } donde:
//   - B es un tipo base (Int / Bool / String / arrow)
//   - x es la variable de binding
//   - P(x) es un predicado escrito como expresión sintáctica
//     (cadenas de la forma "x > 0 && x < 100").
//
// El módulo es minimalista (al estilo Liquid Haskell didáctico):
// el solver de VCs no es Z3 — es un evaluador/SAT-search sobre
// enteros y booleanos suficiente para los predicados que se
// construyen en los tests y para casos pequeños de subtipado.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rLet = exports.rApp = exports.rLam = exports.rIf = exports.rBinop = exports.rVar = exports.rLit = exports.refine = exports.tArrow = exports.tString = exports.tBool = exports.tInt = void 0;
exports.eqBase = eqBase;
exports.eqRefType = eqRefType;
exports.baseToString = baseToString;
exports.refTypeToString = refTypeToString;
exports.termToString = termToString;
// ---------- Constructores convenientes ----------
/** Construye el tipo refinado `{ binding : Int | predicate }`. */
const tInt = (binding = '_v', predicate = 'true') => ({
    base: 'Int',
    binding,
    predicate,
});
exports.tInt = tInt;
/** Construye el tipo refinado `{ binding : Bool | predicate }`. */
const tBool = (binding = '_v', predicate = 'true') => ({
    base: 'Bool',
    binding,
    predicate,
});
exports.tBool = tBool;
/** Construye el tipo refinado `{ binding : String | predicate }`. */
const tString = (binding = '_v', predicate = 'true') => ({
    base: 'String',
    binding,
    predicate,
});
exports.tString = tString;
/**
 * Construye un tipo refinado flecha `{ binding : (from -> to) | predicate }`.
 * @param from - Tipo del parámetro.
 * @param to - Tipo del resultado.
 */
const tArrow = (from, to, binding = '_v', predicate = 'true') => ({
    base: { kind: 'arrow', from, to },
    binding,
    predicate,
});
exports.tArrow = tArrow;
/**
 * Construye un tipo refinado a partir de sus partes.
 * @param base - Tipo base (primitivo o flecha).
 * @param binding - Nombre de la variable de binding.
 * @param predicate - Predicado textual sobre la variable.
 */
const refine = (base, binding, predicate) => ({
    base,
    binding,
    predicate,
});
exports.refine = refine;
// ---------- Constructores de términos ----------
/** Crea un literal (número, booleano o cadena). */
const rLit = (value) => ({ kind: 'lit', value });
exports.rLit = rLit;
/** Crea una referencia a variable por nombre. */
const rVar = (name) => ({ kind: 'var', name });
exports.rVar = rVar;
/**
 * Crea una expresión binaria con operador `op`.
 * @param op - Operador aritmético, de comparación o lógico.
 */
const rBinop = (op, left, right) => ({ kind: 'binop', op, left, right });
exports.rBinop = rBinop;
/** Crea una expresión condicional `if cond then t else e`. */
const rIf = (cond, t, e) => ({
    kind: 'if',
    cond,
    then: t,
    else: e,
});
exports.rIf = rIf;
/** Crea una abstracción lambda con tipo refinado para el parámetro. */
const rLam = (param, paramType, body) => ({
    kind: 'lam',
    param,
    paramType,
    body,
});
exports.rLam = rLam;
/** Crea una aplicación de función a argumento. */
const rApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.rApp = rApp;
/** Crea un `let bind = value in body` con anotación de tipo opcional. */
const rLet = (bind, value, body, bindType) => ({
    kind: 'let',
    bind,
    bindType,
    value,
    body,
});
exports.rLet = rLet;
// ---------- Igualdad estructural de tipos base ----------
/**
 * Comprueba igualdad estructural de dos `BaseType`.
 * Para flechas, delega en `eqRefType` para los subtipos.
 */
function eqBase(a, b) {
    if (typeof a === 'string' || typeof b === 'string')
        return a === b;
    // both arrows
    return eqRefType(a.from, b.from) && eqRefType(a.to, b.to);
}
/**
 * Comprueba igualdad estructural de dos `RefType` (ignora predicados;
 * la equivalencia semántica la maneja el subtipado).
 */
function eqRefType(a, b) {
    if (!eqBase(a.base, b.base))
        return false;
    // No exigimos la igualdad textual del predicado a este nivel; el chequeo de
    // subtipado se ocupa de la equivalencia semántica (P ↔ Q).
    return true;
}
// ---------- Serialización legible ----------
/** Serializa un `BaseType` en notación legible (e.g. `Int`, `(T) -> (U)`). */
function baseToString(b) {
    if (typeof b === 'string')
        return b;
    return `(${refTypeToString(b.from)}) -> (${refTypeToString(b.to)})`;
}
/** Serializa un `RefType` como `{ v : B | P }` (sin predicado si es trivial). */
function refTypeToString(t) {
    const pred = t.predicate.trim();
    if (pred === '' || pred === 'true') {
        return `{ ${t.binding} : ${baseToString(t.base)} }`;
    }
    return `{ ${t.binding} : ${baseToString(t.base)} | ${pred} }`;
}
/** Serializa un `RTerm` en notación legible para debugging y mensajes de error. */
function termToString(t) {
    switch (t.kind) {
        case 'lit':
            return typeof t.value === 'string' ? JSON.stringify(t.value) : String(t.value);
        case 'var':
            return t.name;
        case 'binop':
            return `(${termToString(t.left)} ${t.op} ${termToString(t.right)})`;
        case 'if':
            return `if ${termToString(t.cond)} then ${termToString(t.then)} else ${termToString(t.else)}`;
        case 'lam':
            return `(λ ${t.param} : ${refTypeToString(t.paramType)} . ${termToString(t.body)})`;
        case 'app':
            return `(${termToString(t.fn)} ${termToString(t.arg)})`;
        case 'let':
            return `let ${t.bind}${t.bindType ? ` : ${refTypeToString(t.bindType)}` : ''} = ${termToString(t.value)} in ${termToString(t.body)}`;
    }
}
//# sourceMappingURL=types.js.map