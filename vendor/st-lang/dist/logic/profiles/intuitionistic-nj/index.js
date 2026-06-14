"use strict";
// ============================================================
// Intuitionistic Natural Deduction (NJ) — Entrada pública
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPCValid = exports.kripkeCounterModel = exports.verifyProof = exports.proveIntuitionistically = exports.implies = exports.or = exports.and = exports.not = exports.bottom = exports.atom = exports.collectAtoms = exports.formulaToString = exports.formulaEquals = exports.formulaKey = void 0;
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
Object.defineProperty(exports, "proveIntuitionistically", { enumerable: true, get: function () { return prover_1.proveIntuitionistically; } });
Object.defineProperty(exports, "verifyProof", { enumerable: true, get: function () { return prover_1.verifyProof; } });
var kripke_1 = require("./kripke");
Object.defineProperty(exports, "kripkeCounterModel", { enumerable: true, get: function () { return kripke_1.kripkeCounterModel; } });
Object.defineProperty(exports, "isIPCValid", { enumerable: true, get: function () { return kripke_1.isIPCValid; } });
//# sourceMappingURL=index.js.map