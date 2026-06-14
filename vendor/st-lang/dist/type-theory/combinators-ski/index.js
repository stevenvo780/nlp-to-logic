"use strict";
// ============================================================
// SKI combinatory logic — Punto de entrada público
// ============================================================
//
// API:
//   - Tipos: CTerm
//   - Constructores: S(), K(), I(), cvar, app
//   - Estructura: ctermEq, freeVars, termToString
//   - Reducción: reduceStep, normalize, isNormalForm, NormalizeResult
//   - Bracket abstraction: abstractFromLambda, toLambda
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLambda = exports.abstractFromLambda = exports.isNormalForm = exports.normalize = exports.reduceStep = exports.termToString = exports.freeVars = exports.ctermEq = exports.app = exports.cvar = exports.I = exports.K = exports.S = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "S", { enumerable: true, get: function () { return types_1.S; } });
Object.defineProperty(exports, "K", { enumerable: true, get: function () { return types_1.K; } });
Object.defineProperty(exports, "I", { enumerable: true, get: function () { return types_1.I; } });
Object.defineProperty(exports, "cvar", { enumerable: true, get: function () { return types_1.cvar; } });
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return types_1.app; } });
Object.defineProperty(exports, "ctermEq", { enumerable: true, get: function () { return types_1.ctermEq; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return types_1.freeVars; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
var reduce_1 = require("./reduce");
Object.defineProperty(exports, "reduceStep", { enumerable: true, get: function () { return reduce_1.reduceStep; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return reduce_1.normalize; } });
Object.defineProperty(exports, "isNormalForm", { enumerable: true, get: function () { return reduce_1.isNormalForm; } });
var abstract_1 = require("./abstract");
Object.defineProperty(exports, "abstractFromLambda", { enumerable: true, get: function () { return abstract_1.abstractFromLambda; } });
Object.defineProperty(exports, "toLambda", { enumerable: true, get: function () { return abstract_1.toLambda; } });
//# sourceMappingURL=index.js.map