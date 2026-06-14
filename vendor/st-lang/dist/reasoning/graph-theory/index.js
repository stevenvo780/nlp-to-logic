"use strict";
// ============================================================
// ST Graph Theory — grafos finitos, recorridos y algoritmos clásicos
// ============================================================
//
// Implementa una representación genérica de grafos dirigidos y no
// dirigidos sobre vértices arbitrarios `V` (comparables por igualdad
// estructural cuando son primitivos, o por identidad cuando son
// objetos). Cubre:
//
//   • BFS / DFS / orden topológico
//   • Componentes conexos y fuertemente conexos (Tarjan)
//   • Puntos de articulación y puentes (DFS lowlink)
//   • Caminos mínimos: Dijkstra (no negativos), Bellman-Ford
//     (detecta ciclos negativos), Floyd-Warshall (todos contra todos)
//   • Árbol generador mínimo: Kruskal (DSU) y Prim (cola por prioridad
//     simple)
//   • Emparejamiento bipartito máximo: Hopcroft-Karp y variante
//     determinista por aumento de caminos
//   • Coloreo: greedy y número cromático por backtracking
//   • Isomorfismo (grafos pequeños) por refinamiento de invariantes y
//     backtracking compatibles con grados/sequence
//
// Convenciones:
//   • `Graph<V>` mantiene `vertices: Set<V>` y `edges: Array<Edge>`.
//     Para grafos no dirigidos cada arista lógica se almacena una sola
//     vez; `neighbors` la recorre en ambos sentidos. Para dirigidos,
//     la dirección manda.
//   • Los pesos por defecto son 1; los algoritmos de caminos mínimos
//     y MST asumen pesos finitos definidos.
//   • La igualdad de vértices se hace con `===` (apta para strings,
//     números, símbolos y referencias). Para objetos compuestos, el
//     llamante debe deduplicar antes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGraph = makeGraph;
exports.addVertex = addVertex;
exports.addEdge = addEdge;
exports.neighbors = neighbors;
exports.inDegree = inDegree;
exports.outDegree = outDegree;
exports.bfs = bfs;
exports.dfs = dfs;
exports.topologicalSort = topologicalSort;
exports.connectedComponents = connectedComponents;
exports.isConnected = isConnected;
exports.stronglyConnectedComponents = stronglyConnectedComponents;
exports.articulationPoints = articulationPoints;
exports.bridges = bridges;
exports.dijkstra = dijkstra;
exports.bellmanFord = bellmanFord;
exports.floydWarshall = floydWarshall;
exports.kruskal = kruskal;
exports.prim = prim;
exports.bipartiteMaximumMatching = bipartiteMaximumMatching;
exports.hopcroftKarp = hopcroftKarp;
exports.greedyColoring = greedyColoring;
exports.chromaticNumber = chromaticNumber;
exports.areIsomorphic = areIsomorphic;
exports.findIsomorphism = findIsomorphism;
// ------------------------------------------------------------
// Construcción
// ------------------------------------------------------------
/** Crea un grafo vacío (dirigido o no según el flag). */
function makeGraph(directed = false) {
    return {
        vertices: new Set(),
        edges: [],
        directed,
    };
}
/** Añade el vértice `v` al grafo `G` (sin aristas). */
function addVertex(G, v) {
    G.vertices.add(v);
}
/** Añade la arista `e` al grafo `G`, incluyendo sus extremos como vértices si es necesario. */
function addEdge(G, e) {
    G.vertices.add(e.from);
    G.vertices.add(e.to);
    G.edges.push({ from: e.from, to: e.to, weight: e.weight });
}
/** Devuelve los vecinos salientes de `v` (en no dirigido, ambos extremos cuentan). */
function neighbors(G, v) {
    const out = [];
    for (const e of G.edges) {
        if (e.from === v)
            out.push(e.to);
        else if (!G.directed && e.to === v)
            out.push(e.from);
    }
    return out;
}
/** Grado de entrada de `v` (en grafo no dirigido, igual al grado total). */
function inDegree(G, v) {
    if (!G.directed)
        return degreeUndirected(G, v);
    let d = 0;
    for (const e of G.edges)
        if (e.to === v)
            d++;
    return d;
}
/** Grado de salida de `v` (en grafo no dirigido, igual al grado total). */
function outDegree(G, v) {
    if (!G.directed)
        return degreeUndirected(G, v);
    let d = 0;
    for (const e of G.edges)
        if (e.from === v)
            d++;
    return d;
}
function degreeUndirected(G, v) {
    let d = 0;
    for (const e of G.edges) {
        if (e.from === v)
            d++;
        if (e.to === v && e.from !== e.to)
            d++;
    }
    return d;
}
function buildAdjacency(G) {
    const adj = new Map();
    for (const v of G.vertices)
        adj.set(v, []);
    for (const e of G.edges) {
        const w = e.weight ?? 1;
        const a = adj.get(e.from);
        if (a)
            a.push({ to: e.to, weight: w });
        if (!G.directed && e.from !== e.to) {
            const b = adj.get(e.to);
            if (b)
                b.push({ to: e.from, weight: w });
        }
    }
    return adj;
}
// ------------------------------------------------------------
// Recorridos
// ------------------------------------------------------------
/** BFS desde `start`; devuelve los vértices en orden de visita. Llama `visit` por cada uno si se proporciona. */
function bfs(G, start, visit) {
    if (!G.vertices.has(start))
        return [];
    const adj = buildAdjacency(G);
    const order = [];
    const seen = new Set([start]);
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
        const v = queue[head++];
        order.push(v);
        if (visit)
            visit(v);
        const nbrs = adj.get(v) ?? [];
        for (const { to } of nbrs) {
            if (!seen.has(to)) {
                seen.add(to);
                queue.push(to);
            }
        }
    }
    return order;
}
/** DFS desde `start`; devuelve los vértices en orden de visita. Llama `visit` por cada uno si se proporciona. */
function dfs(G, start, visit) {
    if (!G.vertices.has(start))
        return [];
    const adj = buildAdjacency(G);
    const order = [];
    const seen = new Set();
    const stack = [start];
    while (stack.length > 0) {
        const v = stack.pop();
        if (seen.has(v))
            continue;
        seen.add(v);
        order.push(v);
        if (visit)
            visit(v);
        const nbrs = adj.get(v) ?? [];
        // Apilar en orden inverso para que el primer vecino se procese primero.
        for (let i = nbrs.length - 1; i >= 0; i--) {
            const entry = nbrs[i];
            if (entry && !seen.has(entry.to))
                stack.push(entry.to);
        }
    }
    return order;
}
/** Orden topológico vía Kahn. Devuelve `'has-cycle'` si el grafo no es un DAG. */
function topologicalSort(G) {
    if (!G.directed) {
        // Para no dirigidos no tiene sentido salvo aristas-cero; devolver vértices.
        return Array.from(G.vertices);
    }
    const inDeg = new Map();
    for (const v of G.vertices)
        inDeg.set(v, 0);
    const adj = buildAdjacency(G);
    for (const e of G.edges) {
        inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    }
    const queue = [];
    for (const [v, d] of inDeg)
        if (d === 0)
            queue.push(v);
    const order = [];
    let head = 0;
    while (head < queue.length) {
        const v = queue[head++];
        order.push(v);
        const nbrs = adj.get(v) ?? [];
        for (const { to } of nbrs) {
            const nd = (inDeg.get(to) ?? 0) - 1;
            inDeg.set(to, nd);
            if (nd === 0)
                queue.push(to);
        }
    }
    if (order.length !== G.vertices.size)
        return 'has-cycle';
    return order;
}
// ------------------------------------------------------------
// Conectividad
// ------------------------------------------------------------
/** Componentes conexos (débiles en dirigido) del grafo. Cada componente es una lista de vértices. */
function connectedComponents(G) {
    const adj = buildAdjacency(G);
    const seen = new Set();
    const comps = [];
    for (const start of G.vertices) {
        if (seen.has(start))
            continue;
        const comp = [];
        const stack = [start];
        while (stack.length > 0) {
            const v = stack.pop();
            if (seen.has(v))
                continue;
            seen.add(v);
            comp.push(v);
            // En grafos dirigidos, para conectividad "débil" usamos vecinos en ambos
            // sentidos; para no dirigidos, `adj` ya recorre ambos extremos.
            const nbrs = adj.get(v) ?? [];
            for (const { to } of nbrs)
                if (!seen.has(to))
                    stack.push(to);
            if (G.directed) {
                // Añadir predecesores también para conectividad débil.
                for (const e of G.edges)
                    if (e.to === v && !seen.has(e.from))
                        stack.push(e.from);
            }
        }
        comps.push(comp);
    }
    return comps;
}
/** Devuelve `true` si el grafo tiene un solo componente conexo. */
function isConnected(G) {
    if (G.vertices.size <= 1)
        return true;
    return connectedComponents(G).length === 1;
}
/** Componentes fuertemente conexos (Tarjan, iterativo). En no dirigido cada SCC = componente conexo. */
function stronglyConnectedComponents(G) {
    if (!G.directed)
        return connectedComponents(G);
    const adj = buildAdjacency(G);
    const index = new Map();
    const lowlink = new Map();
    const onStack = new Set();
    const stack = [];
    const result = [];
    let counter = 0;
    const callStack = [];
    for (const start of G.vertices) {
        if (index.has(start))
            continue;
        callStack.push({ v: start, iter: 0 });
        index.set(start, counter);
        lowlink.set(start, counter);
        counter++;
        stack.push(start);
        onStack.add(start);
        while (callStack.length > 0) {
            const frame = callStack[callStack.length - 1];
            const v = frame.v;
            const nbrs = adj.get(v) ?? [];
            if (frame.iter < nbrs.length) {
                const entry = nbrs[frame.iter];
                frame.iter++;
                const w = entry.to;
                if (!index.has(w)) {
                    index.set(w, counter);
                    lowlink.set(w, counter);
                    counter++;
                    stack.push(w);
                    onStack.add(w);
                    callStack.push({ v: w, iter: 0 });
                }
                else if (onStack.has(w)) {
                    const lv = lowlink.get(v) ?? 0;
                    const iw = index.get(w) ?? 0;
                    if (iw < lv)
                        lowlink.set(v, iw);
                }
            }
            else {
                // Cerrar el nodo: si lowlink == index → raíz de SCC.
                const lv = lowlink.get(v) ?? 0;
                const iv = index.get(v) ?? 0;
                if (lv === iv) {
                    const comp = [];
                    while (stack.length > 0) {
                        const w = stack.pop();
                        onStack.delete(w);
                        comp.push(w);
                        if (w === v)
                            break;
                    }
                    result.push(comp);
                }
                callStack.pop();
                if (callStack.length > 0) {
                    const parent = callStack[callStack.length - 1];
                    const lp = lowlink.get(parent.v) ?? 0;
                    if (lv < lp)
                        lowlink.set(parent.v, lv);
                }
            }
        }
    }
    return result;
}
/** Puntos de articulación (corte) del grafo no dirigido, detectados vía DFS lowlink. */
function articulationPoints(G) {
    if (G.vertices.size === 0)
        return [];
    const adj = buildAdjacency(G);
    const disc = new Map();
    const low = new Map();
    const parent = new Map();
    const isArt = new Set();
    let timer = 0;
    for (const start of G.vertices) {
        if (disc.has(start))
            continue;
        const root = start;
        const stack = [{ v: root, iter: 0, children: 0 }];
        disc.set(root, timer);
        low.set(root, timer);
        timer++;
        parent.set(root, null);
        while (stack.length > 0) {
            const frame = stack[stack.length - 1];
            const v = frame.v;
            const nbrs = adj.get(v) ?? [];
            if (frame.iter < nbrs.length) {
                const entry = nbrs[frame.iter];
                frame.iter++;
                const w = entry.to;
                if (!disc.has(w)) {
                    frame.children++;
                    parent.set(w, v);
                    disc.set(w, timer);
                    low.set(w, timer);
                    timer++;
                    stack.push({ v: w, iter: 0, children: 0 });
                }
                else if (w !== parent.get(v)) {
                    const lv = low.get(v) ?? 0;
                    const dw = disc.get(w) ?? 0;
                    if (dw < lv)
                        low.set(v, dw);
                }
            }
            else {
                stack.pop();
                const p = parent.get(v);
                if (p != null) {
                    const lp = low.get(p) ?? 0;
                    const lv = low.get(v) ?? 0;
                    if (lv < lp)
                        low.set(p, lv);
                    const dp = disc.get(p) ?? 0;
                    if (p !== root && lv >= dp)
                        isArt.add(p);
                }
                else {
                    // raíz
                    if (frame.children > 1)
                        isArt.add(v);
                }
            }
        }
    }
    return Array.from(isArt);
}
/** Puentes del grafo no dirigido (DFS lowlink): aristas cuya eliminación desconecta el grafo. */
function bridges(G) {
    const adj = buildAdjacency(G);
    const disc = new Map();
    const low = new Map();
    const parent = new Map();
    const out = [];
    let timer = 0;
    for (const start of G.vertices) {
        if (disc.has(start))
            continue;
        const stack = [{ v: start, iter: 0 }];
        disc.set(start, timer);
        low.set(start, timer);
        timer++;
        parent.set(start, null);
        while (stack.length > 0) {
            const frame = stack[stack.length - 1];
            const v = frame.v;
            const nbrs = adj.get(v) ?? [];
            if (frame.iter < nbrs.length) {
                const entry = nbrs[frame.iter];
                frame.iter++;
                const w = entry.to;
                if (!disc.has(w)) {
                    parent.set(w, v);
                    disc.set(w, timer);
                    low.set(w, timer);
                    timer++;
                    stack.push({ v: w, iter: 0 });
                }
                else if (w !== parent.get(v)) {
                    const lv = low.get(v) ?? 0;
                    const dw = disc.get(w) ?? 0;
                    if (dw < lv)
                        low.set(v, dw);
                }
            }
            else {
                stack.pop();
                const p = parent.get(v);
                if (p != null) {
                    const lp = low.get(p) ?? 0;
                    const lv = low.get(v) ?? 0;
                    if (lv < lp)
                        low.set(p, lv);
                    const dp = disc.get(p) ?? 0;
                    if (lv > dp)
                        out.push({ from: p, to: v });
                }
            }
        }
    }
    return out;
}
// ------------------------------------------------------------
// Caminos mínimos
// ------------------------------------------------------------
// Min-heap binario para Dijkstra. Items: [distancia, vértice].
class MinHeap {
    data = [];
    get size() {
        return this.data.length;
    }
    push(item) {
        this.data.push(item);
        this.siftUp(this.data.length - 1);
    }
    pop() {
        const n = this.data.length;
        if (n === 0)
            return undefined;
        const top = this.data[0];
        const last = this.data.pop();
        if (n > 1) {
            this.data[0] = last;
            this.siftDown(0);
        }
        return top;
    }
    siftUp(i) {
        let idx = i;
        while (idx > 0) {
            const parent = (idx - 1) >> 1;
            const pa = this.data[parent];
            const cu = this.data[idx];
            if (cu[0] < pa[0]) {
                this.data[idx] = pa;
                this.data[parent] = cu;
                idx = parent;
            }
            else
                break;
        }
    }
    siftDown(i) {
        let idx = i;
        const n = this.data.length;
        while (true) {
            const l = 2 * idx + 1;
            const r = 2 * idx + 2;
            let best = idx;
            if (l < n && this.data[l][0] < this.data[best][0])
                best = l;
            if (r < n && this.data[r][0] < this.data[best][0])
                best = r;
            if (best !== idx) {
                const tmp = this.data[idx];
                this.data[idx] = this.data[best];
                this.data[best] = tmp;
                idx = best;
            }
            else
                break;
        }
    }
}
/**
 * Dijkstra: caminos mínimos desde `start` (pesos no negativos).
 * @throws si hay aristas con peso negativo.
 */
function dijkstra(G, start) {
    // Validar pesos no negativos.
    for (const e of G.edges) {
        if ((e.weight ?? 1) < 0) {
            throw new Error('dijkstra: pesos negativos no permitidos');
        }
    }
    const adj = buildAdjacency(G);
    const dist = new Map();
    const pred = new Map();
    for (const v of G.vertices)
        dist.set(v, Infinity);
    if (!G.vertices.has(start))
        return { distances: dist, predecessors: pred };
    dist.set(start, 0);
    const heap = new MinHeap();
    heap.push([0, start]);
    while (heap.size > 0) {
        const top = heap.pop();
        if (!top)
            break;
        const [d, v] = top;
        if (d > (dist.get(v) ?? Infinity))
            continue;
        const nbrs = adj.get(v) ?? [];
        for (const { to, weight } of nbrs) {
            const nd = d + weight;
            if (nd < (dist.get(to) ?? Infinity)) {
                dist.set(to, nd);
                pred.set(to, v);
                heap.push([nd, to]);
            }
        }
    }
    return { distances: dist, predecessors: pred };
}
/** Bellman-Ford: caminos mínimos desde `start` con detección de ciclos negativos. */
function bellmanFord(G, start) {
    const dist = new Map();
    const pred = new Map();
    for (const v of G.vertices)
        dist.set(v, Infinity);
    if (!G.vertices.has(start))
        return { distances: dist, predecessors: pred, negativeCycle: false };
    dist.set(start, 0);
    // Lista de aristas dirigidas equivalentes: para no dirigidos, duplicamos.
    const dEdges = [];
    for (const e of G.edges) {
        const w = e.weight ?? 1;
        dEdges.push({ from: e.from, to: e.to, weight: w });
        if (!G.directed && e.from !== e.to)
            dEdges.push({ from: e.to, to: e.from, weight: w });
    }
    const n = G.vertices.size;
    for (let i = 0; i < n - 1; i++) {
        let changed = false;
        for (const e of dEdges) {
            const du = dist.get(e.from) ?? Infinity;
            if (du === Infinity)
                continue;
            const nd = du + e.weight;
            if (nd < (dist.get(e.to) ?? Infinity)) {
                dist.set(e.to, nd);
                pred.set(e.to, e.from);
                changed = true;
            }
        }
        if (!changed)
            break;
    }
    // Detectar ciclo negativo: si todavía se puede relajar.
    let negativeCycle = false;
    for (const e of dEdges) {
        const du = dist.get(e.from) ?? Infinity;
        if (du === Infinity)
            continue;
        if (du + e.weight < (dist.get(e.to) ?? Infinity)) {
            negativeCycle = true;
            break;
        }
    }
    return { distances: dist, predecessors: pred, negativeCycle };
}
/** Floyd-Warshall: distancias mínimas entre todos los pares de vértices O(n³). */
function floydWarshall(G) {
    const verts = Array.from(G.vertices);
    const idx = new Map();
    verts.forEach((v, i) => idx.set(v, i));
    const n = verts.length;
    const D = Array.from({ length: n }, () => new Array(n).fill(Infinity));
    for (let i = 0; i < n; i++)
        D[i][i] = 0;
    for (const e of G.edges) {
        const i = idx.get(e.from);
        const j = idx.get(e.to);
        if (i === undefined || j === undefined)
            continue;
        const w = e.weight ?? 1;
        const row = D[i];
        if (w < (row[j] ?? Infinity))
            row[j] = w;
        if (!G.directed) {
            const rowJ = D[j];
            if (w < (rowJ[i] ?? Infinity))
                rowJ[i] = w;
        }
    }
    for (let k = 0; k < n; k++) {
        const Dk = D[k];
        for (let i = 0; i < n; i++) {
            const Di = D[i];
            const dik = Di[k] ?? Infinity;
            if (dik === Infinity)
                continue;
            for (let j = 0; j < n; j++) {
                const cand = dik + (Dk[j] ?? Infinity);
                if (cand < (Di[j] ?? Infinity))
                    Di[j] = cand;
            }
        }
    }
    const out = new Map();
    for (let i = 0; i < n; i++) {
        const row = new Map();
        const vi = verts[i];
        for (let j = 0; j < n; j++) {
            const vj = verts[j];
            row.set(vj, D[i][j] ?? Infinity);
        }
        out.set(vi, row);
    }
    return out;
}
// ------------------------------------------------------------
// Disjoint-Set Union (Union-Find) para MST
// ------------------------------------------------------------
class DSU {
    parent = new Map();
    rank = new Map();
    add(v) {
        if (!this.parent.has(v)) {
            this.parent.set(v, v);
            this.rank.set(v, 0);
        }
    }
    find(v) {
        let cur = v;
        while (this.parent.get(cur) !== cur) {
            const p = this.parent.get(cur);
            const gp = this.parent.get(p);
            this.parent.set(cur, gp);
            cur = gp;
        }
        return cur;
    }
    union(a, b) {
        const ra = this.find(a);
        const rb = this.find(b);
        if (ra === rb)
            return false;
        const rka = this.rank.get(ra) ?? 0;
        const rkb = this.rank.get(rb) ?? 0;
        if (rka < rkb)
            this.parent.set(ra, rb);
        else if (rka > rkb)
            this.parent.set(rb, ra);
        else {
            this.parent.set(rb, ra);
            this.rank.set(ra, rka + 1);
        }
        return true;
    }
}
// ------------------------------------------------------------
// MST
// ------------------------------------------------------------
/** Kruskal: árbol generador mínimo en grafo no dirigido (DSU + ordenación por peso). */
function kruskal(G) {
    if (G.directed) {
        throw new Error('kruskal: requiere grafo no dirigido');
    }
    const dsu = new DSU();
    for (const v of G.vertices)
        dsu.add(v);
    const sorted = G.edges
        .map((e) => ({ from: e.from, to: e.to, weight: e.weight ?? 1 }))
        .sort((a, b) => a.weight - b.weight);
    const result = [];
    let total = 0;
    for (const e of sorted) {
        if (dsu.union(e.from, e.to)) {
            result.push(e);
            total += e.weight;
        }
    }
    return { edges: result, totalWeight: total };
}
/** Prim: árbol generador mínimo en grafo no dirigido (cola de prioridad). */
function prim(G, start) {
    if (G.directed) {
        throw new Error('prim: requiere grafo no dirigido');
    }
    if (G.vertices.size === 0)
        return { edges: [], totalWeight: 0 };
    const root = start !== undefined && G.vertices.has(start) ? start : G.vertices.values().next().value;
    const adj = buildAdjacency(G);
    const inTree = new Set([root]);
    // Heap de aristas candidatas [peso, from, to].
    const heap = new MinHeap();
    for (const { to, weight } of adj.get(root) ?? []) {
        heap.push([weight, { from: root, to }]);
    }
    const result = [];
    let total = 0;
    while (heap.size > 0 && inTree.size < G.vertices.size) {
        const top = heap.pop();
        if (!top)
            break;
        const [w, e] = top;
        if (inTree.has(e.to))
            continue;
        inTree.add(e.to);
        result.push({ from: e.from, to: e.to, weight: w });
        total += w;
        for (const { to, weight } of adj.get(e.to) ?? []) {
            if (!inTree.has(to))
                heap.push([weight, { from: e.to, to }]);
        }
    }
    return { edges: result, totalWeight: total };
}
// ------------------------------------------------------------
// Bipartite matching
// ------------------------------------------------------------
/** Emparejamiento bipartito máximo vía DFS-aumento (algoritmo de Kuhn). */
function bipartiteMaximumMatching(G, leftPartition) {
    const adj = buildAdjacency(G);
    const matchR = new Map(); // right → left
    const tryKuhn = (u, visited) => {
        const nbrs = adj.get(u) ?? [];
        for (const { to: w } of nbrs) {
            if (leftPartition.has(w))
                continue;
            if (visited.has(w))
                continue;
            visited.add(w);
            const matched = matchR.get(w);
            if (matched === undefined || tryKuhn(matched, visited)) {
                matchR.set(w, u);
                return true;
            }
        }
        return false;
    };
    for (const u of leftPartition) {
        if (!G.vertices.has(u))
            continue;
        tryKuhn(u, new Set());
    }
    const out = [];
    for (const [r, l] of matchR)
        out.push({ left: l, right: r });
    return out;
}
/** Hopcroft-Karp: emparejamiento bipartito máximo con BFS por niveles + DFS de aumento (O(E√V)). */
function hopcroftKarp(G, leftPartition) {
    const adj = buildAdjacency(G);
    const pairL = new Map();
    const pairR = new Map();
    const distL = new Map();
    const left = [];
    for (const v of leftPartition) {
        if (G.vertices.has(v)) {
            left.push(v);
            pairL.set(v, null);
        }
    }
    for (const v of G.vertices) {
        if (!leftPartition.has(v))
            pairR.set(v, null);
    }
    const INF = Number.POSITIVE_INFINITY;
    const bfsLayers = () => {
        const queue = [];
        for (const u of left) {
            if (pairL.get(u) === null) {
                distL.set(u, 0);
                queue.push(u);
            }
            else {
                distL.set(u, INF);
            }
        }
        let found = false;
        let head = 0;
        while (head < queue.length) {
            const u = queue[head++];
            const du = distL.get(u) ?? INF;
            const nbrs = adj.get(u) ?? [];
            for (const { to: v } of nbrs) {
                if (leftPartition.has(v))
                    continue;
                const pv = pairR.get(v);
                if (pv === null || pv === undefined) {
                    found = true;
                }
                else {
                    if ((distL.get(pv) ?? INF) === INF) {
                        distL.set(pv, du + 1);
                        queue.push(pv);
                    }
                }
            }
        }
        return found;
    };
    const dfsAugment = (u) => {
        const nbrs = adj.get(u) ?? [];
        for (const { to: v } of nbrs) {
            if (leftPartition.has(v))
                continue;
            const pv = pairR.get(v) ?? null;
            const expected = (distL.get(u) ?? INF) + 1;
            const dpv = pv === null ? INF : (distL.get(pv) ?? INF);
            if (pv === null || (dpv === expected && dfsAugment(pv))) {
                pairL.set(u, v);
                pairR.set(v, u);
                return true;
            }
        }
        distL.set(u, INF);
        return false;
    };
    while (bfsLayers()) {
        for (const u of left) {
            if (pairL.get(u) === null)
                dfsAugment(u);
        }
    }
    const out = [];
    for (const u of left) {
        const v = pairL.get(u);
        if (v !== null && v !== undefined)
            out.push({ left: u, right: v });
    }
    return out;
}
// ------------------------------------------------------------
// Coloreo
// ------------------------------------------------------------
/** Coloreo greedy: ordena por grado descendente y asigna el primer color disponible. */
function greedyColoring(G) {
    const order = Array.from(G.vertices).sort((a, b) => degreeUndirected(G, b) - degreeUndirected(G, a));
    const color = new Map();
    for (const v of order) {
        const used = new Set();
        for (const n of neighbors(G, v)) {
            const c = color.get(n);
            if (c !== undefined)
                used.add(c);
        }
        let c = 0;
        while (used.has(c))
            c++;
        color.set(v, c);
    }
    return color;
}
/** Número cromático χ(G) por backtracking con poda (intenta k = 1, 2, …). Solo apto para grafos pequeños. */
function chromaticNumber(G) {
    const verts = Array.from(G.vertices);
    if (verts.length === 0)
        return 0;
    // Si hay aristas, al menos 2.
    const adj = new Map();
    for (const v of verts)
        adj.set(v, new Set());
    for (const e of G.edges) {
        if (e.from === e.to)
            continue;
        adj.get(e.from)?.add(e.to);
        adj.get(e.to)?.add(e.from);
    }
    const canColor = (k) => {
        const color = new Array(verts.length).fill(-1);
        const idxOf = new Map();
        verts.forEach((v, i) => idxOf.set(v, i));
        const dfs = (i) => {
            if (i === verts.length)
                return true;
            const v = verts[i];
            const used = new Set();
            for (const nb of adj.get(v) ?? []) {
                const ci = color[idxOf.get(nb)];
                if (ci !== undefined && ci >= 0)
                    used.add(ci);
            }
            for (let c = 0; c < k; c++) {
                if (used.has(c))
                    continue;
                color[i] = c;
                if (dfs(i + 1))
                    return true;
                color[i] = -1;
            }
            return false;
        };
        return dfs(0);
    };
    for (let k = 1; k <= verts.length; k++) {
        if (canColor(k))
            return k;
    }
    return verts.length;
}
// ------------------------------------------------------------
// Isomorfismo (grafos pequeños)
// ------------------------------------------------------------
// Heurística de refinamiento de invariantes (1-WL liviano): para cada
// vértice arma una firma (grado, multiset de grados de vecinos) y permite
// rechazar rápidamente. Si las firmas globales no coinciden, no iso.
function vertexSignatures(G) {
    const sig = new Map();
    for (const v of G.vertices) {
        const nbDegrees = neighbors(G, v).map((n) => degreeUndirected(G, n));
        nbDegrees.sort((a, b) => a - b);
        sig.set(v, `${degreeUndirected(G, v)}|${nbDegrees.join(',')}`);
    }
    return sig;
}
function signatureMultiset(sigs) {
    const arr = Array.from(sigs.values());
    arr.sort();
    return arr.join('||');
}
/** Devuelve `true` si los grafos `g1` y `g2` son isomorfos (estructuralmente equivalentes). */
function areIsomorphic(g1, g2) {
    return findIsomorphism(g1, g2) !== null;
}
/** Busca un isomorfismo entre `g1` y `g2`; devuelve el mapeo de vértices o `null` si no existe. */
function findIsomorphism(g1, g2) {
    if (g1.directed !== g2.directed)
        return null;
    if (g1.vertices.size !== g2.vertices.size)
        return null;
    if (g1.edges.length !== g2.edges.length)
        return null;
    // Comparar secuencia de grados.
    const deg1 = Array.from(g1.vertices)
        .map((v) => degreeUndirected(g1, v))
        .sort((a, b) => a - b);
    const deg2 = Array.from(g2.vertices)
        .map((v) => degreeUndirected(g2, v))
        .sort((a, b) => a - b);
    if (deg1.length !== deg2.length || deg1.some((d, i) => d !== deg2[i]))
        return null;
    // Comparar firmas vecinales.
    const sig1 = vertexSignatures(g1);
    const sig2 = vertexSignatures(g2);
    if (signatureMultiset(sig1) !== signatureMultiset(sig2))
        return null;
    const verts1 = Array.from(g1.vertices);
    const verts2 = Array.from(g2.vertices);
    // Adyacencia como set de pares para chequeo rápido.
    const adj1 = new Map();
    for (const v of verts1)
        adj1.set(v, new Set());
    for (const e of g1.edges) {
        adj1.get(e.from)?.add(e.to);
        if (!g1.directed)
            adj1.get(e.to)?.add(e.from);
    }
    const adj2 = new Map();
    for (const v of verts2)
        adj2.set(v, new Set());
    for (const e of g2.edges) {
        adj2.get(e.from)?.add(e.to);
        if (!g2.directed)
            adj2.get(e.to)?.add(e.from);
    }
    // Backtracking: emparejar verts1[i] con un v2 compatible.
    const mapping = new Map();
    const used = new Set();
    // Candidatos por firma para cada vértice de g1.
    const candidates = new Map();
    for (const v of verts1) {
        const cand = [];
        const s = sig1.get(v);
        for (const w of verts2) {
            if (sig2.get(w) === s)
                cand.push(w);
        }
        candidates.set(v, cand);
    }
    // Ordenar verts1 por número de candidatos (variable más restrictiva primero).
    const order = verts1.slice().sort((a, b) => {
        return (candidates.get(a)?.length ?? 0) - (candidates.get(b)?.length ?? 0);
    });
    const compatible = (u, w) => {
        // Para cada vecino previamente mapeado de u en g1, el correspondiente
        // mapeo en g2 debe ser vecino de w.
        for (const [uPrev, wPrev] of mapping) {
            const uAdj = adj1.get(u)?.has(uPrev) ?? false;
            const wAdj = adj2.get(w)?.has(wPrev) ?? false;
            if (uAdj !== wAdj)
                return false;
            if (g1.directed) {
                const uAdjRev = adj1.get(uPrev)?.has(u) ?? false;
                const wAdjRev = adj2.get(wPrev)?.has(w) ?? false;
                if (uAdjRev !== wAdjRev)
                    return false;
            }
        }
        return true;
    };
    const backtrack = (i) => {
        if (i === order.length)
            return true;
        const u = order[i];
        for (const w of candidates.get(u) ?? []) {
            if (used.has(w))
                continue;
            if (!compatible(u, w))
                continue;
            mapping.set(u, w);
            used.add(w);
            if (backtrack(i + 1))
                return true;
            mapping.delete(u);
            used.delete(w);
        }
        return false;
    };
    if (backtrack(0))
        return mapping;
    return null;
}
//# sourceMappingURL=index.js.map