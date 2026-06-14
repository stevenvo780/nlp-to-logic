"use strict";
// ============================================================
// Refinement types — Punto de entrada público
// ============================================================
//
// Tipos refinados al estilo Liquid Haskell didáctico:
//   { x : Int | P(x) }
//
// Capacidades:
//   - typeCheck : sintetiza o chequea tipos refinados con VC
//                 generation y descarga acotada.
//   - isSubtype : subtipado por implicación, contravarianza en
//                 parámetros de arrow.
//   - generateVC: extrae los predicados que deben mantenerse.
//   - checkVC   : solver acotado SAT-like sobre enteros + booleanos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.predicateToString = exports.predicateRenameVar = exports.predicateSubstVar = exports.predicateFreeVars = exports.evalPredicate = exports.parsePredicate = exports.implies = exports.checkVC = exports.isSubtype = exports.generateVC = exports.typeCheck = exports.termToString = exports.refTypeToString = exports.baseToString = exports.eqRefType = exports.eqBase = exports.rLet = exports.rApp = exports.rLam = exports.rIf = exports.rBinop = exports.rVar = exports.rLit = exports.refine = exports.tArrow = exports.tString = exports.tBool = exports.tInt = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "tInt", { enumerable: true, get: function () { return types_1.tInt; } });
Object.defineProperty(exports, "tBool", { enumerable: true, get: function () { return types_1.tBool; } });
Object.defineProperty(exports, "tString", { enumerable: true, get: function () { return types_1.tString; } });
Object.defineProperty(exports, "tArrow", { enumerable: true, get: function () { return types_1.tArrow; } });
Object.defineProperty(exports, "refine", { enumerable: true, get: function () { return types_1.refine; } });
Object.defineProperty(exports, "rLit", { enumerable: true, get: function () { return types_1.rLit; } });
Object.defineProperty(exports, "rVar", { enumerable: true, get: function () { return types_1.rVar; } });
Object.defineProperty(exports, "rBinop", { enumerable: true, get: function () { return types_1.rBinop; } });
Object.defineProperty(exports, "rIf", { enumerable: true, get: function () { return types_1.rIf; } });
Object.defineProperty(exports, "rLam", { enumerable: true, get: function () { return types_1.rLam; } });
Object.defineProperty(exports, "rApp", { enumerable: true, get: function () { return types_1.rApp; } });
Object.defineProperty(exports, "rLet", { enumerable: true, get: function () { return types_1.rLet; } });
Object.defineProperty(exports, "eqBase", { enumerable: true, get: function () { return types_1.eqBase; } });
Object.defineProperty(exports, "eqRefType", { enumerable: true, get: function () { return types_1.eqRefType; } });
Object.defineProperty(exports, "baseToString", { enumerable: true, get: function () { return types_1.baseToString; } });
Object.defineProperty(exports, "refTypeToString", { enumerable: true, get: function () { return types_1.refTypeToString; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
var checker_1 = require("./checker");
Object.defineProperty(exports, "typeCheck", { enumerable: true, get: function () { return checker_1.typeCheck; } });
Object.defineProperty(exports, "generateVC", { enumerable: true, get: function () { return checker_1.generateVC; } });
var subtype_1 = require("./subtype");
Object.defineProperty(exports, "isSubtype", { enumerable: true, get: function () { return subtype_1.isSubtype; } });
var solver_1 = require("./solver");
Object.defineProperty(exports, "checkVC", { enumerable: true, get: function () { return solver_1.checkVC; } });
Object.defineProperty(exports, "implies", { enumerable: true, get: function () { return solver_1.implies; } });
var predicate_1 = require("./predicate");
Object.defineProperty(exports, "parsePredicate", { enumerable: true, get: function () { return predicate_1.parsePredicate; } });
Object.defineProperty(exports, "evalPredicate", { enumerable: true, get: function () { return predicate_1.evalPredicate; } });
Object.defineProperty(exports, "predicateFreeVars", { enumerable: true, get: function () { return predicate_1.freeVars; } });
Object.defineProperty(exports, "predicateSubstVar", { enumerable: true, get: function () { return predicate_1.substVar; } });
Object.defineProperty(exports, "predicateRenameVar", { enumerable: true, get: function () { return predicate_1.renameVar; } });
Object.defineProperty(exports, "predicateToString", { enumerable: true, get: function () { return predicate_1.predicateToString; } });
//# sourceMappingURL=index.js.map