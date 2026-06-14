"use strict";
// ============================================================
// ST Optimization — barrel público.
// ============================================================
// API:
//   solveLP(problem, opts?)   → LPSolution     simplex de dos fases
//   solveILP(problem, opts?)  → ILPSolution    branch-and-bound
//   lpRelaxation(ilp)         → LPProblem      relajación continua
//   standardForm(lp)          → LPProblem      forma estándar
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardForm = exports.lpRelaxation = exports.solveILP = exports.solveLP = void 0;
var simplex_1 = require("./simplex");
Object.defineProperty(exports, "solveLP", { enumerable: true, get: function () { return simplex_1.solveLP; } });
var branch_and_bound_1 = require("./branch-and-bound");
Object.defineProperty(exports, "solveILP", { enumerable: true, get: function () { return branch_and_bound_1.solveILP; } });
Object.defineProperty(exports, "lpRelaxation", { enumerable: true, get: function () { return branch_and_bound_1.lpRelaxation; } });
var standard_form_1 = require("./standard-form");
Object.defineProperty(exports, "standardForm", { enumerable: true, get: function () { return standard_form_1.standardForm; } });
//# sourceMappingURL=index.js.map