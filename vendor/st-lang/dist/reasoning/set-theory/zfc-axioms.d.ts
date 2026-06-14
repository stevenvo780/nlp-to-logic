/**
 * Sanity checks of selected ZFC axioms restricted to the Vω fragment.
 *
 * Most axioms hold on Vω: extensionality, pairing, union, power set,
 * foundation, separation, replacement. Infinity FAILS on Vω because Vω
 * is exactly the universe of hereditarily finite sets — there is no
 * infinite set inside it.
 *
 * The "check" functions verify on a sample of HF sets. They return
 * `holds = false` plus a counterexample when violated.
 */
import { HFSet } from './hf-sets';
export interface ZFCAxiomCheck {
    readonly name: string;
    readonly holds: boolean;
    readonly note?: string;
    readonly counterexample?: ReadonlyArray<HFSet>;
}
/**
 * Axiom of Extensionality: ∀A ∀B (A = B ↔ ∀x (x ∈ A ↔ x ∈ B)).
 * Our canonicalization implements extensionality directly, so we verify
 * agreement on a sample plus the contrapositive on intentionally distinct
 * sets.
 */
export declare function checkExtensionality(): ZFCAxiomCheck;
/**
 * Axiom of Pairing: ∀a ∀b ∃P (a ∈ P ∧ b ∈ P ∧ ∀x (x ∈ P → x = a ∨ x = b)).
 */
export declare function checkPairing(_samples?: number): ZFCAxiomCheck;
/**
 * Axiom of Union: for any family F there exists ⋃F such that x ∈ ⋃F iff
 * x ∈ A for some A ∈ F.
 */
export declare function checkUnion(_samples?: number): ZFCAxiomCheck;
/**
 * Axiom of Power Set: ∀A ∃P (∀x (x ∈ P ↔ x ⊆ A)). Sample over small sets
 * to keep |P(A)| = 2^|A| manageable.
 */
export declare function checkPowerSet(_samples?: number): ZFCAxiomCheck;
/**
 * Axiom of Infinity: ∃I (∅ ∈ I ∧ ∀x (x ∈ I → succ(x) ∈ I)). This is
 * exactly what fails on Vω: there is no HF set closed under successor,
 * because successor strictly increases rank and HF sets have finite rank.
 *
 * We "witness" the failure by attempting a closure construction: start
 * with ∅, repeatedly add successors, and observe that the inductive set
 * cannot terminate inside Vω. Programmatically we cap the search depth
 * and report holds=false with the partial witness.
 */
export declare function checkInfinity(): ZFCAxiomCheck;
/**
 * Axiom of Foundation (Regularity): every nonempty set A has an element
 * disjoint from A. On HF sets this holds automatically because the
 * membership relation is well-founded by construction (no cycles, no
 * infinite descending chains).
 */
export declare function checkFoundation(_samples?: number): ZFCAxiomCheck;
export declare function checkAllAxioms(): ZFCAxiomCheck[];
//# sourceMappingURL=zfc-axioms.d.ts.map