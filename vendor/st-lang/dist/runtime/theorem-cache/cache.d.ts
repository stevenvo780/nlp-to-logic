export interface CachedTheorem {
    /** Hash determinista derivado de (normalizedFormula, profile). */
    id: string;
    formula: string;
    /** Forma canónica con identificadores normalizados a `?0`, `?1`, … */
    normalizedFormula: string;
    profile: string;
    /** Prueba opaca (ProofTree / NJProof / sequent / …). */
    proof: unknown;
    /** Nombre de la función de verificación, para re-verify. */
    verifier?: string;
    metadata: {
        provedAt: string;
        ms: number;
        provedBy?: string;
    };
}
export interface CacheOptions {
    /** Cap de entradas; LRU. Default 10000. */
    maxEntries?: number;
    /**
     * Ruta del archivo de persistencia (JSON). Default
     * `~/.st-theorem-cache/theorems.json`.
     */
    persistPath?: string;
    /** Hash function (default sha1 hex). */
    hashFn?: (formula: string) => string;
}
export interface CacheStats {
    entries: number;
    hits: number;
    misses: number;
    storedBytes: number;
}
export interface ReuseResult {
    reusable: boolean;
    substitution?: Record<string, string>;
    reusedProof?: unknown;
}
export declare class TheoremCache {
    private readonly maxEntries;
    private readonly persistPath;
    private readonly hashFn;
    private entries;
    private hits;
    private misses;
    constructor(opts?: CacheOptions);
    /**
     * Canonicaliza una fórmula a forma estable (placeholders).
     */
    canonicalize(formula: string): string;
    /**
     * Almacena un teorema; retorna el id asignado. Si ya existe una
     * entrada con el mismo (formula canónica, profile), la reemplaza
     * y la promueve a MRU.
     */
    store(theorem: Omit<CachedTheorem, 'id'>): string;
    /**
     * Devuelve el teorema cacheado para una fórmula+profile dados, o
     * `undefined` si no existe. Incrementa hits/misses.
     */
    retrieve(formula: string, profile: string): CachedTheorem | undefined;
    /**
     * Retorna todos los teoremas que matchean el patrón dado.
     *
     * El patrón usa metavariables `?x`. Ej: `?x -> ?x` matchea cualquier
     * teorema cacheado cuya fórmula sea `<id> -> <id>` (mismo lado).
     *
     * El matching opera sobre la fórmula original (no la canónica), de
     * modo que el caller puede inspeccionar los nombres reales.
     */
    retrieveByPattern(pattern: string): CachedTheorem[];
    /**
     * Comprueba si existe una entrada para (formula, profile). NO afecta
     * los contadores hits/misses.
     */
    exists(formula: string, profile: string): boolean;
    remove(id: string): boolean;
    clear(): void;
    saveToDisk(): Promise<void>;
    /**
     * Carga teoremas desde disco. Devuelve cuántas entradas cargó.
     * No-op silencioso si el archivo no existe.
     */
    loadFromDisk(): Promise<number>;
    stats(): CacheStats;
    private evictLru;
}
/**
 * Intenta reusar la prueba de un teorema cacheado para un target
 * dado. Si las fórmulas son canónicamente equivalentes (misma
 * estructura, identificadores en el mismo orden), calcula la
 * substitución y reemplaza los nombres en la prueba (cuando la
 * prueba es un string o un objeto JSON que la admita textualmente).
 *
 * Para pruebas opacas no-string, devuelve la prueba original sin
 * tocar — el caller es responsable de re-instanciar.
 */
export declare function tryReuseProof(theorem: CachedTheorem, targetFormula: string): ReuseResult;
//# sourceMappingURL=cache.d.ts.map