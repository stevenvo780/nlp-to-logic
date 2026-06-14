/**
 * Finite lattice theory.
 *
 * A lattice is a poset (P, ≤) in which every pair of elements has both
 * a least upper bound (join, ∨) and a greatest lower bound (meet, ∧).
 *
 * This module focuses on **finite** lattices: given the carrier set and
 * a `leq` predicate, we derive join/meet exhaustively (O(n^3) per pair
 * via direct search). That is enough for the structural checks
 * downstream — distributivity, modularity, complementation, Heyting
 * implication — which are themselves O(n^3) or O(n^4) and not meant
 * for n ≫ 100.
 *
 * Notable theorems used:
 *   - Dedekind: a lattice is **modular** iff it has no sublattice
 *     isomorphic to the pentagon N5.
 *   - Birkhoff: a lattice is **distributive** iff it has no sublattice
 *     isomorphic to N5 *or* to the diamond M3.
 *
 * Equality of carrier elements is decided by *antisymmetry of leq*:
 * `a === b` whenever `leq(a,b) && leq(b,a)`. This lets callers use
 * structural elements like `Set<string>` without supplying their own
 * equality predicate.
 */
export interface FiniteLattice<T> {
    readonly elements: ReadonlyArray<T>;
    readonly leq: (a: T, b: T) => boolean;
    readonly join: (a: T, b: T) => T;
    readonly meet: (a: T, b: T) => T;
    readonly top: T;
    readonly bottom: T;
}
declare const indexOf: <T>(L: FiniteLattice<T>, x: T) => number;
/**
 * Check that (elements, leq) forms a lattice: poset axioms plus
 * existence of join/meet for every pair.
 */
export declare function isLattice<T>(elements: ReadonlyArray<T>, leq: (a: T, b: T) => boolean): boolean;
/**
 * Build a FiniteLattice from carrier + order. Returns null if the
 * structure is not a lattice (missing/non-unique join or meet, or
 * the order itself is malformed).
 */
export declare function makeLattice<T>(elements: ReadonlyArray<T>, leq: (a: T, b: T) => boolean): FiniteLattice<T> | null;
/**
 * Distributive: a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c) for all a,b,c.
 */
export declare function isDistributive<T>(L: FiniteLattice<T>): boolean;
/**
 * Modular: a ≤ c ⇒ a ∨ (b ∧ c) = (a ∨ b) ∧ c.
 */
export declare function isModular<T>(L: FiniteLattice<T>): boolean;
/**
 * Find a complement of `a`: some x with a ∨ x = ⊤ and a ∧ x = ⊥.
 * Returns the first match (lattice may have multiple), or null.
 */
export declare function complement<T>(L: FiniteLattice<T>, a: T): T | null;
/**
 * Complemented: every element has at least one complement.
 */
export declare function isComplemented<T>(L: FiniteLattice<T>): boolean;
/**
 * Boolean lattice: distributive + complemented.
 * In finite Boolean lattices, complements are automatically unique.
 */
export declare function isBoolean<T>(L: FiniteLattice<T>): boolean;
/**
 * Relative pseudo-complement of `a` with respect to `b`: the largest
 * x such that a ∧ x ≤ b. Equivalently the Heyting implication a ⇒ b.
 * Returns null if no largest x exists.
 */
export declare function relativeComplement<T>(L: FiniteLattice<T>, a: T, b: T): T | null;
/**
 * Heyting algebra: distributive lattice in which every pair (a,b)
 * has a relative pseudo-complement a ⇒ b.
 *
 * In finite lattices, distributivity is equivalent to existence of
 * relative pseudo-complements, so any finite distributive lattice is
 * automatically Heyting. We still check both for clarity.
 */
export declare function isHeyting<T>(L: FiniteLattice<T>): boolean;
/**
 * Atoms: elements that cover ⊥ (i.e. ⊥ < a with no element strictly
 * between).
 */
export declare function atoms<T>(L: FiniteLattice<T>): T[];
/**
 * Coatoms: elements covered by ⊤.
 */
export declare function coatoms<T>(L: FiniteLattice<T>): T[];
/**
 * Detect a sublattice isomorphic to the pentagon N5.
 *
 * N5 is the 5-element lattice on {⊥, a, b, c, ⊤} with:
 *   - ⊥ < a < c < ⊤ (a chain of length 3)
 *   - ⊥ < b < ⊤ (b incomparable to both a and c)
 *   - a ∧ b = ⊥, a ∨ b = ⊤, c ∧ b = ⊥, c ∨ b = ⊤.
 *
 * Equivalent to: there exist 5 distinct elements x0 < x1 < x2 and y,
 * with y incomparable to x1 and to x2 minus x0, top = x2 ∨ y,
 * bottom = x0 ∧ y, and y ∨ x1 = y ∨ x2, y ∧ x1 = y ∧ x2.
 */
export declare function containsPentagon<T>(L: FiniteLattice<T>): boolean;
/**
 * Detect a sublattice isomorphic to the diamond M3.
 *
 * M3 is the 5-element lattice with one bottom, one top, and three
 * mutually incomparable elements between, each pair joining to ⊤
 * and meeting to ⊥.
 */
export declare function containsDiamond<T>(L: FiniteLattice<T>): boolean;
export interface DedekindAnalysis {
    readonly distributive: boolean;
    readonly modular: boolean;
    readonly pentagonFree: boolean;
    readonly diamondFree: boolean;
}
/**
 * Dedekind / Birkhoff structural analysis. By the two classical
 * theorems:
 *   modular   ⇔ pentagon-free
 *   distributive ⇔ pentagon-free AND diamond-free
 * We compute both algebraically and by sublattice search; the result
 * agrees on well-formed finite lattices.
 */
export declare function dedekindAnalysis<T>(L: FiniteLattice<T>): DedekindAnalysis;
/**
 * Power set lattice 2^S ordered by inclusion. For |S|=n this has
 * 2^n elements; keep n small (≤ 6).
 */
export declare function powerSetLattice(baseElements: ReadonlyArray<string>): FiniteLattice<Set<string>>;
/**
 * Divisors of n ordered by divisibility. (Lattice for any positive n.)
 */
export declare function divisibilityLattice(n: number): FiniteLattice<number>;
/**
 * Chain of n elements 0 < 1 < ... < n-1.
 */
export declare function chain(n: number): FiniteLattice<number>;
/**
 * Pentagon N5: the classical non-modular 5-element lattice.
 *
 * Hasse diagram:
 *        T
 *       / \
 *      c   b
 *      |   |
 *      a   |
 *       \ /
 *        B
 */
export declare function pentagonN5(): FiniteLattice<string>;
/**
 * Diamond M3: modular but not distributive 5-element lattice.
 *
 * Hasse diagram:
 *        T
 *      / | \
 *     a  b  c
 *      \ | /
 *        B
 */
export declare function diamondM3(): FiniteLattice<string>;
export { indexOf as _indexOfElement };
//# sourceMappingURL=index.d.ts.map