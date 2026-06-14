export interface DPMechanism<T> {
    epsilon: number;
    delta: number;
    sensitivity: number;
    apply(input: T): T | number;
}
export interface DPRng {
    uniform(): number;
    laplace(b: number): number;
    gaussian(mu: number, sigma: number): number;
}
export declare function makeDPRng(seed?: number): DPRng;
/**
 * Mecanismo de Laplace: agrega ruido Laplace(0, Δ/ε) a `value`.
 * Da ε-DP puro (δ = 0) cuando Δ es la sensibilidad L1 de la query.
 */
export declare function laplaceNoise(value: number, sensitivity: number, epsilon: number, rng?: DPRng): number;
/**
 * Mecanismo Gaussian: agrega N(0, σ²) con σ = Δ·√(2 ln(1.25/δ))/ε,
 * la calibración estándar de Dwork-Roth (Algorithmic Foundations,
 * Theorem A.1). Garantiza (ε,δ)-DP para ε ∈ (0, 1] cuando Δ es la
 * sensibilidad L2. Para ε > 1 la cota sigue siendo válida pero deja
 * de ser tight; los frameworks modernos prefieren la "analytic
 * Gaussian" (Balle-Wang 2018) — la dejamos para una iteración futura.
 */
export declare function gaussianNoise(value: number, sensitivity: number, epsilon: number, delta: number, rng?: DPRng): number;
/**
 * Mecanismo exponencial: elige un item con probabilidad proporcional
 * a exp(ε · score(item) / (2 · sensitivity)). Implementa la
 * formulación canónica (McSherry-Talwar 2007). Da ε-DP cuando
 * `sensitivity` es la sensibilidad de la función de score.
 */
export declare function exponentialMechanism<T>(items: T[], score: (item: T) => number, sensitivity: number, epsilon: number, rng?: DPRng): T;
/**
 * Randomized response binario: reporta `bit` con probabilidad `p`,
 * y `¬bit` con probabilidad 1 − p. Garantiza ε-DP local con
 * ε = |ln(p / (1 − p))|. La elección clásica p = 3/4 da ε = ln 3.
 */
export declare function randomizedResponse(bit: boolean, p: number, rng?: DPRng): boolean;
/**
 * ε equivalente a un mecanismo de randomized response con
 * probabilidad de verdad `p`. Útil para test del trade-off.
 */
export declare function randomizedResponseEpsilon(p: number): number;
/**
 * Conteo DP: cuenta cuántos valores cumplen `predicate` y aplica
 * ruido Laplace con sensibilidad 1 (cambiar un registro mueve el
 * conteo en a lo más 1). El resultado se redondea al entero más
 * cercano y se clamp-a a ≥ 0 (un conteo nunca es negativo).
 */
export declare function dpCount<T>(values: T[], predicate: (v: T) => boolean, epsilon: number, rng?: DPRng): number;
/**
 * Media DP de valores acotados al rango [low, high]: clipea cada
 * valor al rango, calcula la media empírica y aplica Laplace con
 * sensibilidad (high − low) / n. Asumimos n público.
 */
export declare function dpMean(values: number[], range: [number, number], epsilon: number, rng?: DPRng): number;
/**
 * Histograma DP sobre `categories`: cuenta ocurrencias por categoría
 * y agrega ruido Laplace independiente a cada bin con sensibilidad 1.
 * Asumimos que cada registro pertenece a a lo más una categoría
 * (cambiar un registro mueve a lo más un bin en ±1). Si las
 * categorías son disjuntas y cubrentes, este es un caso clásico de
 * composición paralela: el ε total = ε.
 */
export declare function dpHistogram<T>(values: T[], categories: T[], epsilon: number, rng?: DPRng): Map<T, number>;
export interface PrivacyBudget {
    epsilon: number;
    delta: number;
}
/**
 * Composición básica (Dwork-McSherry-Nissim-Smith 2006, Theorem 3.16
 * en Algorithmic Foundations): la composición secuencial de k
 * mecanismos (ε_i, δ_i)-DP da (Σ ε_i, Σ δ_i)-DP. Cota uniforme y
 * conservadora.
 */
export declare function basicComposition(mechanisms: PrivacyBudget[]): PrivacyBudget;
/**
 * Composición avanzada (Dwork-Rothblum-Vadhan 2010, Theorem III.3):
 * para k mecanismos cada uno (ε, δ)-DP, el compuesto es
 *
 *   (√(2 k ln(1/δ')) · ε  +  k · ε · (e^ε − 1),  k δ + δ')-DP
 *
 * para cualquier δ' > 0. Cuando los ε_i son heterogéneos usamos el
 * máximo como cota uniforme (válida pero no óptima; el tight bound
 * heterogéneo requiere RDP/zCDP, fuera del alcance de este módulo).
 *
 * `deltaTotal` es el δ' adicional que el caller acepta pagar.
 * Devuelve el (ε,δ) total cubriendo el slack δ'.
 */
export declare function advancedComposition(mechanisms: PrivacyBudget[], deltaTotal: number): PrivacyBudget;
/**
 * Composición paralela: cuando k mecanismos actúan sobre particiones
 * disjuntas del dataset, el ε total es el máximo (no la suma), y el
 * δ total es el máximo (no la suma). Caso clásico: histograma con
 * categorías mutuamente excluyentes.
 */
export declare function parallelComposition(mechanisms: PrivacyBudget[]): PrivacyBudget;
/**
 * Sensibilidad global L1: el máximo de |f(D) − f(D')| sobre la
 * lista de pares neighbours suministrada. Implementación empírica
 * pensada para tests/diagnóstico — la sensibilidad real exige
 * razonar sobre todas las parejas válidas, no sólo las muestreadas.
 */
export declare function globalSensitivityL1(fn: (data: number[]) => number, neighbors: Array<[number[], number[]]>): number;
/**
 * Sensibilidad suave (Nissim-Raskhodnikova-Smith 2007):
 *
 *   S*_β(f, D) = max_k e^{−β·k} · LS^{(k)}(f, D)
 *
 * donde LS^{(k)} es la sensibilidad local a distancia k. Aproximamos
 * variando vecinos hasta `data.length` (cota superior de k). Para
 * datasets grandes, restringir el k máximo via la longitud del
 * propio dataset.
 *
 * Esta es una versión basada en mutaciones simples (cambiar un valor
 * por el mín o máx empírico) — suficiente para median/mean acotados
 * en tests, no un cálculo general.
 */
export declare function smoothSensitivity(fn: (data: number[]) => number, data: number[], beta: number): number;
//# sourceMappingURL=index.d.ts.map