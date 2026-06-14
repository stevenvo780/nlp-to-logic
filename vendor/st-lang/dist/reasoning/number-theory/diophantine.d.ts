export declare function linearDiophantine(a: bigint, b: bigint, c: bigint): {
    x: bigint;
    y: bigint;
} | null;
export declare function continuedFractionExpansion(num: bigint, den: bigint, maxLen?: number): bigint[];
export declare function fromContinuedFraction(coefs: bigint[]): {
    num: bigint;
    den: bigint;
};
//# sourceMappingURL=diophantine.d.ts.map