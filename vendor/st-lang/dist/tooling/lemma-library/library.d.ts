import type { CuratedLemma, LemmaDifficulty } from './types';
export interface SearchOptions {
    domain?: string;
    limit?: number;
}
export declare class LemmaLibrary {
    private byId;
    private byDomainIndex;
    private byTagIndex;
    private byDifficultyIndex;
    add(lemma: CuratedLemma): void;
    get(id: string): CuratedLemma | undefined;
    byDomain(domain: string): CuratedLemma[];
    byTag(tag: string): CuratedLemma[];
    byDifficulty(d: LemmaDifficulty): CuratedLemma[];
    all(): CuratedLemma[];
    size(): number;
    /**
     * Búsqueda por palabra clave: tokeniza la query, asigna score a
     * cada lema según matches en name (peso 3), tags (peso 2) y
     * statement (peso 1). Si `opts.domain` está, filtra antes.
     * Devuelve los top `opts.limit` (default 20).
     */
    search(query: string, opts?: SearchOptions): CuratedLemma[];
    /**
     * Recupera lemas similares al dado, ranqueados por overlap de
     * tokens en statement (peso 2) + tags (peso 1). Excluye al propio
     * lema. Default k = 5.
     */
    similar(lemma: CuratedLemma, k?: number): CuratedLemma[];
    private indexSet;
    private resolve;
}
//# sourceMappingURL=library.d.ts.map