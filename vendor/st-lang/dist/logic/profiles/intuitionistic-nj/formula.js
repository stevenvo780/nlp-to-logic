"use strict";
// ============================================================
// Helpers de fórmulas intuicionistas
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.implies = exports.or = exports.and = exports.not = exports.bottom = exports.atom = void 0;
exports.formulaKey = formulaKey;
exports.formulaEquals = formulaEquals;
exports.formulaToString = formulaToString;
exports.collectAtoms = collectAtoms;
/**
 * Clave sintáctica estable para deduplicación / memoización.
 * Determinista y libre de ambigüedades por paréntesis explícitos.
 */
function formulaKey(f) {
    switch (f.kind) {
        case 'atom':
            return `A(${f.name})`;
        case 'bottom':
            return '⊥';
        case 'not':
            return `N(${formulaKey(f.arg)})`;
        case 'and':
            return `&(${formulaKey(f.left)},${formulaKey(f.right)})`;
        case 'or':
            return `|(${formulaKey(f.left)},${formulaKey(f.right)})`;
        case 'implies':
            return `>(${formulaKey(f.left)},${formulaKey(f.right)})`;
    }
}
function formulaEquals(a, b) {
    return formulaKey(a) === formulaKey(b);
}
function formulaToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name;
        case 'bottom':
            return '⊥';
        case 'not':
            return `¬${parens(f.arg)}`;
        case 'and':
            return `(${formulaToString(f.left)} ∧ ${formulaToString(f.right)})`;
        case 'or':
            return `(${formulaToString(f.left)} ∨ ${formulaToString(f.right)})`;
        case 'implies':
            return `(${formulaToString(f.left)} → ${formulaToString(f.right)})`;
    }
}
function parens(f) {
    if (f.kind === 'atom' || f.kind === 'bottom')
        return formulaToString(f);
    return `(${formulaToString(f)})`;
}
/**
 * Recolecta los átomos proposicionales (por nombre) que aparecen en `f`.
 */
function collectAtoms(f, out = new Set()) {
    switch (f.kind) {
        case 'atom':
            out.add(f.name);
            return out;
        case 'bottom':
            return out;
        case 'not':
            return collectAtoms(f.arg, out);
        case 'and':
        case 'or':
        case 'implies':
            collectAtoms(f.left, out);
            return collectAtoms(f.right, out);
    }
}
// Constructores ergonómicos -----------------------------------
const atom = (name) => ({ kind: 'atom', name });
exports.atom = atom;
const bottom = () => ({ kind: 'bottom' });
exports.bottom = bottom;
const not = (arg) => ({ kind: 'not', arg });
exports.not = not;
const and = (left, right) => ({
    kind: 'and',
    left,
    right,
});
exports.and = and;
const or = (left, right) => ({
    kind: 'or',
    left,
    right,
});
exports.or = or;
const implies = (left, right) => ({
    kind: 'implies',
    left,
    right,
});
exports.implies = implies;
//# sourceMappingURL=formula.js.map