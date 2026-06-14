/**
 * An element of GF(p^n) represented as a polynomial of degree < n
 * with coefficients in Z/p (little-endian: `coefficients[i]` = coef of x^i).
 */
export interface GFElement {
    coefficients: number[];
    prime: number;
    degree: number;
}
/**
 * A finite field GF(p^n) defined by a monic irreducible polynomial of degree n over Z/p.
 * Elements are polynomials mod `irreducible`; arithmetic is done in Z/p[x] / (irreducible).
 */
export interface GaloisField {
    prime: number;
    degree: number;
    order: number;
    irreducible: number[];
    primitiveElement?: GFElement;
}
/**
 * Finds the first monic irreducible polynomial of degree `n` over Z/p
 * by enumerating all monic polys and applying Rabin's irreducibility test.
 * @param p - A prime number.
 * @param n - Degree >= 1.
 * @returns Coefficient array (little-endian), or `null` if none found (should not happen for valid inputs).
 * @throws When `p` is not prime or `n` < 1.
 */
export declare function findIrreducibleOverZp(p: number, n: number): number[] | null;
/**
 * Constructs the finite field GF(p^n).
 * If `irreducible` is not provided, one is found automatically via {@link findIrreducibleOverZp}.
 * @param p - A prime number.
 * @param n - Extension degree >= 1. `n = 1` gives the prime field GF(p).
 * @param irreducible - Optional monic irreducible polynomial of degree `n` over Z/p.
 * @throws When `p` is not prime, `n` < 1, or the provided polynomial is reducible.
 */
export declare function makeGaloisField(p: number, n: number, irreducible?: number[]): GaloisField;
/** Returns the additive identity 0 of the field `F`. */
export declare function gfZero(F: GaloisField): GFElement;
/** Returns the multiplicative identity 1 of the field `F`. */
export declare function gfOne(F: GaloisField): GFElement;
/**
 * Constructs an element of `F` from a coefficient array, reducing each coefficient mod p
 * and padding/truncating to length `F.degree`.
 */
export declare function gfElement(F: GaloisField, coefficients: number[]): GFElement;
/** Returns `a + b` in `F`. */
export declare function gfAdd(F: GaloisField, a: GFElement, b: GFElement): GFElement;
/** Returns `a - b` in `F`. */
export declare function gfSub(F: GaloisField, a: GFElement, b: GFElement): GFElement;
/** Returns `a * b` in `F` (polynomial product reduced mod the irreducible). */
export declare function gfMul(F: GaloisField, a: GFElement, b: GFElement): GFElement;
/** Returns `true` when `a` and `b` represent the same field element (coefficient-wise). */
export declare function gfEq(a: GFElement, b: GFElement): boolean;
/**
 * Returns the multiplicative inverse of `a` in `F` via the extended Euclidean algorithm,
 * or `null` when `a` is the zero element.
 */
export declare function gfInverse(F: GaloisField, a: GFElement): GFElement | null;
/** Returns `a / b` in `F`, or `null` when `b` is zero (not invertible). */
export declare function gfDiv(F: GaloisField, a: GFElement, b: GFElement): GFElement | null;
/**
 * Returns `a^exp` in `F` via square-and-multiply.
 * Negative exponents compute the inverse first.
 * @throws When `exp` < 0 and `a` is the zero element.
 */
export declare function gfPow(F: GaloisField, a: GFElement, exp: bigint): GFElement;
/**
 * Returns the multiplicative order of `a` in `F`: the minimum k >= 1 such that `a^k = 1`.
 * The result always divides `F.order - 1` (by Lagrange's theorem).
 * @throws When `a` is the zero element.
 */
export declare function order(F: GaloisField, a: GFElement): number;
/**
 * Finds a primitive element (generator of the multiplicative group) of `F`
 * by iterating over non-zero elements and checking multiplicative order.
 * @throws When no generator is found (should not happen for well-formed `F`).
 */
export declare function findPrimitive(F: GaloisField): GFElement;
/**
 * Computes the discrete logarithm `k` such that `base^k = target` in `F`,
 * or `null` when no such `k` exists. Uses linear search — intended for small fields.
 */
export declare function discreteLog(F: GaloisField, base: GFElement, target: GFElement): number | null;
/**
 * Reed-Solomon-style encoding: evaluates the polynomial with coefficients `message`
 * at `n` points `{g^0, g^1, …, g^(n-1)}`, where `g` is a primitive element of `F`.
 * @param n - Number of evaluation points; must be <= `F.order - 1`.
 * @throws When `n` is out of range or `message` elements do not belong to `F`.
 */
export declare function rsEncode(F: GaloisField, message: GFElement[], n: number): GFElement[];
//# sourceMappingURL=index.d.ts.map