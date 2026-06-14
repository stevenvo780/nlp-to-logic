"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExtensionality = checkExtensionality;
exports.checkPairing = checkPairing;
exports.checkUnion = checkUnion;
exports.checkPowerSet = checkPowerSet;
exports.checkInfinity = checkInfinity;
exports.checkFoundation = checkFoundation;
exports.checkAllAxioms = checkAllAxioms;
const hf_sets_1 = require("./hf-sets");
/**
 * Sample universe of small HF sets used by the probabilistic checks.
 * Includes ∅, the first few naturals, singletons, pairs and a small
 * power-set tower. Bounded to keep the checks fast.
 */
function sampleUniverse() {
    const universe = [hf_sets_1.EMPTY];
    const seen = new Set([(0, hf_sets_1.canonicalize)(hf_sets_1.EMPTY)]);
    const push = (s) => {
        const k = (0, hf_sets_1.canonicalize)(s);
        if (!seen.has(k)) {
            seen.add(k);
            universe.push(s);
        }
    };
    for (let i = 1; i <= 4; i++) {
        push((0, hf_sets_1.nat)(i));
    }
    // Snapshot the length to avoid feeding new singletons back into the
    // iteration (would diverge: each singleton is distinct from prior).
    const snapshotLen = universe.length;
    for (let i = 0; i < snapshotLen; i++) {
        const base = universe[i];
        if (base !== undefined) {
            push((0, hf_sets_1.singleton)(base));
        }
    }
    push((0, hf_sets_1.pair)(hf_sets_1.EMPTY, (0, hf_sets_1.singleton)(hf_sets_1.EMPTY)));
    push((0, hf_sets_1.powerSet)((0, hf_sets_1.nat)(2)));
    return universe;
}
/**
 * Axiom of Extensionality: ∀A ∀B (A = B ↔ ∀x (x ∈ A ↔ x ∈ B)).
 * Our canonicalization implements extensionality directly, so we verify
 * agreement on a sample plus the contrapositive on intentionally distinct
 * sets.
 */
function checkExtensionality() {
    const universe = sampleUniverse();
    for (const a of universe) {
        for (const b of universe) {
            const sameElements = a.elements.length === 0 && b.elements.length === 0
                ? true
                : (0, hf_sets_1.isSubset)(a, b) && (0, hf_sets_1.isSubset)(b, a);
            const eq = (0, hf_sets_1.setEquals)(a, b);
            if (eq !== sameElements) {
                return {
                    name: 'Extensionality',
                    holds: false,
                    counterexample: [a, b],
                };
            }
        }
    }
    // Order/duplication invariance.
    const a1 = (0, hf_sets_1.pair)(hf_sets_1.EMPTY, (0, hf_sets_1.singleton)(hf_sets_1.EMPTY));
    const a2 = (0, hf_sets_1.pair)((0, hf_sets_1.singleton)(hf_sets_1.EMPTY), hf_sets_1.EMPTY);
    if (!(0, hf_sets_1.setEquals)(a1, a2)) {
        return { name: 'Extensionality', holds: false, counterexample: [a1, a2] };
    }
    return { name: 'Extensionality', holds: true };
}
/**
 * Axiom of Pairing: ∀a ∀b ∃P (a ∈ P ∧ b ∈ P ∧ ∀x (x ∈ P → x = a ∨ x = b)).
 */
function checkPairing(_samples = 0) {
    const universe = sampleUniverse();
    for (const a of universe) {
        for (const b of universe) {
            const p = (0, hf_sets_1.pair)(a, b);
            if (!(0, hf_sets_1.isElement)(a, p) || !(0, hf_sets_1.isElement)(b, p)) {
                return { name: 'Pairing', holds: false, counterexample: [a, b, p] };
            }
            const expectedCard = (0, hf_sets_1.setEquals)(a, b) ? 1 : 2;
            if ((0, hf_sets_1.cardinality)(p) !== expectedCard) {
                return { name: 'Pairing', holds: false, counterexample: [a, b, p] };
            }
        }
    }
    return { name: 'Pairing', holds: true };
}
/**
 * Axiom of Union: for any family F there exists ⋃F such that x ∈ ⋃F iff
 * x ∈ A for some A ∈ F.
 */
function checkUnion(_samples = 0) {
    const universe = sampleUniverse();
    for (const a of universe) {
        for (const b of universe) {
            const u = (0, hf_sets_1.union)(a, b);
            for (const x of a.elements) {
                if (!(0, hf_sets_1.isElement)(x, u)) {
                    return { name: 'Union', holds: false, counterexample: [a, b, x] };
                }
            }
            for (const x of b.elements) {
                if (!(0, hf_sets_1.isElement)(x, u)) {
                    return { name: 'Union', holds: false, counterexample: [a, b, x] };
                }
            }
            for (const x of u.elements) {
                if (!(0, hf_sets_1.isElement)(x, a) && !(0, hf_sets_1.isElement)(x, b)) {
                    return { name: 'Union', holds: false, counterexample: [a, b, x] };
                }
            }
        }
    }
    // Generalized union over a small family.
    const family = [(0, hf_sets_1.nat)(2), (0, hf_sets_1.singleton)((0, hf_sets_1.nat)(3)), (0, hf_sets_1.pair)(hf_sets_1.EMPTY, (0, hf_sets_1.nat)(1))];
    const big = (0, hf_sets_1.unionFamily)(family);
    for (const member of family) {
        for (const x of member.elements) {
            if (!(0, hf_sets_1.isElement)(x, big)) {
                return { name: 'Union', holds: false, counterexample: [member, x] };
            }
        }
    }
    return { name: 'Union', holds: true };
}
/**
 * Axiom of Power Set: ∀A ∃P (∀x (x ∈ P ↔ x ⊆ A)). Sample over small sets
 * to keep |P(A)| = 2^|A| manageable.
 */
function checkPowerSet(_samples = 0) {
    const universe = sampleUniverse().filter((s) => (0, hf_sets_1.cardinality)(s) <= 3);
    for (const a of universe) {
        const p = (0, hf_sets_1.powerSet)(a);
        const expected = 1 << (0, hf_sets_1.cardinality)(a);
        if ((0, hf_sets_1.cardinality)(p) !== expected) {
            return { name: 'Power Set', holds: false, counterexample: [a, p] };
        }
        for (const s of p.elements) {
            if (!(0, hf_sets_1.isSubset)(s, a)) {
                return { name: 'Power Set', holds: false, counterexample: [a, s] };
            }
        }
        // ∅ and A itself are always in P(A).
        if (!(0, hf_sets_1.isElement)(hf_sets_1.EMPTY, p)) {
            return { name: 'Power Set', holds: false, counterexample: [a, p] };
        }
        if (!(0, hf_sets_1.isElement)(a, p)) {
            return { name: 'Power Set', holds: false, counterexample: [a, p] };
        }
    }
    return { name: 'Power Set', holds: true };
}
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
function checkInfinity() {
    const seen = new Set([(0, hf_sets_1.canonicalize)(hf_sets_1.EMPTY)]);
    let current = hf_sets_1.EMPTY;
    const witnesses = [current];
    const CAP = 32;
    for (let i = 0; i < CAP; i++) {
        const next = (0, hf_sets_1.succ)(current);
        const key = (0, hf_sets_1.canonicalize)(next);
        if (seen.has(key)) {
            // Would mean closure — should never happen in Vω.
            return {
                name: 'Infinity',
                holds: true,
                note: 'closure detected (unexpected for Vω)',
                counterexample: witnesses,
            };
        }
        seen.add(key);
        witnesses.push(next);
        current = next;
    }
    return {
        name: 'Infinity',
        holds: false,
        note: 'Vω no contiene un conjunto inductivo: successor strictamente aumenta el rango',
        counterexample: witnesses,
    };
}
/**
 * Axiom of Foundation (Regularity): every nonempty set A has an element
 * disjoint from A. On HF sets this holds automatically because the
 * membership relation is well-founded by construction (no cycles, no
 * infinite descending chains).
 */
function checkFoundation(_samples = 0) {
    const universe = sampleUniverse().filter((s) => s.elements.length > 0);
    for (const a of universe) {
        let foundDisjoint = false;
        for (const e of a.elements) {
            let disjoint = true;
            for (const inner of e.elements) {
                if ((0, hf_sets_1.isElement)(inner, a)) {
                    disjoint = false;
                    break;
                }
            }
            if (disjoint) {
                foundDisjoint = true;
                break;
            }
        }
        if (!foundDisjoint) {
            return { name: 'Foundation', holds: false, counterexample: [a] };
        }
    }
    return { name: 'Foundation', holds: true };
}
function checkAllAxioms() {
    return [
        checkExtensionality(),
        checkPairing(),
        checkUnion(),
        checkPowerSet(),
        checkInfinity(),
        checkFoundation(),
    ];
}
//# sourceMappingURL=zfc-axioms.js.map