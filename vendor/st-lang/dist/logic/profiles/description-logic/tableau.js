"use strict";
// ============================================================
// ST Description Logic — Tableau de decisión para ALC
// ============================================================
// Procedimiento estándar de tableau con blocking (subset blocking)
// para garantizar terminación con TBox cíclica.
//
// Estado de la rama:
//   - individuals: id -> Set<conceptHash> (labels)
//   - roles:       roleName -> Array<[from, to]>
//   - blocked:     id -> id  (ancestro que bloquea, si aplica)
//
// Reglas:
//   ⊓: añade ambos children
//   ⊔: bifurca
//   ∃R.C: si no hay R-sucesor con C, crea fresh y, R(x,y), C(y)
//   ∀R.C: para todo R(x,y), añade C(y)
//
// Clash: A ∈ labels(x) y ¬A ∈ labels(x); o ⊥ ∈ labels(x).
//
// TBox internalization: cada axioma C ⊑ D se convierte en
// el concepto axiom = ¬C ⊔ D, que se añade a cada individuo
// (existente y futuro). C ≡ D se desdobla en C ⊑ D y D ⊑ C.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.conceptToString = void 0;
exports.isSatisfiable = isSatisfiable;
exports.isSubsumed = isSubsumed;
exports.isInstance = isInstance;
exports.classify = classify;
const types_1 = require("./types");
const nnf_1 = require("./nnf");
Object.defineProperty(exports, "conceptToString", { enumerable: true, get: function () { return nnf_1.conceptToString; } });
const MAX_INDIVIDUALS = 5000;
// ── Helpers ─────────────────────────────────────────────────
function makeBranch() {
    return {
        individuals: new Map(),
        roleAssertions: new Map(),
        tboxAxioms: [],
        pendingOr: [],
        processedOr: new Set(),
        freshCounter: 0,
    };
}
function cloneBranch(b) {
    const c = {
        individuals: new Map(),
        roleAssertions: new Map(),
        tboxAxioms: [...b.tboxAxioms],
        pendingOr: b.pendingOr.map((p) => ({
            indId: p.indId,
            disjuncts: [...p.disjuncts],
            sourceHash: p.sourceHash,
        })),
        processedOr: new Set(b.processedOr),
        freshCounter: b.freshCounter,
    };
    for (const [k, ind] of b.individuals) {
        c.individuals.set(k, {
            id: ind.id,
            labels: new Map(ind.labels),
            parent: ind.parent,
        });
    }
    for (const [role, pairs] of b.roleAssertions) {
        c.roleAssertions.set(role, pairs.map((p) => [p[0], p[1]]));
    }
    return c;
}
function getOrCreateIndividual(branch, id, parent) {
    let ind = branch.individuals.get(id);
    if (!ind) {
        ind = { id, labels: new Map(), parent };
        branch.individuals.set(id, ind);
    }
    return ind;
}
function freshIndividual(branch, parent) {
    const id = `_x${branch.freshCounter++}`;
    return getOrCreateIndividual(branch, id, parent);
}
function roleSuccessors(branch, role, from) {
    const pairs = branch.roleAssertions.get(role);
    if (!pairs)
        return [];
    const out = [];
    for (const [a, b] of pairs)
        if (a === from)
            out.push(b);
    return out;
}
function addRoleAssertion(branch, role, from, to) {
    let pairs = branch.roleAssertions.get(role);
    if (!pairs) {
        pairs = [];
        branch.roleAssertions.set(role, pairs);
    }
    // de-dup
    for (const [a, b] of pairs)
        if (a === from && b === to)
            return;
    pairs.push([from, to]);
}
/**
 * Subset blocking: un individuo anónimo x está bloqueado si existe un ancestro y
 * (a través de la cadena parent → parent) tal que labels(x) ⊆ labels(y).
 * Solo bloquea para conceptos generados por ∃ (no aplica a individuos de la ABox).
 */
function isBlocked(branch, indId) {
    const ind = branch.individuals.get(indId);
    if (!ind || !ind.parent)
        return false;
    // Solo fresh individuals son bloqueables.
    if (!indId.startsWith('_x'))
        return false;
    let ancestorId = ind.parent;
    while (ancestorId) {
        const anc = branch.individuals.get(ancestorId);
        if (!anc)
            break;
        if (subsetOf(ind.labels, anc.labels))
            return true;
        ancestorId = anc.parent || '';
    }
    return false;
}
function subsetOf(a, b) {
    for (const k of a.keys())
        if (!b.has(k))
            return false;
    return true;
}
// ── Adición de concepto al individuo ────────────────────────
/**
 * Añade `concept` (NNF) como label de `indId`. Devuelve:
 *   - 'clash' si la rama cierra
 *   - 'added' si era nuevo
 *   - 'dup'   si ya estaba
 */
function addLabel(branch, indId, concept) {
    if (concept.kind === 'bottom')
        return 'clash';
    if (concept.kind === 'top')
        return 'dup';
    const ind = getOrCreateIndividual(branch, indId);
    const h = (0, nnf_1.conceptHash)(concept);
    if (ind.labels.has(h))
        return 'dup';
    // Check clash con negación.
    const negH = (0, nnf_1.conceptHash)((0, nnf_1.toNNF)((0, types_1.not)(concept)));
    if (ind.labels.has(negH))
        return 'clash';
    ind.labels.set(h, concept);
    // Si era ⊓ → enqueuemos children directamente.
    if (concept.kind === 'and') {
        for (const c of concept.args || []) {
            const r = addLabel(branch, indId, c);
            if (r === 'clash')
                return 'clash';
        }
    }
    else if (concept.kind === 'or') {
        const sourceHash = `${indId}::${h}`;
        if (!branch.processedOr.has(sourceHash)) {
            branch.pendingOr.push({
                indId,
                disjuncts: concept.args || [],
                sourceHash,
            });
        }
    }
    return 'added';
}
// ── Aplicación de TBox al individuo ─────────────────────────
function applyTBoxTo(branch, indId) {
    for (const ax of branch.tboxAxioms) {
        const r = addLabel(branch, indId, ax);
        if (r === 'clash')
            return 'clash';
    }
    return 'ok';
}
// ── Reglas ∃ / ∀ ────────────────────────────────────────────
/**
 * Aplica una pasada de reglas determinísticas: ∀, ∃.
 * Devuelve true si se hizo algún cambio.
 */
function applyDeterministicRules(branch) {
    let changed = false;
    // ── ∀R.C: para cada individuo no bloqueado con ∀R.C y cada R(x,y), añade C(y)
    // Iteramos sobre un snapshot porque podemos crear nuevos sucesores.
    const indSnapshot = Array.from(branch.individuals.values());
    for (const ind of indSnapshot) {
        if (isBlocked(branch, ind.id))
            continue;
        for (const [, c] of ind.labels) {
            if (c.kind !== 'forall')
                continue;
            if (!c.role || !c.arg)
                continue;
            const role = c.role;
            const inner = c.arg;
            for (const succ of roleSuccessors(branch, role, ind.id)) {
                const succInd = branch.individuals.get(succ);
                if (!succInd)
                    continue;
                if (succInd.labels.has((0, nnf_1.conceptHash)(inner)))
                    continue;
                const r = addLabel(branch, succ, inner);
                if (r === 'clash')
                    return 'clash';
                if (r === 'added')
                    changed = true;
            }
        }
    }
    // ── ∃R.C: para cada individuo no bloqueado con ∃R.C que no tenga
    // un R-sucesor con C, crear uno fresh.
    // (Se aplica DESPUÉS de ∀ porque generar sucesor podría requerir refrescar.)
    const indSnapshot2 = Array.from(branch.individuals.values());
    for (const ind of indSnapshot2) {
        if (isBlocked(branch, ind.id))
            continue;
        for (const [, c] of ind.labels) {
            if (c.kind !== 'exists')
                continue;
            if (!c.role || !c.arg)
                continue;
            const role = c.role;
            const inner = c.arg;
            const innerH = (0, nnf_1.conceptHash)(inner);
            const succs = roleSuccessors(branch, role, ind.id);
            const satisfied = succs.some((s) => {
                const si = branch.individuals.get(s);
                return si ? si.labels.has(innerH) : false;
            });
            if (satisfied)
                continue;
            if (branch.individuals.size >= MAX_INDIVIDUALS) {
                // Tableau agotado — para ALC con blocking no debería pasar, pero
                // por defensa devolvemos stable para no diverger.
                return 'stable';
            }
            const fresh = freshIndividual(branch, ind.id);
            addRoleAssertion(branch, role, ind.id, fresh.id);
            // Aplicar TBox al recién nacido.
            const t = applyTBoxTo(branch, fresh.id);
            if (t === 'clash')
                return 'clash';
            const r1 = addLabel(branch, fresh.id, inner);
            if (r1 === 'clash')
                return 'clash';
            // Propagar ∀ del padre al recién nacido.
            for (const [, vc] of ind.labels) {
                if (vc.kind === 'forall' && vc.role === role && vc.arg) {
                    const r2 = addLabel(branch, fresh.id, vc.arg);
                    if (r2 === 'clash')
                        return 'clash';
                }
            }
            changed = true;
        }
    }
    return changed ? 'changed' : 'stable';
}
// ── Expansión principal ─────────────────────────────────────
function saturate(branch, depth) {
    if (depth > 1000)
        return true; // se considera abierta por defensa.
    // 1) Aplicar reglas determinísticas hasta estabilizar.
    for (;;) {
        const r = applyDeterministicRules(branch);
        if (r === 'clash')
            return false;
        if (r === 'stable')
            break;
    }
    // 2) Procesar próximo ⊔ pendiente.
    // Saltamos disyunciones cuyo individuo ya tiene un disyunto satisfecho.
    while (branch.pendingOr.length > 0) {
        const next = branch.pendingOr.shift();
        if (!next)
            break;
        if (branch.processedOr.has(next.sourceHash))
            continue;
        const ind = branch.individuals.get(next.indId);
        if (!ind) {
            branch.processedOr.add(next.sourceHash);
            continue;
        }
        // Si alguno de los disyuntos ya está en labels, no hace falta bifurcar.
        const alreadySatisfied = next.disjuncts.some((d) => ind.labels.has((0, nnf_1.conceptHash)(d)));
        if (alreadySatisfied) {
            branch.processedOr.add(next.sourceHash);
            continue;
        }
        branch.processedOr.add(next.sourceHash);
        // Bifurcar: probar cada disyunto.
        for (const d of next.disjuncts) {
            const child = cloneBranch(branch);
            const r = addLabel(child, next.indId, d);
            if (r === 'clash')
                continue;
            if (saturate(child, depth + 1))
                return true;
        }
        return false;
    }
    // 3) Sin más pendings ni cambios: rama abierta y saturada.
    return true;
}
// ── Carga de KB ─────────────────────────────────────────────
function internalizeTBox(branch, tbox) {
    for (const ax of tbox) {
        if (ax.kind === 'subsumes') {
            // C ⊑ D  ≡  ⊤ ⊑ ¬C ⊔ D
            const left = ax.left;
            const right = ax.right;
            branch.tboxAxioms.push((0, nnf_1.toNNF)((0, types_1.or)((0, types_1.not)(left), right)));
        }
        else if (ax.kind === 'equivalent') {
            const left = ax.left;
            const right = ax.right;
            branch.tboxAxioms.push((0, nnf_1.toNNF)((0, types_1.or)((0, types_1.not)(left), right)));
            branch.tboxAxioms.push((0, nnf_1.toNNF)((0, types_1.or)((0, types_1.not)(right), left)));
        }
        // instance / role-instance no son TBox — se ignoran aquí.
    }
}
function loadABox(branch, abox) {
    // Primero crear todos los individuos referenciados.
    const seen = new Set();
    const ensure = (id) => {
        if (seen.has(id))
            return;
        seen.add(id);
        getOrCreateIndividual(branch, id);
    };
    for (const ax of abox) {
        if (ax.kind === 'instance')
            ensure(ax.left);
        if (ax.kind === 'role-instance') {
            ensure(ax.left);
            ensure(ax.right);
        }
    }
    // Aplicar TBox a todos los individuos existentes.
    for (const id of seen) {
        if (applyTBoxTo(branch, id) === 'clash')
            return 'clash';
    }
    // Cargar asertions.
    for (const ax of abox) {
        if (ax.kind === 'instance') {
            const c = (0, nnf_1.toNNF)(ax.right);
            if (addLabel(branch, ax.left, c) === 'clash')
                return 'clash';
        }
        else if (ax.kind === 'role-instance') {
            if (!ax.role)
                continue;
            addRoleAssertion(branch, ax.role, ax.left, ax.right);
        }
    }
    return 'ok';
}
// ── API pública ─────────────────────────────────────────────
/**
 * Decide si `concept` es satisfacible (eventualmente bajo la KB).
 * Construye un tableau iniciando con un individuo fresco x : concept,
 * y aplica las reglas hasta cerrar todas las ramas o encontrar una abierta.
 */
function isSatisfiable(concept, kb) {
    const branch = makeBranch();
    if (kb)
        internalizeTBox(branch, kb.tbox);
    // Si hay KB no-vacía, cargamos su ABox primero (puede ya cerrar).
    if (kb && kb.abox.length > 0) {
        if (loadABox(branch, kb.abox) === 'clash')
            return false;
    }
    // Individuo testigo para `concept`.
    const witness = '_root';
    getOrCreateIndividual(branch, witness);
    if (applyTBoxTo(branch, witness) === 'clash')
        return false;
    if (addLabel(branch, witness, (0, nnf_1.toNNF)(concept)) === 'clash')
        return false;
    return saturate(branch, 0);
}
/**
 * Decide si `sub ⊑ sup` (bajo la KB). Equivale a: ¬(sub ⊓ ¬sup) es válida,
 * o sea, `sub ⊓ ¬sup` es insatisfacible.
 */
function isSubsumed(sub, sup, kb) {
    const probe = (0, types_1.and)(sub, (0, types_1.not)(sup));
    return !isSatisfiable(probe, kb);
}
/**
 * Decide si `individual` es instancia de `concept` bajo la KB.
 * Equivale a: KB ∪ {individual : ¬concept} es inconsistente.
 */
function isInstance(individual, concept, kb) {
    // Construimos una KB extendida con el axioma de instancia negada.
    const extended = {
        tbox: kb.tbox,
        abox: [...kb.abox, { kind: 'instance', left: individual, right: (0, types_1.not)(concept) }],
    };
    // El test es: ¿es la KB consistente? Si NO lo es, individuo es instancia.
    const branch = makeBranch();
    internalizeTBox(branch, extended.tbox);
    if (loadABox(branch, extended.abox) === 'clash')
        return true;
    // Aún si la ABox carga sin clash inmediato, hay que saturar.
    // Iniciamos saturación sin "concepto probe": el branch ya contiene
    // todas las afirmaciones de la KB extendida.
    // Si saturate devuelve true (abierta) → consistente → NO es instancia.
    // Si saturate devuelve false (cerrada) → inconsistente → SÍ es instancia.
    return !saturate(branch, 0);
}
/**
 * Clasificación: produce taxonomía de conceptos atómicos de la KB.
 * Devuelve Map<conceptName, Set<conceptName>> donde `Set` contiene
 * los conceptos atómicos que subsumen al name (es decir: superconceptos).
 * ⊤ y ⊥ se incluyen siempre.
 */
function classify(kb) {
    const names = collectAtomicNames(kb);
    names.add('⊤');
    names.add('⊥');
    const result = new Map();
    for (const n of names)
        result.set(n, new Set());
    const conceptOf = (n) => {
        if (n === '⊤')
            return types_1.TOP;
        if (n === '⊥')
            return types_1.BOTTOM;
        return (0, types_1.atomic)(n);
    };
    for (const sub of names) {
        const subSet = result.get(sub);
        if (!subSet)
            continue;
        const subC = conceptOf(sub);
        // ¿es satisfacible sub bajo KB? Si no, sub ≡ ⊥ → subsumido por todo.
        const subSat = isSatisfiable(subC, kb);
        if (!subSat) {
            // sub es ⊥ bajo la KB: subsumido por todos.
            for (const sup of names)
                subSet.add(sup);
            continue;
        }
        for (const sup of names) {
            if (sub === sup) {
                subSet.add(sup);
                continue;
            }
            const supC = conceptOf(sup);
            if (isSubsumed(subC, supC, kb)) {
                subSet.add(sup);
            }
        }
    }
    return result;
}
function collectAtomicNames(kb) {
    const out = new Set();
    const walk = (c) => {
        if (c.kind === 'atomic' && c.name)
            out.add(c.name);
        if (c.arg)
            walk(c.arg);
        if (c.args)
            for (const a of c.args)
                walk(a);
    };
    for (const ax of kb.tbox) {
        if (typeof ax.left !== 'string')
            walk(ax.left);
        if (typeof ax.right !== 'string')
            walk(ax.right);
    }
    for (const ax of kb.abox) {
        if (typeof ax.right !== 'string')
            walk(ax.right);
    }
    return out;
}
//# sourceMappingURL=tableau.js.map