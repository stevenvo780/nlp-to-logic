import type { AbductionOptions, AbductionProblem, Explanation } from './types';
/**
 * Encuentra todas las explicaciones de un problema abductivo.
 *
 * - Enumera subsets de abducibles en orden creciente de tamaño.
 * - Filtra los inconsistentes y los que no implican la observación.
 * - Calcula minimalidad por inclusión (parsimony) post-hoc.
 * - Aplica el filtro `preferred` para el output final.
 */
export declare function findExplanations(problem: AbductionProblem, opts?: AbductionOptions): Explanation[];
/**
 * Devuelve UNA explicación: la "mejor" según `preferred`. Si hay
 * empate, la primera en orden lex (consistente y reproducible).
 *
 * Devuelve `null` si no hay explicación posible.
 */
export declare function bestExplanation(problem: AbductionProblem, opts?: AbductionOptions): Explanation | null;
//# sourceMappingURL=find.d.ts.map