import { Formula } from '../../../types';
/**
 * Reglas del calculo G3 (proposicional clasico).
 *
 * - `axiom`        : Γ, A ⊢ A, Δ   (A atomico)
 * - `andL` / `andR`: descomposicion de ∧ a izquierda / derecha
 * - `orL`  / `orR` : descomposicion de ∨
 * - `impL` / `impR`: descomposicion de →
 * - `notL` / `notR`: descomposicion de ¬
 * - `falseL`       : Γ, ⊥ ⊢ Δ es axioma
 * - `trueR`        : Γ ⊢ ⊤, Δ es axioma
 */
export type SequentRule = 'axiom' | 'falseL' | 'trueR' | 'andL' | 'andR' | 'orL' | 'orR' | 'impL' | 'impR' | 'notL' | 'notR';
export interface Sequent {
    left: Formula[];
    right: Formula[];
}
export interface ProofTree {
    goal: Sequent;
    rule?: SequentRule;
    /** Formula principal a la que se aplica la regla. */
    principalFormula?: Formula;
    premises: ProofTree[];
    closed: boolean;
}
export interface ProveResult {
    provable: boolean;
    proof?: ProofTree;
}
//# sourceMappingURL=types.d.ts.map