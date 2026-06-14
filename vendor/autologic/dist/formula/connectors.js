"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ST_OPERATORS = void 0;
exports.roleToOperator = roleToOperator;
exports.profileSupportsOperator = profileSupportsOperator;
/** Operadores ST por tipo de conexión */
exports.ST_OPERATORS = {
    implication: '->',
    biconditional: '<->',
    conjunction: '&',
    disjunction: '|',
    negation: '!',
    universal: 'forall',
    existential: 'exists',
    necessity: '[]',
    possibility: '<>',
    temporal_next: 'next',
    temporal_until: 'until',
    temporal_always: 'always',
    temporal_eventually: 'eventually',
};
/**
 * Obtiene el operador ST correspondiente a un rol de marcador.
 */
function roleToOperator(role) {
    switch (role) {
        case 'condition':
        case 'consequent':
        case 'conclusion':
            return exports.ST_OPERATORS.implication;
        case 'biconditional':
            return exports.ST_OPERATORS.biconditional;
        case 'and':
            return exports.ST_OPERATORS.conjunction;
        case 'or':
            return exports.ST_OPERATORS.disjunction;
        case 'negation':
            return exports.ST_OPERATORS.negation;
        case 'universal':
            return exports.ST_OPERATORS.universal;
        case 'existential':
            return exports.ST_OPERATORS.existential;
        case 'necessity':
            return exports.ST_OPERATORS.necessity;
        case 'possibility':
            return exports.ST_OPERATORS.possibility;
        case 'temporal':
        case 'temporal_next':
            return exports.ST_OPERATORS.temporal_next;
        case 'temporal_until':
            return exports.ST_OPERATORS.temporal_until;
        case 'temporal_always':
            return exports.ST_OPERATORS.temporal_always;
        case 'temporal_eventually':
            return exports.ST_OPERATORS.temporal_eventually;
        default:
            return null;
    }
}
/**
 * Verifica si un perfil soporta un operador dado.
 */
function profileSupportsOperator(profile, operator) {
    const propositional = ['->', '<->', '&', '|', '!'];
    const firstOrder = [...propositional, 'forall', 'exists'];
    const modal = [...propositional, '[]', '<>'];
    const temporal = [...propositional, 'next', 'until', 'always', 'eventually'];
    switch (profile) {
        case 'classical.propositional':
        case 'intuitionistic.propositional':
        case 'paraconsistent.belnap':
            return propositional.includes(operator);
        case 'classical.first_order':
            return firstOrder.includes(operator);
        case 'modal.k':
        case 'epistemic.s5':
        case 'deontic.standard':
            return modal.includes(operator);
        case 'temporal.ltl':
            return temporal.includes(operator);
        case 'aristotelian.syllogistic':
            return firstOrder.includes(operator);
        case 'arithmetic':
        case 'probabilistic.basic':
            return [...propositional, '<>', '[]', 'Pr'].includes(operator);
        default:
            return propositional.includes(operator);
    }
}
//# sourceMappingURL=connectors.js.map