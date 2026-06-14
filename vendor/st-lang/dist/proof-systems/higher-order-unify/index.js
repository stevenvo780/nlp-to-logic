"use strict";
// ============================================================
// Higher-order unification (Miller 1991) — Punto de entrada público
// ============================================================
//
// API:
//   - HOTerm, HOSubst (tipos)
//   - isPattern / isHigherOrderPattern (detección de patrón)
//   - unifyPattern  (unificación MGU decidible)
//   - applyHOSubst  (aplicar sustitución con β-reducción)
//   - normalize     (β-normalización leftmost-outermost)
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFreshCounter = exports.freshName = exports.freeVarsHO = exports.normalize = exports.applyHOSubst = exports.buildLambdaBinding = exports.unifyMetaApp = exports.unifyPattern = exports.isHigherOrderPattern = exports.isPattern = void 0;
var pattern_1 = require("./pattern");
Object.defineProperty(exports, "isPattern", { enumerable: true, get: function () { return pattern_1.isPattern; } });
Object.defineProperty(exports, "isHigherOrderPattern", { enumerable: true, get: function () { return pattern_1.isHigherOrderPattern; } });
var unify_1 = require("./unify");
Object.defineProperty(exports, "unifyPattern", { enumerable: true, get: function () { return unify_1.unifyPattern; } });
Object.defineProperty(exports, "unifyMetaApp", { enumerable: true, get: function () { return unify_1.unifyMetaApp; } });
Object.defineProperty(exports, "buildLambdaBinding", { enumerable: true, get: function () { return unify_1.buildLambdaBinding; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "applyHOSubst", { enumerable: true, get: function () { return normalize_1.applyHOSubst; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return normalize_1.normalize; } });
Object.defineProperty(exports, "freeVarsHO", { enumerable: true, get: function () { return normalize_1.freeVarsHO; } });
Object.defineProperty(exports, "freshName", { enumerable: true, get: function () { return normalize_1.freshName; } });
Object.defineProperty(exports, "resetFreshCounter", { enumerable: true, get: function () { return normalize_1.resetFreshCounter; } });
//# sourceMappingURL=index.js.map