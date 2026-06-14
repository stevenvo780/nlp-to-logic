"use strict";
// ============================================================
// Natural Deduction NK (classical) — Entrada pública
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.nkToNJ = exports.provedLEM = exports.provedDNE = exports.provedPeirce = exports.verifyProof = exports.proveIntuitOnly = exports.proveClassically = exports.implies = exports.or = exports.and = exports.not = exports.bottom = exports.atom = exports.collectAtoms = exports.formulaToString = exports.formulaEquals = exports.formulaKey = exports.CLASSICAL_ONLY_RULES = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "CLASSICAL_ONLY_RULES", { enumerable: true, get: function () { return types_1.CLASSICAL_ONLY_RULES; } });
var formula_1 = require("./formula");
Object.defineProperty(exports, "formulaKey", { enumerable: true, get: function () { return formula_1.formulaKey; } });
Object.defineProperty(exports, "formulaEquals", { enumerable: true, get: function () { return formula_1.formulaEquals; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return formula_1.formulaToString; } });
Object.defineProperty(exports, "collectAtoms", { enumerable: true, get: function () { return formula_1.collectAtoms; } });
Object.defineProperty(exports, "atom", { enumerable: true, get: function () { return formula_1.atom; } });
Object.defineProperty(exports, "bottom", { enumerable: true, get: function () { return formula_1.bottom; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return formula_1.not; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return formula_1.and; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return formula_1.or; } });
Object.defineProperty(exports, "implies", { enumerable: true, get: function () { return formula_1.implies; } });
var prover_1 = require("./prover");
Object.defineProperty(exports, "proveClassically", { enumerable: true, get: function () { return prover_1.proveClassically; } });
Object.defineProperty(exports, "proveIntuitOnly", { enumerable: true, get: function () { return prover_1.proveIntuitOnly; } });
Object.defineProperty(exports, "verifyProof", { enumerable: true, get: function () { return prover_1.verifyProof; } });
Object.defineProperty(exports, "provedPeirce", { enumerable: true, get: function () { return prover_1.provedPeirce; } });
Object.defineProperty(exports, "provedDNE", { enumerable: true, get: function () { return prover_1.provedDNE; } });
Object.defineProperty(exports, "provedLEM", { enumerable: true, get: function () { return prover_1.provedLEM; } });
Object.defineProperty(exports, "nkToNJ", { enumerable: true, get: function () { return prover_1.nkToNJ; } });
//# sourceMappingURL=index.js.map