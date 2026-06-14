import type { DLTerm, OdeSystem, State } from '../../logic/profiles/dl-hybrid';
/** Veredicto sobre un candidato de invariante diferencial. */
export type InvariantVerdict = {
    kind: 'invariant';
    reason: 'exact' | 'lie-nonnegative';
    samples: number;
} | {
    kind: 'not-invariant';
    counterexample: State;
    lieValue: number;
} | {
    kind: 'unknown';
    reason: string;
};
export interface InvariantOptions {
    /** Conjunto de estados a verificar la condición L_f(p) ≥ 0. */
    samples?: State[];
    /** Malla por defecto si `samples` no se pasa. */
    meshValues?: number[];
}
/**
 * Verifica si `p ≥ 0` es invariante diferencial del sistema bajo el
 * dominio implícito (sin restringir). Chequea L_f(p) ≥ 0 en una malla.
 */
export declare function checkDifferentialInvariant(p: DLTerm, system: OdeSystem, opts?: InvariantOptions): InvariantVerdict;
/**
 * Sugiere candidatos típicos de invariante diferencial para un sistema
 * ODE y devuelve los que satisfacen la condición suficiente. Si no
 * encuentra nada, devuelve lista vacía.
 */
export interface CandidateResult {
    candidate: DLTerm;
    description: string;
    verdict: InvariantVerdict;
}
export declare function suggestInvariants(system: OdeSystem, opts?: InvariantOptions): CandidateResult[];
/** Formatea un veredicto para inspección humana. */
export declare function describeVerdict(c: CandidateResult): string;
//# sourceMappingURL=invariant-search.d.ts.map