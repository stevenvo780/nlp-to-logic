"use strict";
// ============================================================
// tryApplyLemma — pattern matching simple goal ↔ lema
//
// Heurística: tokeniza el goal y cada lema, busca aquellos cuyo
// "esqueleto" estructural (símbolos lógicos) sea subsequence del
// goal, y propone sustituciones de las metavariables (P, Q, R, …,
// φ, ψ, x, y, z, a, b, c, n, m) al primer no-variable encontrado
// en posición correspondiente.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryApplyLemma = tryApplyLemma;
const tokenize_1 = require("./tokenize");
const METAVAR_PATTERN = /^[a-zA-Zφψχ]$/;
function isMetavar(tok) {
    return METAVAR_PATTERN.test(tok);
}
function structuralSkeleton(tokens) {
    return tokens.filter((t) => !isMetavar(t));
}
function isSubsequence(needle, haystack) {
    let i = 0;
    for (const h of haystack) {
        if (i < needle.length && h === needle[i])
            i++;
    }
    return i === needle.length;
}
function tryUnify(pattern, goal) {
    const subs = new Map();
    let gi = 0;
    for (let pi = 0; pi < pattern.length; pi++) {
        const ptok = pattern[pi];
        if (ptok === undefined)
            return undefined;
        if (isMetavar(ptok)) {
            // captura el siguiente token del goal o un grupo balanceado mínimo
            if (gi >= goal.length)
                return undefined;
            const captured = goal[gi];
            if (captured === undefined)
                return undefined;
            const existing = subs.get(ptok);
            if (existing !== undefined && existing !== captured)
                return undefined;
            subs.set(ptok, captured);
            gi++;
        }
        else {
            // avanza hasta el primer match exacto del símbolo
            while (gi < goal.length && goal[gi] !== ptok)
                gi++;
            if (gi >= goal.length)
                return undefined;
            gi++;
        }
    }
    return subs;
}
/**
 * Devuelve los lemas de `library` cuyo esqueleto estructural es
 * subsequence del goal. Si se encuentra el más específico (mayor
 * cantidad de tokens estructurales), añade las sustituciones.
 */
function tryApplyLemma(goal, library) {
    const goalTokens = (0, tokenize_1.tokenize)(goal);
    const goalSkeleton = structuralSkeleton(goalTokens);
    if (goalSkeleton.length === 0)
        return { applicable: [] };
    const applicable = [];
    for (const lemma of library.all()) {
        const lemmaTokens = (0, tokenize_1.tokenize)(lemma.statement);
        const lemmaSkeleton = structuralSkeleton(lemmaTokens);
        if (lemmaSkeleton.length === 0)
            continue;
        if (isSubsequence(lemmaSkeleton, goalSkeleton)) {
            applicable.push({ lemma, skeleton: lemmaSkeleton });
        }
    }
    applicable.sort((a, b) => b.skeleton.length - a.skeleton.length);
    let substitutions;
    if (applicable.length > 0) {
        const top = applicable[0];
        if (top !== undefined) {
            const lemmaTokens = (0, tokenize_1.tokenize)(top.lemma.statement);
            substitutions = tryUnify(lemmaTokens, goalTokens);
        }
    }
    return {
        applicable: applicable.map((a) => a.lemma),
        substitutions,
    };
}
//# sourceMappingURL=apply.js.map