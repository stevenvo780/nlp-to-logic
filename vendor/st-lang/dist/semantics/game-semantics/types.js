"use strict";
// ============================================================
// Game semantics para IPC — Tipos
// ============================================================
//
// Juegos dialógicos al estilo Lorenzen (1958) / Felscher (1985):
// dos jugadores debaten una fórmula. El Proponente (P) la afirma;
// el Oponente (O) la ataca. Una fórmula es válida en IPC sii P
// tiene una estrategia ganadora bajo las reglas estructurales
// intuicionistas. (Lorenzen, Felscher: equivalencia con NJ.)
//
// ADT pública pedida por el spec (sin `not` explícito; `¬φ` se
// modela como `φ → ⊥`). La conversión a/desde otras
// representaciones de fórmulas vive en `convert.ts`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipcNot = exports.ipcImplies = exports.ipcOr = exports.ipcAnd = exports.ipcBottom = exports.ipcAtom = void 0;
exports.ipcKey = ipcKey;
exports.ipcEquals = ipcEquals;
exports.ipcToString = ipcToString;
// ---------- constructores ergonómicos ----------
const ipcAtom = (name) => ({ kind: 'atom', name });
exports.ipcAtom = ipcAtom;
const ipcBottom = () => ({ kind: 'bottom' });
exports.ipcBottom = ipcBottom;
const ipcAnd = (left, right) => ({
    kind: 'and',
    left,
    right,
});
exports.ipcAnd = ipcAnd;
const ipcOr = (left, right) => ({
    kind: 'or',
    left,
    right,
});
exports.ipcOr = ipcOr;
const ipcImplies = (left, right) => ({
    kind: 'implies',
    left,
    right,
});
exports.ipcImplies = ipcImplies;
/** Azúcar: `¬φ` = `φ → ⊥`. Útil para tests pedagógicos. */
const ipcNot = (arg) => (0, exports.ipcImplies)(arg, (0, exports.ipcBottom)());
exports.ipcNot = ipcNot;
// ---------- igualdad y clave ----------
function ipcKey(f) {
    switch (f.kind) {
        case 'atom':
            return `A(${f.name})`;
        case 'bottom':
            return '⊥';
        case 'and':
            return `&(${ipcKey(f.left)},${ipcKey(f.right)})`;
        case 'or':
            return `|(${ipcKey(f.left)},${ipcKey(f.right)})`;
        case 'implies':
            return `>(${ipcKey(f.left)},${ipcKey(f.right)})`;
    }
}
function ipcEquals(a, b) {
    return ipcKey(a) === ipcKey(b);
}
function ipcToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name;
        case 'bottom':
            return '⊥';
        case 'and':
            return `(${ipcToString(f.left)} ∧ ${ipcToString(f.right)})`;
        case 'or':
            return `(${ipcToString(f.left)} ∨ ${ipcToString(f.right)})`;
        case 'implies':
            return `(${ipcToString(f.left)} → ${ipcToString(f.right)})`;
    }
}
//# sourceMappingURL=types.js.map