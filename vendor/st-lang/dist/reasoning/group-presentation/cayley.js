"use strict";
// ============================================================
// Grafo de Cayley a partir de una tabla de cosets completa.
// ============================================================
//
// Cuando la tabla representa el grupo entero (subgroupGens = []),
// los cosets son los elementos del grupo y τ(c, x) = c' significa
// "multiplicar el elemento c por el generador x da c'". Esto es,
// por construcción, el grafo de Cayley de G con respecto al
// conjunto generador S.
//
// Por convención usamos solo las aristas con generadores
// positivos (no sus inversos) — el grafo es naturalmente
// dirigido y las aristas inversas se recuperan de τ(c, x⁻¹).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cayleyGraph = cayleyGraph;
function cayleyGraph(table) {
    const vertices = [];
    for (let i = 1; i <= table.numCosets; i++)
        vertices.push(i);
    const edges = [];
    // Para cada vértice y cada generador positivo, registramos la
    // arista dirigida v --g--> w. Si la celda está vacía (no debería
    // suceder en tablas completas) la saltamos.
    for (const v of vertices) {
        const row = table.table.get(v);
        if (!row)
            continue;
        for (const g of table.generators) {
            const w = row.get(g);
            if (w !== undefined)
                edges.push([v, g, w]);
        }
    }
    return { vertices, edges };
}
//# sourceMappingURL=cayley.js.map