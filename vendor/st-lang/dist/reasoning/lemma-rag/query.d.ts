import type { CuratedLemma } from '../../tooling/lemma-library/types';
import type { EmbeddingProvider, QueryResult, RAGOptions } from './types';
import { IndexStore } from './index-store';
/**
 * LemmaRAG — instancia principal del sistema RAG.
 *
 * Flujo de uso:
 *   const rag = new LemmaRAG();
 *   rag.index(lemmas);
 *   const results = rag.query('negation implies double negation', { k: 3 });
 */
export declare class LemmaRAG {
    private store;
    constructor(provider?: EmbeddingProvider);
    /** Indexa una lista de lemas. Idempotente por id. */
    index(lemmas: CuratedLemma[]): void;
    /** Número de lemas indexados. */
    size(): number;
    /**
     * Realiza una búsqueda semántica híbrida.
     *
     * Flujo:
     *   1. Embed(query) → query_vec
     *   2. Cosine similarity contra todos los vectores en el store
     *   3. BM25 sobre los tokens de la query
     *   4. Score híbrido: 0.7 * cosine + 0.3 * bm25_norm
     *   5. Top-k con score ≥ minScore
     */
    query(queryText: string, opts?: RAGOptions): QueryResult[];
    /** Acceso directo al IndexStore (para tests y benchmarks). */
    getStore(): IndexStore;
}
/**
 * Retorna (creando si necesario) la instancia global del RAG.
 * Útil para uso quick-start sin gestionar el ciclo de vida.
 */
export declare function globalRAG(): LemmaRAG;
/** Resetea la instancia global (útil en tests). */
export declare function resetGlobalRAG(): void;
/**
 * Función de conveniencia: indexa lemas en la instancia global y
 * ejecuta la query. Si `rag` no se pasa, usa la global.
 *
 * @example
 *   const results = queryLemmas(standardLibrary().all(), 'double negation');
 */
export declare function queryLemmas(lemmas: CuratedLemma[], queryText: string, opts?: RAGOptions, rag?: LemmaRAG): QueryResult[];
//# sourceMappingURL=query.d.ts.map