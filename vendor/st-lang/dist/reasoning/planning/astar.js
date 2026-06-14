"use strict";
// ============================================================
// ST Planning — A* Planner (forward search con heurística)
// ============================================================
//
// A* sobre el espacio de estados: f(n) = g(n) + h(n) donde
//   g(n) = costo acumulado del plan hasta n
//   h(n) = heurística admisible al goal (default FF)
//
// Con h admisible (≤ costo real), A* garantiza el plan de menor
// COSTO. Con heurística no admisible, sigue funcionando pero pierde
// la garantía de óptimo (suele ser más rápido).
//
// Implementación de la priority queue: binary heap sobre `f`. Para
// problemas reales (b ~ 5, d ~ 30) basta — no necesitamos Fibonacci.
Object.defineProperty(exports, "__esModule", { value: true });
exports.aStarPlan = aStarPlan;
const ground_1 = require("./ground");
const bfs_1 = require("./bfs");
const heuristic_1 = require("./heuristic");
// ── Min-heap por f ─────────────────────────────────────────────
//
// Implementación clásica con array indexado en 0. Comparador estable
// usando un contador de inserción como tiebreaker (FIFO entre nodos
// con mismo f; ayuda a reproducibilidad).
class MinHeap {
    items = [];
    seqCounter = 0;
    size() {
        return this.items.length;
    }
    push(node) {
        this.items.push({ node, seq: this.seqCounter++ });
        this.bubbleUp(this.items.length - 1);
    }
    pop() {
        if (this.items.length === 0)
            return undefined;
        const top = this.items[0];
        const last = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = last;
            this.bubbleDown(0);
        }
        return top.node;
    }
    less(a, b) {
        const ia = this.items[a];
        const ib = this.items[b];
        if (ia.node.f !== ib.node.f)
            return ia.node.f < ib.node.f;
        return ia.seq < ib.seq;
    }
    swap(a, b) {
        const tmp = this.items[a];
        this.items[a] = this.items[b];
        this.items[b] = tmp;
    }
    bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.less(i, parent)) {
                this.swap(i, parent);
                i = parent;
            }
            else
                break;
        }
    }
    bubbleDown(i) {
        const n = this.items.length;
        while (true) {
            const l = i * 2 + 1;
            const r = i * 2 + 2;
            let best = i;
            if (l < n && this.less(l, best))
                best = l;
            if (r < n && this.less(r, best))
                best = r;
            if (best === i)
                break;
            this.swap(i, best);
            i = best;
        }
    }
}
/**
 * A* planner. Devuelve plan de menor costo bajo `heuristic` admisible,
 * o `null` si no hay solución dentro de los límites.
 *
 * Default: `goalCountHeuristic` (|goal\state|). Para mejor rendimiento
 * en problemas no triviales, pasar `makeFFHeuristic(problem)`.
 */
function aStarPlan(problem, options = {}) {
    const heuristic = options.heuristic ?? heuristic_1.goalCountHeuristic;
    const maxDepth = options.maxDepth ?? 200;
    const maxNodes = options.maxNodes ?? 100_000;
    const cost = options.costFunction ?? (() => 1);
    if ((0, ground_1.goalSatisfied)(problem.initialState, problem.goal)) {
        return { actions: [], length: 0, cost: 0 };
    }
    const groundedByAction = problem.actions.map((a) => ({
        schema: a,
        instances: (0, ground_1.groundAll)(a, problem.objects),
    }));
    const heap = new MinHeap();
    const initialH = heuristic(problem.initialState, problem.goal);
    heap.push({ state: problem.initialState, plan: [], g: 0, f: initialH });
    // gScore[hash] = mejor g conocido para ese estado. Permite reabrir
    // si encontramos camino mejor (closed list optimista).
    const gScore = new Map();
    gScore.set((0, bfs_1.hashState)(problem.initialState), 0);
    let expanded = 0;
    while (heap.size() > 0) {
        const node = heap.pop();
        const hash = (0, bfs_1.hashState)(node.state);
        // Si hay un g mejor registrado, este nodo es stale; skip.
        const known = gScore.get(hash);
        if (known !== undefined && node.g > known)
            continue;
        if ((0, ground_1.goalSatisfied)(node.state, problem.goal)) {
            return { actions: node.plan, length: node.plan.length, cost: node.g };
        }
        if (node.plan.length >= maxDepth)
            continue;
        if (expanded >= maxNodes)
            return null;
        expanded++;
        for (const { schema, instances } of groundedByAction) {
            for (const { bindings, grounded } of instances) {
                if (!(0, ground_1.preconditionsSatisfied)(node.state, grounded.preconditions))
                    continue;
                const next = (0, ground_1.applyAction)(node.state, grounded);
                const step = { action: schema, bindings };
                const tentativeG = node.g + cost(step);
                const nextHash = (0, bfs_1.hashState)(next);
                const prevG = gScore.get(nextHash);
                if (prevG !== undefined && tentativeG >= prevG)
                    continue;
                gScore.set(nextHash, tentativeG);
                const h = heuristic(next, problem.goal);
                if (!Number.isFinite(h))
                    continue; // dead end relajado
                heap.push({
                    state: next,
                    plan: [...node.plan, step],
                    g: tentativeG,
                    f: tentativeG + h,
                });
            }
        }
    }
    return null;
}
//# sourceMappingURL=astar.js.map