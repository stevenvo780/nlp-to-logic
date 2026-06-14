"use strict";
// ============================================================
// MLTT — Martin-Löf Type Theory (núcleo público)
// ============================================================
//
// Cálculo λ con tipos dependientes:
//   - Π (x : A). B(x)          funciones dependientes
//   - Σ (x : A). B(x)          pares dependientes
//   - Id(A, a, b) + refl       tipo identidad propositional
//   - Type i jerárquico        universos
//   - Nat / zero / succ        naturales como tipo base
//
// inferType / checkType / normalize / alphaBetaEq son la API mínima
// para construir lenguajes tipo Coq/Agda didácticos encima.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInferError = exports.checkType = exports.inferType = exports.alphaBetaEq = exports.alphaEq = exports.isNormal = exports.normalize = exports.reduceStep = exports.substitute = exports.termToString = exports.occursFree = exports.freeVars = exports.mArrow = exports.mSucc = exports.mZero = exports.mNat = exports.mRefl = exports.mId = exports.mSnd = exports.mFst = exports.mPair = exports.mSigma = exports.mApp = exports.mLam = exports.mPi = exports.mUniverse = exports.mVar = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "mVar", { enumerable: true, get: function () { return types_1.mVar; } });
Object.defineProperty(exports, "mUniverse", { enumerable: true, get: function () { return types_1.mUniverse; } });
Object.defineProperty(exports, "mPi", { enumerable: true, get: function () { return types_1.mPi; } });
Object.defineProperty(exports, "mLam", { enumerable: true, get: function () { return types_1.mLam; } });
Object.defineProperty(exports, "mApp", { enumerable: true, get: function () { return types_1.mApp; } });
Object.defineProperty(exports, "mSigma", { enumerable: true, get: function () { return types_1.mSigma; } });
Object.defineProperty(exports, "mPair", { enumerable: true, get: function () { return types_1.mPair; } });
Object.defineProperty(exports, "mFst", { enumerable: true, get: function () { return types_1.mFst; } });
Object.defineProperty(exports, "mSnd", { enumerable: true, get: function () { return types_1.mSnd; } });
Object.defineProperty(exports, "mId", { enumerable: true, get: function () { return types_1.mId; } });
Object.defineProperty(exports, "mRefl", { enumerable: true, get: function () { return types_1.mRefl; } });
Object.defineProperty(exports, "mNat", { enumerable: true, get: function () { return types_1.mNat; } });
Object.defineProperty(exports, "mZero", { enumerable: true, get: function () { return types_1.mZero; } });
Object.defineProperty(exports, "mSucc", { enumerable: true, get: function () { return types_1.mSucc; } });
Object.defineProperty(exports, "mArrow", { enumerable: true, get: function () { return types_1.mArrow; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return types_1.freeVars; } });
Object.defineProperty(exports, "occursFree", { enumerable: true, get: function () { return types_1.occursFree; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
var substitute_1 = require("./substitute");
Object.defineProperty(exports, "substitute", { enumerable: true, get: function () { return substitute_1.substitute; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "reduceStep", { enumerable: true, get: function () { return normalize_1.reduceStep; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_1.normalize; } });
Object.defineProperty(exports, "isNormal", { enumerable: true, get: function () { return normalize_1.isNormal; } });
var equality_1 = require("./equality");
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return equality_1.alphaEq; } });
Object.defineProperty(exports, "alphaBetaEq", { enumerable: true, get: function () { return equality_1.alphaBetaEq; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return infer_1.inferType; } });
Object.defineProperty(exports, "checkType", { enumerable: true, get: function () { return infer_1.checkType; } });
Object.defineProperty(exports, "isInferError", { enumerable: true, get: function () { return infer_1.isInferError; } });
//# sourceMappingURL=index.js.map