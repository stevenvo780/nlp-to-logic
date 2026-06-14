import type { FOLClause, FOLTerm } from '../fol-prover/types';
import { cloneLiteral } from './term-utils';
export interface DemodulationRule {
    from: FOLTerm;
    to: FOLTerm;
}
/**
 * Apply a list of oriented rewrite rules `from → to` to every position of every literal
 * in `clause`, repeatedly, until no more rewrites apply (fixed point) or we exceed a
 * safety bound. Each rule is treated as "matching by unification of the variables in
 * `from` against the subterm" — i.e. one-way matching, not two-way unification.
 *
 * The orientation guarantees termination because every successful rewrite replaces a
 * larger term (by `compareTerms`) with a smaller one; we additionally cap the total
 * number of rewrites per call.
 */
export declare function demodulate(clause: FOLClause, rewrites: DemodulationRule[]): FOLClause;
/**
 * Equality factoring: given a clause containing two positive equality literals
 *   x = y    and    x = z
 * with shared lhs, produce the factor   x = y ∨ y ≠ z   (which is logically valid
 * given the original and helps the saturation process). Returns every distinct factor.
 *
 * More generally, for two positive equalities (a=b) and (c=d) where a unifies with c
 * via σ, emits (a=b ∨ b≠d)·σ.
 */
export declare function equalityFactor(clause: FOLClause): FOLClause[];
export { cloneLiteral };
//# sourceMappingURL=demodulate.d.ts.map