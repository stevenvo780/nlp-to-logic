"use strict";
// ============================================================
// Proof Nets — Tipos para MLL (Multiplicative Linear Logic)
// ============================================================
//
// Proof nets de Girard: representación gráfica de pruebas en
// linear logic sin "bureaucracy" de orden estructural.
//
// Para MLL puro sólo aparecen dos conectivos:
//   ⊗  (tensor)  — multiplicativo positivo
//   ⅋  (par)     — multiplicativo negativo
//
// Los átomos llevan polaridad explícita (A vs A⊥); la dualidad
// satisface (A⊥)⊥ = A, (A⊗B)⊥ = A⊥ ⅋ B⊥, (A⅋B)⊥ = A⊥ ⊗ B⊥.
//
// Un nodo del net es la ocurrencia de una fórmula en algún punto
// del grafo. Un link une nodos con la semántica habitual:
//   axiom    : dos nodos duales, frescos como hojas del net.
//   cut      : dos nodos duales, no aportan a la conclusión.
//   tensor   : tres nodos {premisa-izq, premisa-der, conclusión}.
//   par      : tres nodos {premisa-izq, premisa-der, conclusión}.
//
// Las conclusiones del net son los ids de los nodos que viven en
// el "borde": ni premisa de tensor/par, ni participan en un cut.
Object.defineProperty(exports, "__esModule", { value: true });
exports.par = exports.tensor = exports.atomNeg = exports.atomPos = void 0;
exports.dual = dual;
exports.formulaEquals = formulaEquals;
exports.formulaToString = formulaToString;
// ---------- Constructores convenientes para fórmulas ----------
/** Creates a positive atom `A` (polarity `'pos'`). */
const atomPos = (name) => ({
    kind: 'atom',
    name,
    polarity: 'pos',
});
exports.atomPos = atomPos;
/** Creates a negative atom `A⊥` (polarity `'neg'`). */
const atomNeg = (name) => ({
    kind: 'atom',
    name,
    polarity: 'neg',
});
exports.atomNeg = atomNeg;
/** Creates a tensor formula `A ⊗ B`. */
const tensor = (left, right) => ({
    kind: 'tensor',
    left,
    right,
});
exports.tensor = tensor;
/** Creates a par formula `A ⅋ B`. */
const par = (left, right) => ({
    kind: 'par',
    left,
    right,
});
exports.par = par;
// Dualidad lineal: involutiva, distribuye De Morgan sobre ⊗ / ⅋.
function dual(f) {
    switch (f.kind) {
        case 'atom':
            return { kind: 'atom', name: f.name, polarity: f.polarity === 'pos' ? 'neg' : 'pos' };
        case 'tensor':
            return { kind: 'par', left: dual(f.left), right: dual(f.right) };
        case 'par':
            return { kind: 'tensor', left: dual(f.left), right: dual(f.right) };
    }
}
/** Returns `true` when two MLL formulas are structurally equal. */
function formulaEquals(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'atom':
            return a.name === b.name && a.polarity === b.polarity;
        case 'tensor':
        case 'par': {
            const bb = b;
            return formulaEquals(a.left, bb.left) && formulaEquals(a.right, bb.right);
        }
    }
}
/** Renders an MLL formula as a human-readable string using ⊗, ⅋, and ⊥ notation. */
function formulaToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.polarity === 'pos' ? f.name : `${f.name}⊥`;
        case 'tensor':
            return `(${formulaToString(f.left)} ⊗ ${formulaToString(f.right)})`;
        case 'par':
            return `(${formulaToString(f.left)} ⅋ ${formulaToString(f.right)})`;
    }
}
//# sourceMappingURL=types.js.map