import { modPow } from './modular';
export declare function factorize(n: bigint): Array<{
    prime: bigint;
    exponent: number;
}>;
export declare function divisors(n: bigint): bigint[];
export declare function eulerPhi(n: bigint): bigint;
export declare function mobius(n: bigint): -1 | 0 | 1;
export declare const _internal: {
    modPow: typeof modPow;
};
//# sourceMappingURL=factorization.d.ts.map