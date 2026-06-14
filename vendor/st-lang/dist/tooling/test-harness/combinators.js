"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossProduct = crossProduct;
exports.parameterize = parameterize;
exports.filter = filter;
exports.filterByTags = filterByTags;
exports.tag = tag;
exports.makeSuite = makeSuite;
function caseTags(c) {
    return c.tags ?? [];
}
function hasAnyTag(c, wanted) {
    if (wanted.length === 0)
        return true;
    const tags = caseTags(c);
    for (const t of wanted) {
        if (tags.includes(t))
            return true;
    }
    return false;
}
function tagsMatchMode(a, b, mode) {
    if (mode === 'cartesian')
        return true;
    if (mode === 'union') {
        if (a.length === 0 && b.length === 0)
            return true;
        return true;
    }
    if (a.length === 0 || b.length === 0)
        return false;
    for (const t of a) {
        if (b.includes(t))
            return true;
    }
    return false;
}
function crossProduct(s1, s2, opts) {
    const mode = opts?.combine ?? 'cartesian';
    const filterTags = opts?.filterTags ?? [];
    const cases = [];
    for (const ca of s1.cases) {
        for (const cb of s2.cases) {
            if (!tagsMatchMode(caseTags(ca), caseTags(cb), mode))
                continue;
            const mergedTags = Array.from(new Set([...caseTags(ca), ...caseTags(cb)]));
            if (filterTags.length > 0) {
                let hit = false;
                for (const t of filterTags) {
                    if (mergedTags.includes(t)) {
                        hit = true;
                        break;
                    }
                }
                if (!hit)
                    continue;
            }
            cases.push({
                name: `${ca.name} × ${cb.name}`,
                input: { a: ca.input, b: cb.input },
                tags: mergedTags.length > 0 ? mergedTags : undefined,
            });
        }
    }
    return { name: `${s1.name} × ${s2.name}`, cases };
}
function parameterize(suite, params) {
    const cases = [];
    for (let i = 0; i < suite.cases.length; i += 1) {
        const c = suite.cases[i];
        if (!c)
            continue;
        for (let j = 0; j < params.length; j += 1) {
            const p = params[j];
            cases.push({
                name: `${c.name} [param=${formatParam(p)}]`,
                input: { input: c.input, param: p },
                tags: c.tags,
            });
        }
    }
    return { name: `${suite.name} ⊗ params`, cases };
}
function formatParam(p) {
    if (p === null)
        return 'null';
    if (p === undefined)
        return 'undefined';
    if (typeof p === 'string')
        return p;
    if (typeof p === 'number' || typeof p === 'boolean')
        return String(p);
    try {
        return JSON.stringify(p);
    }
    catch {
        return '[unserializable]';
    }
}
function filter(suite, pred) {
    return {
        name: suite.name,
        cases: suite.cases.filter(pred),
    };
}
function filterByTags(suite, tags) {
    return filter(suite, (c) => hasAnyTag(c, tags));
}
function tag(suite, tagFn) {
    return {
        name: suite.name,
        cases: suite.cases.map((c) => {
            const extra = tagFn(c);
            const merged = Array.from(new Set([...(c.tags ?? []), ...extra]));
            return { ...c, tags: merged.length > 0 ? merged : undefined };
        }),
    };
}
function makeSuite(name, cases) {
    return { name, cases };
}
//# sourceMappingURL=combinators.js.map