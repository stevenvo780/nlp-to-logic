"use strict";
// ============================================================
// ST μ-calculus — tipos
// ============================================================
// Modal μ-calculus: lógica modal extendida con operadores de
// punto fijo `μ` (least fixed-point) y `ν` (greatest fixed-point).
// Subsume CTL, LTL y PDL: cualquier fórmula CTL puede traducirse
// a μ-cálculo (ver `ctl-translate.ts`).
//
// Sintaxis:
//   φ ::= p | X | ¬φ | φ ∧ φ | φ ∨ φ | □φ | ◇φ | μX. φ | νX. φ
//
// Restricción semántica: las variables ligadas deben aparecer
// bajo un número par de negaciones (positividad / monotonicidad)
// para que los puntos fijos existan por el teorema de Knaster-Tarski.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.muToString = muToString;
/** Renderiza una fórmula μ-cálculo a notación textual estándar. */
function muToString(phi) {
    switch (phi.kind) {
        case 'atom':
            return phi.name;
        case 'var':
            return phi.name;
        case 'not':
            return `¬${muToString(phi.arg)}`;
        case 'and':
            return `(${muToString(phi.left)} ∧ ${muToString(phi.right)})`;
        case 'or':
            return `(${muToString(phi.left)} ∨ ${muToString(phi.right)})`;
        case 'box':
            return `□${muToString(phi.arg)}`;
        case 'diamond':
            return `◇${muToString(phi.arg)}`;
        case 'mu':
            return `μ${phi.bind}. ${muToString(phi.body)}`;
        case 'nu':
            return `ν${phi.bind}. ${muToString(phi.body)}`;
    }
}
//# sourceMappingURL=types.js.map