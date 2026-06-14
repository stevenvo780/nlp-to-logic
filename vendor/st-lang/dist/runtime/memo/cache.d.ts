import { Formula, RunResult } from '../../types';
export interface MemoOptions {
    maxEntries?: number;
    persistPath?: string;
    ttlMs?: number;
}
export interface MemoStats {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
}
export type { RunResult as EvalResult };
export declare class DerivationCache {
    private readonly maxEntries;
    private readonly persistPath;
    private readonly ttlMs;
    private store;
    private hits;
    private misses;
    private evictions;
    constructor(opts?: MemoOptions);
    get(formula: Formula): RunResult | undefined;
    set(formula: Formula, result: RunResult): void;
    clear(): void;
    stats(): MemoStats;
    loadFromDisk(): Promise<void>;
    saveToDisk(): Promise<void>;
    private lruPromote;
    private evictLru;
}
//# sourceMappingURL=cache.d.ts.map