"use strict";
// ============================================================
// ST TypeChecker — Barrel export
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClosest = exports.levenshtein = exports.typeCheck = exports.TypeChecker = void 0;
var checker_1 = require("./checker");
Object.defineProperty(exports, "TypeChecker", { enumerable: true, get: function () { return checker_1.TypeChecker; } });
Object.defineProperty(exports, "typeCheck", { enumerable: true, get: function () { return checker_1.typeCheck; } });
var levenshtein_1 = require("./levenshtein");
Object.defineProperty(exports, "levenshtein", { enumerable: true, get: function () { return levenshtein_1.levenshtein; } });
Object.defineProperty(exports, "findClosest", { enumerable: true, get: function () { return levenshtein_1.findClosest; } });
//# sourceMappingURL=index.js.map