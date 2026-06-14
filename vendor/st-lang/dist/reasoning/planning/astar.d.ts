import type { AStarOptions, Plan, STRIPSProblem } from './types';
/**
 * A* planner. Devuelve plan de menor costo bajo `heuristic` admisible,
 * o `null` si no hay solución dentro de los límites.
 *
 * Default: `goalCountHeuristic` (|goal\state|). Para mejor rendimiento
 * en problemas no triviales, pasar `makeFFHeuristic(problem)`.
 */
export declare function aStarPlan(problem: STRIPSProblem, options?: AStarOptions): Plan | null;
//# sourceMappingURL=astar.d.ts.map