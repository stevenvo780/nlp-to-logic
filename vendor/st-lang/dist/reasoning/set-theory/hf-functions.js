"use strict";
/**
 * Functions modelled as sets of Kuratowski ordered pairs (the graph), plus
 * an explicit domain and codomain. A graph is a valid function iff it is
 * functional: ⟨x, y₁⟩ ∈ f and ⟨x, y₂⟩ ∈ f implies y₁ = y₂.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_FUNCTION = void 0;
exports.isValidFunction = isValidFunction;
exports.applyHF = applyHF;
exports.composeHF = composeHF;
exports.isInjective = isInjective;
exports.isSurjective = isSurjective;
exports.isBijective = isBijective;
exports.makeFunction = makeFunction;
const hf_sets_1 = require("./hf-sets");
/**
 * The graph must be a subset of domain × codomain, every element must be
 * a Kuratowski pair, and the relation must be functional. We also require
 * the graph to be total on `domain` so that `apply` is well-defined for
 * every x in the declared domain.
 */
function isValidFunction(f) {
    const product = (0, hf_sets_1.cartesianProduct)(f.domain, f.codomain);
    if (!(0, hf_sets_1.isSubset)(f.graph, product)) {
        return false;
    }
    const fromX = new Map();
    for (const p of f.graph.elements) {
        const x = (0, hf_sets_1.fst)(p);
        const y = (0, hf_sets_1.snd)(p);
        if (x === null || y === null) {
            return false;
        }
        const xk = (0, hf_sets_1.canonicalize)(x);
        const yk = (0, hf_sets_1.canonicalize)(y);
        const existing = fromX.get(xk);
        if (existing !== undefined && existing !== yk) {
            return false;
        }
        fromX.set(xk, yk);
    }
    // Totality on declared domain.
    const canonicalDomain = (0, hf_sets_1.canonicalSet)(f.domain);
    if (fromX.size !== canonicalDomain.elements.length) {
        return false;
    }
    return true;
}
function applyHF(f, x) {
    if (!(0, hf_sets_1.isElement)(x, f.domain)) {
        return null;
    }
    const xk = (0, hf_sets_1.canonicalize)(x);
    for (const p of f.graph.elements) {
        const px = (0, hf_sets_1.fst)(p);
        if (px !== null && (0, hf_sets_1.canonicalize)(px) === xk) {
            return (0, hf_sets_1.snd)(p);
        }
    }
    return null;
}
/**
 * (f ∘ g)(x) = f(g(x)). Returns null when the codomain of g is not the
 * domain of f, or either function is malformed.
 */
function composeHF(f, g) {
    if (!(0, hf_sets_1.setEquals)(g.codomain, f.domain)) {
        return null;
    }
    const pairs = [];
    const seen = new Set();
    for (const x of (0, hf_sets_1.canonicalSet)(g.domain).elements) {
        const mid = applyHF(g, x);
        if (mid === null) {
            return null;
        }
        const out = applyHF(f, mid);
        if (out === null) {
            return null;
        }
        const pp = (0, hf_sets_1.orderedPair)(x, out);
        const key = (0, hf_sets_1.canonicalize)(pp);
        if (!seen.has(key)) {
            seen.add(key);
            pairs.push(pp);
        }
    }
    return {
        graph: { kind: 'set', elements: pairs },
        domain: g.domain,
        codomain: f.codomain,
    };
}
function isInjective(f) {
    const images = new Set();
    for (const p of f.graph.elements) {
        const y = (0, hf_sets_1.snd)(p);
        if (y === null) {
            return false;
        }
        const key = (0, hf_sets_1.canonicalize)(y);
        if (images.has(key)) {
            return false;
        }
        images.add(key);
    }
    return true;
}
function isSurjective(f) {
    const images = new Set();
    for (const p of f.graph.elements) {
        const y = (0, hf_sets_1.snd)(p);
        if (y === null) {
            return false;
        }
        images.add((0, hf_sets_1.canonicalize)(y));
    }
    for (const y of f.codomain.elements) {
        if (!images.has((0, hf_sets_1.canonicalize)(y))) {
            return false;
        }
    }
    return true;
}
function isBijective(f) {
    return isInjective(f) && isSurjective(f);
}
/**
 * Constructor helper: builds an HFFunction from an explicit mapping. The
 * caller passes parallel arrays; we form the graph from Kuratowski pairs.
 * No validation here — call `isValidFunction` afterwards if you need it.
 */
function makeFunction(domain, codomain, mapping) {
    const pairs = mapping.map(([x, y]) => (0, hf_sets_1.orderedPair)(x, y));
    return {
        graph: { kind: 'set', elements: pairs },
        domain,
        codomain,
    };
}
exports.EMPTY_FUNCTION = {
    graph: hf_sets_1.EMPTY,
    domain: hf_sets_1.EMPTY,
    codomain: hf_sets_1.EMPTY,
};
//# sourceMappingURL=hf-functions.js.map