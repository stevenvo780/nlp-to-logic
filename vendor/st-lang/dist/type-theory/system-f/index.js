"use strict";
// ============================================================
// System F — Punto de entrada público
// ============================================================
//
// λ² (System F) extiende STLC con cuantificación universal sobre
// tipos. Curry-Howard: corresponde a la lógica proposicional
// intuicionista de segundo orden.
//
// Constructores y operaciones:
//   - Tipos: atom, arrow, forall.
//   - Términos: var, abs, app, tabs (Λ), tapp (t [T]).
//   - typeOf: type-checking con contexto (term + type).
//   - reduceBeta / normalize: β + type-β (call-by-name).
//   - isWellFormed: chequea que tipos no tengan variables libres
//     no declaradas.
//   - alphaEqType: igualdad de tipos módulo α.
Object.defineProperty(exports, "__esModule", { value: true });
exports.substTerm = exports.substTypeInTerm = exports.substType = exports.termTypeVars = exports.freeVars = exports.isNormal = exports.normalize = exports.reduceBeta = exports.isTypeError = exports.typeOf = exports.cloneContext = exports.emptyContext = exports.fTermToString = exports.fTypeToString = exports.isWellFormed = exports.alphaEqType = exports.freeTypeVars = exports.fTApp = exports.fTAbs = exports.fApp = exports.fAbs = exports.fVar = exports.fForall = exports.fArrow = exports.fAtom = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "fAtom", { enumerable: true, get: function () { return types_1.fAtom; } });
Object.defineProperty(exports, "fArrow", { enumerable: true, get: function () { return types_1.fArrow; } });
Object.defineProperty(exports, "fForall", { enumerable: true, get: function () { return types_1.fForall; } });
Object.defineProperty(exports, "fVar", { enumerable: true, get: function () { return types_1.fVar; } });
Object.defineProperty(exports, "fAbs", { enumerable: true, get: function () { return types_1.fAbs; } });
Object.defineProperty(exports, "fApp", { enumerable: true, get: function () { return types_1.fApp; } });
Object.defineProperty(exports, "fTAbs", { enumerable: true, get: function () { return types_1.fTAbs; } });
Object.defineProperty(exports, "fTApp", { enumerable: true, get: function () { return types_1.fTApp; } });
Object.defineProperty(exports, "freeTypeVars", { enumerable: true, get: function () { return types_1.freeTypeVars; } });
Object.defineProperty(exports, "alphaEqType", { enumerable: true, get: function () { return types_1.alphaEqType; } });
Object.defineProperty(exports, "isWellFormed", { enumerable: true, get: function () { return types_1.isWellFormed; } });
Object.defineProperty(exports, "fTypeToString", { enumerable: true, get: function () { return types_1.fTypeToString; } });
Object.defineProperty(exports, "fTermToString", { enumerable: true, get: function () { return types_1.fTermToString; } });
Object.defineProperty(exports, "emptyContext", { enumerable: true, get: function () { return types_1.emptyContext; } });
Object.defineProperty(exports, "cloneContext", { enumerable: true, get: function () { return types_1.cloneContext; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "typeOf", { enumerable: true, get: function () { return infer_1.typeOf; } });
Object.defineProperty(exports, "isTypeError", { enumerable: true, get: function () { return infer_1.isTypeError; } });
var reduce_1 = require("./reduce");
Object.defineProperty(exports, "reduceBeta", { enumerable: true, get: function () { return reduce_1.reduceBeta; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return reduce_1.normalize; } });
Object.defineProperty(exports, "isNormal", { enumerable: true, get: function () { return reduce_1.isNormal; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return reduce_1.freeVars; } });
Object.defineProperty(exports, "termTypeVars", { enumerable: true, get: function () { return reduce_1.termTypeVars; } });
Object.defineProperty(exports, "substType", { enumerable: true, get: function () { return reduce_1.substType; } });
Object.defineProperty(exports, "substTypeInTerm", { enumerable: true, get: function () { return reduce_1.substTypeInTerm; } });
Object.defineProperty(exports, "substTerm", { enumerable: true, get: function () { return reduce_1.substTerm; } });
//# sourceMappingURL=index.js.map