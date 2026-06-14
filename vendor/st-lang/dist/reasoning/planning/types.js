"use strict";
// ============================================================
// ST Planning — Tipos públicos (STRIPS / PDDL light)
// ============================================================
//
// STRIPS (Fikes & Nilsson 1971): planificación clásica donde el
// estado es un conjunto finito de hechos atómicos y las acciones
// modifican ese conjunto mediante:
//
//   - preconditions: hechos que deben estar presentes para aplicar
//   - addList:       hechos que se vuelven verdaderos tras aplicar
//   - delList:       hechos que se eliminan tras aplicar
//
// El planificador busca una secuencia ⟨a₁, …, aₙ⟩ tal que aplicarla
// al estado inicial S₀ produzca un estado Sₙ ⊇ goal.
//
// "PDDL light": soportamos parámetros tipados via `objects` y
// `parameters` (los strings con `?x` se sustituyen). No soportamos
// fluents numéricos, cuantificadores universales, ni tipos
// jerárquicos — el grueso del PDDL nivel 1 (STRIPS + typing).
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map