import { Formula } from '../../../types';
export interface DPLLResult {
    satisfiable: boolean;
    model?: Record<string, boolean>;
}
/**
 * DPLL SAT Solver — now delegates to CDCL for ~100x performance improvement.
 * Maintains the same DPLLResult interface for backward compatibility.
 */
export declare function dpll(formula: Formula, timeoutMs?: number): DPLLResult;
/**
 * DPLL asíncrono — delega a cdclAsync con soporte de paralelismo.
 * Usa portfolio racing (Web Workers / worker_threads) para fórmulas grandes.
 */
export declare function dpllAsync(formula: Formula, timeoutMs?: number): Promise<DPLLResult>;
/**
 * Legacy DPLL solver — kept as fallback. Use dpll() instead.
 */
export declare function dpllLegacy(formula: Formula, timeoutMs?: number): DPLLResult;
//# sourceMappingURL=dpll.d.ts.map