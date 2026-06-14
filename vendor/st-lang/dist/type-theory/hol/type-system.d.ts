import { HOLType } from './types';
/** Construye una variable de tipo `α`, `β`, etc. */
export declare const tvar: (name: string) => HOLType;
/** Constante de tipo: `bool`, `ind`, ... */
export declare const tconst: (name: string) => HOLType;
/** Aplicación de constructor de tipo (e.g. `fun`, `prod`). */
export declare const tapp: (fn: string, args: HOLType[]) => HOLType;
export declare const TyBool: HOLType;
export declare const TyInd: HOLType;
/** `A → B` */
export declare const funTy: (from: HOLType, to: HOLType) => HOLType;
/** Empareja `A → B → ...` de derecha a izquierda. */
export declare const funTyN: (...types: HOLType[]) => HOLType;
/**
 * Igualdad estructural de tipos. Las variables de tipo se
 * comparan por nombre (no hay α-renaming sobre tipos en HOL).
 */
export declare function typeEq(a: HOLType, b: HOLType): boolean;
/** Devuelve true si `t` es una flecha `A → B`. */
export declare function isFunType(t: HOLType): t is {
    kind: 'tapp';
    fn: 'fun';
    args: HOLType[];
};
/** Dominio de una flecha. Lanza si el tipo no es flecha. */
export declare function funDomain(t: HOLType): HOLType;
/** Codominio de una flecha. Lanza si el tipo no es flecha. */
export declare function funCodomain(t: HOLType): HOLType;
/** Pretty-printer; útil para mensajes de error y tests. */
export declare function typeToString(t: HOLType): string;
/**
 * Sustitución sobre variables de tipo. Aplica `subst` a `t`
 * de manera capture-free (los tipos no tienen binders).
 */
export declare function substType(subst: Record<string, HOLType>, t: HOLType): HOLType;
/** Recolecta los nombres de las variables de tipo libres en `t`. */
export declare function freeTypeVars(t: HOLType, out?: Set<string>): Set<string>;
//# sourceMappingURL=type-system.d.ts.map