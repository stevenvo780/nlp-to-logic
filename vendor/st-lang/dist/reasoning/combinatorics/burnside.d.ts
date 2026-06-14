/**
 * Aplica el lema de Burnside para contar órbitas. `items` es el alfabeto;
 * el conjunto X sobre el que actúa el grupo son las cadenas de longitud
 * `length` (collares de `length` perlas con `items.length` colores).
 * `groupActions` son las funciones del grupo G actuando sobre X.
 *
 * |X/G| = (1/|G|) * sum_{g in G} |X^g|
 */
export declare function burnsideCount<T>(items: T[], length: number, groupActions: Array<(x: T[]) => T[]>): number;
/**
 * Genera las |group| rotaciones cíclicas de un arreglo de tamaño `length`.
 * Útil para contar collares con simetría cíclica.
 */
export declare function cyclicRotations(length: number): Array<(x: unknown[]) => unknown[]>;
//# sourceMappingURL=burnside.d.ts.map