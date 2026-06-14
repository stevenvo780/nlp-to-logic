import { NKFormula } from './types';
/**
 * Clave sintáctica estable para deduplicación / memoización.
 */
export declare function formulaKey(f: NKFormula): string;
/** Igualdad sintáctica entre dos fórmulas NK por comparación de claves. */
export declare function formulaEquals(a: NKFormula, b: NKFormula): boolean;
/** Renderiza una fórmula NK en notación textual (¬, ∧, ∨, →, ⊥). */
export declare function formulaToString(f: NKFormula): string;
/**
 * Recolecta los átomos proposicionales que aparecen en `f`.
 */
export declare function collectAtoms(f: NKFormula, out?: Set<string>): Set<string>;
/** Átomo proposicional clásico. */
export declare const atom: (name: string) => NKFormula;
/** Constante de falsedad ⊥. */
export declare const bottom: () => NKFormula;
/** Negación: ¬φ. */
export declare const not: (arg: NKFormula) => NKFormula;
/** Conjunción: left ∧ right. */
export declare const and: (left: NKFormula, right: NKFormula) => NKFormula;
/** Disyunción: left ∨ right. */
export declare const or: (left: NKFormula, right: NKFormula) => NKFormula;
/** Implicación: left → right. */
export declare const implies: (left: NKFormula, right: NKFormula) => NKFormula;
//# sourceMappingURL=formula.d.ts.map