"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeString = memoizeString;
exports.memoizeHash = memoizeHash;
exports.memoizeAtoms = memoizeAtoms;
exports.memoizeNNF = memoizeNNF;
exports.memoizeCNF = memoizeCNF;
exports.memoizeDNF = memoizeDNF;
/**
 * Cache central para derivaciones y operaciones frecuentes sobre AST.
 * ST genera fórmulas inmutables en su mayoría, por lo que podemos usar
 * la referencia del objeto Formula como clave en un WeakMap, evitando
 * pérdidas de memoria y logrando cacheo O(1).
 */
const stringCache = new WeakMap();
const hashCache = new WeakMap();
const atomsCache = new WeakMap();
const nnfCache = new WeakMap();
const cnfCache = new WeakMap();
const dnfCache = new WeakMap();
/**
 * Función genérica de memoización para operaciones que toman FormData y
 * devuelven un string.
 */
function memoizeString(f, compute) {
    let cached = stringCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    stringCache.set(f, cached);
    return cached;
}
function memoizeHash(f, compute) {
    let cached = hashCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    hashCache.set(f, cached);
    return cached;
}
function memoizeAtoms(f, compute) {
    let cached = atomsCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    atomsCache.set(f, cached);
    return cached;
}
function memoizeNNF(f, compute) {
    let cached = nnfCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    nnfCache.set(f, cached);
    return cached;
}
function memoizeCNF(f, compute) {
    let cached = cnfCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    cnfCache.set(f, cached);
    return cached;
}
function memoizeDNF(f, compute) {
    let cached = dnfCache.get(f);
    if (cached !== undefined)
        return cached;
    cached = compute(f);
    dnfCache.set(f, cached);
    return cached;
}
//# sourceMappingURL=memo.js.map