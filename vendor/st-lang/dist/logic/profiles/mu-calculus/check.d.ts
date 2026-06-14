import type { KripkeStructure, MuFormula } from './types';
/**
 * Model checking de modal μ-calculus.
 * Devuelve el conjunto de estados que satisfacen φ.
 *
 * Lanza si φ tiene variables libres no ligadas o si la fórmula no
 * está bien formada en tiempo de ejecución (se recomienda chequear
 * `isWellFormed(φ)` antes de invocar).
 */
export declare function modelCheck(K: KripkeStructure, phi: MuFormula): Set<string>;
/**
 * `K, s ⊨ φ` para un estado puntual. Conveniencia sobre `modelCheck`.
 */
export declare function satisfiesAt(K: KripkeStructure, phi: MuFormula, state: string): boolean;
//# sourceMappingURL=check.d.ts.map