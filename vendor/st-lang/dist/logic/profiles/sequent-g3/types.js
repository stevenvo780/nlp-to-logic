"use strict";
// ============================================================
// G3 Sequent Calculus — Types
// ============================================================
//
// Calculo de secuentes G3 (Gentzen reformulado por Kleene) para
// logica proposicional clasica. Sus reglas son invertibles, las
// premisas son sub-formulas de la conclusion y el sistema admite
// eliminacion del corte (cut elimination), por lo que la busqueda
// hacia atras es completa y terminante.
//
// Convencion: un secuente Γ ⊢ Δ se representa con `left` y `right`
// como multisets (arrays con duplicados permitidos). El orden no
// importa logicamente pero se preserva para reproducibilidad.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map