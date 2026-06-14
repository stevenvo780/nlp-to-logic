"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqualityLiteral = isEqualityLiteral;
exports.termKey = termKey;
exports.literalKey = literalKey;
exports.clauseKey = clauseKey;
exports.termsEqual = termsEqual;
exports.cloneTerm = cloneTerm;
exports.cloneLiteral = cloneLiteral;
exports.cloneClause = cloneClause;
exports.termSize = termSize;
exports.collectVars = collectVars;
exports.termVars = termVars;
exports.termAt = termAt;
exports.replaceAt = replaceAt;
exports.allPositions = allPositions;
exports.allLiteralPositions = allLiteralPositions;
exports.getLiteralSubterm = getLiteralSubterm;
exports.replaceLiteralSubterm = replaceLiteralSubterm;
exports.compareTerms = compareTerms;
exports.freshenClause = freshenClause;
exports.substToRecordTerm = substToRecordTerm;
const types_1 = require("./types");
/** Returns `true` when `lit` is an equality literal (predicate `=` with exactly 2 args). */
function isEqualityLiteral(lit) {
    return lit.predicate === types_1.EQ_PREDICATE && lit.args.length === 2;
}
/**
 * Produces a canonical string key for a term, suitable for equality checks and
 * set membership. Variables are prefixed with `?`, constants with `#`,
 * functions use `name(arg,arg,...)`.
 */
function termKey(t) {
    if (t.kind === 'var')
        return `?${t.name}`;
    if (t.kind === 'const')
        return `#${t.name}`;
    return `${t.name}(${(t.args ?? []).map(termKey).join(',')})`;
}
/**
 * Produces a canonical string key for a literal.
 * Negated literals are prefixed with `!`.
 */
function literalKey(lit) {
    const args = lit.args.map(termKey).join(',');
    return `${lit.negated ? '!' : ''}${lit.predicate}(${args})`;
}
/**
 * Produces a canonical string key for a clause by sorting its literal keys.
 * Suitable for deduplication of resolved clauses.
 */
function clauseKey(c) {
    return c.map(literalKey).sort().join('|');
}
/** Returns `true` when two terms are structurally equal (via their canonical keys). */
function termsEqual(a, b) {
    return termKey(a) === termKey(b);
}
/** Returns a deep copy of a term. */
function cloneTerm(t) {
    if (t.kind === 'var')
        return { kind: 'var', name: t.name };
    if (t.kind === 'const')
        return { kind: 'const', name: t.name };
    return { kind: 'func', name: t.name, args: (t.args ?? []).map(cloneTerm) };
}
/** Returns a deep copy of a literal, cloning all argument terms. */
function cloneLiteral(lit) {
    return {
        negated: lit.negated,
        predicate: lit.predicate,
        args: lit.args.map(cloneTerm),
    };
}
/** Returns a deep copy of a clause (array of literals). */
function cloneClause(c) {
    return c.map(cloneLiteral);
}
/**
 * Counts the number of nodes in the term tree (variables and constants count as 1,
 * function nodes add 1 plus the size of each argument).
 */
function termSize(t) {
    if (t.kind === 'var')
        return 1;
    if (t.kind === 'const')
        return 1;
    let n = 1;
    for (const a of t.args ?? [])
        n += termSize(a);
    return n;
}
/**
 * Accumulates all variable names reachable from `t` into `out`.
 * @param t - The term to inspect.
 * @param out - Set that receives variable names (mutated in place).
 */
function collectVars(t, out) {
    if (t.kind === 'var') {
        out.add(t.name);
        return;
    }
    if (t.kind === 'const')
        return;
    for (const a of t.args ?? [])
        collectVars(a, out);
}
/** Returns the set of variable names that appear anywhere in `t`. */
function termVars(t) {
    const out = new Set();
    collectVars(t, out);
    return out;
}
/**
 * Returns the subterm of `t` at the given position. Position [] returns t itself;
 * position [i, j, ...] descends into args[i], then args[j], etc.
 */
function termAt(t, pos) {
    let cur = t;
    for (const idx of pos) {
        if (cur.kind === 'var' || cur.kind === 'const')
            return null;
        const args = cur.args ?? [];
        if (idx < 0 || idx >= args.length)
            return null;
        const nxt = args[idx];
        if (nxt === undefined)
            return null;
        cur = nxt;
    }
    return cur;
}
/**
 * Returns a new term equal to `t` but with the subterm at `pos` replaced by `replacement`.
 * If pos is invalid returns `t` unchanged.
 */
function replaceAt(t, pos, replacement) {
    if (pos.length === 0)
        return cloneTerm(replacement);
    if (t.kind === 'var' || t.kind === 'const')
        return cloneTerm(t);
    const [head, ...rest] = pos;
    if (head === undefined)
        return cloneTerm(t);
    const args = (t.args ?? []).slice();
    const child = args[head];
    if (child === undefined)
        return cloneTerm(t);
    args[head] = replaceAt(child, rest, replacement);
    return { kind: 'func', name: t.name, args };
}
/**
 * Enumerate every (non-empty) position inside the term tree, including the root.
 * Variables and constants only yield their own position; functions also yield children.
 */
function allPositions(t) {
    const out = [[]];
    if (t.kind === 'func') {
        const args = t.args ?? [];
        for (let i = 0; i < args.length; i++) {
            const child = args[i];
            if (child === undefined)
                continue;
            for (const p of allPositions(child)) {
                out.push([i, ...p]);
            }
        }
    }
    return out;
}
/**
 * Enumerate positions for a literal as (argIndex, ...termPath). Useful for paramodulation
 * targets that point inside a literal's args.
 */
function allLiteralPositions(lit) {
    const out = [];
    for (let i = 0; i < lit.args.length; i++) {
        const a = lit.args[i];
        if (a === undefined)
            continue;
        for (const p of allPositions(a)) {
            out.push([i, ...p]);
        }
    }
    return out;
}
/**
 * Returns the subterm of `lit` addressed by `pos`, where `pos[0]` selects the
 * argument index and the remaining path descends into that term.
 * Returns `null` if the position is out of range or empty.
 */
function getLiteralSubterm(lit, pos) {
    if (pos.length === 0)
        return null;
    const [head, ...rest] = pos;
    if (head === undefined)
        return null;
    const arg = lit.args[head];
    if (arg === undefined)
        return null;
    return termAt(arg, rest);
}
/**
 * Returns a new literal with the subterm at `pos` replaced by `replacement`.
 * `pos[0]` selects the argument; remaining path is forwarded to `replaceAt`.
 * Returns a clone of `lit` unchanged if `pos` is empty or invalid.
 */
function replaceLiteralSubterm(lit, pos, replacement) {
    if (pos.length === 0)
        return cloneLiteral(lit);
    const [head, ...rest] = pos;
    if (head === undefined)
        return cloneLiteral(lit);
    const args = lit.args.slice();
    const target = args[head];
    if (target === undefined)
        return cloneLiteral(lit);
    args[head] = replaceAt(target, rest, replacement);
    return { negated: lit.negated, predicate: lit.predicate, args };
}
/**
 * Lexicographic path ordering–ish comparison used for orienting equations and
 * for selecting which side rewrites the other in demodulation. Strictly compares
 * (size, then key) so that the "bigger" term is rewritten into the "smaller" one.
 */
function compareTerms(a, b) {
    const sa = termSize(a);
    const sb = termSize(b);
    if (sa !== sb)
        return sa - sb;
    const ka = termKey(a);
    const kb = termKey(b);
    if (ka < kb)
        return -1;
    if (ka > kb)
        return 1;
    return 0;
}
let GLOBAL_RENAME = 0;
/**
 * Returns a copy of `c` with every variable renamed to a globally unique name,
 * preventing variable-capture during paramodulation/resolution with other clauses.
 */
function freshenClause(c) {
    const suffix = `_eq${GLOBAL_RENAME++}`;
    const seen = new Map();
    const rename = (t) => {
        if (t.kind === 'var') {
            let nn = seen.get(t.name);
            if (nn === undefined) {
                nn = `${t.name}${suffix}`;
                seen.set(t.name, nn);
            }
            return { kind: 'var', name: nn };
        }
        if (t.kind === 'const')
            return { kind: 'const', name: t.name };
        return { kind: 'func', name: t.name, args: (t.args ?? []).map(rename) };
    };
    return c.map((lit) => ({
        negated: lit.negated,
        predicate: lit.predicate,
        args: lit.args.map(rename),
    }));
}
/**
 * Converts a substitution Map to a plain Record, deep-cloning each term.
 * Useful for serialization and interop with result types that expect plain objects.
 */
function substToRecordTerm(s) {
    const out = {};
    for (const [k, v] of s.entries())
        out[k] = cloneTerm(v);
    return out;
}
//# sourceMappingURL=term-utils.js.map