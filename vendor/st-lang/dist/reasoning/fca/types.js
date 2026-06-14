"use strict";
// ============================================================
// Formal Concept Analysis (FCA) — tipos públicos
// ============================================================
// Marco matemático de Wille (1982) para extraer una jerarquía conceptual
// a partir de una relación binaria objeto-atributo.
//
// Contexto formal:
//   K = (G, M, I)
//     G  conjunto finito de "objetos"
//     M  conjunto finito de "atributos"
//     I ⊆ G × M  relación de incidencia ("el objeto g tiene el atributo m")
//
// Operadores de derivación (polares de Galois):
//   A' = { m ∈ M | ∀ g ∈ A. (g, m) ∈ I }     (atributos comunes a A ⊆ G)
//   B' = { g ∈ G | ∀ m ∈ B. (g, m) ∈ I }     (objetos que poseen todo B ⊆ M)
//
// Un concepto formal es un par (A, B) con A ⊆ G, B ⊆ M tal que
//   A' = B  y  B' = A
// equivalentemente:  A = A''  y  B = B''  (clausura).
//
// El conjunto B(K) de todos los conceptos, ordenado por
//   (A1, B1) ≤ (A2, B2) ⇔ A1 ⊆ A2  ( ⇔ B2 ⊆ B1 )
// forma un retículo completo (lattice), el "concept lattice".
//
// Top:     (G, G')   — todos los objetos, atributos comunes.
// Bottom:  (M', M)   — atributos en todos, en general ∅ objetos.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map