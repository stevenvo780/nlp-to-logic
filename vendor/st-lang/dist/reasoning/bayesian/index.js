"use strict";
// ============================================================
// ST Bayesian Inference — Barrel
// ============================================================
//
// Motor de inferencia bayesiana sobre redes discretas simples.
// Variable elimination con orden min-fill, joint probability
// y most probable explanation (MAP/MPE).
//
// API pública:
//   - `query(net, queryVar, evidence?)`            → posterior P(Q | E)
//   - `variableElimination(net, queryVar, ev?)`    → idem (alias explícito)
//   - `jointProbability(net, assignment)`          → P(asignación completa)
//   - `mostProbableExplanation(net, evidence?)`    → argmax P(· | E)
//
// Tipos: `BayesianNetwork`, `DiscreteVariable`, `CPT`, `Evidence`,
// `PosteriorDistribution`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.variableElimination = exports.query = exports.mostProbableExplanation = exports.jointProbability = void 0;
var inference_1 = require("./inference");
Object.defineProperty(exports, "jointProbability", { enumerable: true, get: function () { return inference_1.jointProbability; } });
Object.defineProperty(exports, "mostProbableExplanation", { enumerable: true, get: function () { return inference_1.mostProbableExplanation; } });
Object.defineProperty(exports, "query", { enumerable: true, get: function () { return inference_1.query; } });
Object.defineProperty(exports, "variableElimination", { enumerable: true, get: function () { return inference_1.variableElimination; } });
//# sourceMappingURL=index.js.map