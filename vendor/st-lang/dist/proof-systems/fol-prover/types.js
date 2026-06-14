"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkVar = mkVar;
exports.mkConst = mkConst;
exports.mkFunc = mkFunc;
exports.mkLit = mkLit;
exports.termToString = termToString;
exports.literalToString = literalToString;
exports.clauseToString = clauseToString;
/** Creates a variable term. */
function mkVar(name) {
    return { kind: 'var', name };
}
/** Creates a constant term. */
function mkConst(name) {
    return { kind: 'const', name };
}
/** Creates a function application term. */
function mkFunc(name, args) {
    return { kind: 'func', name, args };
}
/** Creates a literal from its negation flag, predicate name, and argument terms. */
function mkLit(negated, predicate, args) {
    return { negated, predicate, args };
}
/** Renders a term as `name` (var/const) or `name(arg,...)` (func). */
function termToString(t) {
    if (t.kind === 'var' || t.kind === 'const')
        return t.name;
    const args = (t.args ?? []).map(termToString).join(',');
    return `${t.name}(${args})`;
}
/** Renders a literal as `P(args)` or `¬P(args)`. */
function literalToString(lit) {
    const args = lit.args.map(termToString).join(',');
    const head = `${lit.predicate}(${args})`;
    return lit.negated ? `¬${head}` : head;
}
/** Renders a clause as a disjunction of literals, or `⊥` for the empty clause. */
function clauseToString(c) {
    if (c.length === 0)
        return '⊥';
    return c.map(literalToString).join(' ∨ ');
}
//# sourceMappingURL=types.js.map