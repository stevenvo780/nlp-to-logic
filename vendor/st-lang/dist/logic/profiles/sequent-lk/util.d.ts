import { LKFormula } from './types';
/**
 * Clave canonica de una formula LK. Sirve para comparar igualdad
 * sintactica entre formulas y construir conjuntos/multisets.
 */
export declare function lkKey(f: LKFormula): string;
export declare function eq(a: LKFormula, b: LKFormula): boolean;
/** Devuelve una copia superficial: util para construir premisas sin alias. */
export declare function cloneSeq<T>(xs: T[]): T[];
export declare function removeAt<T>(xs: T[], idx: number): T[];
/** Quita la primera ocurrencia de una formula identificable por `key`. */
export declare function removeFirstByKey(xs: LKFormula[], key: string): LKFormula[];
/** Quita todas las ocurrencias de una formula identificable por `key`. */
export declare function removeAllByKey(xs: LKFormula[], key: string): LKFormula[];
export declare function containsKey(xs: LKFormula[], key: string): boolean;
/** Profundidad de una formula (sub-formulas estrictas). */
export declare function depth(f: LKFormula): number;
//# sourceMappingURL=util.d.ts.map