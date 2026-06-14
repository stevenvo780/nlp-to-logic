"use strict";
// ============================================================
// Tableau Framework — Propositional prover factory
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPropositionalProver = createPropositionalProver;
const TableauProver_1 = require("./TableauProver");
// ── Helpers ──────────────────────────────────────────────────
function args(f) {
    return Array.isArray(f['args']) ? f['args'] : [];
}
function arg0(f) {
    const a = args(f);
    if (!a[0])
        throw new Error(`Expected at least one argument in ${f.kind}`);
    return a[0];
}
function arg1(f) {
    const a = args(f);
    if (!a[1])
        throw new Error(`Expected at least two arguments in ${f.kind}`);
    return a[1];
}
function signed(formula, s, label) {
    return { formula, signed: s, label };
}
// ── Standard signed-tableau rules ────────────────────────────
/**
 * T¬A → F A
 */
const ruleT_Not = {
    name: 'T-Not',
    match: (n) => n.signed === 'T' && n.formula.kind === 'not',
    apply: (n) => [[signed(arg0(n.formula), 'F', 'T-Not')]],
};
/**
 * F¬A → T A
 */
const ruleF_Not = {
    name: 'F-Not',
    match: (n) => n.signed === 'F' && n.formula.kind === 'not',
    apply: (n) => [[signed(arg0(n.formula), 'T', 'F-Not')]],
};
/**
 * T(A∧B) → T A, T B  (α-rule)
 */
const ruleT_And = {
    name: 'T-And',
    match: (n) => n.signed === 'T' && n.formula.kind === 'and',
    apply: (n) => [[signed(arg0(n.formula), 'T', 'T-And'), signed(arg1(n.formula), 'T', 'T-And')]],
};
/**
 * F(A∧B) → F A | F B  (β-rule)
 */
const ruleF_And = {
    name: 'F-And',
    match: (n) => n.signed === 'F' && n.formula.kind === 'and',
    apply: (n) => [[signed(arg0(n.formula), 'F', 'F-And')], [signed(arg1(n.formula), 'F', 'F-And')]],
};
/**
 * T(A∨B) → T A | T B  (β-rule)
 */
const ruleT_Or = {
    name: 'T-Or',
    match: (n) => n.signed === 'T' && n.formula.kind === 'or',
    apply: (n) => [[signed(arg0(n.formula), 'T', 'T-Or')], [signed(arg1(n.formula), 'T', 'T-Or')]],
};
/**
 * F(A∨B) → F A, F B  (α-rule)
 */
const ruleF_Or = {
    name: 'F-Or',
    match: (n) => n.signed === 'F' && n.formula.kind === 'or',
    apply: (n) => [[signed(arg0(n.formula), 'F', 'F-Or'), signed(arg1(n.formula), 'F', 'F-Or')]],
};
/**
 * T(A→B) → F A | T B  (β-rule)
 */
const ruleT_Implies = {
    name: 'T-Implies',
    match: (n) => n.signed === 'T' && n.formula.kind === 'implies',
    apply: (n) => [
        [signed(arg0(n.formula), 'F', 'T-Implies')],
        [signed(arg1(n.formula), 'T', 'T-Implies')],
    ],
};
/**
 * F(A→B) → T A, F B  (α-rule)
 */
const ruleF_Implies = {
    name: 'F-Implies',
    match: (n) => n.signed === 'F' && n.formula.kind === 'implies',
    apply: (n) => [
        [signed(arg0(n.formula), 'T', 'F-Implies'), signed(arg1(n.formula), 'F', 'F-Implies')],
    ],
};
// ── Standard closure condition ────────────────────────────────
/**
 * A branch closes when it contains both T A and F A for some formula A.
 */
function contradictionClosure(branch) {
    const tSet = new Set();
    const fSet = new Set();
    for (const n of branch.nodes) {
        const key = formulaKey(n.formula);
        if (n.signed === 'T')
            tSet.add(key);
        if (n.signed === 'F')
            fSet.add(key);
    }
    for (const k of tSet) {
        if (fSet.has(k))
            return `Contradiction: T ${k} and F ${k}`;
    }
    return null;
}
function formulaKey(f) {
    const a = args(f);
    if (a.length === 0) {
        const name = typeof f['name'] === 'string' ? f['name'] : '';
        return `${f.kind}(${name})`;
    }
    return `${f.kind}(${a.map(formulaKey).join(',')})`;
}
// ── Factory ───────────────────────────────────────────────────
function createPropositionalProver() {
    const prover = new TableauProver_1.TableauProver();
    for (const rule of [
        ruleT_Not,
        ruleF_Not,
        ruleT_And,
        ruleF_And,
        ruleT_Or,
        ruleF_Or,
        ruleT_Implies,
        ruleF_Implies,
    ]) {
        prover.registerRule(rule);
    }
    prover.registerClosureCondition(contradictionClosure);
    return prover;
}
//# sourceMappingURL=propositional.js.map