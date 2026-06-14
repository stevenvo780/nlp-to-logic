"use strict";
// ============================================================
// LK Sequent Calculus — Entrada publica del perfil
// ============================================================
//
// Calculo de secuentes LK de Gentzen (1934) para logica
// proposicional clasica con cut-elimination (Hauptsatz).
//
//   import { proveLK, hasCut, eliminateCut, isValid }
//     from 'src/profiles/sequent-lk';
Object.defineProperty(exports, "__esModule", { value: true });
exports.depth = exports.eq = exports.lkKey = exports.eliminateCut = exports.isValid = exports.hasCut = exports.proveLKFormula = exports.proveLK = void 0;
var prover_1 = require("./prover");
Object.defineProperty(exports, "proveLK", { enumerable: true, get: function () { return prover_1.proveLK; } });
Object.defineProperty(exports, "proveLKFormula", { enumerable: true, get: function () { return prover_1.proveLKFormula; } });
Object.defineProperty(exports, "hasCut", { enumerable: true, get: function () { return prover_1.hasCut; } });
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return prover_1.isValid; } });
var cut_elimination_1 = require("./cut-elimination");
Object.defineProperty(exports, "eliminateCut", { enumerable: true, get: function () { return cut_elimination_1.eliminateCut; } });
var util_1 = require("./util");
Object.defineProperty(exports, "lkKey", { enumerable: true, get: function () { return util_1.lkKey; } });
Object.defineProperty(exports, "eq", { enumerable: true, get: function () { return util_1.eq; } });
Object.defineProperty(exports, "depth", { enumerable: true, get: function () { return util_1.depth; } });
//# sourceMappingURL=index.js.map