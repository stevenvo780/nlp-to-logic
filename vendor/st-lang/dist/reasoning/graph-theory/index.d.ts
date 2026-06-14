/** Arista de grafo con peso opcional (default 1 en algoritmos). */
export interface Edge<V> {
    from: V;
    to: V;
    weight?: number;
}
/** Arista con peso obligatorio, usada en resultados de algoritmos como MST y caminos mínimos. */
export interface WeightedEdge<V> {
    from: V;
    to: V;
    weight: number;
}
/** Grafo finito genérico sobre vértices de tipo `V`. Puede ser dirigido o no dirigido. */
export interface Graph<V> {
    vertices: Set<V>;
    edges: Array<Edge<V>>;
    directed: boolean;
}
/** Crea un grafo vacío (dirigido o no según el flag). */
export declare function makeGraph<V>(directed?: boolean): Graph<V>;
/** Añade el vértice `v` al grafo `G` (sin aristas). */
export declare function addVertex<V>(G: Graph<V>, v: V): void;
/** Añade la arista `e` al grafo `G`, incluyendo sus extremos como vértices si es necesario. */
export declare function addEdge<V>(G: Graph<V>, e: Edge<V>): void;
/** Devuelve los vecinos salientes de `v` (en no dirigido, ambos extremos cuentan). */
export declare function neighbors<V>(G: Graph<V>, v: V): V[];
/** Grado de entrada de `v` (en grafo no dirigido, igual al grado total). */
export declare function inDegree<V>(G: Graph<V>, v: V): number;
/** Grado de salida de `v` (en grafo no dirigido, igual al grado total). */
export declare function outDegree<V>(G: Graph<V>, v: V): number;
/** BFS desde `start`; devuelve los vértices en orden de visita. Llama `visit` por cada uno si se proporciona. */
export declare function bfs<V>(G: Graph<V>, start: V, visit?: (v: V) => void): V[];
/** DFS desde `start`; devuelve los vértices en orden de visita. Llama `visit` por cada uno si se proporciona. */
export declare function dfs<V>(G: Graph<V>, start: V, visit?: (v: V) => void): V[];
/** Orden topológico vía Kahn. Devuelve `'has-cycle'` si el grafo no es un DAG. */
export declare function topologicalSort<V>(G: Graph<V>): V[] | 'has-cycle';
/** Componentes conexos (débiles en dirigido) del grafo. Cada componente es una lista de vértices. */
export declare function connectedComponents<V>(G: Graph<V>): V[][];
/** Devuelve `true` si el grafo tiene un solo componente conexo. */
export declare function isConnected<V>(G: Graph<V>): boolean;
/** Componentes fuertemente conexos (Tarjan, iterativo). En no dirigido cada SCC = componente conexo. */
export declare function stronglyConnectedComponents<V>(G: Graph<V>): V[][];
/** Puntos de articulación (corte) del grafo no dirigido, detectados vía DFS lowlink. */
export declare function articulationPoints<V>(G: Graph<V>): V[];
/** Puentes del grafo no dirigido (DFS lowlink): aristas cuya eliminación desconecta el grafo. */
export declare function bridges<V>(G: Graph<V>): Array<{
    from: V;
    to: V;
}>;
/**
 * Dijkstra: caminos mínimos desde `start` (pesos no negativos).
 * @throws si hay aristas con peso negativo.
 */
export declare function dijkstra<V>(G: Graph<V>, start: V): {
    distances: Map<V, number>;
    predecessors: Map<V, V>;
};
/** Bellman-Ford: caminos mínimos desde `start` con detección de ciclos negativos. */
export declare function bellmanFord<V>(G: Graph<V>, start: V): {
    distances: Map<V, number>;
    predecessors: Map<V, V>;
    negativeCycle: boolean;
};
/** Floyd-Warshall: distancias mínimas entre todos los pares de vértices O(n³). */
export declare function floydWarshall<V>(G: Graph<V>): Map<V, Map<V, number>>;
/** Kruskal: árbol generador mínimo en grafo no dirigido (DSU + ordenación por peso). */
export declare function kruskal<V>(G: Graph<V>): {
    edges: Array<WeightedEdge<V>>;
    totalWeight: number;
};
/** Prim: árbol generador mínimo en grafo no dirigido (cola de prioridad). */
export declare function prim<V>(G: Graph<V>, start?: V): {
    edges: Array<WeightedEdge<V>>;
    totalWeight: number;
};
/** Emparejamiento bipartito máximo vía DFS-aumento (algoritmo de Kuhn). */
export declare function bipartiteMaximumMatching<V>(G: Graph<V>, leftPartition: Set<V>): Array<{
    left: V;
    right: V;
}>;
/** Hopcroft-Karp: emparejamiento bipartito máximo con BFS por niveles + DFS de aumento (O(E√V)). */
export declare function hopcroftKarp<V>(G: Graph<V>, leftPartition: Set<V>): Array<{
    left: V;
    right: V;
}>;
/** Coloreo greedy: ordena por grado descendente y asigna el primer color disponible. */
export declare function greedyColoring<V>(G: Graph<V>): Map<V, number>;
/** Número cromático χ(G) por backtracking con poda (intenta k = 1, 2, …). Solo apto para grafos pequeños. */
export declare function chromaticNumber<V>(G: Graph<V>): number;
/** Devuelve `true` si los grafos `g1` y `g2` son isomorfos (estructuralmente equivalentes). */
export declare function areIsomorphic<V1, V2>(g1: Graph<V1>, g2: Graph<V2>): boolean;
/** Busca un isomorfismo entre `g1` y `g2`; devuelve el mapeo de vértices o `null` si no existe. */
export declare function findIsomorphism<V1, V2>(g1: Graph<V1>, g2: Graph<V2>): Map<V1, V2> | null;
//# sourceMappingURL=index.d.ts.map