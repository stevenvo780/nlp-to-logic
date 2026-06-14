"use strict";
// ============================================================
// ST Default Logic (Reiter) — Tipos
// ============================================================
//
// Lógica default de Reiter (1980). Una default rule:
//
//     α : β1, ..., βn / γ
//
// significa "si α se cree y cada βi es consistente con las creencias
// actuales, entonces concluye γ". Una extensión es un punto fijo del
// operador inducido por la teoría: el conjunto de creencias estable
// donde todos los defaults aplicables ya fueron aplicados y ninguno
// más aplica sin generar inconsistencia.
//
// Limitación v1: prerequisites, justifications y consequents son
// literales (ground): "P" o "¬P". La consistencia se verifica buscando
// pares L/¬L en el conjunto de creencias. Esto cubre todos los
// ejemplos clásicos (Tweety, Nixon-diamond, etc.) sin SAT completo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_DEFAULTS = exports.DEFAULT_MAX_EXTENSIONS = void 0;
exports.DEFAULT_MAX_EXTENSIONS = 64;
exports.DEFAULT_MAX_DEFAULTS = 64;
//# sourceMappingURL=types.js.map