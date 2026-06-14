/**
 * Constructive (uniform) continuity on a compact interval.
 *
 * Bishop's framework: a function f : [a, b] -> R is continuous iff it
 * comes with an explicit modulus of uniform continuity
 *   omega : Q_>0 -> Q_>0
 * such that |x - y| < omega(eps) implies |f(x) - f(y)| < eps,
 * for all x, y in [a, b].
 *
 * On a general (non-compact) domain, "pointwise" continuity is the wrong
 * notion constructively. We only model uniform continuity on intervals.
 *
 * Modulus convention: we use `modulus(epsPrecision) -> deltaPrecision`,
 * both positive integers, encoding `1/eps -> 1/delta`. So
 *   modulus(k) = m  means  |x - y| < 1/m  =>  |f(x) - f(y)| < 1/k.
 */
import { type CReal } from '../constructive-reals';
export interface ConstructiveContinuous {
    /** The function itself. */
    fn: (x: CReal) => CReal;
    /**
     * Modulus of uniform continuity.
     * Given `epsPrecision = k`, returns `deltaPrecision = m` with
     *   |x - y| < 1/m  =>  |f(x) - f(y)| < 1/k.
     */
    modulus: (epsPrecision: number) => number;
}
/**
 * Sound sampling-based check that the modulus is correct on `[a, b]`.
 *
 * Constructively, "for all x, y in [a, b]" is not decidable. Instead we
 * sample `samples` pairs of points at distance ~1/m within [a, b] and
 * verify the implication holds at each one. If the modulus is correct
 * this returns true; a wrong modulus gets exposed on any failing sample.
 */
export declare const isUniformlyContinuousOn: (f: ConstructiveContinuous, interval: readonly [CReal, CReal], epsPrecision?: number, samples?: number) => boolean;
/**
 * Composition of uniformly continuous functions.
 *
 * If g has modulus `omega_g` and f has modulus `omega_f`, then `f . g`
 * has modulus `omega_g . omega_f`:
 *   |x - y| < 1 / omega_g(omega_f(eps))
 *     => |g(x) - g(y)| < 1/omega_f(eps)
 *     => |f(g(x)) - f(g(y))| < 1/eps.
 */
export declare const composition: (f: ConstructiveContinuous, g: ConstructiveContinuous) => ConstructiveContinuous;
/**
 * Constant function. Modulus is trivial (any positive integer works).
 */
export declare const constant: (c: CReal) => ConstructiveContinuous;
/**
 * Identity. Lipschitz-1, modulus(eps) = eps.
 */
export declare const identity: () => ConstructiveContinuous;
/**
 * Lipschitz function from a JS callback with known Lipschitz constant L.
 * Useful for tests. Modulus(eps) = ceil(L * eps).
 *
 * The caller is responsible for the Lipschitz bound being correct.
 */
export declare const lipschitz: (fn: (x: CReal) => CReal, lipschitzConstant: number) => ConstructiveContinuous;
//# sourceMappingURL=continuity.d.ts.map