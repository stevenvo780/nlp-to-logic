import type { Fact, Plan, PlannerOptions, STRIPSProblem } from './types';
/**
 * Hash canónico de un estado: orden lex de los hechos y join. Es
 * O(n log n) pero los estados de planning suelen ser chicos.
 */
export declare function hashState(state: Set<Fact>): string;
/**
 * BFS planner. Devuelve plan de menor longitud, o `null` si no hay
 * solución dentro de los límites.
 *
 * Complejidad: O(b^d) donde b = factor de rama (acciones ground
 * aplicables) y d = profundidad. Para problemas reales sin podas se
 * vuelve inviable rápido — usar `aStarPlan` con FF heuristic para
 * dominios no triviales.
 */
export declare function bfsPlan(problem: STRIPSProblem, options?: PlannerOptions): Plan | null;
//# sourceMappingURL=bfs.d.ts.map