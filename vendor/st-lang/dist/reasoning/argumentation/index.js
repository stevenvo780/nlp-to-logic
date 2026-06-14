"use strict";
// ============================================================
// ST Argumentation — Barrel export (Dung framework)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotExport = exports.computeExtensions = exports.lazyAdmissibleSets = exports.isStable = exports.isComplete = exports.semiStableExtensions = exports.completeExtensions = exports.stableExtensions = exports.preferredExtensions = exports.groundedExtension = exports.isSubset = exports.setsEqual = exports.characteristicFunction = exports.isAdmissible = exports.defends = exports.isConflictFree = exports.hasAttack = exports.attackedBySet = exports.attackedBy = exports.attackersOf = exports.createFramework = exports.DEFAULT_EXHAUSTIVE_LIMIT = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "DEFAULT_EXHAUSTIVE_LIMIT", { enumerable: true, get: function () { return types_1.DEFAULT_EXHAUSTIVE_LIMIT; } });
var framework_1 = require("./framework");
Object.defineProperty(exports, "createFramework", { enumerable: true, get: function () { return framework_1.createFramework; } });
Object.defineProperty(exports, "attackersOf", { enumerable: true, get: function () { return framework_1.attackersOf; } });
Object.defineProperty(exports, "attackedBy", { enumerable: true, get: function () { return framework_1.attackedBy; } });
Object.defineProperty(exports, "attackedBySet", { enumerable: true, get: function () { return framework_1.attackedBySet; } });
Object.defineProperty(exports, "hasAttack", { enumerable: true, get: function () { return framework_1.hasAttack; } });
Object.defineProperty(exports, "isConflictFree", { enumerable: true, get: function () { return framework_1.isConflictFree; } });
Object.defineProperty(exports, "defends", { enumerable: true, get: function () { return framework_1.defends; } });
Object.defineProperty(exports, "isAdmissible", { enumerable: true, get: function () { return framework_1.isAdmissible; } });
Object.defineProperty(exports, "characteristicFunction", { enumerable: true, get: function () { return framework_1.characteristicFunction; } });
Object.defineProperty(exports, "setsEqual", { enumerable: true, get: function () { return framework_1.setsEqual; } });
Object.defineProperty(exports, "isSubset", { enumerable: true, get: function () { return framework_1.isSubset; } });
var extensions_1 = require("./extensions");
Object.defineProperty(exports, "groundedExtension", { enumerable: true, get: function () { return extensions_1.groundedExtension; } });
Object.defineProperty(exports, "preferredExtensions", { enumerable: true, get: function () { return extensions_1.preferredExtensions; } });
Object.defineProperty(exports, "stableExtensions", { enumerable: true, get: function () { return extensions_1.stableExtensions; } });
Object.defineProperty(exports, "completeExtensions", { enumerable: true, get: function () { return extensions_1.completeExtensions; } });
Object.defineProperty(exports, "semiStableExtensions", { enumerable: true, get: function () { return extensions_1.semiStableExtensions; } });
Object.defineProperty(exports, "isComplete", { enumerable: true, get: function () { return extensions_1.isComplete; } });
Object.defineProperty(exports, "isStable", { enumerable: true, get: function () { return extensions_1.isStable; } });
Object.defineProperty(exports, "lazyAdmissibleSets", { enumerable: true, get: function () { return extensions_1.lazyAdmissibleSets; } });
Object.defineProperty(exports, "computeExtensions", { enumerable: true, get: function () { return extensions_1.computeExtensions; } });
var dot_1 = require("./dot");
Object.defineProperty(exports, "dotExport", { enumerable: true, get: function () { return dot_1.dotExport; } });
//# sourceMappingURL=index.js.map