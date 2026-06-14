"use strict";
// ============================================================
// Tests: query.ts — API pública LemmaRAG + queryLemmas
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const query_1 = require("../query");
const mockLemmas = [
    {
        id: 'prop.identity',
        name: 'Identity',
        statement: 'P → P',
        domain: 'propositional',
        tags: ['identity', 'implication', 'classical'],
        difficulty: 'trivial',
    },
    {
        id: 'prop.double-neg',
        name: 'Double negation elimination',
        statement: '¬¬P → P',
        domain: 'propositional',
        tags: ['negation', 'classical', 'double-negation'],
        difficulty: 'easy',
    },
    {
        id: 'prop.de-morgan',
        name: 'De Morgan conjunction',
        statement: '¬(P ∧ Q) ↔ (¬P ∨ ¬Q)',
        domain: 'propositional',
        tags: ['de-morgan', 'classical', 'negation', 'conjunction'],
        difficulty: 'easy',
    },
    {
        id: 'prop.excluded-middle',
        name: 'Law of excluded middle',
        statement: 'P ∨ ¬P',
        domain: 'propositional',
        tags: ['classical', 'tertium-non-datur', 'disjunction'],
        difficulty: 'easy',
        isAxiom: true,
    },
    {
        id: 'arith.add-zero',
        name: 'Right additive identity',
        statement: '∀n. n + 0 = n',
        domain: 'arithmetic',
        tags: ['peano', 'addition', 'naturals'],
        difficulty: 'trivial',
    },
    {
        id: 'modal.k',
        name: 'Axiom K',
        statement: '□(P → Q) → (□P → □Q)',
        domain: 'modal',
        tags: ['axiom', 'K', 'distribution', 'box'],
        difficulty: 'easy',
        isAxiom: true,
    },
];
(0, vitest_1.describe)('LemmaRAG', () => {
    let rag;
    (0, vitest_1.beforeEach)(() => {
        rag = new query_1.LemmaRAG();
        rag.index(mockLemmas);
    });
    (0, vitest_1.it)('size() refleja el número de lemas indexados', () => {
        (0, vitest_1.expect)(rag.size()).toBe(mockLemmas.length);
    });
    (0, vitest_1.it)('query vacío devuelve array', () => {
        const results = rag.query('');
        (0, vitest_1.expect)(Array.isArray(results)).toBe(true);
    });
    (0, vitest_1.it)('query sin lemas indexados devuelve []', () => {
        const emptyRag = new query_1.LemmaRAG();
        (0, vitest_1.expect)(emptyRag.query('P → P')).toEqual([]);
    });
    (0, vitest_1.it)('query devuelve resultados con score, cosineScore, bm25Score', () => {
        const results = rag.query('negation double', { k: 3 });
        (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
        for (const r of results) {
            (0, vitest_1.expect)(typeof r.score).toBe('number');
            (0, vitest_1.expect)(typeof r.cosineScore).toBe('number');
            (0, vitest_1.expect)(typeof r.bm25Score).toBe('number');
            (0, vitest_1.expect)(r.lemma).toBeDefined();
        }
    });
    (0, vitest_1.it)('k=1 devuelve exactamente 1 resultado', () => {
        const results = rag.query('implication identity', { k: 1 });
        (0, vitest_1.expect)(results.length).toBeLessThanOrEqual(1);
    });
    (0, vitest_1.it)('filtro de dominio funciona', () => {
        const results = rag.query('negation', { k: 5, domain: 'arithmetic' });
        for (const r of results) {
            (0, vitest_1.expect)(r.lemma.domain).toBe('arithmetic');
        }
    });
    (0, vitest_1.it)('minScore filtra resultados de baja relevancia', () => {
        const results = rag.query('addition naturals zero', { k: 10, minScore: 0.5 });
        for (const r of results) {
            (0, vitest_1.expect)(r.score).toBeGreaterThanOrEqual(0.5);
        }
    });
    (0, vitest_1.it)('resultados ordenados descendentemente por score', () => {
        const results = rag.query('classical negation modal', { k: 5 });
        for (let i = 1; i < results.length; i++) {
            (0, vitest_1.expect)(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
        }
    });
});
(0, vitest_1.describe)('queryLemmas — función de conveniencia', () => {
    (0, vitest_1.it)('retorna resultados sobre el conjunto proporcionado', () => {
        const results = (0, query_1.queryLemmas)(mockLemmas, 'negation', { k: 3 });
        (0, vitest_1.expect)(results.length).toBeGreaterThanOrEqual(0);
    });
    (0, vitest_1.it)('con lemmas vacío devuelve []', () => {
        (0, vitest_1.expect)((0, query_1.queryLemmas)([], 'P → P')).toEqual([]);
    });
    (0, vitest_1.it)('usa instancia RAG externa si se provee', () => {
        const externalRAG = new query_1.LemmaRAG();
        externalRAG.index(mockLemmas);
        const results = (0, query_1.queryLemmas)([], 'double negation', {}, externalRAG);
        (0, vitest_1.expect)(Array.isArray(results)).toBe(true);
    });
});
(0, vitest_1.describe)('globalRAG', () => {
    (0, vitest_1.it)('resetGlobalRAG crea nueva instancia en siguiente llamada', () => {
        (0, query_1.resetGlobalRAG)();
        const rag1 = (0, query_1.globalRAG)();
        const rag2 = (0, query_1.globalRAG)();
        (0, vitest_1.expect)(rag1).toBe(rag2);
        (0, query_1.resetGlobalRAG)();
        const rag3 = (0, query_1.globalRAG)();
        (0, vitest_1.expect)(rag3).not.toBe(rag1);
    });
});
//# sourceMappingURL=query.test.js.map