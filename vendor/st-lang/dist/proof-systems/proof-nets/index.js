"use strict";
// ============================================================
// Proof Nets — Punto de entrada público
// ============================================================
//
// Proof nets de Girard para MLL (Multiplicative Linear Logic):
//   - construcción a partir de un secuente,
//   - verificación de corrección (criterio Danos-Regnier),
//   - eliminación de cortes (axiom-cut y mult-cut).
//
// Diseño "didáctico" cercano al estándar de la literatura:
// nodos numerados, links {axiom, cut, tensor, par} con ports en
// orden canónico, conclusiones explícitas.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCutFree = exports.normalizeCuts = exports.reduceCutStep = exports.reduceCut = exports.isCorrect = exports.constructFromSequent = exports.formulaToString = exports.formulaEquals = exports.dual = exports.par = exports.tensor = exports.atomNeg = exports.atomPos = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "atomPos", { enumerable: true, get: function () { return types_1.atomPos; } });
Object.defineProperty(exports, "atomNeg", { enumerable: true, get: function () { return types_1.atomNeg; } });
Object.defineProperty(exports, "tensor", { enumerable: true, get: function () { return types_1.tensor; } });
Object.defineProperty(exports, "par", { enumerable: true, get: function () { return types_1.par; } });
Object.defineProperty(exports, "dual", { enumerable: true, get: function () { return types_1.dual; } });
Object.defineProperty(exports, "formulaEquals", { enumerable: true, get: function () { return types_1.formulaEquals; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return types_1.formulaToString; } });
var construct_1 = require("./construct");
Object.defineProperty(exports, "constructFromSequent", { enumerable: true, get: function () { return construct_1.constructFromSequent; } });
var correctness_1 = require("./correctness");
Object.defineProperty(exports, "isCorrect", { enumerable: true, get: function () { return correctness_1.isCorrect; } });
var cut_elim_1 = require("./cut-elim");
Object.defineProperty(exports, "reduceCut", { enumerable: true, get: function () { return cut_elim_1.reduceCut; } });
Object.defineProperty(exports, "reduceCutStep", { enumerable: true, get: function () { return cut_elim_1.reduceCutStep; } });
Object.defineProperty(exports, "normalizeCuts", { enumerable: true, get: function () { return cut_elim_1.normalizeCuts; } });
Object.defineProperty(exports, "isCutFree", { enumerable: true, get: function () { return cut_elim_1.isCutFree; } });
//# sourceMappingURL=index.js.map