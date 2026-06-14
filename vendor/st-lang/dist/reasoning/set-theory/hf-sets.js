"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY = void 0;
exports.canonicalize = canonicalize;
exports.setEquals = setEquals;
exports.isElement = isElement;
exports.isSubset = isSubset;
exports.cardinality = cardinality;
exports.canonicalSet = canonicalSet;
exports.singleton = singleton;
exports.pair = pair;
exports.union = union;
exports.unionFamily = unionFamily;
exports.intersection = intersection;
exports.difference = difference;
exports.powerSet = powerSet;
exports.orderedPair = orderedPair;
exports.fst = fst;
exports.snd = snd;
exports.cartesianProduct = cartesianProduct;
exports.succ = succ;
exports.nat = nat;
exports.isTransitive = isTransitive;
exports.isOrdinal = isOrdinal;
const makeSet = (elements) => ({
    kind: 'set',
    elements,
});
exports.EMPTY = makeSet([]);
/**
 * Canonical identifier for an HF set. Two HF sets are extensionally equal
 * iff their canonicalize() outputs are identical strings.
 *
 * Implementation: every distinct extensional set is mapped to a compact
 * integer ID via Hopcroft-style interning. The returned string is the
 * literal `'#<id>'`. This avoids the exponential blowup that the naive
 * recursive "{e1,e2,...}" serialization would have on deeply nested
 * sets like von Neumann ordinals nat(n) (whose canonical string grows
 * as Θ(2^n)). The interning table is a module-level singleton; since
 * HFSet is structurally immutable in practice this is safe.
 */
const internByKey = new Map();
const idByObject = new WeakMap();
function canonicalize(x) {
    const cached = idByObject.get(x);
    if (cached !== undefined) {
        return cached;
    }
    let key;
    if (x.elements.length === 0) {
        key = '0';
    }
    else {
        const childIds = x.elements.map(canonicalize);
        const unique = Array.from(new Set(childIds));
        unique.sort();
        key = unique.join(',');
    }
    let id = internByKey.get(key);
    if (id === undefined) {
        id = `#${internByKey.size.toString(36)}`;
        internByKey.set(key, id);
    }
    idByObject.set(x, id);
    return id;
}
function setEquals(a, b) {
    return canonicalize(a) === canonicalize(b);
}
function isElement(x, A) {
    const target = canonicalize(x);
    for (const e of A.elements) {
        if (canonicalize(e) === target) {
            return true;
        }
    }
    return false;
}
function isSubset(a, b) {
    for (const e of a.elements) {
        if (!isElement(e, b)) {
            return false;
        }
    }
    return true;
}
/**
 * Cardinality is the number of *distinct* elements (after canonical dedup).
 * `a.elements` may contain syntactic duplicates if the set was built by
 * hand; we count once per equivalence class.
 */
function cardinality(a) {
    const seen = new Set();
    for (const e of a.elements) {
        seen.add(canonicalize(e));
    }
    return seen.size;
}
/**
 * Returns the canonical representative of a set: same elements, deduplicated
 * and ordered. Useful when consumers want a stable shape.
 */
function canonicalSet(a) {
    const seen = new Map();
    for (const e of a.elements) {
        const key = canonicalize(e);
        if (!seen.has(key)) {
            seen.set(key, canonicalSet(e));
        }
    }
    const sortedKeys = Array.from(seen.keys()).sort();
    const ordered = [];
    for (const k of sortedKeys) {
        const value = seen.get(k);
        if (value !== undefined) {
            ordered.push(value);
        }
    }
    return makeSet(ordered);
}
function singleton(x) {
    return makeSet([x]);
}
function pair(a, b) {
    if (setEquals(a, b)) {
        return makeSet([a]);
    }
    return makeSet([a, b]);
}
function union(a, b) {
    const seen = new Map();
    for (const e of a.elements) {
        seen.set(canonicalize(e), e);
    }
    for (const e of b.elements) {
        const key = canonicalize(e);
        if (!seen.has(key)) {
            seen.set(key, e);
        }
    }
    return makeSet(Array.from(seen.values()));
}
/**
 * Generalized union: union of every element of `sets`. If `sets` is the
 * family {A1, A2, ...} returns A1 ∪ A2 ∪ ... (Axiom of Union).
 */
function unionFamily(sets) {
    const family = Array.isArray(sets) ? sets : sets.elements;
    let acc = exports.EMPTY;
    for (const s of family) {
        acc = union(acc, s);
    }
    return acc;
}
function intersection(a, b) {
    const out = [];
    const seen = new Set();
    for (const e of a.elements) {
        const key = canonicalize(e);
        if (!seen.has(key) && isElement(e, b)) {
            seen.add(key);
            out.push(e);
        }
    }
    return makeSet(out);
}
function difference(a, b) {
    const out = [];
    const seen = new Set();
    for (const e of a.elements) {
        const key = canonicalize(e);
        if (!seen.has(key) && !isElement(e, b)) {
            seen.add(key);
            out.push(e);
        }
    }
    return makeSet(out);
}
/**
 * Power set: set of all subsets. For a set of cardinality n returns a set
 * of cardinality 2^n. Implementation is the classic bitmask enumeration
 * over the canonical element list.
 */
function powerSet(a) {
    const canonical = canonicalSet(a);
    const xs = canonical.elements;
    const n = xs.length;
    const total = 1 << n;
    const subsets = [];
    for (let mask = 0; mask < total; mask++) {
        const sub = [];
        for (let i = 0; i < n; i++) {
            if ((mask & (1 << i)) !== 0) {
                const element = xs[i];
                if (element !== undefined) {
                    sub.push(element);
                }
            }
        }
        subsets.push(makeSet(sub));
    }
    return makeSet(subsets);
}
/**
 * Kuratowski ordered pair: ⟨a, b⟩ := { {a}, {a, b} }.
 * Recovers `fst` and `snd` correctly even when a = b.
 */
function orderedPair(a, b) {
    const left = singleton(a);
    const right = pair(a, b);
    return pair(left, right);
}
/**
 * Extracts the first component of a Kuratowski pair. Returns null if the
 * input is not shaped like an ordered pair.
 */
function fst(p) {
    if (p.elements.length === 0 || p.elements.length > 2) {
        return null;
    }
    const first = p.elements[0];
    if (first === undefined || first.elements.length === 0) {
        return null;
    }
    // The singleton {a} sits inside p; its sole element is a.
    for (const member of p.elements) {
        if (member.elements.length === 1) {
            const candidate = member.elements[0];
            if (candidate !== undefined) {
                return candidate;
            }
        }
    }
    return null;
}
function snd(p) {
    if (p.elements.length === 0 || p.elements.length > 2) {
        return null;
    }
    const a = fst(p);
    if (a === null) {
        return null;
    }
    // Look for the {a, b} side. If p = {{a}}, then b = a.
    for (const member of p.elements) {
        if (member.elements.length === 2) {
            const m0 = member.elements[0];
            const m1 = member.elements[1];
            if (m0 === undefined || m1 === undefined) {
                continue;
            }
            if (setEquals(m0, a)) {
                return m1;
            }
            if (setEquals(m1, a)) {
                return m0;
            }
        }
    }
    // Degenerate pair ⟨a, a⟩ = {{a}}.
    return a;
}
/**
 * Cartesian product A × B = { ⟨a, b⟩ : a ∈ A, b ∈ B }.
 */
function cartesianProduct(a, b) {
    const ca = canonicalSet(a);
    const cb = canonicalSet(b);
    const out = [];
    const seen = new Set();
    for (const x of ca.elements) {
        for (const y of cb.elements) {
            const pp = orderedPair(x, y);
            const key = canonicalize(pp);
            if (!seen.has(key)) {
                seen.add(key);
                out.push(pp);
            }
        }
    }
    return makeSet(out);
}
/**
 * Von Neumann natural number: 0 := ∅, succ(n) := n ∪ {n}.
 * Therefore n = {0, 1, ..., n-1}.
 */
function succ(n) {
    return union(n, singleton(n));
}
function nat(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('nat(n): n debe ser entero no negativo');
    }
    let acc = exports.EMPTY;
    for (let i = 0; i < n; i++) {
        acc = succ(acc);
    }
    return acc;
}
/**
 * Transitive: every element of x is also a subset of x.
 * Required by the von Neumann ordinal definition.
 */
function isTransitive(x) {
    for (const e of x.elements) {
        if (!isSubset(e, x)) {
            return false;
        }
    }
    return true;
}
/**
 * Von Neumann ordinal: transitive set, well-ordered by ∈. On HF sets
 * (where every membership chain terminates by Foundation) this collapses
 * to: x is transitive and every element of x is also transitive.
 */
function isOrdinal(x) {
    if (!isTransitive(x)) {
        return false;
    }
    for (const e of x.elements) {
        if (!isTransitive(e)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=hf-sets.js.map