/**
 * Hereditarily finite sets (the universe Vω).
 *
 * Every HF set is built from the empty set in finitely many steps using
 * pairing and union. Equality is extensional: two sets are equal iff they
 * have the same elements, regardless of order or repetition.
 *
 * Internally we keep elements as a plain array; the canonical form (used
 * for hashing/equality) deduplicates and orders by a recursive serialization.
 */
export interface HFSet {
    readonly kind: 'set';
    readonly elements: ReadonlyArray<HFSet>;
}
export declare const EMPTY: HFSet;
export declare function canonicalize(x: HFSet): string;
export declare function setEquals(a: HFSet, b: HFSet): boolean;
export declare function isElement(x: HFSet, A: HFSet): boolean;
export declare function isSubset(a: HFSet, b: HFSet): boolean;
/**
 * Cardinality is the number of *distinct* elements (after canonical dedup).
 * `a.elements` may contain syntactic duplicates if the set was built by
 * hand; we count once per equivalence class.
 */
export declare function cardinality(a: HFSet): number;
/**
 * Returns the canonical representative of a set: same elements, deduplicated
 * and ordered. Useful when consumers want a stable shape.
 */
export declare function canonicalSet(a: HFSet): HFSet;
export declare function singleton(x: HFSet): HFSet;
export declare function pair(a: HFSet, b: HFSet): HFSet;
export declare function union(a: HFSet, b: HFSet): HFSet;
/**
 * Generalized union: union of every element of `sets`. If `sets` is the
 * family {A1, A2, ...} returns A1 ∪ A2 ∪ ... (Axiom of Union).
 */
export declare function unionFamily(sets: HFSet[] | HFSet): HFSet;
export declare function intersection(a: HFSet, b: HFSet): HFSet;
export declare function difference(a: HFSet, b: HFSet): HFSet;
/**
 * Power set: set of all subsets. For a set of cardinality n returns a set
 * of cardinality 2^n. Implementation is the classic bitmask enumeration
 * over the canonical element list.
 */
export declare function powerSet(a: HFSet): HFSet;
/**
 * Kuratowski ordered pair: ⟨a, b⟩ := { {a}, {a, b} }.
 * Recovers `fst` and `snd` correctly even when a = b.
 */
export declare function orderedPair(a: HFSet, b: HFSet): HFSet;
/**
 * Extracts the first component of a Kuratowski pair. Returns null if the
 * input is not shaped like an ordered pair.
 */
export declare function fst(p: HFSet): HFSet | null;
export declare function snd(p: HFSet): HFSet | null;
/**
 * Cartesian product A × B = { ⟨a, b⟩ : a ∈ A, b ∈ B }.
 */
export declare function cartesianProduct(a: HFSet, b: HFSet): HFSet;
/**
 * Von Neumann natural number: 0 := ∅, succ(n) := n ∪ {n}.
 * Therefore n = {0, 1, ..., n-1}.
 */
export declare function succ(n: HFSet): HFSet;
export declare function nat(n: number): HFSet;
/**
 * Transitive: every element of x is also a subset of x.
 * Required by the von Neumann ordinal definition.
 */
export declare function isTransitive(x: HFSet): boolean;
/**
 * Von Neumann ordinal: transitive set, well-ordered by ∈. On HF sets
 * (where every membership chain terminates by Foundation) this collapses
 * to: x is transitive and every element of x is also transitive.
 */
export declare function isOrdinal(x: HFSet): boolean;
//# sourceMappingURL=hf-sets.d.ts.map