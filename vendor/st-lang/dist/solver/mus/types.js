"use strict";
// ============================================================
// ST MUS (Minimal Unsatisfiable Subset) — Tipos públicos
// ============================================================
//
// Un MUS de un conjunto unsat C de cláusulas es un subconjunto
// M ⊆ C tal que:
//   1. M es insatisfacible (unsat).
//   2. Para toda cláusula c ∈ M, M \ {c} es satisfacible (sat).
//
// Es decir: minimal por inclusión. NO necesariamente cardinality-
// minimum — eso sería el smallest MUS y es Σ₂ᵖ-hard.
//
// Usos típicos en debugging de constraints / type errors:
//   - Aislar el "núcleo" del conflicto cuando un sistema reporta
//     unsat sobre cientos de cláusulas.
//   - Explicar a un usuario por qué su conjunto de premisas es
//     contradictorio.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map