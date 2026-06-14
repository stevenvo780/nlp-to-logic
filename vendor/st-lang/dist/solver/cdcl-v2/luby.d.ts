/**
 * Calcula el i-ésimo término (1-indexado) de la secuencia de Luby.
 * Para mantener la indexación pública 0-indexada, internamente trabajamos
 * con t = i + 1, aplicando la recurrencia clásica de Knuth (1991):
 *   luby(t) = 2^(k-1)             si t = 2^k - 1
 *   luby(t) = luby(t - 2^(k-1) + 1) si 2^(k-1) ≤ t < 2^k - 1
 */
export declare function luby(i: number): number;
/**
 * Genera los primeros `n` términos de la secuencia de Luby.
 * Útil para tests y previsualización.
 */
export declare function lubySequence(n: number): number[];
/**
 * Política de restart Luby con multiplicador `base`.
 * Cada paso devuelve cuántos conflictos esperar antes del próximo restart.
 */
export declare class LubyRestartPolicy {
    private readonly base;
    private idx;
    constructor(base?: number);
    /** Conflictos hasta el próximo restart (avanza el contador interno). */
    next(): number;
    /** Estado actual (para inspección/tests). */
    get index(): number;
    reset(): void;
}
//# sourceMappingURL=luby.d.ts.map