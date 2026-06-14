"use strict";
// ============================================================
// Modal Frame Axioms — Tipos
// ============================================================
//
// Lógicas modales normales caracterizadas por axiomas de frame:
//
//   T : □φ → φ            reflexividad     ∀w. R(w,w)
//   B : φ → □◇φ           simetría         ∀w,v. R(w,v) → R(v,w)
//   4 : □φ → □□φ          transitividad    ∀w,v,u. R(w,v)∧R(v,u) → R(w,u)
//   5 : ◇φ → □◇φ          euclidianidad    ∀w,v,u. R(w,v)∧R(w,u) → R(v,u)
//   D : □φ → ◇φ           serialidad       ∀w. ∃v. R(w,v)
//
// Sistemas estándar como composiciones:
//
//   K     = ∅          (sin axiomas, sólo K y N)
//   T     = {T}        reflexivo
//   D     = {D}        serial
//   B     = {T, B}     reflexivo + simétrico  (a veces KB = {B} sin T)
//   K4    = {4}        transitivo
//   K5    = {5}        euclidiano
//   KB    = {B}        sólo simétrico
//   S4    = {T, 4}     reflexivo + transitivo
//   S5    = {T, 4, 5}  equivalencia (≡ T+B+4 ≡ T+5)
//   KD45  = {D, 4, 5}  serial + trans + eucl  (modelo doxástico)
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map