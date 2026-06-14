"use strict";
// CDCL incremental — entry point público.
//
// API:
//   const s = new IncrementalCDCL(numVars?);
//   s.addClause([1, -2, 3]);            // cláusulas DIMACS
//   s.push();                            // checkpoint opcional
//   const r = s.solve([assump1, ...]);   // sat/unsat con assumptions opcionales
//   s.pop();                             // rollback al checkpoint
//
// Ver `types.ts` para los tipos de resultado.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementalCDCL = void 0;
var solver_1 = require("./solver");
Object.defineProperty(exports, "IncrementalCDCL", { enumerable: true, get: function () { return solver_1.IncrementalCDCL; } });
//# sourceMappingURL=index.js.map