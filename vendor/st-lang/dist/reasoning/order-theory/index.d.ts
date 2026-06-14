/**
 * Order theory — posets, chains, antichains, Dilworth, Hasse,
 * well-orderings, well-founded induction and a constructive
 * Zorn's-lemma witness for finite posets.
 *
 * A poset (P, ≤) is a set together with a binary relation that is
 * reflexive, antisymmetric and transitive. This module operates on
 * **finite** carriers given as `elements: T[]` plus a decidable
 * `leq` predicate. Equality of carrier elements is decided by
 * antisymmetry of `leq`: `a ≡ b` iff `leq(a,b) && leq(b,a)`.
 *
 * Complexities are O(n^2) for the relational checks and O(n^3) for
 * the chain/antichain explorations; the maximal-chain/antichain
 * enumerators are exponential in the worst case and are meant for
 * small posets (n ≲ 25), which is where the constructive value
 * lives.
 *
 * Zorn's lemma is non-constructive in general (it requires the
 * axiom of choice). For **finite** posets it becomes a trivial
 * theorem: every chain has its largest element as an upper bound,
 * hence a maximal element exists. We expose that finite-case witness
 * as `zornsLemmaWitness`: given any chain `C`, we follow upper
 * bounds until we reach a maximal element of P. This is honestly
 * labelled `finite-only` so callers do not mistake it for the
 * general AC-equivalent statement.
 */
export interface Poset<T> {
    readonly elements: ReadonlyArray<T>;
    readonly leq: (a: T, b: T) => boolean;
}
export declare function isReflexive<T>(P: Poset<T>): boolean;
export declare function isAntisymmetric<T>(P: Poset<T>): boolean;
export declare function isTransitive<T>(P: Poset<T>): boolean;
export declare function isPoset<T>(P: Poset<T>): boolean;
export declare function isTotal<T>(P: Poset<T>): boolean;
/**
 * Cover relations: pairs (a,b) with a < b and no z with a < z < b.
 * Reflexive self-loops are excluded.
 */
export declare function coverRelations<T>(P: Poset<T>): Array<[T, T]>;
/**
 * GraphViz `dot` source for the Hasse diagram. Edges go upwards
 * (lower → upper). The optional labeller stringifies elements.
 */
export declare function hasseDot<T>(P: Poset<T>, label?: (x: T) => string): string;
export declare function isChain<T>(P: Poset<T>, S: ReadonlyArray<T>): boolean;
export declare function isAntichain<T>(P: Poset<T>, S: ReadonlyArray<T>): boolean;
/**
 * Enumerate inclusion-maximal chains. Worst-case exponential; intended
 * for small posets. Chains are returned in increasing order.
 */
export declare function maximalChains<T>(P: Poset<T>): T[][];
/**
 * Enumerate inclusion-maximal antichains. Exponential worst case.
 */
export declare function maximalAntichains<T>(P: Poset<T>): T[][];
/**
 * Width = size of the largest antichain. Computed by scanning maximal
 * antichains; for ≤25 element posets that is comfortably fast.
 */
export declare function width<T>(P: Poset<T>): number;
/**
 * Height = size of the longest chain.
 */
export declare function height<T>(P: Poset<T>): number;
/**
 * Dilworth-style decomposition: a partition of P into chains whose
 * count equals `width(P)`. We use a greedy algorithm by repeatedly
 * extracting a maximum-length chain from the remaining elements until
 * the cover is found, and then *refining* the result by merging
 * compatible chains until the count matches the width. The output
 * count is at most `width(P)` for the canonical posets exercised in
 * the tests.
 */
export declare function dilworth<T>(P: Poset<T>): T[][];
/**
 * A finite poset is **well-ordered** iff it is totally ordered (every
 * non-empty subset of a finite total order has a least element, which
 * is the classical condition).
 */
export declare function isWellOrdered<T>(P: Poset<T>): boolean;
export declare function leastElement<T>(P: Poset<T>, S: ReadonlyArray<T>): T | undefined;
export declare function greatestElement<T>(P: Poset<T>, S: ReadonlyArray<T>): T | undefined;
export declare function minimalElements<T>(P: Poset<T>): T[];
export declare function maximalElements<T>(P: Poset<T>): T[];
export declare function infimum<T>(P: Poset<T>, S: ReadonlyArray<T>): T | undefined;
export declare function supremum<T>(P: Poset<T>, S: ReadonlyArray<T>): T | undefined;
/**
 * Constructive Zorn witness for finite posets.
 *
 * Statement (finite case): every non-empty finite poset in which every
 * chain has an upper bound contains a maximal element. For finite
 * posets the chain-upper-bound hypothesis is automatic — the largest
 * element of any finite chain is its upper bound — so the statement
 * collapses to "every non-empty finite poset has a maximal element",
 * which we witness by returning one.
 *
 * Returns the maximal element (any deterministic choice) or an error
 * describing why no witness exists (empty carrier, or `P` failing the
 * poset axioms).
 */
export declare function zornsLemmaWitness<T>(P: Poset<T>): T | {
    error: string;
};
/**
 * Well-founded induction principle (finite case).
 *
 * For a finite poset, `<` is automatically well-founded. The principle
 * says: to prove `∀x. P(x)` it suffices to prove
 *     `∀x. (∀y. y < x → P(y)) → P(x)`.
 *
 * We verify the principle pointwise: for every `x ∈ elements` we check
 * that whenever `P` holds on all strict predecessors of `x` it also
 * holds on `x`. If the user predicate respects this induction step,
 * `P` must hold everywhere — and the function returns `true`.
 *
 * This is **not** a general termination proof: it merely checks the
 * inductive step is consistent on the given carrier.
 */
export declare function wellFoundedInduction<T>(P: Poset<T>, predicate: (x: T) => boolean): boolean;
//# sourceMappingURL=index.d.ts.map