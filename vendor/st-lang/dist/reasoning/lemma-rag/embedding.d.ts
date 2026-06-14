import type { Embedding, EmbeddingProvider } from './types';
/** Normaliza un vector a norma L2 = 1. Si la norma es 0 devuelve el vector de ceros. */
export declare function normalizeEmbedding(vec: Float32Array): Float32Array;
/**
 * Genera el embedding de una fórmula/texto.
 *
 * El embedding es:
 *   1. Determinístico (misma entrada → mismo vector)
 *   2. Normalizado L2
 *   3. Sin NaN/Infinity
 *
 * Para queries de texto libre (no fórmulas puras), el texto se trata
 * igual — los átomos y operadores se extraen con las mismas reglas.
 */
export declare function hashEmbed(text: string): Embedding;
/**
 * EmbeddingProvider basado en HashEmbedding.
 * Implementa la interfaz EmbeddingProvider para Stage 2.
 */
export declare class HashEmbeddingProvider implements EmbeddingProvider {
    readonly dim = 256;
    embed(text: string): Embedding;
}
/** Instancia singleton reutilizable. */
export declare const defaultProvider: HashEmbeddingProvider;
//# sourceMappingURL=embedding.d.ts.map