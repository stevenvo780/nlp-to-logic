"use strict";
// ============================================================
// Bisimulation — tipos públicos
// ============================================================
// Sistema de Transiciones Etiquetadas (LTS, Labelled Transition System):
//   M = (S, Act, →, L)
//     S       conjunto finito de estados
//     Act     alfabeto de acciones
//     →       relación de transición ⊆ S × Act × S
//     L       función de etiquetado opcional S → 2^AP (proposiciones atómicas)
//
// La bisimulación fuerte ~ es la mayor relación R ⊆ S × S tal que (s, t) ∈ R
// implica:
//   1. L(s) = L(t)                                            (mismas etiquetas)
//   2. ∀ s -a-> s'.  ∃ t'. t -a-> t' ∧ (s', t') ∈ R           (forward simulation)
//   3. ∀ t -a-> t'.  ∃ s'. s -a-> s' ∧ (s', t') ∈ R           (backward simulation)
//
// La bisimulación débil ignora τ-transiciones internas y compara cadenas
//   s ⇒ s' ≡ s -τ*-> ·-a-> ·-τ*-> s'
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map