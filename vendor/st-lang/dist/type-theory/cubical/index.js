"use strict";
// ============================================================
// CTT-Lite — Cubical Type Theory (núcleo público)
// ============================================================
//
// Extiende MLTT con:
//   - Intervalo I con conexiones (∧, ∨) e involución (~)
//   - PathP A x y como caminos dependientes en I
//   - λi. t y p @ r (path-abstracción y aplicación)
//   - Reducciones computacionales del intervalo
//   - glue como precursor sintáctico de la computación de ua
//
// La diferencia central con HoTT (en /hott/) es que aquí univalence
// es computacional: transport sobre un path generado por glue puede
// reducir (en una versión completa de CTT). En este subset se sienta
// la base sintáctica que permite esa reducción.
Object.defineProperty(exports, "__esModule", { value: true });
exports.termToString = exports.alphaEq = exports.alphaBetaEq = exports.normalize = exports.glue = exports.pathCompose = exports.pathInverse = exports.reflPath = exports.intervalType = exports.makeContext = exports.isInferErrorCubical = exports.checkType = exports.inferType = exports.alphaBetaEqCubical = exports.alphaEqCubical = exports.isNormalCubical = exports.normalizeCubical = exports.reduceStepCubical = exports.normalizeInterval = exports.evalInterval = exports.substituteCubical = exports.termToStringCubical = exports.occursFreeCubical = exports.freeVarsCubical = exports.isIntervalExpr = exports.cArrow = exports.cApp = exports.cLam = exports.cPi = exports.cUniverse = exports.cVar = exports.cGlue = exports.cPApp = exports.cPLam = exports.cPathP = exports.cINeg = exports.cIMax = exports.cIMin = exports.cIVar = exports.cI1 = exports.cI0 = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "cI0", { enumerable: true, get: function () { return types_1.cI0; } });
Object.defineProperty(exports, "cI1", { enumerable: true, get: function () { return types_1.cI1; } });
Object.defineProperty(exports, "cIVar", { enumerable: true, get: function () { return types_1.cIVar; } });
Object.defineProperty(exports, "cIMin", { enumerable: true, get: function () { return types_1.cIMin; } });
Object.defineProperty(exports, "cIMax", { enumerable: true, get: function () { return types_1.cIMax; } });
Object.defineProperty(exports, "cINeg", { enumerable: true, get: function () { return types_1.cINeg; } });
Object.defineProperty(exports, "cPathP", { enumerable: true, get: function () { return types_1.cPathP; } });
Object.defineProperty(exports, "cPLam", { enumerable: true, get: function () { return types_1.cPLam; } });
Object.defineProperty(exports, "cPApp", { enumerable: true, get: function () { return types_1.cPApp; } });
Object.defineProperty(exports, "cGlue", { enumerable: true, get: function () { return types_1.cGlue; } });
Object.defineProperty(exports, "cVar", { enumerable: true, get: function () { return types_1.cVar; } });
Object.defineProperty(exports, "cUniverse", { enumerable: true, get: function () { return types_1.cUniverse; } });
Object.defineProperty(exports, "cPi", { enumerable: true, get: function () { return types_1.cPi; } });
Object.defineProperty(exports, "cLam", { enumerable: true, get: function () { return types_1.cLam; } });
Object.defineProperty(exports, "cApp", { enumerable: true, get: function () { return types_1.cApp; } });
Object.defineProperty(exports, "cArrow", { enumerable: true, get: function () { return types_1.cArrow; } });
Object.defineProperty(exports, "isIntervalExpr", { enumerable: true, get: function () { return types_1.isIntervalExpr; } });
Object.defineProperty(exports, "freeVarsCubical", { enumerable: true, get: function () { return types_1.freeVarsCubical; } });
Object.defineProperty(exports, "occursFreeCubical", { enumerable: true, get: function () { return types_1.occursFreeCubical; } });
Object.defineProperty(exports, "termToStringCubical", { enumerable: true, get: function () { return types_1.termToStringCubical; } });
var substitute_1 = require("./substitute");
Object.defineProperty(exports, "substituteCubical", { enumerable: true, get: function () { return substitute_1.substituteCubical; } });
var interval_1 = require("./interval");
Object.defineProperty(exports, "evalInterval", { enumerable: true, get: function () { return interval_1.evalInterval; } });
Object.defineProperty(exports, "normalizeInterval", { enumerable: true, get: function () { return interval_1.normalizeInterval; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "reduceStepCubical", { enumerable: true, get: function () { return normalize_1.reduceStepCubical; } });
Object.defineProperty(exports, "normalizeCubical", { enumerable: true, get: function () { return normalize_1.normalizeCubical; } });
Object.defineProperty(exports, "isNormalCubical", { enumerable: true, get: function () { return normalize_1.isNormalCubical; } });
var equality_1 = require("./equality");
Object.defineProperty(exports, "alphaEqCubical", { enumerable: true, get: function () { return equality_1.alphaEqCubical; } });
Object.defineProperty(exports, "alphaBetaEqCubical", { enumerable: true, get: function () { return equality_1.alphaBetaEqCubical; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return infer_1.inferType; } });
Object.defineProperty(exports, "checkType", { enumerable: true, get: function () { return infer_1.checkType; } });
Object.defineProperty(exports, "isInferErrorCubical", { enumerable: true, get: function () { return infer_1.isInferErrorCubical; } });
Object.defineProperty(exports, "makeContext", { enumerable: true, get: function () { return infer_1.makeContext; } });
Object.defineProperty(exports, "intervalType", { enumerable: true, get: function () { return infer_1.intervalType; } });
var path_algebra_1 = require("./path-algebra");
Object.defineProperty(exports, "reflPath", { enumerable: true, get: function () { return path_algebra_1.reflPath; } });
Object.defineProperty(exports, "pathInverse", { enumerable: true, get: function () { return path_algebra_1.pathInverse; } });
Object.defineProperty(exports, "pathCompose", { enumerable: true, get: function () { return path_algebra_1.pathCompose; } });
Object.defineProperty(exports, "glue", { enumerable: true, get: function () { return path_algebra_1.glue; } });
// Alias sin sufijo para uso ergonómico
var normalize_2 = require("./normalize");
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_2.normalizeCubical; } });
var equality_2 = require("./equality");
Object.defineProperty(exports, "alphaBetaEq", { enumerable: true, get: function () { return equality_2.alphaBetaEqCubical; } });
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return equality_2.alphaEqCubical; } });
var types_2 = require("./types");
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_2.termToStringCubical; } });
//# sourceMappingURL=index.js.map