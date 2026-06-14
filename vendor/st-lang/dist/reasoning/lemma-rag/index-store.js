"use strict";
// ============================================================
// IndexStore — índice in-memory de lemas embebidos
//
// Almacena EmbeddedLemma[] + inverted index de tokens para BM25.
// Soporta inserción, borrado y búsqueda por embedding o por token.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexStore = void 0;
const tokenize_1 = require("../../tooling/lemma-library/tokenize");
/** Construye el term-frequency bag para un lema (name + tags + statement). */
function buildTermFreq(lemma) {
    const tokens = [
        ...(0, tokenize_1.tokenize)(lemma.name),
        ...lemma.tags.flatMap((t) => (0, tokenize_1.tokenize)(t)),
        ...(0, tokenize_1.tokenize)(lemma.statement),
    ];
    const termFreq = new Map();
    for (const tok of tokens) {
        termFreq.set(tok, (termFreq.get(tok) ?? 0) + 1);
    }
    return { termFreq, docLength: tokens.length };
}
class IndexStore {
    provider;
    entries = [];
    byId = new Map();
    /** inverted index: token → set of lemma IDs (para BM25). */
    invertedIndex = new Map();
    /** document frequency: token → número de documentos que lo contienen. */
    docFreq = new Map();
    constructor(provider) {
        this.provider = provider;
    }
    /** Añade un lema al índice. Idempotente si ya existe (mismo id). */
    add(lemma) {
        if (this.byId.has(lemma.id)) {
            return this.byId.get(lemma.id);
        }
        const embedding = this.provider.embed(lemma.statement);
        const { termFreq, docLength } = buildTermFreq(lemma);
        const entry = { lemma, embedding, termFreq, docLength };
        this.entries.push(entry);
        this.byId.set(lemma.id, entry);
        // Actualizar inverted index + docFreq
        for (const tok of termFreq.keys()) {
            let bucket = this.invertedIndex.get(tok);
            if (!bucket) {
                bucket = new Set();
                this.invertedIndex.set(tok, bucket);
            }
            bucket.add(lemma.id);
            this.docFreq.set(tok, (this.docFreq.get(tok) ?? 0) + 1);
        }
        return entry;
    }
    /** Añade múltiples lemas. */
    addAll(lemmas) {
        for (const l of lemmas)
            this.add(l);
    }
    /** Devuelve todos los EmbeddedLemma. */
    all() {
        return this.entries;
    }
    /** Busca por ID. */
    getById(id) {
        return this.byId.get(id);
    }
    /** Número de lemas indexados. */
    size() {
        return this.entries.length;
    }
    /** Devuelve el document frequency de un token (para BM25 IDF). */
    getDocFreq(token) {
        return this.docFreq.get(token) ?? 0;
    }
    /** Total de documentos. */
    totalDocs() {
        return this.entries.length;
    }
    /** Average document length (para BM25). */
    avgDocLength() {
        if (this.entries.length === 0)
            return 1;
        let total = 0;
        for (const e of this.entries)
            total += e.docLength;
        return total / this.entries.length;
    }
    /** Filtra los entries por dominio. */
    byDomain(domain) {
        return this.entries.filter((e) => e.lemma.domain === domain);
    }
    /** Devuelve los IDs de lemas que contienen el token (inverted index). */
    docsForToken(token) {
        return this.invertedIndex.get(token) ?? new Set();
    }
    /** Devuelve el embedding de un vector de consulta generado por el provider. */
    embedQuery(text) {
        return this.provider.embed(text);
    }
}
exports.IndexStore = IndexStore;
//# sourceMappingURL=index-store.js.map