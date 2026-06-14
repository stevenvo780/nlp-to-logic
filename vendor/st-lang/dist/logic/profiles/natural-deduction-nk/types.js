"use strict";
// ============================================================
// Natural Deduction NK (Gentzen classical) — Tipos
// ============================================================
//
// Sistema NK de Gentzen para lógica proposicional clásica.
// Extiende NJ (intuicionista) con reglas que justifican el
// tercero excluido / doble negación clásica.
//
// Reglas intuicionistas heredadas (idéntico a NJ):
//   - Conjunción:   ∧I, ∧EL, ∧ER
//   - Disyunción:   ∨IL, ∨IR, ∨E (con descarga)
//   - Implicación:  →I (descarga), →E (modus ponens)
//   - Negación:     ¬I (descarga, deriva ⊥), ¬E (deriva ⊥)
//   - Falsedad:     ⊥E (ex falso quodlibet)
//   - Asunción:     hipótesis del contexto
//
// Reglas clásicas añadidas:
//   - doubleNegE:   ¬¬φ ⊢ φ                 (eliminación doble negación)
//   - LEM:          ⊢ φ ∨ ¬φ                (tercero excluido como axioma)
//   - pierce:       ⊢ ((φ→ψ)→φ)→φ           (ley de Peirce como axioma)
//   - rAA:          asume ¬φ, deriva ⊥, concluye φ (reductio ad absurdum)
//
// La regla rAA es la dual clásica de ¬I: en NJ, asumiendo φ y
// derivando ⊥ se concluye ¬φ; en NK, asumiendo ¬φ y derivando
// ⊥ se concluye φ. Con sólo rAA añadida a NJ se obtiene
// completitud para la lógica clásica proposicional.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLASSICAL_ONLY_RULES = void 0;
/**
 * Conjunto de reglas que sólo existen en NK (no en NJ).
 * Útil para detectar si una prueba NK es trasladable a NJ.
 */
exports.CLASSICAL_ONLY_RULES = ['doubleNegE', 'LEM', 'pierce', 'rAA'];
//# sourceMappingURL=types.js.map