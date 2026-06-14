"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRenameCounter = resetRenameCounter;
exports.renameClause = renameClause;
exports.binaryResolve = binaryResolve;
exports.hyperresolve = hyperresolve;
exports.hyperresolveMany = hyperresolveMany;
exports.factor = factor;
exports.dedupLiterals = dedupLiterals;
exports.isTautology = isTautology;
const unify_1 = require("./unify");
let renameCounter = 0;
function resetRenameCounter() {
    renameCounter = 0;
}
/**
 * Renombra todas las variables de una cláusula con sufijos frescos, para
 * evitar captura accidental al resolver con otra cláusula.
 */
function renameClause(c) {
    renameCounter += 1;
    const suffix = `_r${renameCounter}`;
    const cache = new Map();
    return {
        literals: c.literals.map((l) => ({
            negated: l.negated,
            predicate: l.predicate,
            args: l.args.map((a) => renameTerm(a, suffix, cache)),
        })),
        parents: c.parents,
        fromGoal: c.fromGoal,
    };
}
function renameTerm(t, suffix, cache) {
    if (t.kind === 'variable') {
        const existing = cache.get(t.name);
        if (existing)
            return existing;
        const fresh = { kind: 'variable', name: `${t.name}${suffix}` };
        cache.set(t.name, fresh);
        return fresh;
    }
    return {
        kind: 'function',
        name: t.name,
        args: t.args.map((a) => renameTerm(a, suffix, cache)),
    };
}
/**
 * Resolución binaria: une dos cláusulas eliminando un par de literales
 * complementarias unificables. Devuelve cero o más resolventes (uno por par
 * de literales complementarias que unifiquen).
 */
function binaryResolve(a, b) {
    const out = [];
    const aR = renameClause(a);
    const bR = renameClause(b);
    for (let i = 0; i < aR.literals.length; i++) {
        for (let j = 0; j < bR.literals.length; j++) {
            const la = aR.literals[i];
            const lb = bR.literals[j];
            if (!la || !lb)
                continue;
            if (la.negated === lb.negated)
                continue;
            const sub = (0, unify_1.unifyLiterals)({ ...la, negated: false }, { ...lb, negated: false });
            if (!sub)
                continue;
            const remaining = [];
            for (let k = 0; k < aR.literals.length; k++) {
                if (k === i)
                    continue;
                const lit = aR.literals[k];
                if (lit)
                    remaining.push((0, unify_1.applySubToLiteral)(lit, sub));
            }
            for (let k = 0; k < bR.literals.length; k++) {
                if (k === j)
                    continue;
                const lit = bR.literals[k];
                if (lit)
                    remaining.push((0, unify_1.applySubToLiteral)(lit, sub));
            }
            out.push({ clause: dedupLiterals({ literals: remaining }), sub });
        }
    }
    return out;
}
/**
 * Hyperresolución: en un solo paso, elimina **todas** las literales negativas
 * de un "núcleo" (nucleus) usando cláusulas auxiliares positivas (electrons)
 * que sean unitarias o tengan sólo literales positivas. El resultado es una
 * cláusula con sólo literales positivas (positive hyperresolvent).
 *
 * `positive` aquí es una lista; en la práctica el caller pasa cláusulas
 * positivas candidatas y la función produce todos los hyperresolventes
 * posibles del núcleo contra ese conjunto. Para mantener la API del spec,
 * exportamos `hyperresolve(positive, nucleus)` con la primera cláusula como
 * electron (cubre el caso "3 units + nucleus" si se llama en cadena).
 */
function hyperresolve(positive, nucleus) {
    return hyperresolveMany([positive], nucleus).map((r) => r.clause);
}
function hyperresolveMany(positives, nucleus) {
    // Núcleo debe tener al menos una literal negativa para ser candidato.
    const negativeIdxs = nucleus.literals
        .map((l, i) => ({ l, i }))
        .filter(({ l }) => l && l.negated)
        .map(({ i }) => i);
    if (negativeIdxs.length === 0)
        return [];
    // Electrons válidos: cláusulas con sólo literales positivas (≥1 literal).
    const electrons = positives.filter((c) => c.literals.length > 0 && c.literals.every((l) => !l.negated));
    if (electrons.length === 0)
        return [];
    const nucleusR = renameClause(nucleus);
    // Re-mapear índices originales tras el renombre (mismo orden).
    const negIdxsRenamed = nucleusR.literals
        .map((l, i) => ({ l, i }))
        .filter(({ l }) => l && l.negated)
        .map(({ i }) => i);
    const start = {
        nucleus: nucleusR,
        remaining: negIdxsRenamed,
        sub: new Map(),
        used: [],
    };
    const results = [];
    const stack = [start];
    while (stack.length > 0) {
        const state = stack.pop();
        if (!state)
            break;
        if (state.remaining.length === 0) {
            // Todas las literales negativas eliminadas → emitir el residual.
            const survivors = [];
            const removedSet = new Set(negIdxsRenamed);
            for (let i = 0; i < state.nucleus.literals.length; i++) {
                if (removedSet.has(i))
                    continue;
                const lit = state.nucleus.literals[i];
                if (lit)
                    survivors.push((0, unify_1.applySubToLiteral)(lit, state.sub));
            }
            results.push({
                clause: dedupLiterals({ literals: survivors }),
                sub: state.sub,
                usedElectrons: state.used,
            });
            continue;
        }
        const targetIdx = state.remaining[0];
        if (targetIdx === undefined)
            continue;
        const target = state.nucleus.literals[targetIdx];
        if (!target)
            continue;
        const targetApplied = (0, unify_1.applySubToLiteral)(target, state.sub);
        for (let ei = 0; ei < electrons.length; ei++) {
            const electron = electrons[ei];
            if (!electron)
                continue;
            const eR = renameClause(electron);
            for (let li = 0; li < eR.literals.length; li++) {
                const candidate = eR.literals[li];
                if (!candidate)
                    continue;
                const partial = (0, unify_1.unifyLiterals)({ ...targetApplied, negated: false }, { ...candidate, negated: false });
                if (!partial)
                    continue;
                // Componer sustituciones
                const combined = new Map();
                for (const [k, v] of state.sub)
                    combined.set(k, (0, unify_1.applySubToTerm)(v, partial));
                for (const [k, v] of partial) {
                    if (!combined.has(k))
                        combined.set(k, v);
                }
                // Si el electron tiene más literales (no unitario), se añaden al residual.
                const extra = [];
                for (let k = 0; k < eR.literals.length; k++) {
                    if (k === li)
                        continue;
                    const ex = eR.literals[k];
                    if (ex)
                        extra.push(ex);
                }
                // Extender la cláusula del núcleo con las extras (vía agregar al final
                // como literales aplicadas, manteniendo índices remaining intactos).
                const extendedNucleus = {
                    literals: [...state.nucleus.literals, ...extra],
                    parents: state.nucleus.parents,
                    fromGoal: state.nucleus.fromGoal,
                };
                stack.push({
                    nucleus: extendedNucleus,
                    remaining: state.remaining.slice(1),
                    sub: combined,
                    used: [...state.used, ei],
                });
            }
        }
    }
    return results;
}
/**
 * Factoring: si dos literales del mismo signo unifican, colapsarlas reduce la
 * cláusula. Indispensable para completar la resolución.
 */
function factor(c) {
    const out = [];
    for (let i = 0; i < c.literals.length; i++) {
        for (let j = i + 1; j < c.literals.length; j++) {
            const li = c.literals[i];
            const lj = c.literals[j];
            if (!li || !lj)
                continue;
            if (li.negated !== lj.negated)
                continue;
            const sub = (0, unify_1.unifyLiterals)({ ...li, negated: false }, { ...lj, negated: false });
            if (!sub)
                continue;
            const survivors = [];
            for (let k = 0; k < c.literals.length; k++) {
                if (k === j)
                    continue;
                const lit = c.literals[k];
                if (lit)
                    survivors.push((0, unify_1.applySubToLiteral)(lit, sub));
            }
            out.push(dedupLiterals({ literals: survivors }));
        }
    }
    return out;
}
function dedupLiterals(c) {
    const seen = [];
    for (const l of c.literals) {
        if (!seen.some((s) => (0, unify_1.literalsEqual)(s, l)))
            seen.push(l);
    }
    return { literals: seen, parents: c.parents, fromGoal: c.fromGoal };
}
/** Detecta cláusulas tautológicas (P ∨ ¬P). */
function isTautology(c) {
    for (let i = 0; i < c.literals.length; i++) {
        for (let j = i + 1; j < c.literals.length; j++) {
            const li = c.literals[i];
            const lj = c.literals[j];
            if (!li || !lj)
                continue;
            if (li.negated === lj.negated)
                continue;
            if (li.predicate !== lj.predicate)
                continue;
            if (li.args.length !== lj.args.length)
                continue;
            let same = true;
            for (let k = 0; k < li.args.length; k++) {
                const a = li.args[k];
                const b = lj.args[k];
                if (!a || !b) {
                    same = false;
                    break;
                }
                if (!termsEqualLocal(a, b)) {
                    same = false;
                    break;
                }
            }
            if (same)
                return true;
        }
    }
    return false;
}
function termsEqualLocal(a, b) {
    if (a.kind !== b.kind)
        return false;
    if (a.kind === 'variable' && b.kind === 'variable')
        return a.name === b.name;
    if (a.kind === 'function' && b.kind === 'function') {
        if (a.name !== b.name || a.args.length !== b.args.length)
            return false;
        for (let i = 0; i < a.args.length; i++) {
            const ai = a.args[i];
            const bi = b.args[i];
            if (ai === undefined || bi === undefined)
                return false;
            if (!termsEqualLocal(ai, bi))
                return false;
        }
        return true;
    }
    return false;
}
//# sourceMappingURL=resolve.js.map