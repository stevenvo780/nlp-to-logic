"use strict";
// ============================================================
// ST Planning — BFS Planner (forward search)
// ============================================================
//
// Búsqueda forward en anchura desde el initialState. Garantiza el
// plan de MENOR longitud (≠ menor costo si hay costos no uniformes;
// para costos pesados usá `aStarPlan`).
//
// Esquema:
//   1. Frontera = cola con (state, planSoFar).
//   2. Visitados = set de hashes canónicos de estado (para no
//      re-expandir el mismo estado).
//   3. Pop, chequear goal, si no → expandir todas las acciones
//      aplicables (con preconditions ⊆ state) y agregar nuevos
//      estados a la frontera.
//   4. Cortar por `maxDepth` y `maxNodes`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashState = hashState;
exports.bfsPlan = bfsPlan;
const ground_1 = require("./ground");
/**
 * Hash canónico de un estado: orden lex de los hechos y join. Es
 * O(n log n) pero los estados de planning suelen ser chicos.
 */
function hashState(state) {
    const arr = Array.from(state);
    arr.sort();
    return arr.join(''); // separador improbable en facts user-supplied
}
/**
 * BFS planner. Devuelve plan de menor longitud, o `null` si no hay
 * solución dentro de los límites.
 *
 * Complejidad: O(b^d) donde b = factor de rama (acciones ground
 * aplicables) y d = profundidad. Para problemas reales sin podas se
 * vuelve inviable rápido — usar `aStarPlan` con FF heuristic para
 * dominios no triviales.
 */
function bfsPlan(problem, options = {}) {
    const maxDepth = options.maxDepth ?? 50;
    const maxNodes = options.maxNodes ?? 100_000;
    const cost = options.costFunction ?? (() => 1);
    // Caso degenerado: goal ya satisfecho en S₀.
    if ((0, ground_1.goalSatisfied)(problem.initialState, problem.goal)) {
        return { actions: [], length: 0, cost: 0 };
    }
    // Pre-grounding: pre-computamos todas las acciones ground para cada
    // schema. Para problemas con muchos objetos esto puede ser caro pero
    // permite expandir sucesores en O(|ground|·|state|).
    const groundedByAction = problem.actions.map((a) => ({
        schema: a,
        instances: (0, ground_1.groundAll)(a, problem.objects),
    }));
    const queue = [{ state: problem.initialState, plan: [], cost: 0 }];
    const visited = new Set();
    visited.add(hashState(problem.initialState));
    let expanded = 0;
    while (queue.length > 0) {
        const node = queue.shift();
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
                const h = hashState(next);
                if (visited.has(h))
                    continue;
                visited.add(h);
                const step = { action: schema, bindings };
                const nextPlan = [...node.plan, step];
                const nextCost = node.cost + cost(step);
                if ((0, ground_1.goalSatisfied)(next, problem.goal)) {
                    return { actions: nextPlan, length: nextPlan.length, cost: nextCost };
                }
                queue.push({ state: next, plan: nextPlan, cost: nextCost });
            }
        }
    }
    return null;
}
//# sourceMappingURL=bfs.js.map