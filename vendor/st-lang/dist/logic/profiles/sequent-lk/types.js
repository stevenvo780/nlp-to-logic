"use strict";
// ============================================================
// LK Sequent Calculus — Types (Gentzen 1934)
// ============================================================
//
// Calculo de secuentes clasico LK de Gentzen. A diferencia de G3,
// LK incluye explicitamente las reglas estructurales (weakening,
// contraccion, intercambio) y la regla de corte (cut). El
// Hauptsatz (teorema fundamental) afirma que toda derivacion en
// LK puede transformarse en una derivacion sin cortes.
//
// Convencion: secuentes multisuccedentes Γ ⊢ Δ con `left` y
// `right` como listas (multisets con orden preservado). Las
// formulas se modelan localmente en `LKFormula` para que el
// perfil pueda evolucionar sin atar el calculo a la representacion
// global de `Formula`.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map