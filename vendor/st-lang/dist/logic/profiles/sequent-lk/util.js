"use strict";
// ============================================================
// LK — Utilidades sintacticas locales
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.lkKey = lkKey;
exports.eq = eq;
exports.cloneSeq = cloneSeq;
exports.removeAt = removeAt;
exports.removeFirstByKey = removeFirstByKey;
exports.removeAllByKey = removeAllByKey;
exports.containsKey = containsKey;
exports.depth = depth;
/**
 * Clave canonica de una formula LK. Sirve para comparar igualdad
 * sintactica entre formulas y construir conjuntos/multisets.
 */
function lkKey(f) {
    switch (f.kind) {
        case 'atom':
            return `a:${f.name}`;
        case 'not':
            return `n(${lkKey(f.arg)})`;
        case 'and':
            return `&(${lkKey(f.left)},${lkKey(f.right)})`;
        case 'or':
            return `|(${lkKey(f.left)},${lkKey(f.right)})`;
        case 'implies':
            return `>(${lkKey(f.left)},${lkKey(f.right)})`;
    }
}
function eq(a, b) {
    return lkKey(a) === lkKey(b);
}
/** Devuelve una copia superficial: util para construir premisas sin alias. */
function cloneSeq(xs) {
    return xs.slice();
}
function removeAt(xs, idx) {
    const copy = xs.slice();
    copy.splice(idx, 1);
    return copy;
}
/** Quita la primera ocurrencia de una formula identificable por `key`. */
function removeFirstByKey(xs, key) {
    const idx = xs.findIndex((f) => lkKey(f) === key);
    if (idx === -1)
        return xs.slice();
    return removeAt(xs, idx);
}
/** Quita todas las ocurrencias de una formula identificable por `key`. */
function removeAllByKey(xs, key) {
    return xs.filter((f) => lkKey(f) !== key);
}
function containsKey(xs, key) {
    return xs.some((f) => lkKey(f) === key);
}
/** Profundidad de una formula (sub-formulas estrictas). */
function depth(f) {
    switch (f.kind) {
        case 'atom':
            return 0;
        case 'not':
            return depth(f.arg) + 1;
        case 'and':
        case 'or':
        case 'implies':
            return Math.max(depth(f.left), depth(f.right)) + 1;
    }
}
//# sourceMappingURL=util.js.map