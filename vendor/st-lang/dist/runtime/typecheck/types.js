"use strict";
// ============================================================
// ST TypeChecker — Tipos de error tipado
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARITHMETIC_PROFILES = exports.FIRST_ORDER_PROFILES = exports.TEMPORAL_PROFILES = exports.MODAL_PROFILES = void 0;
// Perfil considerado "modal" (permite □ ◇)
exports.MODAL_PROFILES = new Set([
    'modal.k',
    'modal.t',
    'modal.s4',
    'modal.s5',
    'epistemic.s5',
    'deontic.standard',
]);
// Perfil considerado "temporal" (permite temporal_next, temporal_until)
exports.TEMPORAL_PROFILES = new Set(['temporal.ltl']);
// Perfil considerado "first-order" (permite forall, exists, predicate)
exports.FIRST_ORDER_PROFILES = new Set([
    'classical.first_order',
    'classical.first-order',
    'aristotelian.syllogistic',
]);
// Perfil con soporte aritmético
exports.ARITHMETIC_PROFILES = new Set(['arithmetic']);
//# sourceMappingURL=types.js.map