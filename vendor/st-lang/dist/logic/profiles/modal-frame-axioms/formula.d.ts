import { ModalFormula } from './types';
declare function unary(f: ModalFormula): ModalFormula;
declare function binLeft(f: ModalFormula): ModalFormula;
declare function binRight(f: ModalFormula): ModalFormula;
/** Crea un átomo proposicional modal. */
export declare const atom: (name: string) => ModalFormula;
/** Negación: ¬φ. */
export declare const not: (arg: ModalFormula) => ModalFormula;
/** Conjunción: φ ∧ ψ. */
export declare const and: (left: ModalFormula, right: ModalFormula) => ModalFormula;
/** Disyunción: φ ∨ ψ. */
export declare const or: (left: ModalFormula, right: ModalFormula) => ModalFormula;
/** Implicación: φ → ψ. */
export declare const implies: (left: ModalFormula, right: ModalFormula) => ModalFormula;
/** Operador □ (necesidad / box): □φ. */
export declare const box: (arg: ModalFormula) => ModalFormula;
/** Operador ◇ (posibilidad / diamond): ◇φ. */
export declare const diamond: (arg: ModalFormula) => ModalFormula;
/**
 * Clave sintáctica determinista para deduplicación.
 */
export declare function formulaKey(f: ModalFormula): string;
/** Igualdad sintáctica entre dos fórmulas modales. */
export declare function formulaEquals(a: ModalFormula, b: ModalFormula): boolean;
/** Renderiza una fórmula modal en notación textual (¬, ∧, ∨, →, □, ◇). */
export declare function formulaToString(f: ModalFormula): string;
/** Recolecta todos los nombres de átomos proposicionales que aparecen en `f`. */
export declare function collectAtoms(f: ModalFormula, out?: Set<string>): Set<string>;
export declare const subUnary: typeof unary;
export declare const subLeft: typeof binLeft;
export declare const subRight: typeof binRight;
export {};
//# sourceMappingURL=formula.d.ts.map