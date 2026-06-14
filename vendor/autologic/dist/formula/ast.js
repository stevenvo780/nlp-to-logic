"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
// Helper Factories
exports.AST = {
    atom(id, text) {
        return { type: 'Atom', id, text };
    },
    and(left, right) {
        return { type: 'Connective', operator: 'AND', left, right };
    },
    or(left, right) {
        return { type: 'Connective', operator: 'OR', left, right };
    },
    implies(left, right) {
        return { type: 'Connective', operator: 'IMPLIES', left, right };
    },
    not(child) {
        return { type: 'Connective', operator: 'NOT', left: child };
    },
    forall(variables, child) {
        return { type: 'Quantifier', operator: 'FORALL', variables, child };
    },
    exists(variables, child) {
        return { type: 'Quantifier', operator: 'EXISTS', variables, child };
    },
    exactlyN(variables, count, child) {
        return { type: 'Quantifier', operator: 'EXACTLY_N', variables, exactCount: count, child };
    },
    modal(operator, child, agent) {
        return { type: 'Modal', operator, agent, child };
    },
    temporalUntil(left, right) {
        return { type: 'TemporalBinary', operator: 'UNTIL', left, right };
    },
    predicate(name, args) {
        return { type: 'Predicate', name, args };
    },
    obj(name) {
        return { type: 'Object', name };
    },
    math(operator, left, right) {
        return { type: 'Math', operator, left, right };
    },
    probability(value, child) {
        return { type: 'Probability', value, child };
    },
    ref(targetId) {
        return { type: 'Ref', targetId };
    }
};
//# sourceMappingURL=ast.js.map