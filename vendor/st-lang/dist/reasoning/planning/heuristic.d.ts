import type { Fact, Heuristic, STRIPSAction, STRIPSProblem } from './types';
/**
 * Distancia básica: `|goal \ state|` (número de hechos del goal aún
 * no presentes en state). Es admisible pero muy débil.
 */
export declare const goalCountHeuristic: Heuristic;
/**
 * Heurística Fast-Forward (versión por niveles, ignora delete-list).
 *
 * Construcción:
 *   F₀ = state
 *   F_{i+1} = F_i ∪ {add-effects de toda acción ground con pre ⊆ F_i}
 *   Termina cuando goal ⊆ F_k → devuelve k.
 *   Si F se estabiliza sin alcanzar el goal → devuelve Infinity
 *   (estado dead-end del problema relajado, por lo tanto del original).
 *
 * Sin delete-list, F crece monotónicamente, así que la iteración
 * termina en ≤ |universo de hechos accesibles| pasos.
 *
 * `actions` debe ser una lista de schemas (lifted). Internamente
 * grounded en cada nivel con los objetos del dominio.
 */
export declare function fastForwardHeuristic(state: Set<Fact>, goal: Set<Fact>, actions: STRIPSAction[], objects?: Record<string, string[]>): number;
/**
 * Helper para crear una heurística FF cerrada sobre el problema.
 * Devuelve una función `Heuristic` que `aStarPlan` puede consumir.
 */
export declare function makeFFHeuristic(problem: STRIPSProblem): Heuristic;
//# sourceMappingURL=heuristic.d.ts.map