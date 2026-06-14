import { type PProgram } from './types';
/** Bernoulli simétrica: prior trivial sobre {true, false}. */
export declare function coinExample(): PProgram<boolean>;
/** Bernoulli con bias arbitrario p ∈ [0,1]. */
export declare function biasedCoinExample(p: number): PProgram<boolean>;
/** AND de dos monedas Bernoulli(0.5): P(true) = 0.25 esperado. */
export declare function twoCoinsExample(): PProgram<boolean>;
/**
 * Bayesian linear regression univariado:
 *   slope ~ Normal(0, 5)
 *   intercept ~ Normal(0, 5)
 *   yᵢ | slope, intercept ~ Normal(slope·xᵢ + intercept, 1)
 *
 * Devuelve la pareja (slope, intercept). Las observaciones se
 * codifican como factor(logPdf(...)) sobre el residuo — equivale
 * a una likelihood gaussiana, suitable para importance/MH.
 */
export declare function bayesianLinearRegression(xs: number[], ys: number[]): PProgram<{
    slope: number;
    intercept: number;
}>;
/**
 * Posterior sobre la media de una gaussiana con σ conocido.
 *   mu ~ Normal(0, 10)
 *   xᵢ | mu ~ Normal(mu, 1)
 *
 * Útil como caso de test analítico: el posterior verdadero es
 * Normal((Σxᵢ) / (n + 1/100), 1/√(n + 1/100)).
 */
export declare function gaussianMeanModel(data: number[]): PProgram<number>;
//# sourceMappingURL=examples.d.ts.map