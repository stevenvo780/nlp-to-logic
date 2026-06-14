"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = resolve;
exports.resolveWithRecord = resolveWithRecord;
exports.runResolutionLoop = runResolutionLoop;
const unify_1 = require("./unify");
let GLOBAL_RENAME_COUNTER = 0;
function freshenClause(c) {
    const suffix = `_${GLOBAL_RENAME_COUNTER++}`;
    const seen = new Map();
    const renameTerm = (t) => {
        if (t.kind === 'var') {
            let nn = seen.get(t.name);
            if (nn === undefined) {
                nn = `${t.name}${suffix}`;
                seen.set(t.name, nn);
            }
            return { kind: 'var', name: nn };
        }
        if (t.kind === 'const')
            return t;
        return { kind: 'func', name: t.name, args: (t.args ?? []).map(renameTerm) };
    };
    return c.map((l) => ({
        negated: l.negated,
        predicate: l.predicate,
        args: l.args.map(renameTerm),
    }));
}
function resolve(c1Raw, c2Raw) {
    const c1 = freshenClause(c1Raw);
    const c2 = freshenClause(c2Raw);
    const out = [];
    for (let i = 0; i < c1.length; i++) {
        for (let j = 0; j < c2.length; j++) {
            const l1 = c1[i];
            const l2 = c2[j];
            if (l1 === undefined || l2 === undefined)
                continue;
            if (l1.negated === l2.negated)
                continue;
            if (l1.predicate !== l2.predicate)
                continue;
            if (l1.args.length !== l2.args.length)
                continue;
            const s = new Map();
            let ok = true;
            for (let k = 0; k < l1.args.length; k++) {
                const a = l1.args[k];
                const b = l2.args[k];
                if (a === undefined || b === undefined) {
                    ok = false;
                    break;
                }
                const r = (0, unify_1.unify)(a, b, s);
                if (r === null) {
                    ok = false;
                    break;
                }
            }
            if (!ok)
                continue;
            const rest1 = c1.filter((_, k) => k !== i).map((l) => (0, unify_1.applyLiteral)(l, s));
            const rest2 = c2.filter((_, k) => k !== j).map((l) => (0, unify_1.applyLiteral)(l, s));
            const merged = factor([...rest1, ...rest2]);
            out.push(merged);
        }
    }
    return out;
}
function factor(c) {
    const seen = new Set();
    const out = [];
    for (const lit of c) {
        const key = literalKey(lit);
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(lit);
    }
    return out;
}
function termKey(t) {
    if (t.kind === 'var')
        return `?${t.name}`;
    if (t.kind === 'const')
        return `#${t.name}`;
    return `${t.name}(${(t.args ?? []).map(termKey).join(',')})`;
}
function literalKey(lit) {
    const args = lit.args.map(termKey).join(',');
    return `${lit.negated ? '!' : ''}${lit.predicate}(${args})`;
}
function clauseKey(c) {
    return c.map(literalKey).sort().join('|');
}
function isTautology(c) {
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
                if (termKey(a) !== termKey(b)) {
                    same = false;
                    break;
                }
            }
            if (same)
                return true;
        }
    }
    return false;
}
function resolveWithRecord(input) {
    const c1 = freshenClause(input.c1);
    const c2 = freshenClause(input.c2);
    const out = [];
    for (let i = 0; i < c1.length; i++) {
        for (let j = 0; j < c2.length; j++) {
            const l1 = c1[i];
            const l2 = c2[j];
            if (l1 === undefined || l2 === undefined)
                continue;
            if (l1.negated === l2.negated)
                continue;
            if (l1.predicate !== l2.predicate)
                continue;
            if (l1.args.length !== l2.args.length)
                continue;
            const s = new Map();
            let ok = true;
            for (let k = 0; k < l1.args.length; k++) {
                const a = l1.args[k];
                const b = l2.args[k];
                if (a === undefined || b === undefined) {
                    ok = false;
                    break;
                }
                const r = (0, unify_1.unify)(a, b, s);
                if (r === null) {
                    ok = false;
                    break;
                }
            }
            if (!ok)
                continue;
            const rest1 = c1.filter((_, k) => k !== i).map((l) => (0, unify_1.applyLiteral)(l, s));
            const rest2 = c2.filter((_, k) => k !== j).map((l) => (0, unify_1.applyLiteral)(l, s));
            const merged = factor([...rest1, ...rest2]);
            out.push({
                from: [input.c1Idx, input.c2Idx],
                resolvent: merged,
                substitution: (0, unify_1.substToRecord)(s),
            });
        }
    }
    return out;
}
function runResolutionLoop(params) {
    const all = [];
    const seen = new Set();
    const addClause = (c) => {
        if (isTautology(c))
            return -1;
        const key = clauseKey(c);
        if (seen.has(key)) {
            return all.findIndex((existing) => clauseKey(existing) === key);
        }
        seen.add(key);
        all.push(c);
        return all.length - 1;
    };
    for (const p of params.premiseClauses)
        addClause(p);
    for (const g of params.negatedGoalClauses)
        addClause(g);
    const steps = [];
    const startedAt = Date.now();
    let cursor = 0;
    for (let step = 0; step < params.maxSteps; step++) {
        if (Date.now() - startedAt > params.timeoutMs) {
            return { proven: false, steps, timeoutHit: true };
        }
        if (cursor >= all.length) {
            return { proven: false, steps, timeoutHit: false, reason: 'saturated' };
        }
        const ci = all[cursor];
        if (ci === undefined) {
            cursor++;
            continue;
        }
        for (let j = 0; j < cursor; j++) {
            if (Date.now() - startedAt > params.timeoutMs) {
                return { proven: false, steps, timeoutHit: true };
            }
            const cj = all[j];
            if (cj === undefined)
                continue;
            const results = resolveWithRecord({ c1Idx: cursor, c2Idx: j, c1: ci, c2: cj });
            for (const r of results) {
                if (r.resolvent.length === 0) {
                    steps.push(r);
                    return { proven: true, steps, timeoutHit: false };
                }
                const before = all.length;
                const newIdx = addClause(r.resolvent);
                if (newIdx >= 0 && newIdx >= before) {
                    steps.push({ from: r.from, resolvent: r.resolvent, substitution: r.substitution });
                    if (steps.length >= params.maxSteps) {
                        return { proven: false, steps, timeoutHit: false, reason: 'max-steps' };
                    }
                }
            }
        }
        cursor++;
    }
    return { proven: false, steps, timeoutHit: false, reason: 'max-steps' };
}
//# sourceMappingURL=resolve.js.map