import { Formula } from '../../../types';
export interface CDCLResult {
    satisfiable: boolean;
    model?: Record<string, boolean>;
    stats?: SolverStats;
}
export interface SolverStats {
    decisions: number;
    propagations: number;
    conflicts: number;
    learnedClauses: number;
    restarts: number;
    preprocessEliminated: number;
    solveTimeMs: number;
}
export interface PatternDetection {
    pattern: string;
    description: string;
    unsatisfiable: boolean;
}
export declare function detectPatterns(clauses: Int32Array[], numVars: number): PatternDetection | null;
export declare function addSymmetryBreaking(clauses: Int32Array[], numVars: number): Int32Array[];
export declare function cdcl(formula: Formula, timeoutMs?: number): CDCLResult;
/**
 * Versión asíncrona del solver CDCL con soporte de paralelismo.
 * Cuando la fórmula es suficientemente grande (≥ PARALLEL_THRESHOLD vars),
 * lanza workers en portfolio racing. Para fórmulas pequeñas, ejecuta
 * el solver secuencial como wrapper de Promise.
 *
 * Compatible con Node.js (worker_threads) y Browser (Web Workers).
 */
export declare function cdclAsync(formula: Formula, timeoutMs?: number): Promise<CDCLResult>;
export type DPLLResult = CDCLResult;
//# sourceMappingURL=cdcl.d.ts.map