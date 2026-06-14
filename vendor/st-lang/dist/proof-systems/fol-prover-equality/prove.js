"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveWithEquality = proveWithEquality;
exports.rewriteEqualityClause = rewriteEqualityClause;
const cnf_1 = require("../fol-prover/cnf");
const resolve_1 = require("../fol-prover/resolve");
const unify_1 = require("../fol-prover/unify");
const paramodulate_1 = require("./paramodulate");
const demodulate_1 = require("./demodulate");
const term_utils_1 = require("./term-utils");
const types_1 = require("./types");
const DEFAULT_TIMEOUT_MS = 3000;
const DEFAULT_MAX_STEPS = 5000;
/**
 * Translate the FOL Formula's `equals` kind to our internal equality predicate.
 * Currently the project's CNF pipeline does not natively know about `equals`; it
 * would turn an `equals(t1, t2)` formula into a predicate literal with two
 * parameters by name. To bring it into the equality prover we walk the Formula
 * tree and rewrite any `equals` node into a `predicate` with the special name
 * `__eq__` whose params are the term strings — but since the existing CNF only
 * supports name-based terms, we explicitly construct the FOLClause for the goal
 * and premises that contain equality.
 *
 * Strategy: parse premises and goal via the usual `toCNF`. After CNF, walk every
 * literal and rewrite predicates that look like equalities into the canonical
 * `__eq__(arg0, arg1)` form. The user-facing convention is: any literal of the
 * form `equals(a, b)` (either as a predicate named "equals", "=", or "eq") is
 * treated as an equality.
 */
const EQUALITY_ALIASES = new Set(['equals', '=', 'eq', '==']);
function rewriteEqualityLiteral(lit) {
    if (EQUALITY_ALIASES.has(lit.predicate) && lit.args.length === 2) {
        return { negated: lit.negated, predicate: types_1.EQ_PREDICATE, args: lit.args };
    }
    return lit;
}
function rewriteEqualityClause(c) {
    return c.map(rewriteEqualityLiteral);
}
function preprocessFormula(f) {
    if (f.kind === 'equals') {
        const params = (f.params ?? f.terms ?? []).slice();
        const newF = { kind: 'predicate', name: '=', params, terms: params };
        if (f.args !== undefined)
            newF.args = f.args.map(preprocessFormula);
        return newF;
    }
    if (f.args === undefined)
        return f;
    return { ...f, args: f.args.map(preprocessFormula) };
}
function reflexivityClauses() {
    // The axiom ∀x. x = x  →  CNF clause  __eq__(x, x)
    return [
        [
            {
                negated: false,
                predicate: types_1.EQ_PREDICATE,
                args: [
                    { kind: 'var', name: '__refl_x' },
                    { kind: 'var', name: '__refl_x' },
                ],
            },
        ],
    ];
}
function isTautology(c) {
    // Standard tautology: P and ¬P with identical args.
    for (let i = 0; i < c.length; i++) {
        for (let j = i + 1; j < c.length; j++) {
            const li = c[i];
            const lj = c[j];
            if (li === undefined || lj === undefined)
                continue;
            if (li.negated === lj.negated)
                continue;
            if (li.predicate !== lj.predicate)
                continue;
            if (li.args.length !== lj.args.length)
                continue;
            let same = true;
            for (let k = 0; k < li.args.length; k++) {
                const a = li.args[k];
                const b = lj.args[k];
                if (a === undefined || b === undefined) {
                    same = false;
                    break;
                }
                if (!(0, term_utils_1.termsEqual)(a, b)) {
                    same = false;
                    break;
                }
            }
            if (same)
                return true;
        }
    }
    // Reflexive tautology: positive __eq__(t, t).
    for (const lit of c) {
        if (!(0, term_utils_1.isEqualityLiteral)(lit) || lit.negated)
            continue;
        const a = lit.args[0];
        const b = lit.args[1];
        if (a === undefined || b === undefined)
            continue;
        if ((0, term_utils_1.termsEqual)(a, b))
            return true;
    }
    return false;
}
function reflexivityResolveStep(c) {
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
        const rest = c
            .filter((_, k) => k !== i)
            .map((l) => ({
            negated: l.negated,
            predicate: l.predicate,
            args: l.args.map((t) => (0, unify_1.applyTerm)(t, sigma)),
        }));
        return { clause: rest, sigma };
    }
    return null;
}
function proveWithEquality(premises, goal, opts = {}) {
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxSteps = opts.maxSteps ?? DEFAULT_MAX_STEPS;
    // Rewrite `equals` nodes so CNF treats them as binary predicates we can recognise.
    const preProcessedPremises = premises.map(preprocessFormula);
    const preGoal = preprocessFormula(goal);
    const rawPremiseClauses = preProcessedPremises.flatMap((p) => (0, cnf_1.toCNF)(p));
    const negatedGoal = { kind: 'not', args: [preGoal] };
    const rawNegGoalClauses = (0, cnf_1.toCNF)(negatedGoal);
    const premiseClauses = rawPremiseClauses.map(rewriteEqualityClause);
    const negGoalClauses = rawNegGoalClauses.map(rewriteEqualityClause);
    if (premiseClauses.some((c) => c.length === 0) || negGoalClauses.some((c) => c.length === 0)) {
        return { proven: true, steps: [] };
    }
    const all = [];
    const seen = new Set();
    const addClause = (c) => {
        if (isTautology(c))
            return { idx: -1, novel: false };
        const key = (0, term_utils_1.clauseKey)(c);
        const existingIdx = all.findIndex((existing) => (0, term_utils_1.clauseKey)(existing) === key);
        if (existingIdx >= 0)
            return { idx: existingIdx, novel: false };
        seen.add(key);
        all.push(c);
        return { idx: all.length - 1, novel: true };
    };
    // Seed: reflexivity axiom (used by paramodulation when a clause demands x = x).
    for (const c of reflexivityClauses())
        addClause(c);
    for (const c of premiseClauses)
        addClause(c);
    for (const c of negGoalClauses)
        addClause(c);
    const steps = [];
    const startedAt = Date.now();
    const finishSuccess = () => ({ proven: true, steps });
    // Saturation loop: classic given-clause-ish. For each new clause, try resolution
    // and paramodulation with every older clause; apply reflexivity resolution and
    // equality factoring inline.
    let cursor = 0;
    while (cursor < all.length) {
        if (Date.now() - startedAt > timeoutMs) {
            return { proven: false, steps, timeoutHit: true };
        }
        if (steps.length >= maxSteps) {
            return { proven: false, steps, reason: 'max-steps' };
        }
        const ci = all[cursor];
        if (ci === undefined) {
            cursor++;
            continue;
        }
        // Reflexivity resolution on the current clause itself.
        {
            const r = reflexivityResolveStep(ci);
            if (r !== null) {
                if (r.clause.length === 0) {
                    steps.push({
                        rule: 'reflex',
                        from: [cursor],
                        result: r.clause,
                        substitution: (0, term_utils_1.substToRecordTerm)(r.sigma),
                    });
                    return finishSuccess();
                }
                const { idx, novel } = addClause(r.clause);
                if (novel && idx >= 0) {
                    steps.push({
                        rule: 'reflex',
                        from: [cursor],
                        result: r.clause,
                        substitution: (0, term_utils_1.substToRecordTerm)(r.sigma),
                    });
                }
            }
        }
        // Equality factoring on the current clause.
        for (const factored of (0, demodulate_1.equalityFactor)(ci)) {
            const { idx, novel } = addClause(factored);
            if (novel && idx >= 0) {
                steps.push({
                    rule: 'factor',
                    from: [cursor],
                    result: factored,
                    substitution: {},
                });
                if (factored.length === 0)
                    return finishSuccess();
            }
            if (steps.length >= maxSteps)
                return { proven: false, steps, reason: 'max-steps' };
        }
        for (let j = 0; j <= cursor; j++) {
            if (Date.now() - startedAt > timeoutMs) {
                return { proven: false, steps, timeoutHit: true };
            }
            const cj = all[j];
            if (cj === undefined)
                continue;
            // --- Binary resolution
            const resolvents = (0, resolve_1.resolveWithRecord)({ c1Idx: cursor, c2Idx: j, c1: ci, c2: cj });
            for (const r of resolvents) {
                if (r.resolvent.length === 0) {
                    steps.push({
                        rule: 'resolve',
                        from: [cursor, j],
                        result: r.resolvent,
                        substitution: {},
                    });
                    return finishSuccess();
                }
                const { idx, novel } = addClause(r.resolvent);
                if (novel && idx >= 0) {
                    steps.push({
                        rule: 'resolve',
                        from: [cursor, j],
                        result: r.resolvent,
                        substitution: {},
                    });
                    if (steps.length >= maxSteps)
                        return { proven: false, steps, reason: 'max-steps' };
                }
            }
            // --- Paramodulation in both directions
            const paramods = (0, paramodulate_1.paramodulateAll)(cursor, ci, j, cj);
            for (const p of paramods) {
                if (p.resolvent.length === 0) {
                    steps.push({
                        rule: 'paramod',
                        from: [p.fromEqClause, p.fromTargetClause],
                        result: p.resolvent,
                        substitution: (0, term_utils_1.substToRecordTerm)(p.substitution),
                    });
                    return finishSuccess();
                }
                // Apply reflexivity resolution to the paramodulant before adding; this
                // catches the common pattern where paramod produces e.g. ¬(a = a) ∨ ...
                let toAdd = p.resolvent;
                const reflexed = reflexivityResolveStep(toAdd);
                if (reflexed !== null)
                    toAdd = reflexed.clause;
                if (toAdd.length === 0) {
                    steps.push({
                        rule: 'paramod',
                        from: [p.fromEqClause, p.fromTargetClause],
                        result: toAdd,
                        substitution: (0, term_utils_1.substToRecordTerm)(p.substitution),
                    });
                    return finishSuccess();
                }
                const { idx, novel } = addClause(toAdd);
                if (novel && idx >= 0) {
                    steps.push({
                        rule: 'paramod',
                        from: [p.fromEqClause, p.fromTargetClause],
                        result: toAdd,
                        substitution: (0, term_utils_1.substToRecordTerm)(p.substitution),
                    });
                    if (steps.length >= maxSteps)
                        return { proven: false, steps, reason: 'max-steps' };
                }
            }
        }
        cursor++;
    }
    return { proven: false, steps, reason: 'saturated' };
}
//# sourceMappingURL=prove.js.map