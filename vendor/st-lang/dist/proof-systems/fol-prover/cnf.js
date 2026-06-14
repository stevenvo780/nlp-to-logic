"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negate = negate;
exports.skolemize = skolemize;
exports.toCNF = toCNF;
const types_1 = require("./types");
function freshSkolem(ctx, universalVars) {
    const id = ctx.skolemCounter.n++;
    if (universalVars.length === 0) {
        return (0, types_1.mkConst)(`sk_c${id}`);
    }
    return (0, types_1.mkFunc)(`sk_f${id}`, universalVars.map((v) => (0, types_1.mkVar)(v)));
}
function freshVar(ctx, base) {
    return `${base}__${ctx.varCounter.n++}`;
}
function isQuantifierKind(k) {
    return k === 'forall' || k === 'exists';
}
function deepCloneFormula(f) {
    const copy = { kind: f.kind };
    if (f.name !== undefined)
        copy.name = f.name;
    if (f.variable !== undefined)
        copy.variable = f.variable;
    if (f.terms !== undefined)
        copy.terms = [...f.terms];
    if (f.params !== undefined)
        copy.params = [...f.params];
    if (f.value !== undefined)
        copy.value = f.value;
    if (f.args !== undefined)
        copy.args = f.args.map(deepCloneFormula);
    return copy;
}
function renameVar(f, oldName, newName) {
    if (f.kind === 'atom') {
        if (f.name === oldName)
            return { ...f, name: newName };
        return f;
    }
    if (f.kind === 'predicate') {
        const params = (f.params ?? f.terms ?? []).map((p) => (p === oldName ? newName : p));
        return { ...f, params, terms: params };
    }
    if (isQuantifierKind(f.kind)) {
        if (f.variable === oldName)
            return f;
        return {
            ...f,
            args: (f.args ?? []).map((a) => renameVar(a, oldName, newName)),
        };
    }
    return {
        ...f,
        args: (f.args ?? []).map((a) => renameVar(a, oldName, newName)),
    };
}
function negate(f) {
    return { kind: 'not', args: [f] };
}
function eliminateImpEq(f) {
    const args = (f.args ?? []).map(eliminateImpEq);
    if (f.kind === 'implies') {
        const a0 = args[0];
        const a1 = args[1];
        if (a0 === undefined || a1 === undefined)
            return f;
        return { kind: 'or', args: [{ kind: 'not', args: [a0] }, a1] };
    }
    if (f.kind === 'biconditional') {
        const a0 = args[0];
        const a1 = args[1];
        if (a0 === undefined || a1 === undefined)
            return f;
        return {
            kind: 'and',
            args: [
                { kind: 'or', args: [{ kind: 'not', args: [a0] }, a1] },
                { kind: 'or', args: [{ kind: 'not', args: [a1] }, a0] },
            ],
        };
    }
    return { ...f, args };
}
function pushNeg(f) {
    if (f.kind === 'not') {
        const inner = f.args?.[0];
        if (inner === undefined)
            return f;
        if (inner.kind === 'not') {
            const innerInner = inner.args?.[0];
            return innerInner !== undefined ? pushNeg(innerInner) : f;
        }
        if (inner.kind === 'and') {
            return {
                kind: 'or',
                args: (inner.args ?? []).map((a) => pushNeg({ kind: 'not', args: [a] })),
            };
        }
        if (inner.kind === 'or') {
            return {
                kind: 'and',
                args: (inner.args ?? []).map((a) => pushNeg({ kind: 'not', args: [a] })),
            };
        }
        if (inner.kind === 'forall') {
            const body = inner.args?.[0];
            if (body === undefined || inner.variable === undefined)
                return f;
            return {
                kind: 'exists',
                variable: inner.variable,
                args: [pushNeg({ kind: 'not', args: [body] })],
            };
        }
        if (inner.kind === 'exists') {
            const body = inner.args?.[0];
            if (body === undefined || inner.variable === undefined)
                return f;
            return {
                kind: 'forall',
                variable: inner.variable,
                args: [pushNeg({ kind: 'not', args: [body] })],
            };
        }
        return { kind: 'not', args: [inner] };
    }
    if (f.args === undefined)
        return f;
    return { ...f, args: f.args.map(pushNeg) };
}
function standardizeApart(f, ctx, seen) {
    if (!isQuantifierKind(f.kind)) {
        if (f.args === undefined)
            return f;
        return { ...f, args: f.args.map((a) => standardizeApart(a, ctx, seen)) };
    }
    const v = f.variable;
    if (v === undefined)
        return f;
    let useVar = v;
    if (seen.has(v)) {
        useVar = freshVar(ctx, v);
    }
    seen.add(useVar);
    const body = f.args?.[0];
    if (body === undefined)
        return f;
    const renamed = useVar === v ? body : renameVar(body, v, useVar);
    return { ...f, variable: useVar, args: [standardizeApart(renamed, ctx, seen)] };
}
function termToParamString(t) {
    if (t.kind === 'var' || t.kind === 'const')
        return t.name;
    const args = (t.args ?? []).map(termToParamString).join(',');
    return `${t.name}(${args})`;
}
function rewriteParamsWithSkolem(params, existentialMap) {
    return params.map((p) => {
        const t = existentialMap.get(p);
        if (t)
            return termToParamString(t);
        return p;
    });
}
function skolemizeRec(f, universals, existentialMap, ctx) {
    if (f.kind === 'forall') {
        const v = f.variable;
        const body = f.args?.[0];
        if (v === undefined || body === undefined)
            return f;
        return {
            kind: 'forall',
            variable: v,
            args: [skolemizeRec(body, [...universals, v], existentialMap, ctx)],
        };
    }
    if (f.kind === 'exists') {
        const v = f.variable;
        const body = f.args?.[0];
        if (v === undefined || body === undefined)
            return f;
        const sk = freshSkolem(ctx, universals);
        existentialMap.set(v, sk);
        return skolemizeRec(body, universals, existentialMap, ctx);
    }
    if (f.kind === 'predicate') {
        const params = f.params ?? f.terms ?? [];
        const rewritten = rewriteParamsWithSkolem(params, existentialMap);
        return { ...f, params: rewritten, terms: rewritten };
    }
    if (f.kind === 'atom') {
        if (f.name !== undefined) {
            const t = existentialMap.get(f.name);
            if (t)
                return { ...f, name: termToParamString(t) };
        }
        return f;
    }
    if (f.args === undefined)
        return f;
    return { ...f, args: f.args.map((a) => skolemizeRec(a, universals, existentialMap, ctx)) };
}
function dropUniversals(f) {
    if (f.kind === 'forall') {
        const body = f.args?.[0];
        if (body === undefined)
            return f;
        return dropUniversals(body);
    }
    if (f.args === undefined)
        return f;
    return { ...f, args: f.args.map(dropUniversals) };
}
function distOrOverAnd(f) {
    if (f.args === undefined)
        return f;
    const args = f.args.map(distOrOverAnd);
    if (f.kind !== 'or')
        return { ...f, args };
    let cur = null;
    for (const a of args) {
        if (cur === null) {
            cur = a;
            continue;
        }
        cur = distributePair(cur, a);
    }
    return cur ?? f;
}
function distributePair(a, b) {
    if (a.kind === 'and') {
        return {
            kind: 'and',
            args: (a.args ?? []).map((sub) => distributePair(sub, b)),
        };
    }
    if (b.kind === 'and') {
        return {
            kind: 'and',
            args: (b.args ?? []).map((sub) => distributePair(a, sub)),
        };
    }
    return { kind: 'or', args: [a, b] };
}
function flattenAnd(f) {
    if (f.kind === 'and')
        return (f.args ?? []).flatMap(flattenAnd);
    return [f];
}
function flattenOr(f) {
    if (f.kind === 'or')
        return (f.args ?? []).flatMap(flattenOr);
    return [f];
}
function isVariableName(name, universals, existentialMap) {
    if (existentialMap.has(name)) {
        const t = existentialMap.get(name);
        return t ?? null;
    }
    if (universals.has(name))
        return (0, types_1.mkVar)(name);
    return null;
}
function termFromName(name, universals, existentialMap) {
    const mapped = isVariableName(name, universals, existentialMap);
    if (mapped)
        return mapped;
    return (0, types_1.mkConst)(name);
}
function literalFromAtom(f, negated, universals, existentialMap) {
    if (f.kind === 'atom') {
        const name = f.name ?? '_';
        return { negated, predicate: name, args: [] };
    }
    if (f.kind === 'predicate') {
        const name = f.name ?? '_';
        const params = f.params ?? f.terms ?? [];
        const args = params.map((p) => termFromName(p, universals, existentialMap));
        return { negated, predicate: name, args };
    }
    if (f.kind === 'true') {
        return { negated, predicate: '__true__', args: [] };
    }
    if (f.kind === 'false') {
        return { negated, predicate: '__false__', args: [] };
    }
    return { negated, predicate: '__unknown__', args: [] };
}
function buildClauses(f, universals, existentialMap) {
    const conjuncts = flattenAnd(f);
    const out = [];
    for (const conj of conjuncts) {
        const disjuncts = flattenOr(conj);
        const lits = [];
        let skip = false;
        for (const d of disjuncts) {
            if (d.kind === 'not') {
                const inner = d.args?.[0];
                if (inner === undefined)
                    continue;
                if (inner.kind === 'true') {
                    skip = false;
                    continue;
                }
                if (inner.kind === 'false') {
                    skip = true;
                    break;
                }
                lits.push(literalFromAtom(inner, true, universals, existentialMap));
                continue;
            }
            if (d.kind === 'true') {
                skip = true;
                break;
            }
            if (d.kind === 'false') {
                continue;
            }
            lits.push(literalFromAtom(d, false, universals, existentialMap));
        }
        if (skip)
            continue;
        out.push(lits);
    }
    return out;
}
function collectUniversals(f, acc) {
    if (f.kind === 'forall' && f.variable !== undefined)
        acc.add(f.variable);
    for (const a of f.args ?? [])
        collectUniversals(a, acc);
}
function skolemize(formula) {
    const ctx = { skolemCounter: { n: 0 }, varCounter: { n: 0 } };
    let f = eliminateImpEq(deepCloneFormula(formula));
    f = pushNeg(f);
    f = standardizeApart(f, ctx, new Set());
    const map = new Map();
    f = skolemizeRec(f, [], map, ctx);
    return f;
}
function toCNF(formula) {
    const ctx = { skolemCounter: { n: 0 }, varCounter: { n: 0 } };
    let f = eliminateImpEq(deepCloneFormula(formula));
    f = pushNeg(f);
    f = standardizeApart(f, ctx, new Set());
    const existentialMap = new Map();
    f = skolemizeRec(f, [], existentialMap, ctx);
    const universals = new Set();
    collectUniversals(f, universals);
    f = dropUniversals(f);
    f = distOrOverAnd(f);
    return buildClauses(f, universals, existentialMap);
}
//# sourceMappingURL=cnf.js.map