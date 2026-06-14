import { HOLTerm, HOLType } from './types';
export declare const mkVar: (name: string, type: HOLType) => HOLTerm;
export declare const mkConst: (name: string, type: HOLType) => HOLTerm;
export declare const mkComb: (fn: HOLTerm, arg: HOLTerm) => HOLTerm;
export declare const mkAbs: (param: string, paramType: HOLType, body: HOLTerm) => HOLTerm;
/**
 * Calcula el tipo de un término bien formado. Lanza si el
 * término está mal tipado (combinación con dominios disjuntos).
 */
export declare function typeOf(t: HOLTerm): HOLType;
/**
 * Igualdad estructural módulo α-renaming. Implementación con
 * dos mapas de profundidad (de Bruijn implícito sobre nombres).
 */
export declare function alphaEq(a: HOLTerm, b: HOLTerm): boolean;
interface VarEntry {
    name: string;
    type: HOLType;
}
/**
 * Devuelve las variables libres de `t` con su tipo. Una variable
 * con mismo nombre pero distinto tipo aparece dos veces.
 */
export declare function freeVars(t: HOLTerm, out?: VarEntry[]): VarEntry[];
/**
 * Devuelve true si `name` aparece libre en `term` con tipo `ty`.
 */
export declare function occursFree(name: string, ty: HOLType, term: HOLTerm): boolean;
/** Genera un nombre fresco respecto a un conjunto de nombres prohibidos. */
export declare function freshName(base: string, forbidden: Set<string>): string;
/**
 * Sustituye [v := value] en `term`. Renombra binders si haría
 * falta para evitar captura. `v` se identifica por nombre + tipo.
 */
export declare function substTerm(name: string, ty: HOLType, value: HOLTerm, term: HOLTerm): HOLTerm;
export declare function instTypeInTerm(subst: Record<string, HOLType>, term: HOLTerm): HOLTerm;
export declare function termToString(t: HOLTerm): string;
/**
 * Constructor de igualdad polimórfica `= : α → α → bool`.
 * Devuelve la `const` `=` instanciada al tipo del término.
 */
export declare function eqConst(ty: HOLType): HOLTerm;
/** Construye el término `l = r` (chequea que sus tipos coincidan). */
export declare function mkEq(l: HOLTerm, r: HOLTerm): HOLTerm;
/** Descompone `l = r` en `[l, r]` o null si no es igualdad. */
export declare function destEq(t: HOLTerm): [HOLTerm, HOLTerm] | null;
/** True si `t` es una igualdad de la forma `l = r`. */
export declare function isEq(t: HOLTerm): boolean;
/** True si `t` es una bi-implicación bool ↔ bool (sintácticamente `=` sobre bool). */
export declare function isIff(t: HOLTerm): boolean;
export {};
//# sourceMappingURL=term.d.ts.map