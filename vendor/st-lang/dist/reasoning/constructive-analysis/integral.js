"use strict";
/**
 * Constructive Bishop integral on a compact interval.
 *
 * For uniformly continuous f on [a, b], the integral
 *   I = ∫_a^b f(x) dx
 * is computed as the limit of Riemann sums. The explicit modulus of
 * uniform continuity gives us the rate.
 *
 * Specifically: given a partition of mesh h, and any choice of sample
 * points, the Riemann sum S_h satisfies
 *   |S_h - I| <= (b - a) * sup{ |f(x) - f(y)| : |x - y| <= h }
 *
 * If we want |S_h - I| < 1/N, pick eps with eps * (b - a) < 1/N, i.e.
 * eps > N * (b - a). Then choose h < 1/omega_f(eps).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bishopIntegral = void 0;
const constructive_reals_1 = require("../constructive-reals");
/**
 * Bishop integral of `f` over `[from, to]`.
 *
 * `precision` is a positive integer N; the result is a rational `q` with
 *   |q - ∫_from^to f| < 1/N.
 *
 * Implementation: midpoint rule with mesh < 1/m where
 *   m = omega_f(ceil(N * length) + 1)
 *
 * which guarantees the bound above. We then wrap the rational in a CReal
 * for compositionality (the same precision N is exposed as 1/N error).
 */
const bishopIntegral = (f, from, to, precision) => {
    if (!Number.isInteger(precision) || precision <= 0) {
        throw new RangeError('[bishopIntegral] precision must be a positive integer');
    }
    const a = (0, constructive_reals_1.toNumber)(from);
    const b = (0, constructive_reals_1.toNumber)(to);
    if (a === b)
        return (0, constructive_reals_1.fromFloat)(0);
    const sign = b > a ? 1 : -1;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const length = hi - lo;
    // Need eps such that eps * length < 1/precision.
    // Use eps = ceil(precision * length) + 1 as positive integer threshold.
    const eps = Math.max(1, Math.ceil(precision * length) + 1);
    const m = f.modulus(eps);
    // Mesh: 1/(m+1). Number of subintervals: N := ceil(length * (m+1)) + 1.
    const N = Math.max(1, Math.ceil(length * (m + 1)) + 1);
    const h = length / N;
    let sum = 0;
    for (let i = 0; i < N; i++) {
        const xi = lo + (i + 0.5) * h; // midpoint
        sum += (0, constructive_reals_1.toNumber)(f.fn((0, constructive_reals_1.fromFloat)(xi)), Math.max(eps, 1_000));
    }
    return (0, constructive_reals_1.fromFloat)(sign * sum * h);
};
exports.bishopIntegral = bishopIntegral;
//# sourceMappingURL=integral.js.map