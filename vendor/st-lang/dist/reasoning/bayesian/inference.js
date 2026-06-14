"use strict";
// ============================================================
// Bayesian Inference — Algorithms
// ============================================================
//
// - jointProbability: producto P(Xᵢ | parents(Xᵢ)) sobre asignación completa.
// - variableElimination: P(Q | E) marginalizando variables no-evidencia.
// - query: alias semántico de variableElimination.
// - mostProbableExplanation: MAP/MPE sobre variables no-evidencia.
Object.defineProperty(exports, "__esModule", { value: true });
exports.jointProbability = jointProbability;
exports.variableElimination = variableElimination;
exports.query = query;
exports.mostProbableExplanation = mostProbableExplanation;
const factor_1 = require("./factor");
// ── Validación ───────────────────────────────────────────────
function indexCPTs(net) {
    const m = new Map();
    for (const c of net.cpts)
        m.set(c.variable, c);
    return m;
}
function assertVariableExists(net, name) {
    if (!net.variables.some((v) => v.name === name)) {
        throw new Error(`Variable "${name}" no existe en la red`);
    }
}
function assertEvidenceValid(net, evidence) {
    for (const [k, v] of Object.entries(evidence)) {
        const dvar = net.variables.find((x) => x.name === k);
        if (!dvar)
            throw new Error(`Evidencia "${k}" no existe en la red`);
        if (!dvar.values.includes(v)) {
            throw new Error(`Evidencia "${k}=${v}" fuera del dominio [${dvar.values.join(', ')}]`);
        }
    }
}
// ── jointProbability ─────────────────────────────────────────
function jointProbability(net, assignment) {
    // Toda variable de la red debe estar asignada y dentro del dominio.
    for (const v of net.variables) {
        const val = assignment[v.name];
        if (val === undefined) {
            throw new Error(`Asignación incompleta: falta "${v.name}"`);
        }
        if (!v.values.includes(val)) {
            throw new Error(`Valor "${val}" fuera del dominio de "${v.name}" [${v.values.join(', ')}]`);
        }
    }
    const cptIndex = indexCPTs(net);
    let p = 1;
    for (const v of net.variables) {
        const cpt = cptIndex.get(v.name);
        if (!cpt)
            throw new Error(`Sin CPT para "${v.name}"`);
        const parentKey = (0, factor_1.buildParentKey)(cpt.parents, assignment);
        const row = cpt.entries[parentKey];
        if (!row) {
            throw new Error(`CPT incompleta: falta fila "${parentKey}" para "${v.name}"`);
        }
        const prob = row[assignment[v.name]];
        if (prob === undefined) {
            throw new Error(`CPT incompleta: sin entrada para "${v.name}=${assignment[v.name]}"`);
        }
        p *= prob;
    }
    return p;
}
// ── Heurística de orden de eliminación ───────────────────────
//
// Min-fill simple: eliminar primero la variable cuya remoción
// agrega menos aristas al gráfico residual. Implementación O(n²)
// — suficiente para redes pequeñas. Para redes triviales con
// pocas variables el costo es despreciable.
function eliminationOrder(toEliminate, factors) {
    const remaining = new Set(toEliminate);
    const order = [];
    const factorsAlive = factors.slice();
    while (remaining.size > 0) {
        let best = null;
        let bestCost = Infinity;
        for (const v of remaining) {
            const involved = factorsAlive.filter((f) => f.variables.includes(v));
            const merged = new Set();
            for (const f of involved)
                for (const x of f.variables)
                    merged.add(x);
            merged.delete(v);
            const cost = merged.size; // proxy del tamaño del cluster
            if (cost < bestCost) {
                bestCost = cost;
                best = v;
            }
        }
        if (best === null)
            break;
        order.push(best);
        remaining.delete(best);
        // simular eliminación: reemplazar factores involucrados por uno fusionado
        const involved = factorsAlive.filter((f) => f.variables.includes(best));
        const others = factorsAlive.filter((f) => !f.variables.includes(best));
        const mergedVars = new Set();
        const mergedDomains = {};
        for (const f of involved) {
            for (const v of f.variables) {
                if (v === best)
                    continue;
                mergedVars.add(v);
                mergedDomains[v] = f.domains[v] ?? [];
            }
        }
        const fakeFactor = {
            variables: Array.from(mergedVars).sort(),
            domains: mergedDomains,
            values: new Map(),
        };
        factorsAlive.length = 0;
        factorsAlive.push(...others, fakeFactor);
    }
    return order;
}
// ── variableElimination ──────────────────────────────────────
function variableElimination(net, queryVar, evidence = {}) {
    assertVariableExists(net, queryVar);
    assertEvidenceValid(net, evidence);
    if (queryVar in evidence) {
        // Si la query está observada, el posterior es degenerado.
        const qVar = net.variables.find((v) => v.name === queryVar);
        if (qVar === undefined)
            throw new Error(`variableElimination: variable "${queryVar}" no encontrada`);
        const qDomain = qVar.values;
        const dist = {};
        const out = {};
        for (const val of qDomain)
            out[val] = val === evidence[queryVar] ? 1 : 0;
        void dist;
        return { variable: queryVar, distribution: out };
    }
    const domains = (0, factor_1.variableDomainsOf)(net);
    // 1. Construir factores desde CPTs, restringidos por evidencia.
    let factors = net.cpts.map((cpt) => {
        const f = (0, factor_1.factorFromCPT)(cpt, domains);
        return (0, factor_1.restrictFactor)(f, evidence);
    });
    // 2. Determinar variables a eliminar (todas menos query y evidencia).
    const toEliminate = net.variables
        .map((v) => v.name)
        .filter((n) => n !== queryVar && !(n in evidence));
    const order = eliminationOrder(toEliminate, factors);
    // 3. Eliminar cada variable: multiplicar todos los factores que la contengan
    //    y sumar-marginalizar.
    for (const v of order) {
        const involved = factors.filter((f) => f.variables.includes(v));
        const others = factors.filter((f) => !f.variables.includes(v));
        if (involved.length === 0)
            continue;
        let product = involved[0];
        for (let i = 1; i < involved.length; i++) {
            product = (0, factor_1.multiplyFactors)(product, involved[i]);
        }
        const reduced = (0, factor_1.sumOut)(product, v);
        factors = [...others, reduced];
    }
    // 4. Multiplicar los factores restantes (todos sobre queryVar tras la elim).
    let result = factors[0];
    for (let i = 1; i < factors.length; i++) {
        result = (0, factor_1.multiplyFactors)(result, factors[i]);
    }
    // 5. Normalizar.
    const normalized = (0, factor_1.normalizeFactor)(result);
    // 6. Extraer la distribución sobre la query.
    const distribution = {};
    const qVarDef = net.variables.find((v) => v.name === queryVar);
    if (qVarDef === undefined)
        throw new Error(`variableElimination: variable "${queryVar}" no encontrada`);
    const qDomain = qVarDef.values;
    for (const val of qDomain) {
        const key = (0, factor_1.assignmentKey)([queryVar], { [queryVar]: val });
        distribution[val] = normalized.values.get(key) ?? 0;
    }
    return { variable: queryVar, distribution };
}
// ── query (alias semántico) ──────────────────────────────────
function query(net, queryVar, evidence = {}) {
    return variableElimination(net, queryVar, evidence);
}
// ── Most Probable Explanation (MPE / MAP completo) ───────────
//
// Devuelve la asignación de máxima probabilidad sobre todas las
// variables no observadas, dada la evidencia. Implementación:
// max-product variable elimination con tracking de backpointers.
function mostProbableExplanation(net, evidence = {}) {
    assertEvidenceValid(net, evidence);
    const domains = (0, factor_1.variableDomainsOf)(net);
    let factors = net.cpts.map((cpt) => {
        const f = (0, factor_1.factorFromCPT)(cpt, domains);
        return (0, factor_1.restrictFactor)(f, evidence);
    });
    const toEliminate = net.variables.map((v) => v.name).filter((n) => !(n in evidence));
    // Para reconstruir el argmax necesitamos eliminar en un orden
    // determinístico y guardar, en cada paso, la mejor asignación
    // de la variable eliminada como función de las restantes.
    const order = eliminationOrder(toEliminate, factors);
    const steps = [];
    for (const v of order) {
        const involved = factors.filter((f) => f.variables.includes(v));
        const others = factors.filter((f) => !f.variables.includes(v));
        if (involved.length === 0)
            continue;
        let product = involved[0];
        for (let i = 1; i < involved.length; i++) {
            product = (0, factor_1.multiplyFactors)(product, involved[i]);
        }
        const contextVars = product.variables.filter((x) => x !== v);
        // Construir chooser: para cada asignación de contextVars,
        // qué valor de v maximiza el producto.
        const chooser = new Map();
        const best = new Map();
        for (const [key, val] of product.values) {
            const assign = (0, factor_1.parseAssignmentKey)(key);
            const ctx = {};
            for (const c of contextVars)
                ctx[c] = assign[c] ?? '';
            const ctxKey = (0, factor_1.assignmentKey)(contextVars, ctx);
            const prev = best.get(ctxKey);
            if (prev === undefined || val > prev) {
                best.set(ctxKey, val);
                chooser.set(ctxKey, assign[v]);
            }
        }
        steps.push({ variable: v, contextVars, chooser });
        const { factor: reduced } = (0, factor_1.maxOut)(product, v);
        factors = [...others, reduced];
    }
    // Tras eliminar todas las variables no-evidencia, queda un
    // factor escalar (sin variables). La asignación óptima se
    // reconstruye recorriendo `steps` en orden inverso.
    const assignment = { ...evidence };
    for (let i = steps.length - 1; i >= 0; i--) {
        const step = steps[i];
        const ctx = {};
        for (const c of step.contextVars) {
            const val = assignment[c];
            if (val === undefined) {
                // No debería ocurrir si el orden es válido — defensa.
                ctx[c] = '';
            }
            else {
                ctx[c] = val;
            }
        }
        const ctxKey = (0, factor_1.assignmentKey)(step.contextVars, ctx);
        const chosen = step.chooser.get(ctxKey);
        if (chosen !== undefined) {
            assignment[step.variable] = chosen;
        }
        else {
            // Fallback: primer valor del dominio. Solo posible con CPT degenerada.
            const dom = domains[step.variable];
            if (dom && dom.length > 0)
                assignment[step.variable] = dom[0] ?? '';
        }
    }
    return assignment;
}
//# sourceMappingURL=inference.js.map