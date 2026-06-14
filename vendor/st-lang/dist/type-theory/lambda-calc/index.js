"use strict";
// ============================================================
// λ-cálculo untyped — Punto de entrada público
// ============================================================
//
// API:
//   - Constructores: v / lam / ap / apN
//   - α-equivalencia, pretty printer
//   - freeVars, substitute (capture-avoiding), alphaRename
//   - betaStep / etaStep / normalize / isNormalForm / isWeakHeadNormalForm
//   - Combinadores: I, K, S, Y, omega, omegaSmall
//   - Church numerals: churchNumeral, decodeChurch, evalChurch,
//                       churchSucc, churchAdd, churchMul
Object.defineProperty(exports, "__esModule", { value: true });
exports.churchMul = exports.churchAdd = exports.churchSucc = exports.evalChurch = exports.decodeChurch = exports.churchNumeral = exports.omegaSmall = exports.omega = exports.Y = exports.S = exports.K = exports.I = exports.isWeakHeadNormalForm = exports.isNormalForm = exports.normalize = exports.etaStep = exports.betaStep = exports.makeFreshSupply = exports.alphaRename = exports.substitute = exports.freeVars = exports.termToString = exports.alphaEq = exports.apN = exports.ap = exports.lam = exports.v = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "v", { enumerable: true, get: function () { return types_1.v; } });
Object.defineProperty(exports, "lam", { enumerable: true, get: function () { return types_1.lam; } });
Object.defineProperty(exports, "ap", { enumerable: true, get: function () { return types_1.ap; } });
Object.defineProperty(exports, "apN", { enumerable: true, get: function () { return types_1.apN; } });
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return types_1.alphaEq; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
var substitution_1 = require("./substitution");
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return substitution_1.freeVars; } });
Object.defineProperty(exports, "substitute", { enumerable: true, get: function () { return substitution_1.substitute; } });
Object.defineProperty(exports, "alphaRename", { enumerable: true, get: function () { return substitution_1.alphaRename; } });
Object.defineProperty(exports, "makeFreshSupply", { enumerable: true, get: function () { return substitution_1.makeFreshSupply; } });
var reduce_1 = require("./reduce");
Object.defineProperty(exports, "betaStep", { enumerable: true, get: function () { return reduce_1.betaStep; } });
Object.defineProperty(exports, "etaStep", { enumerable: true, get: function () { return reduce_1.etaStep; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return reduce_1.normalize; } });
Object.defineProperty(exports, "isNormalForm", { enumerable: true, get: function () { return reduce_1.isNormalForm; } });
Object.defineProperty(exports, "isWeakHeadNormalForm", { enumerable: true, get: function () { return reduce_1.isWeakHeadNormalForm; } });
var combinators_1 = require("./combinators");
Object.defineProperty(exports, "I", { enumerable: true, get: function () { return combinators_1.I; } });
Object.defineProperty(exports, "K", { enumerable: true, get: function () { return combinators_1.K; } });
Object.defineProperty(exports, "S", { enumerable: true, get: function () { return combinators_1.S; } });
Object.defineProperty(exports, "Y", { enumerable: true, get: function () { return combinators_1.Y; } });
Object.defineProperty(exports, "omega", { enumerable: true, get: function () { return combinators_1.omega; } });
Object.defineProperty(exports, "omegaSmall", { enumerable: true, get: function () { return combinators_1.omegaSmall; } });
var church_1 = require("./church");
Object.defineProperty(exports, "churchNumeral", { enumerable: true, get: function () { return church_1.churchNumeral; } });
Object.defineProperty(exports, "decodeChurch", { enumerable: true, get: function () { return church_1.decodeChurch; } });
Object.defineProperty(exports, "evalChurch", { enumerable: true, get: function () { return church_1.evalChurch; } });
Object.defineProperty(exports, "churchSucc", { enumerable: true, get: function () { return church_1.churchSucc; } });
Object.defineProperty(exports, "churchAdd", { enumerable: true, get: function () { return church_1.churchAdd; } });
Object.defineProperty(exports, "churchMul", { enumerable: true, get: function () { return church_1.churchMul; } });
//# sourceMappingURL=index.js.map