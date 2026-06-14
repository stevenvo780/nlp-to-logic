"use strict";
/**
 * ClaimGraph — DAG de claims con detección de ciclos, orden topológico,
 * validación e invalidación propagada.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimGraph = exports.CycleError = void 0;
class CycleError extends Error {
    cycles;
    constructor(cycles) {
        super(`Ciclo detectado en el grafo de claims: ${cycles.map((c) => c.join(' -> ')).join(' | ')}`);
        this.name = 'CycleError';
        this.cycles = cycles;
    }
}
exports.CycleError = CycleError;
class ClaimGraph {
    claims = new Map();
    add(claim) {
        if (!claim.id) {
            throw new Error('Claim invalido: id requerido');
        }
        if (!Array.isArray(claim.dependencies)) {
            throw new Error(`Claim '${claim.id}' invalida: dependencies debe ser un array`);
        }
        // Copia defensiva para que el caller no pueda mutar el grafo por referencia.
        this.claims.set(claim.id, {
            ...claim,
            dependencies: [...claim.dependencies],
        });
    }
    remove(claimId) {
        return this.claims.delete(claimId);
    }
    get(claimId) {
        const claim = this.claims.get(claimId);
        if (!claim)
            return undefined;
        return { ...claim, dependencies: [...claim.dependencies] };
    }
    all() {
        return Array.from(this.claims.values()).map((c) => ({
            ...c,
            dependencies: [...c.dependencies],
        }));
    }
    /**
     * Tarjan SCC. Devuelve sólo las componentes con ciclo (size > 1, o size 1
     * con auto-loop). Un grafo acíclico devuelve [].
     */
    detectCycles() {
        const ids = Array.from(this.claims.keys());
        const indexOf = new Map();
        const lowlink = new Map();
        const onStack = new Set();
        const stack = [];
        const sccs = [];
        let index = 0;
        const strongconnect = (v) => {
            indexOf.set(v, index);
            lowlink.set(v, index);
            index++;
            stack.push(v);
            onStack.add(v);
            const claim = this.claims.get(v);
            const deps = claim ? claim.dependencies : [];
            for (const w of deps) {
                if (!this.claims.has(w))
                    continue; // dep faltante: no afecta SCC
                const lowV = lowlink.get(v) ?? index;
                if (!indexOf.has(w)) {
                    strongconnect(w);
                    const lowW = lowlink.get(w) ?? index;
                    lowlink.set(v, Math.min(lowV, lowW));
                }
                else if (onStack.has(w)) {
                    const idxW = indexOf.get(w) ?? index;
                    lowlink.set(v, Math.min(lowV, idxW));
                }
            }
            if (lowlink.get(v) === indexOf.get(v)) {
                const component = [];
                let popped;
                do {
                    popped = stack.pop();
                    if (popped === undefined)
                        break;
                    onStack.delete(popped);
                    component.push(popped);
                } while (popped !== v);
                const head = component[0];
                const hasSelfLoop = component.length === 1 &&
                    head !== undefined &&
                    (this.claims.get(head)?.dependencies ?? []).includes(head);
                if (component.length > 1 || hasSelfLoop) {
                    // Orden estable: invertir para que el orden refleje el descubrimiento.
                    sccs.push(component.reverse());
                }
            }
        };
        for (const v of ids) {
            if (!indexOf.has(v))
                strongconnect(v);
        }
        return sccs;
    }
    /**
     * Orden topológico (Kahn) — claims sin dependencias primero, luego sus
     * consumidores. Tira CycleError si hay ciclo.
     *
     * Las dependencias faltantes (referidas pero no en el grafo) se ignoran
     * para el conteo de in-degree — son responsabilidad del evaluator.
     */
    topologicalOrder() {
        const cycles = this.detectCycles();
        if (cycles.length > 0)
            throw new CycleError(cycles);
        const inDegree = new Map();
        const dependents = new Map(); // id -> claims que lo necesitan
        for (const id of this.claims.keys()) {
            inDegree.set(id, 0);
            dependents.set(id, []);
        }
        for (const claim of this.claims.values()) {
            for (const dep of claim.dependencies) {
                if (!this.claims.has(dep))
                    continue;
                inDegree.set(claim.id, (inDegree.get(claim.id) ?? 0) + 1);
                const depList = dependents.get(dep);
                if (depList)
                    depList.push(claim.id);
            }
        }
        // Determinismo: ordenar la cola alfabéticamente para que el resultado
        // sea estable entre runs.
        const queue = [];
        for (const [id, deg] of inDegree) {
            if (deg === 0)
                queue.push(id);
        }
        queue.sort();
        const order = [];
        while (queue.length > 0) {
            const v = queue.shift();
            if (v === undefined)
                break;
            order.push(v);
            const consumers = [...(dependents.get(v) ?? [])].sort();
            for (const c of consumers) {
                const deg = (inDegree.get(c) ?? 0) - 1;
                inDegree.set(c, deg);
                if (deg === 0)
                    queue.push(c);
            }
        }
        // Defensa en profundidad: si detectCycles no detectó nada pero quedaron
        // nodos sin emitir, eso indica ciclo no cubierto (no debería ocurrir).
        if (order.length !== this.claims.size) {
            throw new CycleError([Array.from(this.claims.keys()).filter((id) => !order.includes(id))]);
        }
        return order;
    }
    /**
     * Valida todas las claims en orden topológico. Si una claim depende de
     * otra ya marcada inválida, se marca inválida con invalidatedBy = lista
     * de root claims inválidas en su árbol de dependencias.
     *
     * El evaluator sólo se invoca para claims cuyas dependencias son todas
     * válidas (short-circuit por propagación).
     */
    async validateAll(evaluator) {
        const order = this.topologicalOrder();
        const results = new Map();
        // invalidationRoots[claimId] = set de claims raíz inválidas que lo afectan.
        const invalidationRoots = new Map();
        for (const id of order) {
            const claim = this.claims.get(id);
            if (!claim)
                continue;
            const roots = new Set();
            for (const dep of claim.dependencies) {
                if (!this.claims.has(dep))
                    continue;
                const depRoots = invalidationRoots.get(dep);
                if (depRoots && depRoots.size > 0) {
                    for (const r of depRoots)
                        roots.add(r);
                }
            }
            if (roots.size > 0) {
                const invalidatedBy = Array.from(roots).sort();
                const validation = {
                    claimId: id,
                    valid: false,
                    invalidatedBy,
                    errors: [`invalidada por dependencias: ${invalidatedBy.join(', ')}`],
                };
                results.set(id, validation);
                invalidationRoots.set(id, roots);
                continue;
            }
            let evalResult;
            try {
                evalResult = await evaluator(claim);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                evalResult = { valid: false, errors: [`evaluator threw: ${message}`] };
            }
            const validation = {
                claimId: id,
                valid: evalResult.valid,
            };
            if (evalResult.result !== undefined)
                validation.result = evalResult.result;
            if (evalResult.errors && evalResult.errors.length > 0)
                validation.errors = evalResult.errors;
            results.set(id, validation);
            if (!evalResult.valid) {
                invalidationRoots.set(id, new Set([id]));
            }
            else {
                invalidationRoots.set(id, new Set());
            }
        }
        return order.map((id) => results.get(id)).filter((r) => r !== undefined);
    }
    /**
     * Todas las claims que dependen transitivamente de rootClaimId (sus
     * descendientes en el DAG de dependencias). El propio root NO se
     * incluye. Orden determinístico (BFS, alfabético dentro de cada nivel).
     */
    invalidationPath(rootClaimId) {
        if (!this.claims.has(rootClaimId))
            return [];
        const reverseAdj = new Map();
        for (const id of this.claims.keys())
            reverseAdj.set(id, []);
        for (const claim of this.claims.values()) {
            for (const dep of claim.dependencies) {
                if (!this.claims.has(dep))
                    continue;
                const list = reverseAdj.get(dep);
                if (list)
                    list.push(claim.id);
            }
        }
        const visited = new Set();
        const result = [];
        const queue = [...(reverseAdj.get(rootClaimId) ?? [])].sort();
        for (const id of queue)
            visited.add(id);
        while (queue.length > 0) {
            const v = queue.shift();
            if (v === undefined)
                break;
            result.push(v);
            const next = [...(reverseAdj.get(v) ?? [])].sort();
            for (const w of next) {
                if (!visited.has(w)) {
                    visited.add(w);
                    queue.push(w);
                }
            }
        }
        return result;
    }
}
exports.ClaimGraph = ClaimGraph;
//# sourceMappingURL=claim-graph.js.map