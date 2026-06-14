import type { Substitution, Term } from './types';
/**
 * Igualdad estructural de términos (iterativa para soportar
 * términos muy profundos sin stack overflow).
 */
export declare function termEquals(a: Term, b: Term): boolean;
/**
 * Clona un término (iterativo, soporta árboles profundos).
 */
export declare function cloneTerm(t: Term): Term;
/**
 * Conjunto de variables que aparecen en t.
 */
export declare function varsOf(t: Term, acc?: Set<string>): Set<string>;
/**
 * Aplica una sustitución a t (iterativo, soporta términos profundos).
 *
 * Para variables, sigue la cadena de bindings con detección de
 * ciclos (un MGU de Robinson puede tener cadenas x → y → f(z)
 * que sólo terminan tras varios saltos).
 */
export declare function applySubst(t: Term, subst: Substitution): Term;
/**
 * Occurs check: ¿aparece la variable v en t?
 *
 * Indispensable para evitar unificar x con f(x) creando términos
 * infinitos como f(f(f(...))).
 */
export declare function occursIn(v: string, t: Term): boolean;
/**
 * Matching (pattern matching): encuentra σ tal que σ(pattern) = target.
 *
 * A diferencia de la unificación, solo las variables del pattern
 * pueden ligarse. Si target contiene variables, se tratan como
 * constantes opacas. Devuelve null si no hay match.
 */
export declare function match(pattern: Term, target: Term, subst?: Substitution): Substitution | null;
/**
 * Unificación de Robinson. Devuelve un MGU (most general unifier)
 * o null si los términos no unifican.
 *
 * Implementación recursiva con occurs check.
 */
export declare function unify(s: Term, t: Term, subst?: Substitution): Substitution | null;
/**
 * Renombra todas las variables de t agregándole un sufijo (`_<suffix>`).
 *
 * Necesario antes de unificar dos reglas en KB completion: las variables
 * deben ser disjuntas para que LHS₁ y LHS₂ no compartan nombres
 * espuriamente.
 */
export declare function renameVars(t: Term, suffix: string): Term;
/**
 * Tamaño del término (número de nodos). Iterativo para evitar
 * stack overflow en términos muy profundos.
 */
export declare function termSize(t: Term): number;
/**
 * Helpers para construir términos (azúcar para tests).
 */
export declare function v(name: string): Term;
export declare function f(name: string, ...args: Term[]): Term;
export declare function c(name: string): Term;
//# sourceMappingURL=term-utils.d.ts.map