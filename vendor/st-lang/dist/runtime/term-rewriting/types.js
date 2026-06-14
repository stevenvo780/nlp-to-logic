"use strict";
// ============================================================
// ST Term Rewriting — Tipos públicos
// ============================================================
//
// Un Term Rewriting System (TRS) es un conjunto de reglas
//   l → r
// donde l y r son términos de primer orden y vars(r) ⊆ vars(l).
//
// La reescritura aplica una regla buscando un subtérmino que
// unifique (match) con el LHS y lo reemplaza por la sustitución
// del RHS. Se itera hasta llegar a forma normal (sin redex
// aplicables) o hasta saturar maxSteps.
//
// Aplicaciones:
//   - Normalización en pruebas con igualdad (decision procedures).
//   - Simplificación simbólica.
//   - Modelado de teorías ecuacionales (grupos, anillos, listas).
//   - Confluencia + terminación ⇒ decisión de equivalencia.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map