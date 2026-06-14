"use strict";
// ============================================================
// Witness paths para fórmulas CTL existenciales.
// ============================================================
// Solo los operadores existenciales (EX, EF, EG, EU) admiten witness:
// para AX/AF/AG/AU el "testigo" sería el modelo entero (no hay un
// único camino que justifique la propiedad). Si el caller pide
// witness para una fórmula universal devolvemos `null`.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWitness = generateWitness;
const check_1 = require("./check");
function compile(M) {
    const states = new Set();
    const succ = new Map();
    const labels = new Map();
    for (const s of M.states) {
        states.add(s.id);
        succ.set(s.id, new Set());
        labels.set(s.id, new Set(s.labels));
    }
    for (const [from, to] of M.transitions) {
        succ.get(from)?.add(to);
    }
    return { states, succ, labels };
}
function bfsTo(model, start, isGoal, isStep = () => true, allowStartAsGoal = true) {
    if (allowStartAsGoal && isGoal(start))
        return [start];
    const visited = new Set([start]);
    const parent = new Map();
    const queue = [start];
    while (queue.length > 0) {
        const cur = queue.shift();
        if (cur === undefined)
            break;
        for (const s of model.succ.get(cur) ?? []) {
            if (visited.has(s))
                continue;
            visited.add(s);
            parent.set(s, cur);
            if (isGoal(s)) {
                const path = [s];
                let p = cur;
                while (p !== undefined) {
                    path.push(p);
                    p = parent.get(p);
                }
                return path.reverse();
            }
            if (isStep(s))
                queue.push(s);
        }
    }
    return null;
}
/**
 * Encuentra un camino testigo finito (`stateId[]`) que justifique
 * que `phi` se cumple en `state`. Devuelve `null` si:
 *  - `phi` no se cumple en `state`, o
 *  - `phi` es universal (AX/AF/AG/AU) — no admite un único witness path, o
 *  - `state` no existe en el modelo.
 *
 * Convenciones del path devuelto:
 *  - EX φ        → `[state, next]` con `next ⊨ φ`.
 *  - EF φ        → camino más corto desde `state` hasta un estado con `φ`.
 *  - EG φ        → camino que entra en un ciclo de estados con `φ`;
 *                  el último elemento del camino aparece dos veces para
 *                  marcar el lazo (lasso witness).
 *  - E[A U B]    → camino donde todos los intermedios cumplen A y el
 *                  último cumple B.
 *  - cualquier otro operador no existencial → `null`.
 */
function generateWitness(M, phi, state) {
    const model = compile(M);
    if (!model.states.has(state))
        return null;
    // Solo damos witness cuando φ se cumple efectivamente.
    const sat = (0, check_1.modelCheckCTL)(M, phi);
    if (!sat.get(state))
        return null;
    switch (phi.kind) {
        case 'EX': {
            const subSat = (0, check_1.modelCheckCTL)(M, phi.arg);
            for (const s of model.succ.get(state) ?? []) {
                if (subSat.get(s))
                    return [state, s];
            }
            return null;
        }
        case 'EF': {
            const subSat = (0, check_1.modelCheckCTL)(M, phi.arg);
            return bfsTo(model, state, (id) => subSat.get(id) === true);
        }
        case 'EU': {
            const aSat = (0, check_1.modelCheckCTL)(M, phi.left);
            const bSat = (0, check_1.modelCheckCTL)(M, phi.right);
            // Si state ya cumple B, devolvemos camino trivial.
            if (bSat.get(state))
                return [state];
            // Caminos donde los intermedios cumplen A; el goal cumple B.
            if (!aSat.get(state))
                return null;
            return bfsTo(model, state, (id) => bSat.get(id) === true, (id) => aSat.get(id) === true, false);
        }
        case 'EG': {
            const subSat = (0, check_1.modelCheckCTL)(M, phi.arg);
            // EG φ ⇔ existe camino infinito desde state con φ siempre.
            // En modelos finitos esto equivale a alcanzar un ciclo donde todos los
            // estados del ciclo cumplen φ, pasando por estados que también cumplen φ.
            const egSat = sat; // sat[state] true → existe tal camino
            // Encontrar el camino lazo: BFS desde state por estados que cumplen
            // EG φ, hasta llegar a un estado desde el cual se cierre un ciclo.
            if (!subSat.get(state) || !egSat.get(state))
                return null;
            // DFS para encontrar un ciclo dentro del sub-grafo {s : EG φ holds}.
            const inSubgraph = (id) => egSat.get(id) === true && subSat.get(id) === true;
            const stack = [state];
            const onStack = new Set([state]);
            const visited = new Set([state]);
            const result = dfsLasso(model, state, inSubgraph, stack, onStack, visited);
            return result;
        }
        default:
            return null;
    }
}
function dfsLasso(model, current, inSubgraph, stack, onStack, visited) {
    for (const s of model.succ.get(current) ?? []) {
        if (!inSubgraph(s))
            continue;
        if (onStack.has(s)) {
            // Encontramos un back-edge: stack contiene path hasta `current`,
            // y `s` está en stack → ciclo desde s.
            const path = [...stack, s];
            return path;
        }
        if (visited.has(s))
            continue;
        visited.add(s);
        stack.push(s);
        onStack.add(s);
        const r = dfsLasso(model, s, inSubgraph, stack, onStack, visited);
        if (r)
            return r;
        stack.pop();
        onStack.delete(s);
    }
    return null;
}
//# sourceMappingURL=witness.js.map