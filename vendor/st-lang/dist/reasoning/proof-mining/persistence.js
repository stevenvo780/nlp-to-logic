"use strict";
// ============================================================
// ST Proof Mining — Persistencia en theorem-cache
// ============================================================
//
// Bridge entre los MinedLemma y el TheoremCache existente. La idea:
// los lemmas extraídos viven con primera clase en el cache, igual
// que cualquier teorema probado, y se benefician del α-canonical
// hashing + LRU + persistencia a disco.
//
// El mapping es directo:
//
//   MinedLemma.id        ← TheoremCache id (recalculado)
//   MinedLemma.statement → CachedTheorem.formula
//   MinedLemma.proof     → CachedTheorem.proof (estructura completa)
//   profile              → CachedTheorem.profile
//   metadata.provedBy    = 'proof-mining'
//   metadata.ms          = subproof.cost
//
// `persistLemmas(lemmas, cache)` guarda. `recoverLemmas(cache,
// profile)` recupera todos los mined-lemmas de ese profile.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINED_LEMMA_PROVER = void 0;
exports.persistLemmas = persistLemmas;
exports.recoverLemmaFromCache = recoverLemmaFromCache;
exports.recoverLemmas = recoverLemmas;
/**
 * Marca metadata.provedBy que identifica un lemma como minado.
 */
exports.MINED_LEMMA_PROVER = 'proof-mining';
/**
 * Guarda una lista de lemmas minados en el cache. Devuelve los ids
 * (post-hash del cache, que puede diferir si el cache normaliza la
 * fórmula de forma distinta).
 *
 * `now` es inyectable para tests deterministas (default `Date.now()`).
 */
function persistLemmas(lemmas, cache, now = Date.now) {
    const ids = [];
    for (const l of lemmas) {
        const cached = {
            formula: l.statement,
            normalizedFormula: cache.canonicalize(l.statement),
            profile: l.proof.profile,
            proof: {
                // Estructura del proof completo, sin perder metadata de mining.
                steps: l.proof.steps,
                conclusion: l.proof.conclusion,
                premises: l.proof.premises,
                abstractionLevel: l.abstractionLevel,
                usageCount: l.usageCount,
                savings: l.savings,
                sourceProofs: l.sourceProofs,
            },
            verifier: undefined,
            metadata: {
                provedAt: new Date(now()).toISOString(),
                ms: Math.round(l.proof.cost),
                provedBy: exports.MINED_LEMMA_PROVER,
            },
        };
        const id = cache.store(cached);
        ids.push(id);
    }
    return ids;
}
/**
 * Reconstruye un MinedLemma desde una entry cacheada (best-effort).
 * Si la entry no fue persistida vía `persistLemmas`, devuelve
 * `undefined`.
 */
function recoverLemmaFromCache(theorem) {
    if (theorem.metadata.provedBy !== exports.MINED_LEMMA_PROVER)
        return undefined;
    const proof = theorem.proof;
    if (!proof ||
        typeof proof !== 'object' ||
        !Array.isArray(proof.steps) ||
        typeof proof.conclusion !== 'string' ||
        !Array.isArray(proof.premises) ||
        typeof proof.abstractionLevel !== 'number' ||
        typeof proof.usageCount !== 'number' ||
        typeof proof.savings !== 'number' ||
        !Array.isArray(proof.sourceProofs)) {
        return undefined;
    }
    return {
        id: theorem.id,
        statement: theorem.formula,
        proof: {
            id: theorem.id,
            conclusion: proof.conclusion,
            premises: proof.premises,
            profile: theorem.profile,
            steps: proof.steps,
            cost: theorem.metadata.ms,
        },
        abstractionLevel: proof.abstractionLevel,
        usageCount: proof.usageCount,
        savings: proof.savings,
        sourceProofs: proof.sourceProofs,
    };
}
/**
 * Recupera lemmas minados desde el cache a partir de una lista de
 * statements canónicos esperados. Para cada `(statement, profile)`
 * que efectivamente esté cacheado por `persistLemmas`, devuelve el
 * MinedLemma reconstruido.
 *
 * Esta API existe porque `TheoremCache` no expone iteración total
 * por design (LRU + persistencia). El caller que persistió los
 * lemmas conoce sus statements; los pasa aquí para recuperarlos.
 */
function recoverLemmas(cache, entries) {
    const out = [];
    for (const e of entries) {
        const th = cache.retrieve(e.statement, e.profile);
        if (th === undefined)
            continue;
        const recovered = recoverLemmaFromCache(th);
        if (recovered !== undefined)
            out.push(recovered);
    }
    return out;
}
//# sourceMappingURL=persistence.js.map