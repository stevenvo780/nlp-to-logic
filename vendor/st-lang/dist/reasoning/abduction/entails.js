"use strict";
// ============================================================
// ST Abduction — Oráculo de entailment por defecto
// ============================================================
//
// Implementación de entailment por forward-chaining sobre un
// fragmento Horn con unificación simple:
//
//   Sintaxis soportada:
//     - Átomos:   `p`, `bird(tweety)`, `parent(alice, bob)`
//     - Reglas:   `A → B`  (también acepta `->`)
//     - Reglas conjuntivas: `A ∧ B → C` (también `&&`, `and`, `,`)
//     - Negación de conclusión: `A → ¬B` (también `~B`, `!B`)
//
//   Variables: identificadores que empiezan con letra minúscula y
//   están dentro de argumentos de un predicado son variables
//   universalmente cuantificadas (estilo Prolog implícito).
//   Constantes: empiezan con mayúscula o son nombres entre comillas;
//   los demás identificadores se tratan como variables si están
//   dentro de un predicado.
//
//   Por convención de los tests del usuario, `bird(x)` tiene `x` como
//   variable y `bird(tweety)` tiene `tweety` como constante: usamos
//   un set de "variable names" configurable, default = nombres de
//   una sola letra ASCII minúscula (`x`, `y`, `z`, `u`, `v`, `w`).
//
// Limitaciones consciente: no es un demostrador FOL completo. Es
// suficiente para los casos de abducción típicos (diagnóstico,
// Horn-like). Para fragmentos más ricos, pasar un `EntailmentOracle`
// custom.
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEntails = defaultEntails;
exports.defaultConsistent = defaultConsistent;
// Reservamos un set chico de variable-names canónicas. Para casos
// que necesiten más, pasar un EntailmentOracle propio.
const DEFAULT_VARS = new Set(['x', 'y', 'z', 'u', 'v', 'w']);
function tokenizeArgs(s) {
    const out = [];
    let depth = 0;
    let cur = '';
    for (const ch of s) {
        if (ch === '(') {
            depth++;
            cur += ch;
        }
        else if (ch === ')') {
            depth--;
            cur += ch;
        }
        else if (ch === ',' && depth === 0) {
            out.push(cur.trim());
            cur = '';
        }
        else {
            cur += ch;
        }
    }
    if (cur.trim().length > 0)
        out.push(cur.trim());
    return out;
}
function parseAtom(rawIn) {
    let raw = rawIn.trim();
    let negated = false;
    while (raw.startsWith('¬') || raw.startsWith('~') || raw.startsWith('!')) {
        negated = !negated;
        raw = raw.slice(1).trim();
    }
    const lp = raw.indexOf('(');
    if (lp === -1) {
        return { predicate: raw, args: [], negated };
    }
    const rp = raw.lastIndexOf(')');
    if (rp === -1 || rp < lp) {
        return { predicate: raw, args: [], negated };
    }
    const predicate = raw.slice(0, lp).trim();
    const argsRaw = raw.slice(lp + 1, rp);
    const args = tokenizeArgs(argsRaw);
    return { predicate, args, negated };
}
function splitImplication(formula) {
    // Soportar → (→), -> y =>.
    const arrows = ['→', '->', '=>'];
    for (const arr of arrows) {
        const idx = formula.indexOf(arr);
        if (idx >= 0) {
            return {
                lhs: formula.slice(0, idx).trim(),
                rhs: formula.slice(idx + arr.length).trim(),
            };
        }
    }
    return null;
}
function splitConjunction(lhs) {
    // Soportar ∧, &&, ` and ` (con espacios), y ',' (a tope).
    // Procesamos a profundidad-0 para no romper args(a, b).
    const seps = ['∧', '&&'];
    for (const s of seps) {
        if (lhs.includes(s)) {
            return lhs
                .split(s)
                .map((p) => p.trim())
                .filter((p) => p.length > 0);
        }
    }
    // ' and ' como separador case-insensitive.
    const andRegex = /\s+and\s+/i;
    if (andRegex.test(lhs)) {
        return lhs
            .split(andRegex)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
    }
    // ',' a profundidad 0 (no dentro de args(...)).
    const parts = [];
    let depth = 0;
    let cur = '';
    for (const ch of lhs) {
        if (ch === '(') {
            depth++;
            cur += ch;
        }
        else if (ch === ')') {
            depth--;
            cur += ch;
        }
        else if (ch === ',' && depth === 0) {
            parts.push(cur.trim());
            cur = '';
        }
        else {
            cur += ch;
        }
    }
    if (cur.trim().length > 0)
        parts.push(cur.trim());
    return parts.filter((p) => p.length > 0);
}
function parseFormula(formula) {
    const imp = splitImplication(formula);
    if (imp) {
        const premises = splitConjunction(imp.lhs).map(parseAtom);
        const conclusion = parseAtom(imp.rhs);
        return { premises, conclusion };
    }
    return { premises: [], conclusion: parseAtom(formula) };
}
function isVariable(term, varNames) {
    return varNames.has(term);
}
function atomKey(a) {
    const sign = a.negated ? '¬' : '';
    if (a.args.length === 0)
        return `${sign}${a.predicate}`;
    return `${sign}${a.predicate}(${a.args.join(',')})`;
}
/** Unifica `pattern` (puede tener vars) con `ground` (sin vars).
 *  Retorna mapa var→constante o null si falla. Asume ground sin vars. */
function unify(pattern, ground, varNames, subst) {
    if (pattern.predicate !== ground.predicate)
        return null;
    if (pattern.negated !== ground.negated)
        return null;
    if (pattern.args.length !== ground.args.length)
        return null;
    const next = new Map(subst);
    for (let i = 0; i < pattern.args.length; i++) {
        const pa = pattern.args[i];
        const ga = ground.args[i];
        if (pa === undefined || ga === undefined)
            return null;
        if (isVariable(pa, varNames)) {
            const bound = next.get(pa);
            if (bound !== undefined) {
                if (bound !== ga)
                    return null;
            }
            else {
                next.set(pa, ga);
            }
        }
        else if (pa !== ga) {
            return null;
        }
    }
    return next;
}
function applySubst(a, subst) {
    return {
        predicate: a.predicate,
        args: a.args.map((arg) => subst.get(arg) ?? arg),
        negated: a.negated,
    };
}
function isGround(a, varNames) {
    return a.args.every((arg) => !isVariable(arg, varNames));
}
/** Forward-chaining: deriva el cierre de hechos a partir de premisas. */
function forwardChain(premises, varNames, maxIterations = 1000) {
    const parsed = premises.map(parseFormula);
    const facts = new Set();
    const rules = [];
    for (const p of parsed) {
        if (p.premises.length === 0 && isGround(p.conclusion, varNames)) {
            facts.add(atomKey(p.conclusion));
        }
        else {
            rules.push(p);
        }
    }
    // Check trivial inconsistency en facts (p y ¬p ambos hechos).
    for (const f of facts) {
        if (f.startsWith('¬')) {
            if (facts.has(f.slice(1)))
                return { facts, inconsistent: true };
        }
        else {
            if (facts.has(`¬${f}`))
                return { facts, inconsistent: true };
        }
    }
    let changed = true;
    let iter = 0;
    while (changed && iter < maxIterations) {
        changed = false;
        iter++;
        for (const rule of rules) {
            // Generar todas las substituciones que satisfacen las premisas.
            const substitutions = matchPremises(rule.premises, facts, varNames);
            for (const subst of substitutions) {
                const conc = applySubst(rule.conclusion, subst);
                if (!isGround(conc, varNames))
                    continue;
                const key = atomKey(conc);
                if (!facts.has(key)) {
                    // ¿Crea inconsistencia con un hecho existente?
                    const opposite = conc.negated ? atomKey({ ...conc, negated: false }) : `¬${key}`;
                    if (facts.has(opposite)) {
                        facts.add(key);
                        return { facts, inconsistent: true };
                    }
                    facts.add(key);
                    changed = true;
                }
            }
        }
    }
    return { facts, inconsistent: false };
}
/** Devuelve todas las substituciones que satisfacen una lista de premisas
 *  contra el conjunto actual de hechos (ground). */
function matchPremises(premises, facts, varNames) {
    if (premises.length === 0)
        return [new Map()];
    // Parse facts a atoms ground una sola vez.
    const groundAtoms = [];
    for (const f of facts)
        groundAtoms.push(parseAtom(f));
    let cur = [new Map()];
    for (const prem of premises) {
        const next = [];
        for (const subst of cur) {
            const inst = applySubst(prem, subst);
            for (const ga of groundAtoms) {
                const u = unify(inst, ga, varNames, subst);
                if (u !== null)
                    next.push(u);
            }
        }
        cur = next;
        if (cur.length === 0)
            return [];
    }
    return cur;
}
/**
 * Oráculo de entailment por defecto. Forward-chaining sobre Horn-like.
 *
 * Devuelve `true` sii `target` (ground) es derivable de `premises`.
 * Si `target` contiene variables se reporta `false` (no soportamos
 * ∃-targets aquí; usar custom oracle).
 */
function defaultEntails(opts = {}) {
    const varNames = opts.variableNames ?? DEFAULT_VARS;
    const maxIter = opts.maxIterations ?? 1000;
    return (premises, target) => {
        const { facts } = forwardChain(premises, varNames, maxIter);
        const targetAtom = parseAtom(target);
        if (!isGround(targetAtom, varNames))
            return false;
        return facts.has(atomKey(targetAtom));
    };
}
/**
 * Oráculo de consistencia por defecto. Considera inconsistente sii
 * el forward-chaining deriva un par {p, ¬p}.
 */
function defaultConsistent(opts = {}) {
    const varNames = opts.variableNames ?? DEFAULT_VARS;
    const maxIter = opts.maxIterations ?? 1000;
    return (premises) => {
        const { inconsistent } = forwardChain(premises, varNames, maxIter);
        return !inconsistent;
    };
}
//# sourceMappingURL=entails.js.map