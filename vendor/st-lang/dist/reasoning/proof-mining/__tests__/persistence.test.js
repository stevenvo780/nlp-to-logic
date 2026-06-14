"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const theorem_cache_1 = require("../../../runtime/theorem-cache");
const persistence_1 = require("../persistence");
function mkProof(profile = 'classical', cost = 10) {
    return {
        conclusion: 'P -> P',
        premises: ['P'],
        profile,
        cost,
        steps: [
            { rule: 'MP', inputs: ['P->P', 'P'], output: 'P', depth: 0 },
            { rule: 'axiom', inputs: [], output: 'P->P', depth: 1 },
            { rule: 'axiom', inputs: [], output: 'P', depth: 1 },
        ],
    };
}
function mkLemma(id, statement, profile = 'classical') {
    return {
        id,
        statement,
        proof: mkProof(profile),
        abstractionLevel: 1,
        usageCount: 3,
        savings: 27,
        sourceProofs: ['proof-0', 'proof-1', 'proof-2'],
    };
}
(0, vitest_1.describe)('persistLemmas', () => {
    let cache;
    (0, vitest_1.beforeEach)(() => {
        cache = new theorem_cache_1.TheoremCache();
    });
    (0, vitest_1.it)('guarda un lemma y retorna su id', () => {
        const lemma = mkLemma('l1', '?0 -> ?0');
        const ids = (0, persistence_1.persistLemmas)([lemma], cache, () => 1717171717171);
        (0, vitest_1.expect)(ids).toHaveLength(1);
        (0, vitest_1.expect)(typeof ids[0]).toBe('string');
    });
    (0, vitest_1.it)('marca el lemma con provedBy = proof-mining', () => {
        const lemma = mkLemma('l1', '?0 -> ?0');
        (0, persistence_1.persistLemmas)([lemma], cache);
        const th = cache.retrieve('?0 -> ?0', 'classical');
        (0, vitest_1.expect)(th?.metadata.provedBy).toBe(persistence_1.MINED_LEMMA_PROVER);
    });
    (0, vitest_1.it)('guarda múltiples lemmas en batch', () => {
        const lemmas = [
            mkLemma('a', '?0 -> ?0'),
            mkLemma('b', '?0 and ?1'),
            mkLemma('c', '?0 or ?1'),
        ];
        const ids = (0, persistence_1.persistLemmas)(lemmas, cache);
        (0, vitest_1.expect)(ids).toHaveLength(3);
        (0, vitest_1.expect)(cache.stats().entries).toBe(3);
    });
});
(0, vitest_1.describe)('recoverLemmaFromCache', () => {
    (0, vitest_1.it)('devuelve undefined si la entry no es un mined lemma', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const id = cache.store({
            formula: 'P -> P',
            normalizedFormula: '?0 -> ?0',
            profile: 'classical',
            proof: 'axiom',
            metadata: {
                provedAt: new Date().toISOString(),
                ms: 5,
                provedBy: 'other-prover',
            },
        });
        const th = cache.retrieve('P -> P', 'classical');
        (0, vitest_1.expect)(th).toBeDefined();
        (0, vitest_1.expect)((0, persistence_1.recoverLemmaFromCache)(th)).toBeUndefined();
        (0, vitest_1.expect)(id).toBeDefined();
    });
    (0, vitest_1.it)('reconstruye un MinedLemma desde el cache', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const lemma = mkLemma('l1', '?0 -> ?0');
        (0, persistence_1.persistLemmas)([lemma], cache);
        const th = cache.retrieve('?0 -> ?0', 'classical');
        (0, vitest_1.expect)(th).toBeDefined();
        const recovered = (0, persistence_1.recoverLemmaFromCache)(th);
        (0, vitest_1.expect)(recovered).toBeDefined();
        (0, vitest_1.expect)(recovered?.statement).toBe('?0 -> ?0');
        (0, vitest_1.expect)(recovered?.usageCount).toBe(3);
        (0, vitest_1.expect)(recovered?.savings).toBe(27);
        (0, vitest_1.expect)(recovered?.abstractionLevel).toBe(1);
    });
});
(0, vitest_1.describe)('recoverLemmas', () => {
    (0, vitest_1.it)('recupera múltiples lemmas dada la lista de statements esperados', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const lemmas = [
            mkLemma('a', '?0 -> ?0'),
            mkLemma('b', '?0 and ?1'),
        ];
        (0, persistence_1.persistLemmas)(lemmas, cache);
        const recovered = (0, persistence_1.recoverLemmas)(cache, [
            { statement: '?0 -> ?0', profile: 'classical' },
            { statement: '?0 and ?1', profile: 'classical' },
            { statement: 'inexistente', profile: 'classical' },
        ]);
        (0, vitest_1.expect)(recovered).toHaveLength(2);
    });
    (0, vitest_1.it)('round-trip: persist + recover preserva datos clave', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const original = mkLemma('a', '?0 -> ?0');
        (0, persistence_1.persistLemmas)([original], cache);
        const [recovered] = (0, persistence_1.recoverLemmas)(cache, [
            { statement: '?0 -> ?0', profile: 'classical' },
        ]);
        (0, vitest_1.expect)(recovered).toBeDefined();
        (0, vitest_1.expect)(recovered?.usageCount).toBe(original.usageCount);
        (0, vitest_1.expect)(recovered?.savings).toBe(original.savings);
        (0, vitest_1.expect)(recovered?.sourceProofs).toEqual(original.sourceProofs);
    });
});
//# sourceMappingURL=persistence.test.js.map