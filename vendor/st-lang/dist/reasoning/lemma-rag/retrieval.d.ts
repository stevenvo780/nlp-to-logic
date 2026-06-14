import type { Embedding, EmbeddedLemma, QueryResult } from './types';
import type { IndexStore } from './index-store';
/**
 * Cosine similarity entre dos vectores NORMALIZADOS (norma L2 = 1).
 * En ese caso, es simplemente el producto punto.
 * Devuelve un valor en [-1, 1], saturado a [0, 1] para usarse como score.
 */
export declare function cosineSimilarity(a: Embedding, b: Embedding): number;
/**
 * BM25 Okapi score de una query contra un documento en el store.
 * Devuelve un score ≥ 0.
 */
export declare function bm25Score(queryText: string, doc: EmbeddedLemma, store: IndexStore): number;
/**
 * Score híbrido: `cosineWeight * cosine + (1 - cosineWeight) * bm25_norm`.
 *
 * BM25 se normaliza dividiendo por `maxBm25` (máximo observado en el batch).
 * Si maxBm25 === 0, el componente BM25 aporta 0.
 */
export declare function hybridScore(cosine: number, bm25: number, maxBm25: number, cosineWeight: number): number;
/**
 * Recupera los top-k lemas del store para una query dada.
 *
 * @param queryText  - Texto de la query (fórmula o descripción)
 * @param queryVec   - Embedding pre-calculado de queryText
 * @param store      - IndexStore con los lemas indexados
 * @param k          - Número de resultados
 * @param cosineWeight - Peso del componente cosine (default 0.7)
 * @param domain     - Filtro opcional de dominio
 * @param minScore   - Score mínimo para incluir
 */
export declare function retrieveTopK(queryText: string, queryVec: Embedding, store: IndexStore, k: number, cosineWeight: number, domain?: string, minScore?: number): QueryResult[];
//# sourceMappingURL=retrieval.d.ts.map