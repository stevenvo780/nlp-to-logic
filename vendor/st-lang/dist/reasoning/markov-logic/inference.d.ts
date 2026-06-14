import type { MLNTheory, MLNWorld } from './types';
/**
 * Log-score (no normalizado) de un mundo:
 *   logZW = Σ_i w_i · satisfied_i(world)
 *
 * Si la teoría tiene un hard constraint violado, devuelve
 * `-Infinity` (lo cual hace P(world)=0).
 */
export declare function weight(theory: MLNTheory, world: MLNWorld): number;
/**
 * Probabilidad de un mundo dada una aproximación de la partición Z.
 *
 * P(world) = exp(weight(world)) / partitionApprox
 *
 * `partitionApprox` debe estar en el mismo "espacio" (no log).
 * Si `weight(world) === -Infinity` devuelve 0.
 */
export declare function probability(theory: MLNTheory, world: MLNWorld, partitionApprox: number): number;
/**
 * Calcula la partición Z exactamente sumando sobre todos los mundos
 * posibles. SOLO viable para teorías pequeñas (≤ ~20 ground atoms).
 * Útil para tests.
 */
export declare function exactPartition(theory: MLNTheory): number;
/**
 * Marginales exactas P(atom = true) sobre todos los mundos.
 * Mismo costo exponencial que `exactPartition`. Sólo para tests.
 */
export declare function exactMarginals(theory: MLNTheory): Record<string, number>;
interface GibbsOptions {
    /** RNG opcional para reproducibilidad. */
    rng?: () => number;
    /** Mundo inicial; si no se pasa, se randomiza respetando `evidence`. */
    initial?: MLNWorld;
    /** Cuántos warmup steps descartar antes de empezar a coleccionar (default 0). */
    burnIn?: number;
    /** Recolectar 1 cada `thin` pasos (default 1). */
    thin?: number;
}
/**
 * Gibbs sampling sobre los ground atoms NO evidenciados.
 *
 * En cada paso elige un atom no fijo y resamplea su valor según
 * P(atom=true | resto). Para MLN, esa condicional es la sigmoide del
 * "delta" de log-score al flippear:
 *
 *   P(atom=true | ·) = σ( logScore(true) − logScore(false) )
 *
 * Devuelve una secuencia de `iterations` mundos coleccionados tras
 * `burnIn` pasos de calentamiento, con thinning opcional.
 */
export declare function gibbsSample(theory: MLNTheory, evidence: Partial<MLNWorld> | undefined, iterations: number, options?: GibbsOptions): MLNWorld[];
/**
 * Marginales aproximadas: corre Gibbs y promedia indicadores.
 */
export declare function gibbsMarginals(theory: MLNTheory, evidence: Partial<MLNWorld>, iterations: number, options?: GibbsOptions): Record<string, number>;
interface MapOptions {
    rng?: () => number;
    /** Pasos máximos (default 5000). */
    maxFlips?: number;
    /** Reinicios independientes (default 5). */
    restarts?: number;
    /** Probabilidad de random walk en lugar de greedy (default 0.3). */
    noise?: number;
}
/**
 * MAP inference: encuentra el mundo de mayor `weight`. Aproximado
 * mediante MaxWalkSAT con múltiples restarts: en cada paso, elige
 * una ground formula INSATISFECHA y flippea uno de sus atoms; con
 * probabilidad `noise` lo elige al azar (random walk), con `1-noise`
 * elige el flip que más mejora el score (greedy).
 *
 * Respeta `evidence`: nunca flippea atoms fijos.
 */
export declare function mapInference(theory: MLNTheory, evidence?: Partial<MLNWorld>, options?: MapOptions): MLNWorld;
export {};
//# sourceMappingURL=inference.d.ts.map