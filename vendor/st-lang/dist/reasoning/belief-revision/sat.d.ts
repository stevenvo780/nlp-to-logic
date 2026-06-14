import type { PropFormula } from './types';
export type Valuation = Record<string, boolean>;
/** Evalúa una fórmula bajo una valuación clásica. */
export declare function evalFormula(f: PropFormula, v: Valuation): boolean;
/**
 * ¿Es satisfactible la conjunción de `formulas`?
 * Conjunto vacío → trivialmente satisfactible.
 */
export declare function isSatisfiable(formulas: PropFormula[]): boolean;
/**
 * ¿K (conjunción de fórmulas) implica φ?
 * Equivalente a: K ∧ ¬φ es insatisfactible.
 */
export declare function entailsFormula(K: PropFormula[], phi: PropFormula): boolean;
/**
 * ¿Son φ y ψ lógicamente equivalentes? (φ ↔ ψ es tautología)
 */
export declare function areEquivalent(a: PropFormula, b: PropFormula): boolean;
//# sourceMappingURL=sat.d.ts.map