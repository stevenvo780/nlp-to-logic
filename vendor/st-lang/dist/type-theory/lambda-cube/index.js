"use strict";
// ============================================================
// Lambda Cube (Barendregt) — API pública
// ============================================================
//
// Implementación uniforme de los 8 vértices del cubo λ como un Pure
// Type System (PTS) parametrizado por el conjunto de reglas de
// formación. Permite:
//
//   - inferType / checkType en cualquier vértice (λ→, λ2, λω, λC, ...).
//   - normalize por β-reducción (call-by-name).
//   - erase a λ-cálculo no tipado.
//   - Construcciones canónicas: identity polimórfico, Church numerals,
//     id-type operator, dependent list schema, etc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.cocPolyIdentityType = exports.typeLevelIdentityKind = exports.typeLevelIdentity = exports.predicateOverNat = exports.dependentList = exports.churchPairType = exports.churchNumeralType = exports.churchNumeral = exports.polymorphicIdentityType = exports.polymorphicIdentity = exports.untypedToString = exports.isEraseError = exports.erase = exports.isClosedUnder = exports.isInferError = exports.checkType = exports.inferType = exports.isNormal = exports.alphaBetaEq = exports.normalize = exports.reduceStep = exports.substitute = exports.axiomFor = exports.AXIOMS = exports.rulesOf = exports.hasRule = exports.SYSTEMS = exports.extendContext = exports.emptyContext = exports.alphaEq = exports.termToString = exports.freeVars = exports.occursFree = exports.cArrow = exports.cApp = exports.cLam = exports.cPi = exports.cBox = exports.cStar = exports.cSort = exports.cVar = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "cVar", { enumerable: true, get: function () { return types_1.cVar; } });
Object.defineProperty(exports, "cSort", { enumerable: true, get: function () { return types_1.cSort; } });
Object.defineProperty(exports, "cStar", { enumerable: true, get: function () { return types_1.cStar; } });
Object.defineProperty(exports, "cBox", { enumerable: true, get: function () { return types_1.cBox; } });
Object.defineProperty(exports, "cPi", { enumerable: true, get: function () { return types_1.cPi; } });
Object.defineProperty(exports, "cLam", { enumerable: true, get: function () { return types_1.cLam; } });
Object.defineProperty(exports, "cApp", { enumerable: true, get: function () { return types_1.cApp; } });
Object.defineProperty(exports, "cArrow", { enumerable: true, get: function () { return types_1.cArrow; } });
Object.defineProperty(exports, "occursFree", { enumerable: true, get: function () { return types_1.occursFree; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return types_1.freeVars; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return types_1.alphaEq; } });
Object.defineProperty(exports, "emptyContext", { enumerable: true, get: function () { return types_1.emptyContext; } });
Object.defineProperty(exports, "extendContext", { enumerable: true, get: function () { return types_1.extendContext; } });
var rules_1 = require("./rules");
Object.defineProperty(exports, "SYSTEMS", { enumerable: true, get: function () { return rules_1.SYSTEMS; } });
Object.defineProperty(exports, "hasRule", { enumerable: true, get: function () { return rules_1.hasRule; } });
Object.defineProperty(exports, "rulesOf", { enumerable: true, get: function () { return rules_1.rulesOf; } });
Object.defineProperty(exports, "AXIOMS", { enumerable: true, get: function () { return rules_1.AXIOMS; } });
Object.defineProperty(exports, "axiomFor", { enumerable: true, get: function () { return rules_1.axiomFor; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "substitute", { enumerable: true, get: function () { return normalize_1.substitute; } });
Object.defineProperty(exports, "reduceStep", { enumerable: true, get: function () { return normalize_1.reduceStep; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_1.normalize; } });
Object.defineProperty(exports, "alphaBetaEq", { enumerable: true, get: function () { return normalize_1.alphaBetaEq; } });
Object.defineProperty(exports, "isNormal", { enumerable: true, get: function () { return normalize_1.isNormal; } });
var typecheck_1 = require("./typecheck");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return typecheck_1.inferType; } });
Object.defineProperty(exports, "checkType", { enumerable: true, get: function () { return typecheck_1.checkType; } });
Object.defineProperty(exports, "isInferError", { enumerable: true, get: function () { return typecheck_1.isInferError; } });
Object.defineProperty(exports, "isClosedUnder", { enumerable: true, get: function () { return typecheck_1.isClosedUnder; } });
var erase_1 = require("./erase");
Object.defineProperty(exports, "erase", { enumerable: true, get: function () { return erase_1.erase; } });
Object.defineProperty(exports, "isEraseError", { enumerable: true, get: function () { return erase_1.isEraseError; } });
Object.defineProperty(exports, "untypedToString", { enumerable: true, get: function () { return erase_1.untypedToString; } });
var examples_1 = require("./examples");
Object.defineProperty(exports, "polymorphicIdentity", { enumerable: true, get: function () { return examples_1.polymorphicIdentity; } });
Object.defineProperty(exports, "polymorphicIdentityType", { enumerable: true, get: function () { return examples_1.polymorphicIdentityType; } });
Object.defineProperty(exports, "churchNumeral", { enumerable: true, get: function () { return examples_1.churchNumeral; } });
Object.defineProperty(exports, "churchNumeralType", { enumerable: true, get: function () { return examples_1.churchNumeralType; } });
Object.defineProperty(exports, "churchPairType", { enumerable: true, get: function () { return examples_1.churchPairType; } });
Object.defineProperty(exports, "dependentList", { enumerable: true, get: function () { return examples_1.dependentList; } });
Object.defineProperty(exports, "predicateOverNat", { enumerable: true, get: function () { return examples_1.predicateOverNat; } });
Object.defineProperty(exports, "typeLevelIdentity", { enumerable: true, get: function () { return examples_1.typeLevelIdentity; } });
Object.defineProperty(exports, "typeLevelIdentityKind", { enumerable: true, get: function () { return examples_1.typeLevelIdentityKind; } });
Object.defineProperty(exports, "cocPolyIdentityType", { enumerable: true, get: function () { return examples_1.cocPolyIdentityType; } });
//# sourceMappingURL=index.js.map