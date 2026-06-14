"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneLiteral = void 0;
exports.demodulate = demodulate;
exports.equalityFactor = equalityFactor;
const unify_1 = require("../fol-prover/unify");
const term_utils_1 = require("./term-utils");
Object.defineProperty(exports, "cloneLiteral", { enumerable: true, get: function () { return term_utils_1.cloneLiteral; } });
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
function demodulate(clause, rewrites) {
    if (rewrites.length === 0)
        return (0, term_utils_1.cloneClause)(clause);
    // Always orient each rule larger → smaller.
    const oriented = rewrites
        .map(({ from, to }) => {
        if ((0, term_utils_1.compareTerms)(from, to) >= 0)
            return { from: (0, term_utils_1.cloneTerm)(from), to: (0, term_utils_1.cloneTerm)(to) };
        return { from: (0, term_utils_1.cloneTerm)(to), to: (0, term_utils_1.cloneTerm)(from) };
    })
        .filter(({ from, to }) => !(0, term_utils_1.termsEqual)(from, to));
    if (oriented.length === 0)
        return (0, term_utils_1.cloneClause)(clause);
    const MAX_REWRITES = 256;
    const cur = (0, term_utils_1.cloneClause)(clause);
    let rewrites_done = 0;
    // outer fixed point
    let changed = true;
    while (changed && rewrites_done < MAX_REWRITES) {
        changed = false;
        for (let li = 0; li < cur.length; li++) {
            const lit = cur[li];
            if (lit === undefined)
                continue;
            const rewritten = rewriteLiteralOnce(lit, oriented);
            if (rewritten === null)
                continue;
            cur[li] = rewritten;
            rewrites_done++;
            changed = true;
            if (rewrites_done >= MAX_REWRITES)
                break;
        }
    }
    return cur;
}
function rewriteLiteralOnce(lit, rules) {
    // Try every position; first match wins.
    for (const pos of (0, term_utils_1.allLiteralPositions)(lit)) {
        const sub = (0, term_utils_1.getLiteralSubterm)(lit, pos);
        if (sub === null)
            continue;
        for (const rule of rules) {
            const sigma = matchSubterm(rule.from, sub);
            if (sigma === null)
                continue;
            const replacement = (0, unify_1.applyTerm)(rule.to, sigma);
            // Must strictly reduce (orientation guarantees this for closed substitutions but
            // matching may leave variables; double-check).
            const subSigma = (0, unify_1.applyTerm)(rule.from, sigma);
            if ((0, term_utils_1.compareTerms)(replacement, subSigma) >= 0)
                continue;
            return (0, term_utils_1.replaceLiteralSubterm)(lit, pos, replacement);
        }
    }
    return null;
}
/**
 * One-way matching: try to find σ such that `pattern·σ = subject`. Variables in `subject`
 * are treated as constants (cannot be bound). Returns the substitution or null.
 */
function matchSubterm(pattern, subject) {
    // We reuse `unify` but enforce one-way matching by walking manually: bind variables
    // from pattern only.
    const sigma = new Map();
    if (!matchInto(pattern, subject, sigma))
        return null;
    return sigma;
}
function matchInto(p, s, sigma) {
    if (p.kind === 'var') {
        const existing = sigma.get(p.name);
        if (existing !== undefined)
            return (0, term_utils_1.termsEqual)(existing, s);
        sigma.set(p.name, (0, term_utils_1.cloneTerm)(s));
        return true;
    }
    if (p.kind === 'const') {
        return s.kind === 'const' && p.name === s.name;
    }
    // p is func
    if (s.kind !== 'func')
        return false;
    if (p.name !== s.name)
        return false;
    const pa = p.args ?? [];
    const sa = s.args ?? [];
    if (pa.length !== sa.length)
        return false;
    for (let i = 0; i < pa.length; i++) {
        const pi = pa[i];
        const si = sa[i];
        if (pi === undefined || si === undefined)
            return false;
        if (!matchInto(pi, si, sigma))
            return false;
    }
    return true;
}
/**
 * Equality factoring: given a clause containing two positive equality literals
 *   x = y    and    x = z
 * with shared lhs, produce the factor   x = y ∨ y ≠ z   (which is logically valid
 * given the original and helps the saturation process). Returns every distinct factor.
 *
 * More generally, for two positive equalities (a=b) and (c=d) where a unifies with c
 * via σ, emits (a=b ∨ b≠d)·σ.
 */
function equalityFactor(clause) {
    const out = [];
    for (let i = 0; i < clause.length; i++) {
        const li = clause[i];
        if (li === undefined || li.negated || !(0, term_utils_1.isEqualityLiteral)(li))
            continue;
        const a = li.args[0];
        const b = li.args[1];
        if (a === undefined || b === undefined)
            continue;
        for (let j = i + 1; j < clause.length; j++) {
            const lj = clause[j];
            if (lj === undefined || lj.negated || !(0, term_utils_1.isEqualityLiteral)(lj))
                continue;
            const c = lj.args[0];
            const d = lj.args[1];
            if (c === undefined || d === undefined)
                continue;
            // Try both alignments (a~c) and (a~d) to cover the "shared lhs" case symmetrically.
            for (const [u, v] of [
                [c, d],
                [d, c],
            ]) {
                const sigma = new Map();
                const r = (0, unify_1.unify)(a, u, sigma);
                if (r === null)
                    continue;
                // Produce  (a = b ∨ b ≠ v)·σ along with the rest of the clause.
                const aSigma = (0, unify_1.applyTerm)(a, sigma);
                const bSigma = (0, unify_1.applyTerm)(b, sigma);
                const vSigma = (0, unify_1.applyTerm)(v, sigma);
                // Skip degenerate factors where b ≡ v under σ (would yield a tautology after refl).
                if ((0, term_utils_1.termsEqual)(bSigma, vSigma))
                    continue;
                const newClause = [];
                newClause.push({ negated: false, predicate: li.predicate, args: [aSigma, bSigma] });
                newClause.push({ negated: true, predicate: li.predicate, args: [bSigma, vSigma] });
                for (let k = 0; k < clause.length; k++) {
                    if (k === i || k === j)
                        continue;
                    const lk = clause[k];
                    if (lk === undefined)
                        continue;
                    newClause.push(applyLitLocal(lk, sigma));
                }
                out.push(dedup(newClause));
            }
        }
    }
    return out;
}
function applyLitLocal(lit, sigma) {
    return {
        negated: lit.negated,
        predicate: lit.predicate,
        args: lit.args.map((a) => (0, unify_1.applyTerm)(a, sigma)),
    };
}
function dedup(c) {
    const seen = new Set();
    const out = [];
    for (const lit of c) {
        const k = `${lit.negated ? '!' : ''}${lit.predicate}(${lit.args.map(term_utils_1.termKey).join(',')})`;
        if (seen.has(k))
            continue;
        seen.add(k);
        out.push(lit);
    }
    return out;
}
//# sourceMappingURL=demodulate.js.map