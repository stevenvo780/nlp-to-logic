import type { BernoulliDist, CategoricalDist, DiscreteDist, Distribution, NormalDist, PoissonDist, UniformDist } from './types';
/**
 * Saca un valor de `dist` usando `rng` (uniforme [0,1)).
 *
 * Para `categorical` y `discrete`, normaliza las probs internamente
 * para tolerar entradas no exactamente sumadas a 1.
 *
 * Las firmas overloaded dan inferencia precisa por familia.
 */
export declare function sampleFrom(dist: BernoulliDist, rng: () => number): boolean;
export declare function sampleFrom(dist: UniformDist, rng: () => number): number;
export declare function sampleFrom(dist: NormalDist, rng: () => number): number;
export declare function sampleFrom(dist: PoissonDist, rng: () => number): number;
export declare function sampleFrom<T>(dist: CategoricalDist<T>, rng: () => number): T;
export declare function sampleFrom<T>(dist: DiscreteDist<T>, rng: () => number): T;
export declare function sampleFrom<T>(dist: Distribution<T>, rng: () => number): T;
/**
 * Log-densidad / log-masa de `value` bajo `dist`.
 *
 * Para distribuciones continuas (`uniform`, `normal`) es log-pdf;
 * para discretas (`bernoulli`, `poisson`, `categorical`, `discrete`)
 * es log-pmf. Valores fuera del soporte devuelven `-Infinity`.
 */
export declare function logPdf(dist: BernoulliDist, value: boolean): number;
export declare function logPdf(dist: UniformDist, value: number): number;
export declare function logPdf(dist: NormalDist, value: number): number;
export declare function logPdf(dist: PoissonDist, value: number): number;
export declare function logPdf<T>(dist: CategoricalDist<T>, value: T): number;
export declare function logPdf<T>(dist: DiscreteDist<T>, value: T): number;
export declare function logPdf<T>(dist: Distribution<T>, value: T): number;
/**
 * Enumera el soporte de una distribución discreta como pares
 * `[valor, probabilidad]`. Para distribuciones continuas o de
 * soporte infinito (poisson), lanza error: no se puede enumerar.
 *
 * Para `poisson` se podría truncar pero la enumeración exacta no
 * lo soporta — el usuario debe usar `categorical` con un soporte
 * acotado si quiere enumeración.
 */
export declare function enumerateSupport(dist: BernoulliDist): Array<[boolean, number]>;
export declare function enumerateSupport<T>(dist: CategoricalDist<T>): Array<[T, number]>;
export declare function enumerateSupport<T>(dist: DiscreteDist<T>): Array<[T, number]>;
export declare function enumerateSupport<T>(dist: Distribution<T>): Array<[T, number]>;
//# sourceMappingURL=distributions.d.ts.map