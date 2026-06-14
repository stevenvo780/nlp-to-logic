import type { RewriteRule, Term } from './types';
/**
 * Intenta aplicar exactamente un paso de reescritura.
 *
 * Devuelve el término reducido o null si no hay redex.
 *
 * Política de selección:
 *   - Recorre t en pre-order (raíz primero, luego argumentos).
 *   - Para cada nodo prueba las reglas en orden.
 *   - El primer match aplica.
 */
export declare function rewriteStep(t: Term, rules: RewriteRule[]): Term | null;
/**
 * Normaliza t aplicando reglas hasta punto fijo.
 *
 * @param maxSteps  Cota de seguridad para sistemas no terminantes.
 *                  Si se excede, devuelve el último estado alcanzado.
 *
 * Nota: la confluencia se asume responsabilidad del caller — si el
 * TRS no es confluente, distintas estrategias pueden dar distintas
 * FN. Acá fijamos leftmost-outermost.
 */
export declare function normalize(t: Term, rules: RewriteRule[], maxSteps?: number): Term;
/**
 * Lista todas las posiciones (caminos) en t. Una posición es un
 * array de índices: [] = raíz, [0] = primer argumento, [0, 1] =
 * segundo argumento del primer argumento, etc.
 *
 * Útil para enumerar redexes y para calcular critical pairs.
 */
export declare function allPositions(t: Term, prefix?: number[]): number[][];
/**
 * Obtiene el subtérmino en la posición indicada.
 * Devuelve null si la posición no existe.
 */
export declare function subtermAt(t: Term, pos: readonly number[]): Term | null;
/**
 * Reemplaza el subtérmino en la posición indicada por `replacement`.
 *
 * Devuelve un término nuevo (sin mutar t). Si la posición no existe,
 * devuelve t sin cambios.
 */
export declare function replaceAt(t: Term, pos: readonly number[], replacement: Term): Term;
//# sourceMappingURL=rewrite.d.ts.map