"use strict";
// ============================================================
// HoTT — Homotopy Type Theory (núcleo público)
// ============================================================
//
// Extiende MLTT con:
//   - Path A x y como espacio de caminos (no proposición)
//   - refl, transport, ap, J-eliminator (computacionales sobre refl)
//   - pathSym (inverso) y pathConcat (concatenación)
//   - HITs: S¹ (circle, base, loop) y suspensión (north, south, meridian)
//   - Univalence como axioma (ua) no computacional
//
// API mínima compatible con MLTT:
//   inferType / checkType / normalize / alphaBetaEq
Object.defineProperty(exports, "__esModule", { value: true });
exports.termToString = exports.alphaEq = exports.alphaBetaEq = exports.normalize = exports.univalenceWitness = exports.univalence = exports.isHEquivalence = exports.pathCompose = exports.pathInverse = exports.refl = exports.isInferErrorHoTT = exports.checkType = exports.inferType = exports.alphaBetaEqHoTT = exports.alphaEqHoTT = exports.isNormalHoTT = exports.normalizeHoTT = exports.reduceStepHoTT = exports.substituteHoTT = exports.termToStringHoTT = exports.occursFreeHoTT = exports.freeVarsHoTT = exports.hUa = exports.hMeridian = exports.hSouth = exports.hNorth = exports.hSuspension = exports.hLoopOfCircle = exports.hBaseOfCircle = exports.hCircle = exports.hJElim = exports.hAp = exports.hPathConcat = exports.hPathSym = exports.hTransport = exports.hRefl = exports.hPath = exports.hArrow = exports.hSucc = exports.hZero = exports.hNat = exports.hSnd = exports.hFst = exports.hPair = exports.hSigma = exports.hApp = exports.hLam = exports.hPi = exports.hUniverse = exports.hVar = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "hVar", { enumerable: true, get: function () { return types_1.hVar; } });
Object.defineProperty(exports, "hUniverse", { enumerable: true, get: function () { return types_1.hUniverse; } });
Object.defineProperty(exports, "hPi", { enumerable: true, get: function () { return types_1.hPi; } });
Object.defineProperty(exports, "hLam", { enumerable: true, get: function () { return types_1.hLam; } });
Object.defineProperty(exports, "hApp", { enumerable: true, get: function () { return types_1.hApp; } });
Object.defineProperty(exports, "hSigma", { enumerable: true, get: function () { return types_1.hSigma; } });
Object.defineProperty(exports, "hPair", { enumerable: true, get: function () { return types_1.hPair; } });
Object.defineProperty(exports, "hFst", { enumerable: true, get: function () { return types_1.hFst; } });
Object.defineProperty(exports, "hSnd", { enumerable: true, get: function () { return types_1.hSnd; } });
Object.defineProperty(exports, "hNat", { enumerable: true, get: function () { return types_1.hNat; } });
Object.defineProperty(exports, "hZero", { enumerable: true, get: function () { return types_1.hZero; } });
Object.defineProperty(exports, "hSucc", { enumerable: true, get: function () { return types_1.hSucc; } });
Object.defineProperty(exports, "hArrow", { enumerable: true, get: function () { return types_1.hArrow; } });
Object.defineProperty(exports, "hPath", { enumerable: true, get: function () { return types_1.hPath; } });
Object.defineProperty(exports, "hRefl", { enumerable: true, get: function () { return types_1.hRefl; } });
Object.defineProperty(exports, "hTransport", { enumerable: true, get: function () { return types_1.hTransport; } });
Object.defineProperty(exports, "hPathSym", { enumerable: true, get: function () { return types_1.hPathSym; } });
Object.defineProperty(exports, "hPathConcat", { enumerable: true, get: function () { return types_1.hPathConcat; } });
Object.defineProperty(exports, "hAp", { enumerable: true, get: function () { return types_1.hAp; } });
Object.defineProperty(exports, "hJElim", { enumerable: true, get: function () { return types_1.hJElim; } });
Object.defineProperty(exports, "hCircle", { enumerable: true, get: function () { return types_1.hCircle; } });
Object.defineProperty(exports, "hBaseOfCircle", { enumerable: true, get: function () { return types_1.hBaseOfCircle; } });
Object.defineProperty(exports, "hLoopOfCircle", { enumerable: true, get: function () { return types_1.hLoopOfCircle; } });
Object.defineProperty(exports, "hSuspension", { enumerable: true, get: function () { return types_1.hSuspension; } });
Object.defineProperty(exports, "hNorth", { enumerable: true, get: function () { return types_1.hNorth; } });
Object.defineProperty(exports, "hSouth", { enumerable: true, get: function () { return types_1.hSouth; } });
Object.defineProperty(exports, "hMeridian", { enumerable: true, get: function () { return types_1.hMeridian; } });
Object.defineProperty(exports, "hUa", { enumerable: true, get: function () { return types_1.hUa; } });
Object.defineProperty(exports, "freeVarsHoTT", { enumerable: true, get: function () { return types_1.freeVarsHoTT; } });
Object.defineProperty(exports, "occursFreeHoTT", { enumerable: true, get: function () { return types_1.occursFreeHoTT; } });
Object.defineProperty(exports, "termToStringHoTT", { enumerable: true, get: function () { return types_1.termToStringHoTT; } });
var substitute_1 = require("./substitute");
Object.defineProperty(exports, "substituteHoTT", { enumerable: true, get: function () { return substitute_1.substituteHoTT; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "reduceStepHoTT", { enumerable: true, get: function () { return normalize_1.reduceStepHoTT; } });
Object.defineProperty(exports, "normalizeHoTT", { enumerable: true, get: function () { return normalize_1.normalizeHoTT; } });
Object.defineProperty(exports, "isNormalHoTT", { enumerable: true, get: function () { return normalize_1.isNormalHoTT; } });
var equality_1 = require("./equality");
Object.defineProperty(exports, "alphaEqHoTT", { enumerable: true, get: function () { return equality_1.alphaEqHoTT; } });
Object.defineProperty(exports, "alphaBetaEqHoTT", { enumerable: true, get: function () { return equality_1.alphaBetaEqHoTT; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return infer_1.inferType; } });
Object.defineProperty(exports, "checkType", { enumerable: true, get: function () { return infer_1.checkType; } });
Object.defineProperty(exports, "isInferErrorHoTT", { enumerable: true, get: function () { return infer_1.isInferErrorHoTT; } });
var path_algebra_1 = require("./path-algebra");
Object.defineProperty(exports, "refl", { enumerable: true, get: function () { return path_algebra_1.refl; } });
Object.defineProperty(exports, "pathInverse", { enumerable: true, get: function () { return path_algebra_1.pathInverse; } });
Object.defineProperty(exports, "pathCompose", { enumerable: true, get: function () { return path_algebra_1.pathCompose; } });
Object.defineProperty(exports, "isHEquivalence", { enumerable: true, get: function () { return path_algebra_1.isHEquivalence; } });
Object.defineProperty(exports, "univalence", { enumerable: true, get: function () { return path_algebra_1.univalence; } });
Object.defineProperty(exports, "univalenceWitness", { enumerable: true, get: function () { return path_algebra_1.univalenceWitness; } });
// Alias sin sufijo para uso ergonómico desde otros módulos.
var normalize_2 = require("./normalize");
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_2.normalizeHoTT; } });
var equality_2 = require("./equality");
Object.defineProperty(exports, "alphaBetaEq", { enumerable: true, get: function () { return equality_2.alphaBetaEqHoTT; } });
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return equality_2.alphaEqHoTT; } });
var types_2 = require("./types");
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_2.termToStringHoTT; } });
//# sourceMappingURL=index.js.map