"use strict";
/**
 * @module cdcl-v2
 * Entry point público del solver CDCL v2.
 *
 * Uso: `solveCDCLv2(clauses, numVars, opts?)` donde `clauses` es un arreglo
 * de `Int32Array` en formato DIMACS (variables 1..numVars). Devuelve
 * {@link SatResult} o {@link UnsatResult}.
 */
// CDCL v2 — Entry point público.
//
// API principal:
//   solveCDCLv2(clauses, numVars, opts?) → SatResult | UnsatResult
//
// `clauses` es un arreglo de Int32Array en formato DIMACS (variables 1..numVars,
// literal positivo = true, negativo = false; cláusula vacía ⇒ UNSAT).
//
// El solver implementa el pipeline state-of-the-art clásico:
//   - 2-watched literals para BCP O(amortizado).
//   - VSIDS con EVSIDS rescaling para heurística de decisión.
//   - 1UIP conflict analysis con minimización implícita por bumped tracking.
//   - Luby restarts (1, 1, 2, 1, 1, 2, 4, ...).
//   - Phase saving (Pipatsrisawat & Darwiche 2007).
//   - LBD scoring + reducción periódica de la learnt clause database.
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectClausesToRemove = exports.computeLBD = exports.analyzeConflict1UIP = exports.PhaseSaver = exports.lubySequence = exports.luby = exports.LubyRestartPolicy = exports.VSIDS = exports.idxToLit = exports.litToIdx = exports.NO_CONFLICT = exports.NO_ANTECEDENT = exports.solveCDCLv2 = void 0;
var solver_1 = require("./solver");
Object.defineProperty(exports, "solveCDCLv2", { enumerable: true, get: function () { return solver_1.solveCDCLv2; } });
var state_1 = require("./state");
Object.defineProperty(exports, "NO_ANTECEDENT", { enumerable: true, get: function () { return state_1.NO_ANTECEDENT; } });
Object.defineProperty(exports, "NO_CONFLICT", { enumerable: true, get: function () { return state_1.NO_CONFLICT; } });
Object.defineProperty(exports, "litToIdx", { enumerable: true, get: function () { return state_1.litToIdx; } });
Object.defineProperty(exports, "idxToLit", { enumerable: true, get: function () { return state_1.idxToLit; } });
var vsids_1 = require("./vsids");
Object.defineProperty(exports, "VSIDS", { enumerable: true, get: function () { return vsids_1.VSIDS; } });
var luby_1 = require("./luby");
Object.defineProperty(exports, "LubyRestartPolicy", { enumerable: true, get: function () { return luby_1.LubyRestartPolicy; } });
Object.defineProperty(exports, "luby", { enumerable: true, get: function () { return luby_1.luby; } });
Object.defineProperty(exports, "lubySequence", { enumerable: true, get: function () { return luby_1.lubySequence; } });
var phase_saving_1 = require("./phase-saving");
Object.defineProperty(exports, "PhaseSaver", { enumerable: true, get: function () { return phase_saving_1.PhaseSaver; } });
var clause_learning_1 = require("./clause-learning");
Object.defineProperty(exports, "analyzeConflict1UIP", { enumerable: true, get: function () { return clause_learning_1.analyzeConflict1UIP; } });
var lbd_1 = require("./lbd");
Object.defineProperty(exports, "computeLBD", { enumerable: true, get: function () { return lbd_1.computeLBD; } });
Object.defineProperty(exports, "selectClausesToRemove", { enumerable: true, get: function () { return lbd_1.selectClausesToRemove; } });
//# sourceMappingURL=index.js.map