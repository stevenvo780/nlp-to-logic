import type { AbelianGroup, Group, Ring } from './types';
export declare const intAdditiveGroup: AbelianGroup<bigint>;
export declare const intRing: Ring<bigint>;
export interface Rational {
    num: bigint;
    den: bigint;
}
export declare function rational(num: bigint, den: bigint): Rational;
export declare function rationalEq(a: Rational, b: Rational): boolean;
export declare const rationalsField: Ring<Rational>;
/**
 * División en Q. `undefined` solo cuando b = 0/1 (división por cero).
 */
export declare function rationalDiv(a: Rational, b: Rational): Rational | undefined;
export declare function zModN(n: bigint): Ring<bigint>;
/**
 * Lista los n representantes canónicos {0, 1, ..., n-1}.
 */
export declare function zModNElements(n: bigint): bigint[];
/**
 * División modular: busca b tal que a · b ≡ 1 (mod n) por fuerza bruta
 * sobre el dominio finito. Devuelve undefined si no existe inverso.
 */
export declare function zModNDiv(n: bigint): (a: bigint, b: bigint) => bigint | undefined;
export type Perm3 = [number, number, number];
export declare const sym3Elements: Perm3[];
export declare function perm3Eq(a: Perm3, b: Perm3): boolean;
export declare const sym3: Group<Perm3>;
//# sourceMappingURL=instances.d.ts.map