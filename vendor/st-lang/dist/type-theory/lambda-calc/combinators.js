"use strict";
// ============================================================
// λ-cálculo untyped — Combinadores clásicos
// ============================================================
//
//   I  = λx.x
//   K  = λx.λy.x
//   S  = λx.λy.λz.(xz)(yz)
//   Y  = λf.(λx.f(xx))(λx.f(xx))             (fixpoint, diverge en cbv)
//   ω  = λx.xx
//   Ω  = ωω = (λx.xx)(λx.xx)                  (canónico divergente)
Object.defineProperty(exports, "__esModule", { value: true });
exports.omega = exports.omegaSmall = exports.Y = exports.S = exports.K = exports.I = void 0;
const types_1 = require("./types");
exports.I = (0, types_1.lam)('x', (0, types_1.v)('x'));
exports.K = (0, types_1.lam)('x', (0, types_1.lam)('y', (0, types_1.v)('x')));
exports.S = (0, types_1.lam)('x', (0, types_1.lam)('y', (0, types_1.lam)('z', (0, types_1.apN)((0, types_1.v)('x'), (0, types_1.v)('z'), (0, types_1.ap)((0, types_1.v)('y'), (0, types_1.v)('z'))))));
// Y-combinator (Curry).
exports.Y = (0, types_1.lam)('f', (0, types_1.ap)((0, types_1.lam)('x', (0, types_1.ap)((0, types_1.v)('f'), (0, types_1.ap)((0, types_1.v)('x'), (0, types_1.v)('x')))), (0, types_1.lam)('x', (0, types_1.ap)((0, types_1.v)('f'), (0, types_1.ap)((0, types_1.v)('x'), (0, types_1.v)('x'))))));
// ω = λx.xx
exports.omegaSmall = (0, types_1.lam)('x', (0, types_1.ap)((0, types_1.v)('x'), (0, types_1.v)('x')));
// Ω = (λx.xx)(λx.xx) — diverge bajo cualquier estrategia.
exports.omega = (0, types_1.ap)(exports.omegaSmall, exports.omegaSmall);
//# sourceMappingURL=combinators.js.map