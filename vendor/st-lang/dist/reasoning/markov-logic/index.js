"use strict";
// ============================================================
// ST Markov Logic Networks — Barrel
// ============================================================
//
// Una Markov Logic Network combina FOL con redes de Markov:
// cada fórmula `F` lleva un peso `w` real; cada mundo `W` tiene
// probabilidad
//
//   P(W) ∝ exp( Σ_i  w_i · n_i(W) )
//
// donde `n_i(W)` es el número de grounding instances de `F_i`
// SATISFECHAS por `W`. Pesos +∞ representan hard constraints.
//
// API pública:
//   - `ground(theory)`            → array de GroundedFormula
//   - `weight(theory, world)`     → log-prob no normalizada
//   - `probability(theory, world, Z)` → P(world) dada partición Z
//   - `gibbsSample(theory, evidence, n)` → cadena de mundos
//   - `gibbsMarginals(...)`       → P(atom=true) aproximada
//   - `mapInference(theory, ev)`  → mundo más probable (MaxWalkSAT)
//   - `exactPartition(theory)`    → Z exacta (sólo teorías chicas)
//   - `exactMarginals(theory)`    → P(atom=true) exacta (chicas)
//
// Utilidades de grounding/parsing también expuestas para
// herramientas (UI, debugging).
Object.defineProperty(exports, "__esModule", { value: true });
exports.weight = exports.probability = exports.mapInference = exports.gibbsSample = exports.gibbsMarginals = exports.exactPartition = exports.exactMarginals = exports.renderGround = exports.groundFormula = exports.ground = exports.evaluateGround = exports.atomKey = exports.allGroundAtoms = exports.parseFOL = exports.freeVariables = void 0;
var parser_1 = require("./parser");
Object.defineProperty(exports, "freeVariables", { enumerable: true, get: function () { return parser_1.freeVariables; } });
Object.defineProperty(exports, "parseFOL", { enumerable: true, get: function () { return parser_1.parseFOL; } });
var grounding_1 = require("./grounding");
Object.defineProperty(exports, "allGroundAtoms", { enumerable: true, get: function () { return grounding_1.allGroundAtoms; } });
Object.defineProperty(exports, "atomKey", { enumerable: true, get: function () { return grounding_1.atomKey; } });
Object.defineProperty(exports, "evaluateGround", { enumerable: true, get: function () { return grounding_1.evaluateGround; } });
Object.defineProperty(exports, "ground", { enumerable: true, get: function () { return grounding_1.ground; } });
Object.defineProperty(exports, "groundFormula", { enumerable: true, get: function () { return grounding_1.groundFormula; } });
Object.defineProperty(exports, "renderGround", { enumerable: true, get: function () { return grounding_1.renderGround; } });
var inference_1 = require("./inference");
Object.defineProperty(exports, "exactMarginals", { enumerable: true, get: function () { return inference_1.exactMarginals; } });
Object.defineProperty(exports, "exactPartition", { enumerable: true, get: function () { return inference_1.exactPartition; } });
Object.defineProperty(exports, "gibbsMarginals", { enumerable: true, get: function () { return inference_1.gibbsMarginals; } });
Object.defineProperty(exports, "gibbsSample", { enumerable: true, get: function () { return inference_1.gibbsSample; } });
Object.defineProperty(exports, "mapInference", { enumerable: true, get: function () { return inference_1.mapInference; } });
Object.defineProperty(exports, "probability", { enumerable: true, get: function () { return inference_1.probability; } });
Object.defineProperty(exports, "weight", { enumerable: true, get: function () { return inference_1.weight; } });
//# sourceMappingURL=index.js.map