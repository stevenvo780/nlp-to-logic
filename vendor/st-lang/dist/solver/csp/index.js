"use strict";
// ============================================================
// ST CSP — barrel público.
// ============================================================
// API:
//   ac3(csp)                      → { consistent, reducedDomains }
//   backtrack(csp, opts?)         → CSPResult  (primera solución)
//   allSolutions(csp, max?, opts?) → Map[]     (enumeración)
//   graphColoring(graph, k)       → Map<nodo, color> | null
//   nQueens(n)                    → number[] | null
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.nQueens = exports.graphColoring = exports.allSolutions = exports.backtrack = exports.ac3InPlace = exports.ac3 = void 0;
var ac3_1 = require("./ac3");
Object.defineProperty(exports, "ac3", { enumerable: true, get: function () { return ac3_1.ac3; } });
Object.defineProperty(exports, "ac3InPlace", { enumerable: true, get: function () { return ac3_1.ac3InPlace; } });
var backtrack_1 = require("./backtrack");
Object.defineProperty(exports, "backtrack", { enumerable: true, get: function () { return backtrack_1.backtrack; } });
Object.defineProperty(exports, "allSolutions", { enumerable: true, get: function () { return backtrack_1.allSolutions; } });
var builtins_1 = require("./builtins");
Object.defineProperty(exports, "graphColoring", { enumerable: true, get: function () { return builtins_1.graphColoring; } });
Object.defineProperty(exports, "nQueens", { enumerable: true, get: function () { return builtins_1.nQueens; } });
//# sourceMappingURL=index.js.map