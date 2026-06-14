"use strict";
// ============================================================
// ST CTL — Computation Tree Logic
// ============================================================
// Estructuras de Kripke y AST de fórmulas CTL.
//
// Convenciones:
//  - Operadores de camino "exists" (E) requieren al menos UN camino
//    desde el estado actual que cumpla la propiedad temporal.
//  - Operadores de camino "all" (A) requieren que TODOS los caminos
//    desde el estado actual cumplan la propiedad temporal.
//  - Estados sin sucesores se consideran "deadlock": AX φ es trivialmente
//    verdadero, EX φ es trivialmente falso.
//  - El modelo se asume finito. EG y EU se resuelven con punto fijo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctlToString = ctlToString;
/** Renderiza una fórmula CTL a notación textual estándar. */
function ctlToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name;
        case 'true':
            return '⊤';
        case 'false':
            return '⊥';
        case 'not':
            return `¬${ctlToString(f.arg)}`;
        case 'and':
            return `(${f.args.map(ctlToString).join(' ∧ ')})`;
        case 'or':
            return `(${f.args.map(ctlToString).join(' ∨ ')})`;
        case 'implies':
            return `(${ctlToString(f.left)} → ${ctlToString(f.right)})`;
        case 'EX':
            return `EX ${ctlToString(f.arg)}`;
        case 'AX':
            return `AX ${ctlToString(f.arg)}`;
        case 'EF':
            return `EF ${ctlToString(f.arg)}`;
        case 'AF':
            return `AF ${ctlToString(f.arg)}`;
        case 'EG':
            return `EG ${ctlToString(f.arg)}`;
        case 'AG':
            return `AG ${ctlToString(f.arg)}`;
        case 'EU':
            return `E[${ctlToString(f.left)} U ${ctlToString(f.right)}]`;
        case 'AU':
            return `A[${ctlToString(f.left)} U ${ctlToString(f.right)}]`;
    }
}
//# sourceMappingURL=types.js.map