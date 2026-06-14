"use strict";
// ============================================================
// ST Educational — Tipos públicos del generador de ejercicios
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicExercise = toPublicExercise;
function toPublicExercise(ex) {
    return {
        id: ex.id,
        level: ex.level,
        profile: ex.profile,
        kind: ex.kind,
        prompt: ex.prompt,
        formula: ex.formula,
        premises: ex.premises,
        goal: ex.goal,
        hints: ex.hints,
    };
}
//# sourceMappingURL=types.js.map