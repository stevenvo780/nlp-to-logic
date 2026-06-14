"use strict";
// ============================================================
// Tests: retrieval — cosineSimilarity + BM25 + hybridScore
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const retrieval_1 = require("../retrieval");
const embedding_1 = require("../embedding");
const types_1 = require("../types");
const index_store_1 = require("../index-store");
const embedding_2 = require("../embedding");
// ---- helpers ----
function makeVec(values) {
    const v = new Float32Array(types_1.EMBEDDING_DIM);
    for (let i = 0; i < values.length && i < types_1.EMBEDDING_DIM; i++)
        v[i] = values[i] ?? 0;
    // normalize
    let norm = 0;
    for (let i = 0; i < v.length; i++)
        norm += (v[i] ?? 0) ** 2;
    if (norm > 0) {
        const invNorm = 1 / Math.sqrt(norm);
        for (let i = 0; i < v.length; i++)
            v[i] = (v[i] ?? 0) * invNorm;
    }
    return v;
}
const sampleLemmas = [
    {
        id: 'prop.identity',
        name: 'Identity',
        statement: 'P → P',
        domain: 'propositional',
        tags: ['identity', 'implication'],
        difficulty: 'trivial',
    },
    {
        id: 'prop.and-comm',
        name: 'Commutativity of conjunction',
        statement: '(P ∧ Q) ↔ (Q ∧ P)',
        domain: 'propositional',
        tags: ['commutativity', 'conjunction'],
        difficulty: 'trivial',
    },
    {
        id: 'arith.add-comm',
        name: 'Commutativity of addition',
        statement: '∀m n. m + n = n + m',
        domain: 'arithmetic',
        tags: ['commutativity', 'addition'],
        difficulty: 'medium',
    },
];
function makeStore(lemmas = sampleLemmas) {
    const store = new index_store_1.IndexStore(new embedding_2.HashEmbeddingProvider());
    store.addAll(lemmas);
    return store;
}
(0, vitest_1.describe)('cosineSimilarity', () => {
    (0, vitest_1.it)('vector consigo mismo tiene similarity 1.0', () => {
        const v = (0, embedding_1.hashEmbed)('P → P');
        (0, vitest_1.expect)((0, retrieval_1.cosineSimilarity)(v, v)).toBeCloseTo(1.0, 5);
    });
    (0, vitest_1.it)('dos vectores iguales tienen similarity 1.0', () => {
        const v1 = (0, embedding_1.hashEmbed)('P ∧ Q');
        const v2 = (0, embedding_1.hashEmbed)('P ∧ Q');
        (0, vitest_1.expect)((0, retrieval_1.cosineSimilarity)(v1, v2)).toBeCloseTo(1.0, 5);
    });
    (0, vitest_1.it)('similarity está acotada en [0, 1]', () => {
        const v1 = (0, embedding_1.hashEmbed)('P → Q');
        const v2 = (0, embedding_1.hashEmbed)('∀x. P(x)');
        const s = (0, retrieval_1.cosineSimilarity)(v1, v2);
        (0, vitest_1.expect)(s).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(s).toBeLessThanOrEqual(1);
    });
    (0, vitest_1.it)('vectores de distinto length devuelven 0', () => {
        const v1 = new Float32Array(10);
        const v2 = new Float32Array(20);
        (0, vitest_1.expect)((0, retrieval_1.cosineSimilarity)(v1, v2)).toBe(0);
    });
    (0, vitest_1.it)('P∧Q vs Q∧P tienen alta similarity', () => {
        const v1 = (0, embedding_1.hashEmbed)('P ∧ Q');
        const v2 = (0, embedding_1.hashEmbed)('Q ∧ P');
        (0, vitest_1.expect)((0, retrieval_1.cosineSimilarity)(v1, v2)).toBeGreaterThan(0.5);
    });
});
(0, vitest_1.describe)('bm25Score', () => {
    (0, vitest_1.it)('score > 0 cuando query coincide con tokens del documento', () => {
        const store = makeStore();
        const doc = store.getById('prop.and-comm');
        const score = (0, retrieval_1.bm25Score)('commutativity conjunction', doc, store);
        (0, vitest_1.expect)(score).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('score = 0 cuando query sin tokens comunes', () => {
        const store = makeStore();
        const doc = store.getById('prop.identity');
        const score = (0, retrieval_1.bm25Score)('xyz abc def', doc, store);
        (0, vitest_1.expect)(score).toBe(0);
    });
    (0, vitest_1.it)('score ≥ 0 siempre', () => {
        const store = makeStore();
        const doc = store.getById('arith.add-comm');
        const score = (0, retrieval_1.bm25Score)('naturals addition induction', doc, store);
        (0, vitest_1.expect)(score).toBeGreaterThanOrEqual(0);
    });
});
(0, vitest_1.describe)('hybridScore', () => {
    (0, vitest_1.it)('hybrid con cosineWeight=1 es igual al cosine', () => {
        (0, vitest_1.expect)((0, retrieval_1.hybridScore)(0.8, 5, 10, 1.0)).toBeCloseTo(0.8, 5);
    });
    (0, vitest_1.it)('hybrid con cosineWeight=0 es bm25 normalizado', () => {
        (0, vitest_1.expect)((0, retrieval_1.hybridScore)(0.8, 5, 10, 0.0)).toBeCloseTo(0.5, 5);
    });
    (0, vitest_1.it)('hybrid con maxBm25=0 no produce NaN', () => {
        const s = (0, retrieval_1.hybridScore)(0.6, 0, 0, 0.7);
        (0, vitest_1.expect)(Number.isFinite(s)).toBe(true);
    });
});
(0, vitest_1.describe)('retrieveTopK', () => {
    (0, vitest_1.it)('devuelve top-k resultados ordenados por score desc', () => {
        const store = makeStore();
        const query = 'commutativity conjunction';
        const queryVec = (0, embedding_1.hashEmbed)(query);
        const results = (0, retrieval_1.retrieveTopK)(query, queryVec, store, 3, 0.7);
        (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
        for (let i = 1; i < results.length; i++) {
            (0, vitest_1.expect)(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
        }
    });
    (0, vitest_1.it)('k limita el número de resultados', () => {
        const store = makeStore();
        const query = 'implication';
        const queryVec = (0, embedding_1.hashEmbed)(query);
        const results = (0, retrieval_1.retrieveTopK)(query, queryVec, store, 1, 0.7);
        (0, vitest_1.expect)(results.length).toBeLessThanOrEqual(1);
    });
    (0, vitest_1.it)('filtro de dominio restringe resultados', () => {
        const store = makeStore();
        const query = 'commutativity';
        const queryVec = (0, embedding_1.hashEmbed)(query);
        const results = (0, retrieval_1.retrieveTopK)(query, queryVec, store, 5, 0.7, 'arithmetic');
        for (const r of results) {
            (0, vitest_1.expect)(r.lemma.domain).toBe('arithmetic');
        }
    });
});
//# sourceMappingURL=retrieval.test.js.map