"use strict";
// ============================================================
// ST Term Rewriting — Barrel de exportaciones
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTRS = exports.orient = exports.knuthBendixCompletion = exports.freeVarsOf = exports.isConfluent = exports.allCriticalPairs = exports.criticalPairsBetween = exports.lpoCompare = exports.lpo = exports.replaceAt = exports.subtermAt = exports.allPositions = exports.normalize = exports.rewriteStep = exports.c = exports.f = exports.v = exports.termSize = exports.renameVars = exports.unify = exports.match = exports.occursIn = exports.applySubst = exports.varsOf = exports.cloneTerm = exports.termEquals = void 0;
var term_utils_1 = require("./term-utils");
Object.defineProperty(exports, "termEquals", { enumerable: true, get: function () { return term_utils_1.termEquals; } });
Object.defineProperty(exports, "cloneTerm", { enumerable: true, get: function () { return term_utils_1.cloneTerm; } });
Object.defineProperty(exports, "varsOf", { enumerable: true, get: function () { return term_utils_1.varsOf; } });
Object.defineProperty(exports, "applySubst", { enumerable: true, get: function () { return term_utils_1.applySubst; } });
Object.defineProperty(exports, "occursIn", { enumerable: true, get: function () { return term_utils_1.occursIn; } });
Object.defineProperty(exports, "match", { enumerable: true, get: function () { return term_utils_1.match; } });
Object.defineProperty(exports, "unify", { enumerable: true, get: function () { return term_utils_1.unify; } });
Object.defineProperty(exports, "renameVars", { enumerable: true, get: function () { return term_utils_1.renameVars; } });
Object.defineProperty(exports, "termSize", { enumerable: true, get: function () { return term_utils_1.termSize; } });
Object.defineProperty(exports, "v", { enumerable: true, get: function () { return term_utils_1.v; } });
Object.defineProperty(exports, "f", { enumerable: true, get: function () { return term_utils_1.f; } });
Object.defineProperty(exports, "c", { enumerable: true, get: function () { return term_utils_1.c; } });
var rewrite_1 = require("./rewrite");
Object.defineProperty(exports, "rewriteStep", { enumerable: true, get: function () { return rewrite_1.rewriteStep; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return rewrite_1.normalize; } });
Object.defineProperty(exports, "allPositions", { enumerable: true, get: function () { return rewrite_1.allPositions; } });
Object.defineProperty(exports, "subtermAt", { enumerable: true, get: function () { return rewrite_1.subtermAt; } });
Object.defineProperty(exports, "replaceAt", { enumerable: true, get: function () { return rewrite_1.replaceAt; } });
var lpo_1 = require("./lpo");
Object.defineProperty(exports, "lpo", { enumerable: true, get: function () { return lpo_1.lpo; } });
Object.defineProperty(exports, "lpoCompare", { enumerable: true, get: function () { return lpo_1.lpoCompare; } });
var critical_pairs_1 = require("./critical-pairs");
Object.defineProperty(exports, "criticalPairsBetween", { enumerable: true, get: function () { return critical_pairs_1.criticalPairsBetween; } });
Object.defineProperty(exports, "allCriticalPairs", { enumerable: true, get: function () { return critical_pairs_1.allCriticalPairs; } });
Object.defineProperty(exports, "isConfluent", { enumerable: true, get: function () { return critical_pairs_1.isConfluent; } });
Object.defineProperty(exports, "freeVarsOf", { enumerable: true, get: function () { return critical_pairs_1.freeVarsOf; } });
var knuth_bendix_1 = require("./knuth-bendix");
Object.defineProperty(exports, "knuthBendixCompletion", { enumerable: true, get: function () { return knuth_bendix_1.knuthBendixCompletion; } });
Object.defineProperty(exports, "orient", { enumerable: true, get: function () { return knuth_bendix_1.orient; } });
Object.defineProperty(exports, "makeTRS", { enumerable: true, get: function () { return knuth_bendix_1.makeTRS; } });
//# sourceMappingURL=index.js.map