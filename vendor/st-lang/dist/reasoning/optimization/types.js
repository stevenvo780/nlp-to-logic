"use strict";
// ============================================================
// Linear / Integer Programming — tipos de borde.
// ============================================================
// Un LPProblem describe el problema en forma "natural": objetivo
// (minimizar o maximizar) + lista de restricciones lineales con
// operador ≤, ≥ o = y RHS escalar. Las cotas por variable son
// opcionales (default: x ≥ 0, sin cota superior).
//
// Las soluciones reportan estado simbólico ('optimal' | 'unbounded'
// | 'infeasible' | 'iteration_limit') más el vector de variables en
// el orden original del problema y el valor objetivo evaluado.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map