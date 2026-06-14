"use strict";
/**
 * Constructive Cauchy sequences with explicit modulus of convergence.
 *
 * In Bishop's school, a "Cauchy sequence" without a modulus is not enough
 * data to extract a limit constructively — one needs an explicit
 * `modulus(eps)` returning an index N(eps) such that
 *   for all m, n >= N(eps), |x_m - x_n| < eps.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cauchyFrom = exports.limit = exports.isCauchy = void 0;
const constructive_reals_1 = require("../constructive-reals");
/**
 * Sound (one-sided) check: returns true if the modulus genuinely
 * witnesses Cauchy-ness at precision `eps` for the first few terms.
 *
 * Constructively we cannot inspect "all m, n >= N" — we sample a window
 * and verify the bound holds. If the modulus is correct this will
 * return true; if it is a counterexample for some sampled pair, false.
 *
 * `sampleWindow` controls how many terms past N we inspect. Default 8
 * is enough to expose almost all wrong moduli.
 */
const isCauchy = (seq, epsPrecision, sampleWindow = 8) => {
    if (!Number.isInteger(epsPrecision) || epsPrecision <= 0) {
        throw new RangeError('[cauchy] epsPrecision must be a positive integer');
    }
    const N = seq.modulus(epsPrecision);
    if (!Number.isInteger(N) || N < 0)
        return false;
    for (let i = 0; i <= sampleWindow; i++) {
        for (let j = i + 1; j <= sampleWindow; j++) {
            const diff = (0, constructive_reals_1.abs)((0, constructive_reals_1.sub)(seq.approx(N + i), seq.approx(N + j)));
            // We want diff < 1/eps. Pick precision p such that
            // approxLT(diff, 1/eps, p) is sensitive enough. p = 4 * eps works.
            if (!(0, constructive_reals_1.approxLT)(diff, (0, constructive_reals_1.fromFloat)(1 / epsPrecision), 4 * epsPrecision)) {
                return false;
            }
        }
    }
    return true;
};
exports.isCauchy = isCauchy;
/**
 * Limit of a Cauchy sequence with modulus.
 *
 * `bits` (the CReal precision argument) is the number of binary fractional
 * bits required. We need |limit - approx| < 2^{-bits}.
 *
 * Strategy: find index N such that the N-th term x_N is within 2^{-(bits+1)}
 * of the true limit. By the triangle inequality, evaluating x_N at (bits+1)
 * binary bits gives a result within 2^{-bits} of the limit.
 *
 * The modulus(eps) guarantees |x_m - x_n| < 1/eps for m,n >= N(eps).
 * We need 1/eps <= 2^{-(bits+1)}, so eps >= 2^{bits+1}.
 */
const limit = (seq) => ({
    approx: (bits) => {
        if (!Number.isInteger(bits) || bits <= 0) {
            throw new RangeError('[cauchy.limit] precision must be a positive integer');
        }
        const eps = Math.pow(2, bits + 1);
        const N = seq.modulus(eps);
        return seq.approx(N).approx(bits + 1);
    },
});
exports.limit = limit;
/**
 * Convenience: builds a Cauchy seq from a generator + a known rate `1/f(eps)`.
 * `f(eps)` must return an integer N with |x_m - x_n| < 1/eps for m, n >= N.
 */
const cauchyFrom = (term, modulus) => ({
    approx: term,
    modulus,
});
exports.cauchyFrom = cauchyFrom;
//# sourceMappingURL=cauchy.js.map