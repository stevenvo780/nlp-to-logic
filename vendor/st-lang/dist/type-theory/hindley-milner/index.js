"use strict";
// ============================================================
// Hindley-Milner — Punto de entrada público
// ============================================================
//
// Sistema de tipos let-polimórfico (Damas-Milner). Provee:
//   - Sintaxis: Type, TypeScheme, Expr, TypeEnv.
//   - Constructores breves: tVar, tConst, tArrow, tApp, eLam, eApp,
//     eLet, eLetRec, eIf, eLit, eVar.
//   - Algoritmo W: algorithmW / infer / inferScheme.
//   - Unificación y sustituciones: unify, applySubst, composeSubsts,
//     freshTypeVar, generalize, instantiate.
//   - Entorno inicial con primitivos (+, ==, pair, cons, ...).
//   - normalizeScheme: renombra tvars ligadas a a, b, c, ... para
//     comparación estable en tests.
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeScheme = exports.initialEnv = exports.isInferError = exports.inferScheme = exports.infer = exports.algorithmW = exports.instantiate = exports.generalize = exports.isUnifyError = exports.unify = exports.occursIn = exports.resetFreshSupply = exports.freshTypeVar = exports.composeSubsts = exports.applySubstScheme = exports.applySubst = exports.emptySubst = exports.schemeToString = exports.typeToString = exports.schemeFreeVars = exports.typeFreeVars = exports.TStr = exports.TBool = exports.TInt = exports.eIf = exports.eLetRec = exports.eLet = exports.eLam = exports.eAppN = exports.eApp = exports.eLit = exports.eVar = exports.mono = exports.scheme = exports.tApp = exports.tArrow = exports.tConst = exports.tVar = exports.TypeEnv = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "TypeEnv", { enumerable: true, get: function () { return types_1.TypeEnv; } });
Object.defineProperty(exports, "tVar", { enumerable: true, get: function () { return types_1.tVar; } });
Object.defineProperty(exports, "tConst", { enumerable: true, get: function () { return types_1.tConst; } });
Object.defineProperty(exports, "tArrow", { enumerable: true, get: function () { return types_1.tArrow; } });
Object.defineProperty(exports, "tApp", { enumerable: true, get: function () { return types_1.tApp; } });
Object.defineProperty(exports, "scheme", { enumerable: true, get: function () { return types_1.scheme; } });
Object.defineProperty(exports, "mono", { enumerable: true, get: function () { return types_1.mono; } });
Object.defineProperty(exports, "eVar", { enumerable: true, get: function () { return types_1.eVar; } });
Object.defineProperty(exports, "eLit", { enumerable: true, get: function () { return types_1.eLit; } });
Object.defineProperty(exports, "eApp", { enumerable: true, get: function () { return types_1.eApp; } });
Object.defineProperty(exports, "eAppN", { enumerable: true, get: function () { return types_1.eAppN; } });
Object.defineProperty(exports, "eLam", { enumerable: true, get: function () { return types_1.eLam; } });
Object.defineProperty(exports, "eLet", { enumerable: true, get: function () { return types_1.eLet; } });
Object.defineProperty(exports, "eLetRec", { enumerable: true, get: function () { return types_1.eLetRec; } });
Object.defineProperty(exports, "eIf", { enumerable: true, get: function () { return types_1.eIf; } });
Object.defineProperty(exports, "TInt", { enumerable: true, get: function () { return types_1.TInt; } });
Object.defineProperty(exports, "TBool", { enumerable: true, get: function () { return types_1.TBool; } });
Object.defineProperty(exports, "TStr", { enumerable: true, get: function () { return types_1.TStr; } });
Object.defineProperty(exports, "typeFreeVars", { enumerable: true, get: function () { return types_1.typeFreeVars; } });
Object.defineProperty(exports, "schemeFreeVars", { enumerable: true, get: function () { return types_1.schemeFreeVars; } });
Object.defineProperty(exports, "typeToString", { enumerable: true, get: function () { return types_1.typeToString; } });
Object.defineProperty(exports, "schemeToString", { enumerable: true, get: function () { return types_1.schemeToString; } });
var substitution_1 = require("./substitution");
Object.defineProperty(exports, "emptySubst", { enumerable: true, get: function () { return substitution_1.emptySubst; } });
Object.defineProperty(exports, "applySubst", { enumerable: true, get: function () { return substitution_1.applySubst; } });
Object.defineProperty(exports, "applySubstScheme", { enumerable: true, get: function () { return substitution_1.applySubstScheme; } });
Object.defineProperty(exports, "composeSubsts", { enumerable: true, get: function () { return substitution_1.composeSubsts; } });
Object.defineProperty(exports, "freshTypeVar", { enumerable: true, get: function () { return substitution_1.freshTypeVar; } });
Object.defineProperty(exports, "resetFreshSupply", { enumerable: true, get: function () { return substitution_1.resetFreshSupply; } });
Object.defineProperty(exports, "occursIn", { enumerable: true, get: function () { return substitution_1.occursIn; } });
Object.defineProperty(exports, "unify", { enumerable: true, get: function () { return substitution_1.unify; } });
Object.defineProperty(exports, "isUnifyError", { enumerable: true, get: function () { return substitution_1.isUnifyError; } });
Object.defineProperty(exports, "generalize", { enumerable: true, get: function () { return substitution_1.generalize; } });
Object.defineProperty(exports, "instantiate", { enumerable: true, get: function () { return substitution_1.instantiate; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "algorithmW", { enumerable: true, get: function () { return infer_1.algorithmW; } });
Object.defineProperty(exports, "infer", { enumerable: true, get: function () { return infer_1.infer; } });
Object.defineProperty(exports, "inferScheme", { enumerable: true, get: function () { return infer_1.inferScheme; } });
Object.defineProperty(exports, "isInferError", { enumerable: true, get: function () { return infer_1.isInferError; } });
Object.defineProperty(exports, "initialEnv", { enumerable: true, get: function () { return infer_1.initialEnv; } });
Object.defineProperty(exports, "normalizeScheme", { enumerable: true, get: function () { return infer_1.normalizeScheme; } });
//# sourceMappingURL=index.js.map