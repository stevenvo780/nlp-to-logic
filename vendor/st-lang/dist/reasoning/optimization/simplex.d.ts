import type { LPOptions, LPProblem, LPSolution } from './types';
/**
 * Solver LP principal. Acepta el problema en cualquier forma
 * (min/max, ≤/≥/=, con o sin cotas), lo lleva a standardForm y
 * ejecuta simplex de dos fases.
 */
export declare function solveLP(problem: LPProblem, opts?: LPOptions): LPSolution;
//# sourceMappingURL=simplex.d.ts.map