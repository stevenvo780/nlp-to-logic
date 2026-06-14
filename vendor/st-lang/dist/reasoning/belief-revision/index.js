"use strict";
// ============================================================
// ST Belief Revision — Barrel export
// ============================================================
//
// Operadores AGM (Alchourrón-Gärdenfors-Makinson) sobre belief sets
// proposicionales. Incluye expansion, contraction (partial-meet con
// entrenchment opcional), revision (vía identidad de Levi) y
// verificadores de los postulados K1-K3.
Object.defineProperty(exports, "__esModule", { value: true });
exports.areEquivalent = exports.entailsFormula = exports.isSatisfiable = exports.evalFormula = exports.collectAtoms = exports.formulaToString = exports.parsePropFormula = exports.canonicalize = exports.beliefSetToArray = exports.verifyInclusion = exports.verifySuccess = exports.verifyClosure = exports.revise = exports.contract = exports.expand = exports.entails = exports.isConsistent = exports.newBeliefSet = void 0;
var agm_1 = require("./agm");
Object.defineProperty(exports, "newBeliefSet", { enumerable: true, get: function () { return agm_1.newBeliefSet; } });
Object.defineProperty(exports, "isConsistent", { enumerable: true, get: function () { return agm_1.isConsistent; } });
Object.defineProperty(exports, "entails", { enumerable: true, get: function () { return agm_1.entails; } });
Object.defineProperty(exports, "expand", { enumerable: true, get: function () { return agm_1.expand; } });
Object.defineProperty(exports, "contract", { enumerable: true, get: function () { return agm_1.contract; } });
Object.defineProperty(exports, "revise", { enumerable: true, get: function () { return agm_1.revise; } });
Object.defineProperty(exports, "verifyClosure", { enumerable: true, get: function () { return agm_1.verifyClosure; } });
Object.defineProperty(exports, "verifySuccess", { enumerable: true, get: function () { return agm_1.verifySuccess; } });
Object.defineProperty(exports, "verifyInclusion", { enumerable: true, get: function () { return agm_1.verifyInclusion; } });
Object.defineProperty(exports, "beliefSetToArray", { enumerable: true, get: function () { return agm_1.beliefSetToArray; } });
Object.defineProperty(exports, "canonicalize", { enumerable: true, get: function () { return agm_1.canonicalize; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "parsePropFormula", { enumerable: true, get: function () { return parser_1.parsePropFormula; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return parser_1.formulaToString; } });
Object.defineProperty(exports, "collectAtoms", { enumerable: true, get: function () { return parser_1.collectAtoms; } });
var sat_1 = require("./sat");
Object.defineProperty(exports, "evalFormula", { enumerable: true, get: function () { return sat_1.evalFormula; } });
Object.defineProperty(exports, "isSatisfiable", { enumerable: true, get: function () { return sat_1.isSatisfiable; } });
Object.defineProperty(exports, "entailsFormula", { enumerable: true, get: function () { return sat_1.entailsFormula; } });
Object.defineProperty(exports, "areEquivalent", { enumerable: true, get: function () { return sat_1.areEquivalent; } });
//# sourceMappingURL=index.js.map