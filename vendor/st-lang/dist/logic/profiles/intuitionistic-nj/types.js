"use strict";
// ============================================================
// Intuitionistic Natural Deduction (NJ) — Tipos
// ============================================================
//
// Sistema NJ de Gentzen para lógica intuicionista proposicional.
// Sin tercero excluido, sin doble negación clásica.
//
// Reglas implementadas:
//   - Conjunción:   ∧I, ∧EL, ∧ER
//   - Disyunción:   ∨IL, ∨IR, ∨E (con descarga)
//   - Implicación:  →I (descarga), →E (modus ponens)
//   - Negación:     ¬I (descarga, deriva ⊥), ¬E (deriva ⊥)
//   - Falsedad:     ⊥E (ex falso quodlibet)
//   - Asunción:     hipótesis del contexto
//
// Convención: `¬φ` se entiende como `φ → ⊥`. La regla `notI` es
// `→I` cuando el consecuente es `⊥`; `notE` es `→E` produciendo
// `⊥` desde `φ` y `¬φ`.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map