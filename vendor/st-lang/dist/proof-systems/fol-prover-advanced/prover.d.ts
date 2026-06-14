import type { AdvancedProveOptions, AdvancedProveResult, FOLClause, FOLLiteral, RefinementStrategy } from './types';
/**
 * Negación lógica de una literal (toggle del flag `negated`).
 * Útil para construir el goal negado en una refutación.
 */
export declare function negateLiteral(l: FOLLiteral): FOLLiteral;
export declare function negateClause(c: FOLClause): FOLClause[];
/**
 * Prover avanzado: refuta `premises ∧ ¬goal` aplicando el refinamiento
 * elegido. Devuelve un `AdvancedProveResult` con las trazas.
 *
 * Asumimos que `premises` y `goal` ya están en CNF (cláusulas explícitas
 * con literales). El caller que quiera convertir fórmulas ricas a CNF debe
 * hacerlo antes.
 */
export declare function proveAdvanced(premises: FOLClause[], goal: FOLClause, opts: AdvancedProveOptions): AdvancedProveResult;
/**
 * Helper que mapea `RefinementStrategy` a un short-name legible (sirve para
 * logs y tests).
 */
export declare function strategyLabel(s: RefinementStrategy): string;
//# sourceMappingURL=prover.d.ts.map