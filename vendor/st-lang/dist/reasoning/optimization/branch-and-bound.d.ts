import type { ILPOptions, ILPProblem, ILPSolution, LPProblem } from './types';
/**
 * Genera el LP relajado: descarta integerVars/binaryVars pero
 * mantiene `variableBounds` (los binarios ya tienen [0,1] ahí).
 */
export declare function lpRelaxation(ilp: ILPProblem): LPProblem;
/**
 * Solver ILP principal. Estrategia DFS con pila explícita.
 */
export declare function solveILP(problem: ILPProblem, opts?: ILPOptions): ILPSolution;
//# sourceMappingURL=branch-and-bound.d.ts.map