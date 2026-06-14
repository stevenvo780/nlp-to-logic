import { IntuitFormula } from './types';
/**
 * Clave sintáctica estable para deduplicación / memoización.
 * Determinista y libre de ambigüedades por paréntesis explícitos.
 */
export declare function formulaKey(f: IntuitFormula): string;
export declare function formulaEquals(a: IntuitFormula, b: IntuitFormula): boolean;
export declare function formulaToString(f: IntuitFormula): string;
/**
 * Recolecta los átomos proposicionales (por nombre) que aparecen en `f`.
 */
export declare function collectAtoms(f: IntuitFormula, out?: Set<string>): Set<string>;
export declare const atom: (name: string) => IntuitFormula;
export declare const bottom: () => IntuitFormula;
export declare const not: (arg: IntuitFormula) => IntuitFormula;
export declare const and: (left: IntuitFormula, right: IntuitFormula) => IntuitFormula;
export declare const or: (left: IntuitFormula, right: IntuitFormula) => IntuitFormula;
export declare const implies: (left: IntuitFormula, right: IntuitFormula) => IntuitFormula;
//# sourceMappingURL=formula.d.ts.map