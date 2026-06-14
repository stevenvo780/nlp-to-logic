import type { CuratedLemma } from '../../tooling/lemma-library/types';
import type { EmbeddedLemma, Embedding, EmbeddingProvider } from './types';
export declare class IndexStore {
    private readonly provider;
    private entries;
    private byId;
    /** inverted index: token → set of lemma IDs (para BM25). */
    private invertedIndex;
    /** document frequency: token → número de documentos que lo contienen. */
    private docFreq;
    constructor(provider: EmbeddingProvider);
    /** Añade un lema al índice. Idempotente si ya existe (mismo id). */
    add(lemma: CuratedLemma): EmbeddedLemma;
    /** Añade múltiples lemas. */
    addAll(lemmas: CuratedLemma[]): void;
    /** Devuelve todos los EmbeddedLemma. */
    all(): EmbeddedLemma[];
    /** Busca por ID. */
    getById(id: string): EmbeddedLemma | undefined;
    /** Número de lemas indexados. */
    size(): number;
    /** Devuelve el document frequency de un token (para BM25 IDF). */
    getDocFreq(token: string): number;
    /** Total de documentos. */
    totalDocs(): number;
    /** Average document length (para BM25). */
    avgDocLength(): number;
    /** Filtra los entries por dominio. */
    byDomain(domain: string): EmbeddedLemma[];
    /** Devuelve los IDs de lemas que contienen el token (inverted index). */
    docsForToken(token: string): Set<string>;
    /** Devuelve el embedding de un vector de consulta generado por el provider. */
    embedQuery(text: string): Embedding;
}
//# sourceMappingURL=index-store.d.ts.map