import { DefaultTheory, Extension, ComputeOptions } from './types';
/**
 * Normaliza un literal a forma canónica:
 *   "P", "p"           → "P"
 *   "¬P", "!P", "~P",
 *   "not P", " ¬  P "  → "¬P"
 * Quita espacios extra; preserva mayúsculas/minúsculas internas
 * tras el primer carácter (case-sensitive para predicados FOL como
 * "flies(tweety)" vs "Flies(tweety)").
 */
export declare function normalizeLiteral(lit: string): string;
/** Devuelve la negación canónica de un literal normalizado. */
export declare function negate(lit: string): string;
/** Verifica si un conjunto de literales es consistente (no contiene L y ¬L). */
export declare function isConsistent(beliefs: ReadonlySet<string>): boolean;
/**
 * Comprueba si una justificación β es consistente con las creencias:
 * basta con que ¬β no esté en el conjunto.
 */
export declare function isJustificationConsistent(justification: string, beliefs: ReadonlySet<string>): boolean;
/**
 * Calcula todas las extensiones de la teoría enumerando órdenes de
 * aplicación de defaults y verificando que el resultado sea un punto
 * fijo del operador Γ_T.
 *
 * Estrategia: para cada subconjunto de defaults, intentamos aplicarlos
 * en algún orden. Como en v1 trabajamos con literales y la aplicación
 * de un default no se desbloquea por reordering una vez fijado el
 * subconjunto consistente, basta enumerar subconjuntos maximales
 * generables por forward-close empezando desde cada permutación
 * heurística. Para acotar costo: probamos todas las permutaciones
 * cuando |defaults| ≤ 6, y un sampling determinista si excede.
 */
export declare function computeExtensions(T: DefaultTheory, options?: ComputeOptions): Extension[];
//# sourceMappingURL=extensions.d.ts.map