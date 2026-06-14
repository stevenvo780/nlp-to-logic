export interface Congruence {
    remainder: bigint;
    modulus: bigint;
}
export declare function crt(congruences: Congruence[]): {
    solution: bigint;
    modulus: bigint;
} | null;
//# sourceMappingURL=crt.d.ts.map