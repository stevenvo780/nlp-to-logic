"use strict";
// ============================================================
// ST Automata — Tipos
// ============================================================
//
// Modelado clásico de autómatas finitos y de pila:
//
//   DFA (Deterministic Finite Automaton)
//     · Transición total: state × symbol → state.
//     · Acepta una palabra sii el camino termina en estado final.
//
//   NFA (Nondeterministic Finite Automaton, con ε-transiciones)
//     · Transición: state × (symbol ∪ {ε}) → P(states).
//     · Acepta sii existe un camino que termina en final.
//
//   PDA (Pushdown Automaton) — variante "by final state"
//     · Transición: (state, read, popTop) → (nextState, pushTop[]).
//     · `read` o `popTop` pueden ser ε (sin consumir / sin tope).
//     · pushTop se apila en orden inverso (último → top).
//
// Notas:
//   • Los símbolos son strings de longitud 1 (chars). El alfabeto
//     se mantiene explícito porque define complement(M).
//   • La constante EPSILON ('ε') vive aquí para reutilizarse.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPSILON = void 0;
exports.EPSILON = 'ε';
//# sourceMappingURL=types.js.map