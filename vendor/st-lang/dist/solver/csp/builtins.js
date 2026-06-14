"use strict";
// ============================================================
// CSPs predefinidos: graph coloring y N-queens.
// ============================================================
// Ambos se modelan como CSPs binarios estándar para que AC-3 sea
// directamente aplicable.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphColoring = graphColoring;
exports.nQueens = nQueens;
const backtrack_1 = require("./backtrack");
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
function graphColoring(graph, numColors) {
    if (numColors <= 0)
        return null;
    const colors = [];
    for (let i = 0; i < numColors; i++)
        colors.push(i);
    const domains = new Map();
    for (const n of graph.nodes)
        domains.set(n, [...colors]);
    const constraints = [];
    // Deduplicar aristas (u,v) y (v,u).
    const seen = new Set();
    for (const [u, v] of graph.edges) {
        if (u === v) {
            // Self-loop ⇒ trivialmente UNSAT.
            return null;
        }
        const key = u < v ? `${u}|${v}` : `${v}|${u}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        constraints.push({
            vars: [u, v],
            predicate: ([a, b]) => a !== b,
        });
    }
    const csp = {
        variables: [...graph.nodes],
        domains,
        constraints,
    };
    const result = (0, backtrack_1.backtrack)(csp);
    return result.solution;
}
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
function nQueens(n) {
    if (n <= 0)
        return null;
    if (n === 1)
        return [0];
    const variables = [];
    for (let i = 0; i < n; i++)
        variables.push(i);
    const domains = new Map();
    for (let i = 0; i < n; i++) {
        const d = [];
        for (let j = 0; j < n; j++)
            d.push(j);
        domains.set(i, d);
    }
    const constraints = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const rowDiff = j - i;
            constraints.push({
                vars: [i, j],
                predicate: ([ci, cj]) => {
                    if (ci === undefined || cj === undefined)
                        return false;
                    if (ci === cj)
                        return false;
                    if (Math.abs(ci - cj) === rowDiff)
                        return false;
                    return true;
                },
            });
        }
    }
    const csp = { variables, domains, constraints };
    const result = (0, backtrack_1.backtrack)(csp);
    if (!result.solution)
        return null;
    const out = new Array(n).fill(-1);
    for (const [row, col] of result.solution)
        out[row] = col;
    return out;
}
//# sourceMappingURL=builtins.js.map