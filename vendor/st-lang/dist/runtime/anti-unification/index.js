"use strict";
// ============================================================
// ST Anti-Unification — Barrel de exportaciones
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalizationOrder = exports.antiUnifyManyDetailed = exports.antiUnifyMany = exports.c = exports.f = exports.v = exports.termSize = exports.applySubst = exports.varsOf = exports.termKey = exports.termEquals = exports.defaultFreshSupply = exports.antiUnify = void 0;
var anti_unify_1 = require("./anti-unify");
Object.defineProperty(exports, "antiUnify", { enumerable: true, get: function () { return anti_unify_1.antiUnify; } });
Object.defineProperty(exports, "defaultFreshSupply", { enumerable: true, get: function () { return anti_unify_1.defaultFreshSupply; } });
var term_utils_1 = require("./term-utils");
Object.defineProperty(exports, "termEquals", { enumerable: true, get: function () { return term_utils_1.termEquals; } });
Object.defineProperty(exports, "termKey", { enumerable: true, get: function () { return term_utils_1.termKey; } });
Object.defineProperty(exports, "varsOf", { enumerable: true, get: function () { return term_utils_1.varsOf; } });
Object.defineProperty(exports, "applySubst", { enumerable: true, get: function () { return term_utils_1.applySubst; } });
Object.defineProperty(exports, "termSize", { enumerable: true, get: function () { return term_utils_1.termSize; } });
Object.defineProperty(exports, "v", { enumerable: true, get: function () { return term_utils_1.v; } });
Object.defineProperty(exports, "f", { enumerable: true, get: function () { return term_utils_1.f; } });
Object.defineProperty(exports, "c", { enumerable: true, get: function () { return term_utils_1.c; } });
var many_1 = require("./many");
Object.defineProperty(exports, "antiUnifyMany", { enumerable: true, get: function () { return many_1.antiUnifyMany; } });
Object.defineProperty(exports, "antiUnifyManyDetailed", { enumerable: true, get: function () { return many_1.antiUnifyManyDetailed; } });
Object.defineProperty(exports, "generalizationOrder", { enumerable: true, get: function () { return many_1.generalizationOrder; } });
//# sourceMappingURL=index.js.map