import type { Tactic } from './types';
/** Resets the internal goal ID counter to 0. Intended for deterministic tests only. */
export declare function _resetGoalCounter(): void;
/**
 * `intro(name?)` — For a goal of the form `P → Q`, moves the antecedent `P`
 * into the hypothesis context under `name` (auto-generated when omitted) and
 * leaves `Q` as the new goal. Also handles `¬P` (≡ `P → False`).
 * @throws {@link TacticError} When the goal is not an implication or negation.
 */
export declare function intro(name?: string): Tactic;
/**
 * `exact(term)` — Closes the current goal when `term` is either the name of
 * a hypothesis whose type matches the conclusion, or a string syntactically
 * equal to the conclusion.
 * @throws {@link TacticError} When `term` does not match the goal.
 */
export declare function exact(term: string): Tactic;
/**
 * Closes the goal by finding a hypothesis whose type is syntactically equal
 * to the conclusion. Equivalent to `exact` over the full hypothesis map.
 * @throws {@link TacticError} When no hypothesis matches the conclusion.
 */
export declare function assumption(): Tactic;
/**
 * `apply(thm, args?)` — Backward chaining on hypothesis `thm`.
 * If `thm : A → B` and the goal is `B`, leaves sub-goal `A`.
 * Multi-premise: `thm : A → B → C` with goal `C` leaves goals `A` and `B`.
 * `args` allows immediately discharging leading premises with matching hypotheses.
 * @throws {@link TacticError} When `thm` is not in scope, its conclusion does not unify with the goal, or args are mismatched.
 */
export declare function apply(thm: string, args?: string[]): Tactic;
/**
 * `rewrite(eq, dir?)` — Uses hypothesis `eq : lhs = rhs` to replace
 * occurrences of `lhs` with `rhs` in the conclusion (left-to-right by default),
 * or `rhs` with `lhs` when `dir = 'right-to-left'`.
 * @throws {@link TacticError} When `eq` is not an equality or the pattern is absent from the conclusion.
 */
export declare function rewrite(eq: string, dir?: 'left-to-right' | 'right-to-left'): Tactic;
/**
 * Closes goals of the form `a = a` (syntactic reflexivity after normalization).
 * @throws {@link TacticError} When the goal is not an equality or the two sides differ.
 */
export declare function rfl(): Tactic;
/**
 * Closes trivially true goals: `True`, or any goal when `False` is in the hypotheses
 * (ex falso quodlibet).
 * @throws {@link TacticError} When the goal is not trivially provable.
 */
export declare function trivial(): Tactic;
/**
 * ∧-introduction: splits a conjunction goal `P ∧ Q` into two sub-goals `P` and `Q`.
 * @throws {@link TacticError} When the goal is not a conjunction.
 */
export declare function split(): Tactic;
/**
 * ∨-introduction (left): for a disjunction goal `P ∨ Q`, reduces to proving `P`.
 * @throws {@link TacticError} When the goal is not a disjunction.
 */
export declare function left(): Tactic;
/**
 * ∨-introduction (right): for a disjunction goal `P ∨ Q`, reduces to proving `Q`.
 * @throws {@link TacticError} When the goal is not a disjunction.
 */
export declare function right(): Tactic;
/**
 * Case analysis on hypothesis `name`.
 * - `H: P ∧ Q` → splits into hypotheses `H_L: P` and `H_R: Q` in the same goal.
 * - `H: P ∨ Q` → produces two sub-goals, each with the respective disjunct.
 * - `H: ⊥` → closes the goal (ex falso).
 * @throws {@link TacticError} When `name` is not in scope or its type cannot be destructured.
 */
export declare function destruct(name: string): Tactic;
/**
 * Structural induction on hypothesis `name: Nat`.
 * Produces two sub-goals:
 * - **zero case**: conclusion with `name` substituted by `zero`.
 * - **succ case**: adds `IH: P(k)` and `k: Nat`; conclusion is `P(succ(k))`.
 *
 * Only Nat induction is supported in this base implementation.
 * @throws {@link TacticError} When `name` is not a `Nat` hypothesis.
 */
export declare function induction(name: string): Tactic;
/**
 * Alias of {@link destruct} with the semantics of "case analysis".
 * Exported as `case` from `index.ts` via re-export alias (JS keyword conflict).
 */
export declare function caseAnalysis(name: string): Tactic;
/** Maps definition names to their body expressions. Passed to {@link unfold}. */
export interface DefDictionary {
    [name: string]: string;
}
/**
 * `unfold(def, dict)` — Replaces the identifier `def` by its body from `dict`
 * in the current conclusion. The definition dictionary is caller-supplied;
 * no global state is maintained.
 * @throws {@link TacticError} When `def` is not in `dict` or does not appear in the goal.
 */
export declare function unfold(def: string, dict?: DefDictionary): Tactic;
/**
 * Applies the following rewrite rules recursively to a fixed point:
 * - `True ∧ X → X`, `X ∧ True → X`, `False ∧ X → False`
 * - `False ∨ X → X`, `X ∨ False → X`, `True ∨ X → True`
 * - `True → X → X`, `X → True → True`, `False → X → True`
 * - `¬¬X → X`
 * @throws {@link TacticError} When the goal is unchanged after all rules.
 */
export declare function simp(): Tactic;
//# sourceMappingURL=tactics.d.ts.map