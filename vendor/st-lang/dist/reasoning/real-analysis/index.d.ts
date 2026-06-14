export type RealFn = (x: number) => number;
export interface LimitClaim {
    fn: RealFn;
    point: number;
    value: number;
}
export interface LimitVerification {
    holds: boolean;
    counterexample?: number;
    suggestedDelta?: number;
}
/**
 * Verifica numéricamente la afirmación
 *   ∀ε>0 ∃δ>0 ∀x (0 < |x-point| < δ → |fn(x)-value| < ε)
 * para el ε dado. Devuelve δ sugerido (o counterexample si falla
 * incluso con δ extremadamente pequeño).
 *
 * Estrategia: bisecta δ desde 1 hacia abajo, muestreando puntos en
 * (point-δ, point) ∪ (point, point+δ); si todos cumplen |f(x)-L|<ε,
 * δ es válido. Si no encontramos δ válido tras `maxIter` iteraciones,
 * el último x que falló se reporta como counterexample.
 */
export declare function verifyLimit(claim: LimitClaim, epsilon: number, deltaFinder?: (eps: number) => number): LimitVerification;
/**
 * Encuentra (o detecta divergencia/indeterminación de) lim_{x→point} fn(x)
 * por muestreo bilateral con refinamiento sucesivo.
 *
 * Devuelve:
 *   • número L si las dos colas convergen al mismo valor con tolerancia
 *   • 'diverges' si crece sin cota
 *   • 'unknown' si las colas no coinciden (límite no existe / discontinuidad de salto)
 */
export declare function findLimit(fn: RealFn, point: number, opts?: {
    tolerance?: number;
    samples?: number;
}): number | 'diverges' | 'unknown';
/**
 * fn es continua en `point` si lim_{x→point} fn(x) = fn(point) con tol `eps`.
 */
export declare function isContinuousAt(fn: RealFn, point: number, eps?: number): boolean;
/**
 * Verificación numérica de continuidad uniforme en [a,b]:
 *   ∀ε ∃δ ∀x,y∈[a,b] (|x-y|<δ → |f(x)-f(y)|<ε)
 * Estrategia: para cada δ candidato muestreamos pares (x_i, x_i+δ)
 * cubriendo el intervalo y verificamos que |f(x)-f(x+δ)| < eps en todos.
 */
export declare function isUniformlyContinuous(fn: RealFn, domain: [number, number], eps?: number): boolean;
/**
 * Detecta puntos de discontinuidad por muestreo + chequeo local.
 */
export declare function findDiscontinuities(fn: RealFn, domain: [number, number], samples?: number): number[];
export interface Derivative {
    value: number;
    method: 'forward' | 'backward' | 'central' | 'richardson';
}
export declare function derivative(fn: RealFn, x: number, opts?: {
    h?: number;
    method?: Derivative['method'];
}): Derivative;
/**
 * n-ésima derivada por diferencias finitas centrales iteradas (fórmula
 * con coeficientes binomiales con signo alternado).
 *
 *   f^(n)(x) ≈ (1/h^n) · Σ_{k=0..n} (-1)^k C(n,k) f(x + (n/2 - k)·h)
 */
export declare function nthDerivative(fn: RealFn, x: number, n: number, h?: number): number;
/**
 * Diferenciable en `point` si las derivadas laterales coinciden con tolerancia.
 */
export declare function isDifferentiableAt(fn: RealFn, point: number, eps?: number): boolean;
/**
 * Encuentra puntos críticos (f'(x) ≈ 0) por bisección en cambios de signo
 * de la derivada numérica.
 */
export declare function findCriticalPoints(fn: RealFn, domain: [number, number], samples?: number): number[];
export interface Integral {
    value: number;
    method: 'simpson' | 'trapezoidal' | 'romberg' | 'gaussian';
}
export declare function integrate(fn: RealFn, from: number, to: number, opts?: {
    method?: Integral['method'];
    subdivisions?: number;
}): Integral;
export interface SeriesConvergence {
    converges: boolean;
    sumApprox?: number;
    reason?: string;
}
/**
 * Test de la razón sobre coeficientes de una serie Σ a_n (no Σ a_n x^n):
 *   L = lim |a_{n+1}/a_n|
 *   L < 1 ⇒ converge ; L > 1 ⇒ diverge ; L = 1 ⇒ indeciso.
 */
export declare function ratioTest(coefficients: number[]): SeriesConvergence;
/**
 * Test de la raíz: L = lim sup |a_n|^{1/n}.
 */
export declare function rootTest(coefficients: number[]): SeriesConvergence;
export declare function partialSum(fn: (n: number) => number, terms: number): number;
export declare function sequenceLimit(seq: (n: number) => number, opts?: {
    maxTerms?: number;
    tolerance?: number;
}): {
    converges: boolean;
    limit?: number;
    rate?: 'linear' | 'quadratic' | 'unknown';
};
/**
 * Busca c ∈ (a,b) tal que f'(c) = (f(b)-f(a))/(b-a).
 * Si fn es continua en [a,b] y derivable en (a,b), por MVT existe.
 * Aquí asumimos eso y buscamos c por bisección sobre f'(x) - slope.
 */
export declare function meanValueTheorem(fn: RealFn, derivativeFn: RealFn, a: number, b: number, tolerance?: number): {
    holds: boolean;
    c?: number;
};
/**
 * Polinomio de Taylor de orden N de `fn` centrado en `center`, devuelto
 * como función. Las derivadas se calculan numéricamente con `nthDerivative`.
 */
export declare function taylorPolynomial(fn: RealFn, center: number, order: number): (x: number) => number;
/**
 * Cota grosera del resto de Lagrange: |R_n(x)| ≤ M·|x-c|^(n+1)/(n+1)!
 * con M estimado como sup |f^(n+1)| sobre un muestreo entre c y x.
 */
export declare function taylorRemainderBound(fn: RealFn, center: number, x: number, order: number): number;
//# sourceMappingURL=index.d.ts.map