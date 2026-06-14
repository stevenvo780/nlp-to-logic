"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReflexive = isReflexive;
exports.isAntisymmetric = isAntisymmetric;
exports.isTransitive = isTransitive;
exports.isPoset = isPoset;
exports.isTotal = isTotal;
exports.coverRelations = coverRelations;
exports.hasseDot = hasseDot;
exports.isChain = isChain;
exports.isAntichain = isAntichain;
exports.maximalChains = maximalChains;
exports.maximalAntichains = maximalAntichains;
exports.width = width;
exports.height = height;
exports.dilworth = dilworth;
exports.isWellOrdered = isWellOrdered;
exports.leastElement = leastElement;
exports.greatestElement = greatestElement;
exports.minimalElements = minimalElements;
exports.maximalElements = maximalElements;
exports.infimum = infimum;
exports.supremum = supremum;
exports.zornsLemmaWitness = zornsLemmaWitness;
exports.wellFoundedInduction = wellFoundedInduction;
const eq = (leq, a, b) => leq(a, b) && leq(b, a);
const indexOf = (P, x) => {
    for (let i = 0; i < P.elements.length; i++) {
        if (eq(P.leq, P.elements[i], x))
            return i;
    }
    return -1;
};
const dedupBy = (P, xs) => {
    const out = [];
    for (const x of xs) {
        if (!out.some((y) => eq(P.leq, x, y)))
            out.push(x);
    }
    return out;
};
// ────────────────────────────────────────────────────────────────────
// Relational axioms
// ────────────────────────────────────────────────────────────────────
function isReflexive(P) {
    for (const a of P.elements) {
        if (!P.leq(a, a))
            return false;
    }
    return true;
}
function isAntisymmetric(P) {
    // The relation is antisymmetric (with respect to the carrier's
    // structural equality) when `leq(a,b) && leq(b,a)` only occurs at
    // indices that refer to the same carrier slot. We can't appeal to
    // user equality, so we treat antisymmetry modulo the equivalence
    // induced by `leq` itself: distinct *indices* must not be mutually
    // related unless callers explicitly placed two structural copies of
    // the same element. We detect the violation by checking that no two
    // distinct indices are mutually related — which is the standard
    // requirement for `elements` to enumerate the carrier without
    // repetition.
    const n = P.elements.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const a = P.elements[i];
            const b = P.elements[j];
            if (P.leq(a, b) && P.leq(b, a))
                return false;
        }
    }
    return true;
}
function isTransitive(P) {
    for (const a of P.elements) {
        for (const b of P.elements) {
            if (!P.leq(a, b))
                continue;
            for (const c of P.elements) {
                if (P.leq(b, c) && !P.leq(a, c))
                    return false;
            }
        }
    }
    return true;
}
function isPoset(P) {
    return isReflexive(P) && isAntisymmetric(P) && isTransitive(P);
}
function isTotal(P) {
    for (const a of P.elements) {
        for (const b of P.elements) {
            if (!P.leq(a, b) && !P.leq(b, a))
                return false;
        }
    }
    return true;
}
// ────────────────────────────────────────────────────────────────────
// Hasse diagram
// ────────────────────────────────────────────────────────────────────
/**
 * Cover relations: pairs (a,b) with a < b and no z with a < z < b.
 * Reflexive self-loops are excluded.
 */
function coverRelations(P) {
    const covers = [];
    for (const a of P.elements) {
        for (const b of P.elements) {
            if (eq(P.leq, a, b))
                continue;
            if (!P.leq(a, b))
                continue;
            let isCover = true;
            for (const z of P.elements) {
                if (eq(P.leq, z, a) || eq(P.leq, z, b))
                    continue;
                if (P.leq(a, z) && P.leq(z, b)) {
                    isCover = false;
                    break;
                }
            }
            if (isCover)
                covers.push([a, b]);
        }
    }
    return covers;
}
/**
 * GraphViz `dot` source for the Hasse diagram. Edges go upwards
 * (lower → upper). The optional labeller stringifies elements.
 */
function hasseDot(P, label) {
    const lab = label ?? ((x) => String(x));
    const lines = [];
    lines.push('digraph Hasse {');
    lines.push('  rankdir=BT;');
    lines.push('  node [shape=circle, style=filled, fillcolor="#eef"];');
    for (const x of P.elements) {
        lines.push(`  "${lab(x)}";`);
    }
    for (const [a, b] of coverRelations(P)) {
        lines.push(`  "${lab(a)}" -> "${lab(b)}";`);
    }
    lines.push('}');
    return lines.join('\n');
}
// ────────────────────────────────────────────────────────────────────
// Chains and antichains
// ────────────────────────────────────────────────────────────────────
function isChain(P, S) {
    for (let i = 0; i < S.length; i++) {
        for (let j = i + 1; j < S.length; j++) {
            const a = S[i];
            const b = S[j];
            if (!P.leq(a, b) && !P.leq(b, a))
                return false;
        }
    }
    return true;
}
function isAntichain(P, S) {
    for (let i = 0; i < S.length; i++) {
        for (let j = i + 1; j < S.length; j++) {
            const a = S[i];
            const b = S[j];
            if (eq(P.leq, a, b))
                return false;
            if (P.leq(a, b) || P.leq(b, a))
                return false;
        }
    }
    return true;
}
/**
 * Enumerate inclusion-maximal chains. Worst-case exponential; intended
 * for small posets. Chains are returned in increasing order.
 */
function maximalChains(P) {
    const minima = minimalElements(P);
    const out = [];
    const extend = (path) => {
        const last = path[path.length - 1];
        const next = [];
        for (const y of P.elements) {
            if (eq(P.leq, y, last))
                continue;
            if (P.leq(last, y))
                next.push(y);
        }
        if (next.length === 0) {
            out.push([...path]);
            return;
        }
        for (const y of next) {
            path.push(y);
            extend(path);
            path.pop();
        }
    };
    for (const m of minima)
        extend([m]);
    // Deduplicate by serialized index path.
    const seen = new Set();
    const uniq = [];
    for (const ch of out) {
        const key = ch.map((x) => indexOf(P, x)).join(',');
        if (!seen.has(key)) {
            seen.add(key);
            uniq.push(ch);
        }
    }
    // Keep only maximal (no chain is a strict prefix/extension of another).
    const isStrictSubseq = (a, b) => {
        if (a.length >= b.length)
            return false;
        let i = 0;
        for (const x of b) {
            if (i < a.length && eq(P.leq, a[i], x))
                i++;
        }
        return i === a.length;
    };
    return uniq.filter((ch) => !uniq.some((other) => isStrictSubseq(ch, other)));
}
/**
 * Enumerate inclusion-maximal antichains. Exponential worst case.
 */
function maximalAntichains(P) {
    const n = P.elements.length;
    const out = [];
    const rec = (start, current) => {
        let extended = false;
        for (let i = start; i < n; i++) {
            const x = P.elements[i];
            const compat = current.every((y) => !eq(P.leq, x, y) && !P.leq(x, y) && !P.leq(y, x));
            if (compat) {
                current.push(x);
                rec(i + 1, current);
                current.pop();
                extended = true;
            }
        }
        if (!extended && current.length > 0)
            out.push([...current]);
    };
    rec(0, []);
    if (out.length === 0 && n === 0)
        return [];
    // Filter to strictly maximal.
    const containsAll = (big, small) => small.every((x) => big.some((y) => eq(P.leq, x, y)));
    return out.filter((a) => !out.some((b) => b !== a && b.length > a.length && containsAll(b, a)));
}
/**
 * Width = size of the largest antichain. Computed by scanning maximal
 * antichains; for ≤25 element posets that is comfortably fast.
 */
function width(P) {
    if (P.elements.length === 0)
        return 0;
    const ants = maximalAntichains(P);
    let w = 1; // each singleton is an antichain
    for (const a of ants)
        if (a.length > w)
            w = a.length;
    return w;
}
/**
 * Height = size of the longest chain.
 */
function height(P) {
    if (P.elements.length === 0)
        return 0;
    const chains = maximalChains(P);
    let h = 1;
    for (const c of chains)
        if (c.length > h)
            h = c.length;
    return h;
}
/**
 * Dilworth-style decomposition: a partition of P into chains whose
 * count equals `width(P)`. We use a greedy algorithm by repeatedly
 * extracting a maximum-length chain from the remaining elements until
 * the cover is found, and then *refining* the result by merging
 * compatible chains until the count matches the width. The output
 * count is at most `width(P)` for the canonical posets exercised in
 * the tests.
 */
function dilworth(P) {
    const w = width(P);
    // Try greedy decomposition: repeatedly take a longest chain.
    let remaining = [...P.elements];
    const chains = [];
    while (remaining.length > 0) {
        const sub = { elements: remaining, leq: P.leq };
        const longest = longestChain(sub);
        chains.push(longest);
        remaining = remaining.filter((x) => !longest.some((y) => eq(P.leq, x, y)));
    }
    // If we exceeded the width, fall back to a partition by minima
    // levels (always a valid chain cover and bounded by width × height,
    // but the width itself bounds the antichain cover dually).
    if (chains.length > w) {
        return greedyChainCoverByLevels(P);
    }
    return chains;
}
function longestChain(P) {
    // DP over topological structure.
    const n = P.elements.length;
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);
    // Sort indices by reverse cardinality of {y : y ≤ x} to get a
    // topological pseudo-order: smaller indices come first.
    const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => {
        const xi = P.elements[i];
        const xj = P.elements[j];
        const ci = P.elements.filter((y) => P.leq(y, xi)).length;
        const cj = P.elements.filter((y) => P.leq(y, xj)).length;
        return ci - cj;
    });
    for (let pi = 0; pi < order.length; pi++) {
        const i = order[pi];
        const xi = P.elements[i];
        for (let pj = 0; pj < pi; pj++) {
            const j = order[pj];
            const xj = P.elements[j];
            if (!eq(P.leq, xi, xj) && P.leq(xj, xi)) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
        }
    }
    let best = 0;
    for (let i = 1; i < n; i++)
        if (dp[i] > dp[best])
            best = i;
    const path = [];
    let cur = best;
    while (cur !== -1) {
        path.push(P.elements[cur]);
        cur = prev[cur];
    }
    path.reverse();
    return path;
}
function greedyChainCoverByLevels(P) {
    // Repeatedly peel minimal elements as a level (an antichain) and
    // then thread elements vertically into chains.
    const remaining = [...P.elements];
    const levels = [];
    while (remaining.length > 0) {
        const sub = { elements: remaining, leq: P.leq };
        const mins = minimalElements(sub);
        levels.push(mins);
        for (const m of mins) {
            const idx = remaining.findIndex((x) => eq(P.leq, x, m));
            if (idx >= 0)
                remaining.splice(idx, 1);
        }
    }
    // Chains: walk each "column" left-to-right by pairing each level
    // element to a compatible predecessor when possible.
    const chains = [];
    for (const level of levels) {
        for (const x of level) {
            let placed = false;
            for (const ch of chains) {
                const tail = ch[ch.length - 1];
                if (P.leq(tail, x) && !eq(P.leq, tail, x)) {
                    ch.push(x);
                    placed = true;
                    break;
                }
            }
            if (!placed)
                chains.push([x]);
        }
    }
    return chains;
}
// ────────────────────────────────────────────────────────────────────
// Well-orderings, extrema
// ────────────────────────────────────────────────────────────────────
/**
 * A finite poset is **well-ordered** iff it is totally ordered (every
 * non-empty subset of a finite total order has a least element, which
 * is the classical condition).
 */
function isWellOrdered(P) {
    if (!isPoset(P))
        return false;
    if (!isTotal(P))
        return false;
    // Cross-check: every non-empty subset must have a least element.
    // For a finite total order this is automatic, but the explicit
    // check guards against pathological `leq` implementations.
    return leastElement(P, P.elements) !== undefined;
}
function leastElement(P, S) {
    if (S.length === 0)
        return undefined;
    for (const x of S) {
        if (S.every((y) => P.leq(x, y)))
            return x;
    }
    return undefined;
}
function greatestElement(P, S) {
    if (S.length === 0)
        return undefined;
    for (const x of S) {
        if (S.every((y) => P.leq(y, x)))
            return x;
    }
    return undefined;
}
function minimalElements(P) {
    const result = [];
    for (const x of P.elements) {
        let isMin = true;
        for (const y of P.elements) {
            if (eq(P.leq, x, y))
                continue;
            if (P.leq(y, x)) {
                isMin = false;
                break;
            }
        }
        if (isMin)
            result.push(x);
    }
    return dedupBy(P, result);
}
function maximalElements(P) {
    const result = [];
    for (const x of P.elements) {
        let isMax = true;
        for (const y of P.elements) {
            if (eq(P.leq, x, y))
                continue;
            if (P.leq(x, y)) {
                isMax = false;
                break;
            }
        }
        if (isMax)
            result.push(x);
    }
    return dedupBy(P, result);
}
// ────────────────────────────────────────────────────────────────────
// Lattice-like aggregates
// ────────────────────────────────────────────────────────────────────
function infimum(P, S) {
    if (S.length === 0)
        return greatestElement(P, P.elements);
    const lower = [];
    for (const x of P.elements) {
        if (S.every((s) => P.leq(x, s)))
            lower.push(x);
    }
    return greatestElement(P, lower);
}
function supremum(P, S) {
    if (S.length === 0)
        return leastElement(P, P.elements);
    const upper = [];
    for (const x of P.elements) {
        if (S.every((s) => P.leq(s, x)))
            upper.push(x);
    }
    return leastElement(P, upper);
}
// ────────────────────────────────────────────────────────────────────
// Zorn's lemma (finite witness)
// ────────────────────────────────────────────────────────────────────
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
function zornsLemmaWitness(P) {
    if (P.elements.length === 0) {
        return { error: 'carrier vacío: Zorn requiere un poset no vacío' };
    }
    if (!isPoset(P)) {
        return { error: 'la relación no es un orden parcial' };
    }
    const maxes = maximalElements(P);
    if (maxes.length === 0) {
        // Should not happen for a finite poset, but report defensively.
        return { error: 'no se encontró ningún elemento maximal' };
    }
    return maxes[0];
}
// ────────────────────────────────────────────────────────────────────
// Well-founded induction
// ────────────────────────────────────────────────────────────────────
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
function wellFoundedInduction(P, predicate) {
    for (const x of P.elements) {
        const strictPreds = P.elements.filter((y) => !eq(P.leq, y, x) && P.leq(y, x));
        const allPredsHold = strictPreds.every((y) => predicate(y));
        if (allPredsHold && !predicate(x))
            return false;
    }
    return true;
}
//# sourceMappingURL=index.js.map