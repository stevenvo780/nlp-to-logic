"use strict";
// ============================================================
// Higher-Order Logic (HOL Light style) — Entrada pública
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exists = exports.Forall = exports.Implies = exports.Not = exports.Or = exports.And = exports.Bottom = exports.True = exports.instTyped = exports.inst = exports.instType = exports.deductAntisymRule = exports.eqMp = exports.assume = exports.beta = exports.abs = exports.mkComb = exports.trans = exports.refl = exports.mkCombTerm = exports.isIff = exports.isEq = exports.destEq = exports.mkEq = exports.eqConst = exports.termToString = exports.instTypeInTerm = exports.substTerm = exports.freshName = exports.occursFree = exports.freeVars = exports.alphaEq = exports.typeOf = exports.mkAbs = exports.mkConst = exports.mkVar = exports.freeTypeVars = exports.substType = exports.typeToString = exports.funCodomain = exports.funDomain = exports.isFunType = exports.typeEq = exports.funTyN = exports.funTy = exports.TyInd = exports.TyBool = exports.tapp = exports.tconst = exports.tvar = void 0;
exports.assertBool = exports.mkExists = exports.mkForall = exports.mkImplies = exports.mkNot = exports.mkOr = exports.mkAnd = void 0;
// Sistema de tipos
var type_system_1 = require("./type-system");
Object.defineProperty(exports, "tvar", { enumerable: true, get: function () { return type_system_1.tvar; } });
Object.defineProperty(exports, "tconst", { enumerable: true, get: function () { return type_system_1.tconst; } });
Object.defineProperty(exports, "tapp", { enumerable: true, get: function () { return type_system_1.tapp; } });
Object.defineProperty(exports, "TyBool", { enumerable: true, get: function () { return type_system_1.TyBool; } });
Object.defineProperty(exports, "TyInd", { enumerable: true, get: function () { return type_system_1.TyInd; } });
Object.defineProperty(exports, "funTy", { enumerable: true, get: function () { return type_system_1.funTy; } });
Object.defineProperty(exports, "funTyN", { enumerable: true, get: function () { return type_system_1.funTyN; } });
Object.defineProperty(exports, "typeEq", { enumerable: true, get: function () { return type_system_1.typeEq; } });
Object.defineProperty(exports, "isFunType", { enumerable: true, get: function () { return type_system_1.isFunType; } });
Object.defineProperty(exports, "funDomain", { enumerable: true, get: function () { return type_system_1.funDomain; } });
Object.defineProperty(exports, "funCodomain", { enumerable: true, get: function () { return type_system_1.funCodomain; } });
Object.defineProperty(exports, "typeToString", { enumerable: true, get: function () { return type_system_1.typeToString; } });
Object.defineProperty(exports, "substType", { enumerable: true, get: function () { return type_system_1.substType; } });
Object.defineProperty(exports, "freeTypeVars", { enumerable: true, get: function () { return type_system_1.freeTypeVars; } });
// Términos
var term_1 = require("./term");
Object.defineProperty(exports, "mkVar", { enumerable: true, get: function () { return term_1.mkVar; } });
Object.defineProperty(exports, "mkConst", { enumerable: true, get: function () { return term_1.mkConst; } });
Object.defineProperty(exports, "mkAbs", { enumerable: true, get: function () { return term_1.mkAbs; } });
Object.defineProperty(exports, "typeOf", { enumerable: true, get: function () { return term_1.typeOf; } });
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return term_1.alphaEq; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return term_1.freeVars; } });
Object.defineProperty(exports, "occursFree", { enumerable: true, get: function () { return term_1.occursFree; } });
Object.defineProperty(exports, "freshName", { enumerable: true, get: function () { return term_1.freshName; } });
Object.defineProperty(exports, "substTerm", { enumerable: true, get: function () { return term_1.substTerm; } });
Object.defineProperty(exports, "instTypeInTerm", { enumerable: true, get: function () { return term_1.instTypeInTerm; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return term_1.termToString; } });
Object.defineProperty(exports, "eqConst", { enumerable: true, get: function () { return term_1.eqConst; } });
Object.defineProperty(exports, "mkEq", { enumerable: true, get: function () { return term_1.mkEq; } });
Object.defineProperty(exports, "destEq", { enumerable: true, get: function () { return term_1.destEq; } });
Object.defineProperty(exports, "isEq", { enumerable: true, get: function () { return term_1.isEq; } });
Object.defineProperty(exports, "isIff", { enumerable: true, get: function () { return term_1.isIff; } });
// mkComb se expone desde rules.ts (que reexporta) para que el
// "mkComb regla" (sobre teoremas) sea el público, mientras que
// el constructor de términos vive como `mkCombTerm`.
var term_2 = require("./term");
Object.defineProperty(exports, "mkCombTerm", { enumerable: true, get: function () { return term_2.mkComb; } });
// Reglas primitivas
var rules_1 = require("./rules");
Object.defineProperty(exports, "refl", { enumerable: true, get: function () { return rules_1.refl; } });
Object.defineProperty(exports, "trans", { enumerable: true, get: function () { return rules_1.trans; } });
Object.defineProperty(exports, "mkComb", { enumerable: true, get: function () { return rules_1.mkComb; } });
Object.defineProperty(exports, "abs", { enumerable: true, get: function () { return rules_1.abs; } });
Object.defineProperty(exports, "beta", { enumerable: true, get: function () { return rules_1.beta; } });
Object.defineProperty(exports, "assume", { enumerable: true, get: function () { return rules_1.assume; } });
Object.defineProperty(exports, "eqMp", { enumerable: true, get: function () { return rules_1.eqMp; } });
Object.defineProperty(exports, "deductAntisymRule", { enumerable: true, get: function () { return rules_1.deductAntisymRule; } });
Object.defineProperty(exports, "instType", { enumerable: true, get: function () { return rules_1.instType; } });
Object.defineProperty(exports, "inst", { enumerable: true, get: function () { return rules_1.inst; } });
Object.defineProperty(exports, "instTyped", { enumerable: true, get: function () { return rules_1.instTyped; } });
// Conectivas y cuantificadores definidos
var connectives_1 = require("./connectives");
Object.defineProperty(exports, "True", { enumerable: true, get: function () { return connectives_1.True; } });
Object.defineProperty(exports, "Bottom", { enumerable: true, get: function () { return connectives_1.Bottom; } });
Object.defineProperty(exports, "And", { enumerable: true, get: function () { return connectives_1.And; } });
Object.defineProperty(exports, "Or", { enumerable: true, get: function () { return connectives_1.Or; } });
Object.defineProperty(exports, "Not", { enumerable: true, get: function () { return connectives_1.Not; } });
Object.defineProperty(exports, "Implies", { enumerable: true, get: function () { return connectives_1.Implies; } });
Object.defineProperty(exports, "Forall", { enumerable: true, get: function () { return connectives_1.Forall; } });
Object.defineProperty(exports, "Exists", { enumerable: true, get: function () { return connectives_1.Exists; } });
Object.defineProperty(exports, "mkAnd", { enumerable: true, get: function () { return connectives_1.mkAnd; } });
Object.defineProperty(exports, "mkOr", { enumerable: true, get: function () { return connectives_1.mkOr; } });
Object.defineProperty(exports, "mkNot", { enumerable: true, get: function () { return connectives_1.mkNot; } });
Object.defineProperty(exports, "mkImplies", { enumerable: true, get: function () { return connectives_1.mkImplies; } });
Object.defineProperty(exports, "mkForall", { enumerable: true, get: function () { return connectives_1.mkForall; } });
Object.defineProperty(exports, "mkExists", { enumerable: true, get: function () { return connectives_1.mkExists; } });
Object.defineProperty(exports, "assertBool", { enumerable: true, get: function () { return connectives_1.assertBool; } });
//# sourceMappingURL=index.js.map