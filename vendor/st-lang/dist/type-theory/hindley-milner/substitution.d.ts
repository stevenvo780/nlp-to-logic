import type { Type, TypeScheme } from './types';
import { schemeFreeVars } from './types';
/** Sustitución de variables de tipo: mapea nombre de tvar → Type. */
export type Substitution = Map<string, Type>;
/** Crea una sustitución vacía (identidad). */
export declare const emptySubst: () => Substitution;
/**
 * Aplica la sustitución `s` al tipo `t`, siguiendo cadenas de tvars.
 * Si `s` está vacía retorna `t` sin copiar.
 */
export declare function applySubst(t: Type, s: Substitution): Type;
/**
 * Aplica `s` a un esquema de tipos, evitando sustituir las variables
 * ligadas por el cuantificador ∀.
 */
export declare function applySubstScheme(sc: TypeScheme, s: Substitution): TypeScheme;
/**
 * Composición `s1 ∘ s2`: primero aplica `s2`, luego `s1`.
 * Implementado como: aplicar `s1` a los valores de `s2` y luego añadir
 * las entradas de `s1` que `s2` no tocó.
 */
export declare function composeSubsts(s1: Substitution, s2: Substitution): Substitution;
/** Reinicia el contador global de variables frescas (útil para tests reproducibles). */
export declare function resetFreshSupply(): void;
/**
 * Genera una nueva variable de tipo con nombre `prefix0`, `prefix1`, …
 * El contador es global al módulo; usar `resetFreshSupply()` en tests.
 */
export declare function freshTypeVar(prefix?: string): Type;
/**
 * Comprueba si la variable `name` aparece en `t` como subtérmino.
 * Unificarlos sin este check crearía un tipo recursivo infinito.
 */
export declare function occursIn(name: string, t: Type): boolean;
/** Resultado de unificación: sustitución MGU o descriptor de error. */
export type UnifyResult = Substitution | {
    error: string;
};
/** Type guard para detectar un resultado de error de unificación. */
export declare function isUnifyError(r: UnifyResult): r is {
    error: string;
};
/**
 * Unificación de primer orden Robinson con occurs-check.
 * @returns La sustitución MGU `u` tal que `u(t1) ≡ u(t2)`, o `{ error }` si no unifica.
 */
export declare function unify(t1: Type, t2: Type): UnifyResult;
/**
 * Generaliza `t` cerrando las variables libres que no están en el entorno.
 * Solo debe llamarse al tipar la RHS de un `let`.
 * @param envFreeVars - Variables libres presentes en el entorno actual.
 */
export declare function generalize(envFreeVars: Set<string>, t: Type): TypeScheme;
/**
 * Abre un esquema polimórfico reemplazando cada cuantificador con una
 * variable de tipo fresca. Usada cuando se usa una variable polimórfica.
 */
export declare function instantiate(sc: TypeScheme): Type;
export { schemeFreeVars };
//# sourceMappingURL=substitution.d.ts.map