import type { CuratedLemma } from '../../tooling/lemma-library/types';
import type { RecallResult } from './types';
import { queryLemmas } from './query';
/** Par de benchmark: query en lenguaje natural → ID esperado del lema. */
export interface BenchmarkPair {
    query: string;
    expectedId: string;
}
/**
 * 20 pares de benchmark representativos de los dominios cubiertos
 * por standardLibrary(): proposicional, modal, aritmética, conjuntos, FOL.
 *
 * Las queries mezclan paráfrasis directas (fáciles para keyword) con
 * paráfrasis semánticas (difíciles para keyword, donde embedding ayuda).
 */
export declare const BENCHMARK_PAIRS: BenchmarkPair[];
/**
 * Ejecuta el benchmark completo sobre una biblioteca de lemas.
 * Filtra los pares cuyo `expectedId` no está presente en la biblioteca.
 *
 * @returns Array de RecallResult para cada método.
 */
export declare function runBenchmark(lemmas: CuratedLemma[]): RecallResult[];
/**
 * Función de conveniencia que ejecuta el benchmark y devuelve
 * un string legible con los resultados.
 */
export declare function formatBenchmarkResults(results: RecallResult[]): string;
export { queryLemmas };
//# sourceMappingURL=benchmarks.d.ts.map