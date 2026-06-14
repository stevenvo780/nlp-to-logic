/**
 * Dense polynomial over Z or Z/pZ.
 * `coefficients[i]` is the coefficient of x^i (little-endian).
 * When `modulus` is defined, all coefficients are kept reduced mod p.
 */
export interface Polynomial {
    coefficients: bigint[];
    modulus?: bigint;
}
/**
 * Constructs a normalized {@link Polynomial} from a coefficient array.
 * `coefficients[0]` is the constant term; accepts `number[]` for convenience.
 * @param coefficients - Little-endian coefficient array (index = power of x).
 * @param modulus - Optional prime modulus p; all coefficients are reduced mod p.
 */
export declare function poly(coefficients: bigint[] | number[], modulus?: bigint): Polynomial;
/**
 * Returns the degree of `p`. Returns -1 for the zero polynomial (a finite
 * sentinel, since `number` cannot represent -∞ cleanly in strict TS).
 */
export declare function degree(p: Polynomial): number;
/** Returns the coefficient of the highest-degree term, or `0n` for the zero polynomial. */
export declare function leadingCoefficient(p: Polynomial): bigint;
/** Returns `true` when `p` is the zero polynomial (degree -1). */
export declare function isZero(p: Polynomial): boolean;
/** Returns `a + b`. Reduces coefficients mod p when both share a modulus. */
export declare function add(a: Polynomial, b: Polynomial): Polynomial;
/** Returns `a - b`. */
export declare function sub(a: Polynomial, b: Polynomial): Polynomial;
/** Returns `a * b` via schoolbook convolution, O(deg(a)·deg(b)). */
export declare function multiply(a: Polynomial, b: Polynomial): Polynomial;
/**
 * Euclidean division of `a` by `b`, returning `{ quotient, remainder }`.
 * Over Z/pZ the result is exact. Over Z, requires `b` to be monic (lead ±1)
 * or uses pseudo-division when the leading coefficient does not divide.
 * @throws When `b` is the zero polynomial.
 */
export declare function divmod(a: Polynomial, b: Polynomial): {
    quotient: Polynomial;
    remainder: Polynomial;
};
/**
 * Greatest common divisor of `a` and `b`.
 * Over Z/pZ uses Euclides in the field and returns a monic result.
 * Over Z uses subresultant PRS and returns the primitive part with positive leading coefficient.
 */
export declare function gcd(a: Polynomial, b: Polynomial): Polynomial;
/** Returns the formal derivative d/dx of `p`. Constant polynomials map to zero. */
export declare function derivative(p: Polynomial): Polynomial;
/**
 * Evaluates `p` at integer point `x` via Horner's rule.
 * When `p` has a modulus, the result is reduced mod p.
 */
export declare function evaluate(p: Polynomial, x: bigint): bigint;
/**
 * Returns the composition `a(b(x))` via Horner evaluation of `a` over `b`.
 * Both polynomials must share the same modulus (or both be over Z).
 */
export declare function compose(a: Polynomial, b: Polynomial): Polynomial;
/**
 * Returns all rational roots of `p ∈ Z[x]` as reduced fractions `{ num, den }`.
 * Uses the rational root theorem: roots have the form ±(divisors of a₀) / (divisors of aₙ).
 * @throws When `p` has a modulus (rational roots do not apply in Z/pZ).
 */
export declare function rationalRoots(p: Polynomial): Array<{
    num: bigint;
    den: bigint;
}>;
/**
 * Returns the square-free part of `p`: `p / gcd(p, p')`.
 * Over Z/pZ: divides out the gcd with the formal derivative.
 * Over Z: uses primitive-part arithmetic to avoid coefficient blow-up.
 */
export declare function squareFree(p: Polynomial): Polynomial;
/**
 * Factors `p ∈ Z[x]` into irreducible factors over Q.
 * Extracts integer content, linear factors via rational root theorem,
 * and returns the remaining primitive part as a single factor when no
 * further rational roots are found.
 * @throws When `p` has a modulus — use {@link factorInZp} instead.
 */
export declare function factor(p: Polynomial): Polynomial[];
/**
 * Tests whether `p` is irreducible over Q (when no modulus) or over Z/pZ (when modulus is set).
 * Over Q: degree ≤ 3 uses rational root test; degree ≥ 4 delegates to {@link factor}.
 * Over Z/pZ: delegates to {@link factorInZp} and checks for a single factor.
 * @param samples - Unused (kept for API compatibility).
 */
export declare function isIrreducible(p: Polynomial, samples?: number): boolean;
/**
 * Factors `p` in Z/pZ (the field with `prime` elements).
 * Uses root-finding for linear factors, then exhaustive search for
 * irreducible quadratic factors (lite Berlekamp for small p).
 * @param prime - A prime modulus > 1.
 * @throws When `prime` ≤ 1.
 */
export declare function factorInZp(p: Polynomial, prime: bigint): Polynomial[];
/**
 * Computes the resultant of `a` and `b` in Z[x] via the Sylvester matrix determinant.
 * Returns 0 when either polynomial is zero.
 * @throws When either polynomial has a modulus.
 */
export declare function resultant(a: Polynomial, b: Polynomial): bigint;
/**
 * Returns the discriminant of `p ∈ Z[x]`:
 * `disc(p) = (-1)^{n(n-1)/2} · res(p, p') / lead(p)`.
 * @throws When `p` has a modulus.
 */
export declare function discriminant(p: Polynomial): bigint;
//# sourceMappingURL=index.d.ts.map