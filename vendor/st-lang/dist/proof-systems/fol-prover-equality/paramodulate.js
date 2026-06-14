"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneClause = exports.termsEqual = exports.termKey = exports.isEqualityLiteral = void 0;
exports.paramodulate = paramodulate;
exports.paramodulateWithSubst = paramodulateWithSubst;
exports.paramodulateAll = paramodulateAll;
exports.reflexivityResolve = reflexivityResolve;
const unify_1 = require("../fol-prover/unify");
const term_utils_1 = require("./term-utils");
Object.defineProperty(exports, "cloneClause", { enumerable: true, get: function () { return term_utils_1.cloneClause; } });
Object.defineProperty(exports, "isEqualityLiteral", { enumerable: true, get: function () { return term_utils_1.isEqualityLiteral; } });
Object.defineProperty(exports, "termKey", { enumerable: true, get: function () { return term_utils_1.termKey; } });
Object.defineProperty(exports, "termsEqual", { enumerable: true, get: function () { return term_utils_1.termsEqual; } });
/**
 * Paramodulation:
 *
 *   from C ∨ (s = t)         (eqClause, eq_idx points to the s=t literal)
 *   and  D[u]                (target clause, target_idx points to literal containing u,
 *                            target_pos points inside that literal's args)
 *   if unify(s, u) = σ then  (C ∨ D[u → t])·σ
 *
 * The direction is fixed: args[0] = s (lhs), args[1] = t (rhs). To paramodulate
 * "in the other direction" callers should retry with the equation flipped (see
 * `paramodulateAll` for the symmetric enumeration).
 *
 * Returns null when the literals can't paramodulate (wrong kind, unification fails, etc.).
 */
function paramodulate(c1Raw, eq_idx, c2Raw, target_idx, target_pos) {
    const out = paramodulateWithSubst(c1Raw, eq_idx, c2Raw, target_idx, target_pos);
    return out ? out.resolvent : null;
}
function paramodulateWithSubst(c1Raw, eq_idx, c2Raw, target_idx, target_pos) {
    // Standardize variables apart between the two parents.
    const c1 = (0, term_utils_1.freshenClause)(c1Raw);
    const c2 = (0, term_utils_1.freshenClause)(c2Raw);
    const eqLit = c1[eq_idx];
    if (eqLit === undefined)
        return null;
    if (!(0, term_utils_1.isEqualityLiteral)(eqLit))
        return null;
    if (eqLit.negated)
        return null;
    const s = eqLit.args[0];
    const t = eqLit.args[1];
    if (s === undefined || t === undefined)
        return null;
    const target = c2[target_idx];
    if (target === undefined)
        return null;
    const u = (0, term_utils_1.getLiteralSubterm)(target, target_pos);
    if (u === null)
        return null;
    // Don't try to paramodulate into a bare variable subterm — that produces
    // an explosion of useless rewrites equivalent to factoring.
    if (u.kind === 'var')
        return null;
    const sigma = new Map();
    const unified = (0, unify_1.unify)(s, u, sigma);
    if (unified === null)
        return null;
    // Build C·σ (rest of clause 1 minus the equation literal)
    const rest1 = c1.filter((_, k) => k !== eq_idx).map((lit) => (0, unify_1.applyLiteral)(lit, sigma));
    // Build the rewritten target: replace u with t at target_pos, then apply σ.
    const rewritten = (0, term_utils_1.replaceLiteralSubterm)(target, target_pos, (0, unify_1.applyTerm)(t, sigma));
    const rewrittenSigma = (0, unify_1.applyLiteral)(rewritten, sigma);
    const rest2 = c2.filter((_, k) => k !== target_idx).map((lit) => (0, unify_1.applyLiteral)(lit, sigma));
    const merged = factor([...rest1, rewrittenSigma, ...rest2]);
    return { resolvent: merged, substitution: sigma };
}
function paramodulateAll(idxA, cA, idxB, cB) {
    const out = [];
    collectParamods(idxA, cA, idxB, cB, false, out);
    if (idxA !== idxB)
        collectParamods(idxB, cB, idxA, cA, false, out);
    return out;
}
function collectParamods(idxEq, cEq, idxTgt, cTgt, _unusedFlip, out) {
    for (let i = 0; i < cEq.length; i++) {
        const lit = cEq[i];
        if (lit === undefined)
            continue;
        if (!(0, term_utils_1.isEqualityLiteral)(lit) || lit.negated)
            continue;
        const lhs = lit.args[0];
        const rhs = lit.args[1];
        if (lhs === undefined || rhs === undefined)
            continue;
        for (const flip of [false, true]) {
            // Build a virtual clause where, when flip=true, the equation is t = s instead of s = t.
            const directedEq = flip
                ? cEq.map((l, k) => k === i
                    ? {
                        negated: l.negated,
                        predicate: l.predicate,
                        args: [(0, term_utils_1.cloneTerm)(rhs), (0, term_utils_1.cloneTerm)(lhs)],
                    }
                    : l)
                : cEq;
            for (let j = 0; j < cTgt.length; j++) {
                const tgtLit = cTgt[j];
                if (tgtLit === undefined)
                    continue;
                for (const pos of (0, term_utils_1.allLiteralPositions)(tgtLit)) {
                    const result = paramodulateWithSubst(directedEq, i, cTgt, j, pos);
                    if (result === null)
                        continue;
                    out.push({
                        fromEqClause: idxEq,
                        fromTargetClause: idxTgt,
                        eqIdx: i,
                        targetIdx: j,
                        targetPos: pos,
                        flipped: flip,
                        resolvent: result.resolvent,
                        substitution: result.substitution,
                    });
                }
            }
        }
    }
}
function factor(c) {
    const seen = new Set();
    const out = [];
    for (const lit of c) {
        const k = (0, term_utils_1.literalKey)(lit);
        if (seen.has(k))
            continue;
        seen.add(k);
        out.push(lit);
    }
    return out;
}
/**
 * Reflexivity resolution: drop a literal of the form ¬(t = t) from a clause.
 * Useful both during search and for proving reflexive goals.
 */
function reflexivityResolve(c) {
    for (let i = 0; i < c.length; i++) {
        const lit = c[i];
        if (lit === undefined)
            continue;
        if (!(0, term_utils_1.isEqualityLiteral)(lit))
            continue;
        if (!lit.negated)
            continue;
        const a = lit.args[0];
        const b = lit.args[1];
        if (a === undefined || b === undefined)
            continue;
        const sigma = new Map();
        const u = (0, unify_1.unify)(a, b, sigma);
        if (u === null)
            continue;
        return (0, unify_1.applyClause)(c.filter((_, k) => k !== i), sigma);
    }
    return null;
}
//# sourceMappingURL=paramodulate.js.map