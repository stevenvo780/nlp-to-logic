import type { FOLClause, FOLTerm } from '../fol-prover/types';
import { cloneClause, isEqualityLiteral, termKey, termsEqual } from './term-utils';
export interface ParamodResult {
    resolvent: FOLClause;
    substitution: Map<string, FOLTerm>;
}
/**
 * Paramodulation:
 *
 *   from C ∨ (s = t)         (eqClause, eq_idx points to the s=t literal)
 *   and  D[u]                (target clause, target_idx points to literal containing u,
 *                            target_pos points inside that literal's args)
 *   if unify(s, u) = σ then  (C ∨ D[u → t])·σ
 *
 * The direction is fixed: args[0] = s (lhs), args[1] = t (rhs). To paramodulate
 * "in the other direction" callers should retry with the equation flipped (see
 * `paramodulateAll` for the symmetric enumeration).
 *
 * Returns null when the literals can't paramodulate (wrong kind, unification fails, etc.).
 */
export declare function paramodulate(c1Raw: FOLClause, eq_idx: number, c2Raw: FOLClause, target_idx: number, target_pos: number[]): FOLClause | null;
export declare function paramodulateWithSubst(c1Raw: FOLClause, eq_idx: number, c2Raw: FOLClause, target_idx: number, target_pos: number[]): ParamodResult | null;
/**
 * Generate all paramodulation children between two clauses considering both directions
 * of every equality literal in either clause and every interior position of every
 * non-equality target literal in the other.
 */
export interface ParamodAllStep {
    fromEqClause: number;
    fromTargetClause: number;
    eqIdx: number;
    targetIdx: number;
    targetPos: number[];
    flipped: boolean;
    resolvent: FOLClause;
    substitution: Map<string, FOLTerm>;
}
export declare function paramodulateAll(idxA: number, cA: FOLClause, idxB: number, cB: FOLClause): ParamodAllStep[];
/**
 * Reflexivity resolution: drop a literal of the form ¬(t = t) from a clause.
 * Useful both during search and for proving reflexive goals.
 */
export declare function reflexivityResolve(c: FOLClause): FOLClause | null;
/** Re-export utilities used by tests. */
export { isEqualityLiteral, termKey, termsEqual, cloneClause };
//# sourceMappingURL=paramodulate.d.ts.map