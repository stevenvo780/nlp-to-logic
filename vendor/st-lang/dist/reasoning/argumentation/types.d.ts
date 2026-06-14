export interface ArgumentationFramework {
    arguments: Set<string>;
    attacks: Array<[string, string]>;
}
export type Semantics = 'grounded' | 'preferred' | 'stable' | 'complete' | 'semi-stable';
export interface ComputeOptions {
    exhaustiveLimit?: number;
    warnOnLarge?: boolean;
}
export declare const DEFAULT_EXHAUSTIVE_LIMIT = 20;
//# sourceMappingURL=types.d.ts.map