export declare function multiplyPolynomials(a: number[], b: number[]): number[];
/**
 * Evalúa los primeros `n+1` coeficientes (grado 0..n) de la serie de potencias
 * formal cuyos coeficientes están dados explícitamente por `coefficients`.
 * Si `coefficients` tiene menos términos, los completa con 0.
 */
export declare function generatingFunction(coefficients: number[], n: number): number[];
/**
 * Devuelve los coeficientes de (1+x)^n (binomiales). Útil como GF estándar.
 */
export declare function binomialGF(n: number): number[];
//# sourceMappingURL=generating-functions.d.ts.map