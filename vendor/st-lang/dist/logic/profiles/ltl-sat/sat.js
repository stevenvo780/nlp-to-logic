"use strict";
// ============================================================
// ST LTL-SAT — Decisor SAT vía búsqueda de lazo aceptante
// ============================================================
// Algoritmo (Vardi-Wolper en versión explícita):
//
//   1. NNF + clausura + enumerar atoms localmente consistentes.
//   2. Construir relación de transición sobre atoms.
//   3. Filtrar atoms iniciales: aquellos que contienen φ.
//   4. SAT(φ) ⇔ existe lazo (prefix → loop) accesible desde un
//      atom inicial donde, para cada eventualidad presente en
//      cualquier atom del lazo, hay un atom del lazo donde el
//      "witness" está presente.
//
// La construcción es exponencial en |φ|; suficiente para fórmulas
// pedagógicas y tests (≤ ~15 operadores). No es competitivo con
// SPOT, pero es correcto y didáctico.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSatisfiable = isSatisfiable;
exports.isValid = isValid;
exports.toBuchi = toBuchi;
const tableau_1 = require("./tableau");
const types_1 = require("./types");
function buildModel(phi) {
    const nnf = (0, tableau_1.toNNF)(phi);
    const close = (0, tableau_1.closure)(nnf);
    const atoms = (0, tableau_1.enumerateAtoms)(close);
    const succ = (0, tableau_1.transitions)(atoms);
    const initialKey = (0, types_1.formulaKey)(nnf);
    const initialIds = atoms.filter((a) => a.formulas.has(initialKey)).map((a) => a.id);
    return { atoms, succ, initialIds };
}
// Para cada eventualidad que aparece en algún atom del ciclo, debe haber
// un atom del ciclo donde el witness se cumple. Verificamos sobre la
// secuencia ordenada `loop`.
function fulfillsAllEventualities(atoms, loop) {
    // Recolectamos las eventualidades que aparecen en TODOS los estados
    // del lazo (porque cuando una eventualidad cruza el corte X-F φ del lazo
    // debe cumplirse). Más simple: para cada eventualidad presente en al
    // menos un estado del ciclo, debe haber un estado con el witness.
    const pendingByEv = new Map();
    for (const id of loop) {
        const a = atoms[id];
        for (const ev of (0, tableau_1.eventualitiesIn)(a)) {
            if (!pendingByEv.has(ev.key))
                pendingByEv.set(ev.key, ev.witnessFormulaKey);
        }
    }
    for (const [, witnessKey] of pendingByEv) {
        let satisfied = false;
        for (const id of loop) {
            if (atoms[id].formulas.has(witnessKey)) {
                satisfied = true;
                break;
            }
        }
        if (!satisfied)
            return false;
    }
    return true;
}
// Búsqueda: DFS desde cada inicial, explorando todos los caminos
// simples extendidos en busca de un lazo aceptante. Como los grafos son
// pequeños (caps internos), una exploración exhaustiva acotada basta.
function searchLasso(model) {
    const { atoms, succ, initialIds } = model;
    const N = atoms.length;
    if (N === 0 || initialIds.length === 0)
        return null;
    // Soft cap para evitar explosión combinatoria.
    const MAX_PATH_LEN = Math.min(N + 6, 60);
    for (const start of initialIds) {
        const path = [start];
        const pathPos = new Map();
        pathPos.set(start, 0);
        const found = dfs(start, path, pathPos);
        if (found)
            return found;
    }
    return null;
    function dfs(node, path, pathPos) {
        const successors = succ.get(node) ?? [];
        for (const next of successors) {
            const cycleIdx = pathPos.get(next);
            if (cycleIdx !== undefined) {
                // Tenemos lazo: prefix = path[0..idx-1], loop = path[idx..end].
                const prefix = path.slice(0, cycleIdx);
                const loop = path.slice(cycleIdx);
                if (loop.length > 0 && fulfillsAllEventualities(atoms, loop)) {
                    return { prefix, loop };
                }
                // Si no aceptante, intentamos otros sucesores (no recursamos por
                // este nodo ya visitado en el path actual).
                continue;
            }
            if (path.length >= MAX_PATH_LEN)
                continue;
            path.push(next);
            pathPos.set(next, path.length - 1);
            const r = dfs(next, path, pathPos);
            if (r)
                return r;
            path.pop();
            pathPos.delete(next);
        }
        return null;
    }
}
function atomLabel(a) {
    return (0, tableau_1.describeAtom)(a);
}
function isSatisfiable(phi) {
    const model = buildModel(phi);
    const lasso = searchLasso(model);
    if (!lasso)
        return { sat: false };
    const witness = {
        prefix: lasso.prefix.map((id) => atomLabel(model.atoms[id])),
        loop: lasso.loop.map((id) => atomLabel(model.atoms[id])),
    };
    return { sat: true, witness };
}
function isValid(phi) {
    const negated = (0, types_1.not)(phi);
    return !isSatisfiable(negated).sat;
}
// Estimación de tamaño del autómata estilo Büchi: cuenta atoms (estados)
// y cuántos de ellos pueden ser "aceptantes" para alguna eventualidad
// (heurística simple: estados que no tienen eventualidades pendientes).
function toBuchi(phi) {
    const model = buildModel(phi);
    let accepting = 0;
    for (const a of model.atoms) {
        if ((0, tableau_1.eventualitiesIn)(a).length === 0)
            accepting += 1;
    }
    return { states: model.atoms.length, accepting };
}
//# sourceMappingURL=sat.js.map