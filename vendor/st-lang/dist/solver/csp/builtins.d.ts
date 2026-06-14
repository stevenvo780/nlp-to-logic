/**
 * k-coloreo de un grafo no dirigido.
 *
 * Variables: nodos del grafo.
 * Dominios:  {0, 1, ..., numColors-1}.
 * Restricción binaria por arista (u, v): color(u) ≠ color(v).
 *
 * Devuelve un mapeo nodo → color o `null` si el grafo no es
 * k-coloreable.
 */
export declare function graphColoring(graph: {
    nodes: string[];
    edges: Array<[string, string]>;
}, numColors: number): Map<string, number> | null;
/**
 * N-queens. Modelo CSP estándar:
 *   Variables: row 0..n-1 (una reina por fila).
 *   Dominio: columna ∈ {0, ..., n-1}.
 *   Restricción binaria entre filas (i, j):
 *     col(i) ≠ col(j)            (no misma columna)
 *     |col(i) - col(j)| ≠ |i-j|  (no misma diagonal)
 *
 * Devuelve un array `cols` donde `cols[r]` es la columna de la
 * reina en la fila r, o `null` si no hay solución (n=2, n=3).
 */
export declare function nQueens(n: number): number[] | null;
//# sourceMappingURL=builtins.d.ts.map