"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subsumes = subsumes;
exports.removeSubsumed = removeSubsumed;
exports.clausesAlphaEqual = clausesAlphaEqual;
exports.unitPreference = unitPreference;
const unify_1 = require("./unify");
/**
 * Subsumption clásico: c1 subsume c2 si existe una sustitución σ tal que
 * cada literal de c1·σ aparece en c2.
 *
 * Estrategia: backtracking sobre el matching de cada literal de c1 contra c2.
 * Costoso en el caso general, pero acotado: cláusulas en pruebas reales
 * tienen pocas literales.
 */
function subsumes(c1, c2) {
    if (c1.literals.length === 0)
        return true; // ⊥ subsume todo
    if (c1.literals.length > c2.literals.length)
        return false;
    return matchLiterals(c1.literals, c2.literals, new Map());
}
function matchLiterals(remaining, target, sub) {
    if (remaining.length === 0)
        return true;
    const first = remaining[0];
    if (!first)
        return true;
    const rest = remaining.slice(1);
    for (const lit of target) {
        const extended = matchLiteral(first, lit, new Map(sub));
        if (extended && matchLiterals(rest, target, extended))
            return true;
    }
    return false;
}
function matchLiteral(pattern, target, sub) {
    if (pattern.negated !== target.negated)
        return null;
    if (pattern.predicate !== target.predicate)
        return null;
    if (pattern.args.length !== target.args.length)
        return null;
    let current = sub;
    for (let i = 0; i < pattern.args.length; i++) {
        const a = pattern.args[i];
        const b = target.args[i];
        if (a === undefined || b === undefined)
            return null;
        const next = matchTerm(a, b, current);
        if (!next)
            return null;
        current = next;
    }
    return current;
}
/**
 * Matching unidireccional (no unificación): sólo variables del `pattern` se
 * sustituyen; los términos del `target` se mantienen fijos.
 */
function matchTerm(pattern, target, sub) {
    if (pattern.kind === 'variable') {
        const existing = sub.get(pattern.name);
        if (existing) {
            return termsEqual((0, unify_1.applySubToTerm)(existing, sub), target) ? sub : null;
        }
        const next = new Map(sub);
        next.set(pattern.name, target);
        return next;
    }
    if (target.kind === 'variable')
        return null;
    if (pattern.name !== target.name)
        return null;
    if (pattern.args.length !== target.args.length)
        return null;
    let current = sub;
    for (let i = 0; i < pattern.args.length; i++) {
        const a = pattern.args[i];
        const b = target.args[i];
        if (a === undefined || b === undefined)
            return null;
        const next = matchTerm(a, b, current);
        if (!next)
            return null;
        current = next;
    }
    return current;
}
function termsEqual(a, b) {
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
            if (!termsEqual(ai, bi))
                return false;
        }
        return true;
    }
    return false;
}
/**
 * Filtra cláusulas dejando sólo las no-subsumidas por otras del mismo set.
 * Conserva orden de la primera aparición.
 */
function removeSubsumed(clauses) {
    const kept = [];
    for (let i = 0; i < clauses.length; i++) {
        const c = clauses[i];
        if (!c)
            continue;
        let dominated = false;
        for (let j = 0; j < clauses.length; j++) {
            if (i === j)
                continue;
            const other = clauses[j];
            if (!other)
                continue;
            if (clausesAlphaEqual(c, other) && j < i) {
                dominated = true; // duplicado posterior
                break;
            }
            if (!clausesAlphaEqual(c, other) && subsumes(other, c)) {
                dominated = true;
                break;
            }
        }
        if (!dominated)
            kept.push(c);
    }
    return kept;
}
/**
 * Igualdad sintáctica módulo orden de literales y renombre de variables
 * (alpha-equivalencia simple). Suficiente para detectar duplicados producidos
 * por resolución sobre instancias renombradas.
 */
function clausesAlphaEqual(a, b) {
    if (a.literals.length !== b.literals.length)
        return false;
    const matched = new Array(b.literals.length).fill(false);
    outer: for (const la of a.literals) {
        for (let i = 0; i < b.literals.length; i++) {
            if (matched[i])
                continue;
            const lb = b.literals[i];
            if (lb && (0, unify_1.literalsEqual)(la, lb)) {
                matched[i] = true;
                continue outer;
            }
        }
        return false;
    }
    return true;
}
/**
 * Reordena cláusulas para que las unitarias (1 literal) vayan primero.
 * Patrón "unit preference" — reduce drásticamente el espacio de búsqueda en
 * problemas tipo modus-ponens encadenado.
 */
function unitPreference(clauses) {
    return [...clauses].sort((a, b) => a.literals.length - b.literals.length);
}
//# sourceMappingURL=subsumption.js.map