export declare class SeededRng {
    private state;
    constructor(seed: number);
    next(): number;
    int(min: number, max: number): number;
    pick<T>(arr: readonly T[]): T;
    shuffle<T>(arr: readonly T[]): T[];
}
export declare function autoSeed(): number;
//# sourceMappingURL=rng.d.ts.map