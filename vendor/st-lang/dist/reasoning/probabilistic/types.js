"use strict";
// ============================================================
// Probabilistic Programming — Types
// ============================================================
//
// Tipos de datos para un PPL minimal: distribuciones, programas
// probabilísticos, sampler y resumen de posterior.
Object.defineProperty(exports, "__esModule", { value: true });
exports.bernoulli = bernoulli;
exports.uniform = uniform;
exports.normal = normal;
exports.poisson = poisson;
exports.categorical = categorical;
exports.discrete = discrete;
/**
 * Helpers de construcción. Cada uno devuelve la `Distribution<T>`
 * adecuada con T inferido (boolean / number / genérico).
 */
function bernoulli(p) {
    return { kind: 'bernoulli', p };
}
function uniform(low, high) {
    return { kind: 'uniform', low, high };
}
function normal(mean, std) {
    return { kind: 'normal', mean, std };
}
function poisson(lambda) {
    return { kind: 'poisson', lambda };
}
function categorical(values, probs) {
    return { kind: 'categorical', values, probs };
}
function discrete(pmf) {
    return { kind: 'discrete', pmf };
}
//# sourceMappingURL=types.js.map