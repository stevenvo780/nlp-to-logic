"use strict";
/**
 * Bishop-style constructive real analysis.
 *
 * Re-exports the four pillars:
 *   - Cauchy sequences with explicit modulus (`./cauchy`)
 *   - Uniform continuity on compact intervals (`./continuity`)
 *   - Bishop integral (`./integral`)
 *   - Heine-Borel compactness (`./compact`)
 *   - Intermediate value + mean value approximations (`./ivt`)
 *
 * All operations are constructive: no LEM, no unrestricted choice, and
 * every claim of convergence/continuity is backed by an explicit
 * modulus function. The CReal primitive lives in
 * `../constructive-reals`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.meanValueConstructive = exports.intermediateValueTheorem = exports.hasFiniteSubcover = exports.bishopIntegral = exports.lipschitz = exports.identity = exports.constant = exports.composition = exports.isUniformlyContinuousOn = exports.cauchyFrom = exports.limit = exports.isCauchy = void 0;
var cauchy_1 = require("./cauchy");
Object.defineProperty(exports, "isCauchy", { enumerable: true, get: function () { return cauchy_1.isCauchy; } });
Object.defineProperty(exports, "limit", { enumerable: true, get: function () { return cauchy_1.limit; } });
Object.defineProperty(exports, "cauchyFrom", { enumerable: true, get: function () { return cauchy_1.cauchyFrom; } });
var continuity_1 = require("./continuity");
Object.defineProperty(exports, "isUniformlyContinuousOn", { enumerable: true, get: function () { return continuity_1.isUniformlyContinuousOn; } });
Object.defineProperty(exports, "composition", { enumerable: true, get: function () { return continuity_1.composition; } });
Object.defineProperty(exports, "constant", { enumerable: true, get: function () { return continuity_1.constant; } });
Object.defineProperty(exports, "identity", { enumerable: true, get: function () { return continuity_1.identity; } });
Object.defineProperty(exports, "lipschitz", { enumerable: true, get: function () { return continuity_1.lipschitz; } });
var integral_1 = require("./integral");
Object.defineProperty(exports, "bishopIntegral", { enumerable: true, get: function () { return integral_1.bishopIntegral; } });
var compact_1 = require("./compact");
Object.defineProperty(exports, "hasFiniteSubcover", { enumerable: true, get: function () { return compact_1.hasFiniteSubcover; } });
var ivt_1 = require("./ivt");
Object.defineProperty(exports, "intermediateValueTheorem", { enumerable: true, get: function () { return ivt_1.intermediateValueTheorem; } });
Object.defineProperty(exports, "meanValueConstructive", { enumerable: true, get: function () { return ivt_1.meanValueConstructive; } });
//# sourceMappingURL=index.js.map