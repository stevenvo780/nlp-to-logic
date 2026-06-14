import type { Term } from './types';
/**
 * Igualdad estructural de términos (iterativa, soporta árboles
 * profundos sin stack overflow).
 *
 * Tolera la dualidad const/func-con-args=[]: un `const a` y un
 * `func a` con args=[] cuentan como iguales para no penalizar al
 * cliente que mezcle ambas convenciones.
 */
export declare function termEquals(a: Term, b: Term): boolean;
/**
 * Serialización canónica de un término. Usada para comparar pares
 * (t1, t2) en la tabla de desacuerdos del algoritmo de Plotkin.
 *
 * Usa caracteres no-alfanuméricos como separadores para evitar
 * ambigüedades con nombres que contengan paréntesis o comas.
 */
export declare function termKey(t: Term): string;
/**
 * Conjunto de variables que aparecen en t (iterativo).
 */
export declare function varsOf(t: Term, acc?: Set<string>): Set<string>;
/**
 * Aplica una sustitución a un término (no compone cadenas — la
 * sustitución es plana, no recursiva, porque las generadas por
 * antiUnify son siempre con vars frescas a la izquierda y términos
 * cerrados-respecto-a-vars-frescas a la derecha).
 */
export declare function applySubst(t: Term, subst: Map<string, Term>): Term;
/**
 * Tamaño del término (cantidad de nodos).
 */
export declare function termSize(t: Term): number;
/** Variable. */
export declare function v(name: string): Term;
/** Constante (sin args). */
export declare function c(name: string): Term;
/** Aplicación de función. */
export declare function f(name: string, ...args: Term[]): Term;
//# sourceMappingURL=term-utils.d.ts.map