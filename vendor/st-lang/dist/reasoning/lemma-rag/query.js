"use strict";
// ============================================================
// query.ts — API pública del sistema RAG
//
// Expone:
//   - LemmaRAG: clase principal que encapsula store + retrieval
//   - queryLemmas: función de conveniencia stateless (instancia lazy)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemmaRAG = void 0;
exports.globalRAG = globalRAG;
exports.resetGlobalRAG = resetGlobalRAG;
exports.queryLemmas = queryLemmas;
const index_store_1 = require("./index-store");
const retrieval_1 = require("./retrieval");
const embedding_1 = require("./embedding");
const DEFAULT_K = 5;
const DEFAULT_COSINE_WEIGHT = 0.7;
/**
 * LemmaRAG — instancia principal del sistema RAG.
 *
 * Flujo de uso:
 *   const rag = new LemmaRAG();
 *   rag.index(lemmas);
 *   const results = rag.query('negation implies double negation', { k: 3 });
 */
class LemmaRAG {
    store;
    constructor(provider = embedding_1.defaultProvider) {
        this.store = new index_store_1.IndexStore(provider);
    }
    /** Indexa una lista de lemas. Idempotente por id. */
    index(lemmas) {
        this.store.addAll(lemmas);
    }
    /** Número de lemas indexados. */
    size() {
        return this.store.size();
    }
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
    query(queryText, opts = {}) {
        const k = opts.k ?? DEFAULT_K;
        const cosineWeight = opts.cosineWeight ?? DEFAULT_COSINE_WEIGHT;
        const minScore = opts.minScore ?? 0;
        if (this.store.size() === 0)
            return [];
        const queryVec = this.store.embedQuery(queryText);
        return (0, retrieval_1.retrieveTopK)(queryText, queryVec, this.store, k, cosineWeight, opts.domain, minScore);
    }
    /** Acceso directo al IndexStore (para tests y benchmarks). */
    getStore() {
        return this.store;
    }
}
exports.LemmaRAG = LemmaRAG;
// --------------- Instancia lazy global (stateful) ----------------------
let _globalRAG;
/**
 * Retorna (creando si necesario) la instancia global del RAG.
 * Útil para uso quick-start sin gestionar el ciclo de vida.
 */
function globalRAG() {
    if (!_globalRAG)
        _globalRAG = new LemmaRAG();
    return _globalRAG;
}
/** Resetea la instancia global (útil en tests). */
function resetGlobalRAG() {
    _globalRAG = undefined;
}
/**
 * Función de conveniencia: indexa lemas en la instancia global y
 * ejecuta la query. Si `rag` no se pasa, usa la global.
 *
 * @example
 *   const results = queryLemmas(standardLibrary().all(), 'double negation');
 */
function queryLemmas(lemmas, queryText, opts = {}, rag) {
    const instance = rag ?? new LemmaRAG();
    instance.index(lemmas);
    return instance.query(queryText, opts);
}
//# sourceMappingURL=query.js.map