import { Formula } from '../../../types';
import { Sequent, ProveResult } from './types';
/**
 * Demuestra `seq` (Γ ⊢ Δ) por backward search en G3.
 * Normaliza las formulas antes de comenzar.
 */
export declare function proveSequent(seq: Sequent, options?: {
    budget?: number;
}): ProveResult;
/**
 * Atajo: demuestra que `⊢ φ` (formula sin hipotesis) es valida en G3.
 */
export declare function proveFormula(formula: Formula, options?: {
    budget?: number;
}): ProveResult;
//# sourceMappingURL=prover.d.ts.map