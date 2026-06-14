"use strict";
// ============================================================
// Tests: integration — RAG sobre la biblioteca real (standardLibrary)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const query_1 = require("../query");
const standard_1 = require("../../../tooling/lemma-library/standard");
(0, vitest_1.describe)('LemmaRAG sobre standardLibrary real', () => {
    const lib = (0, standard_1.standardLibrary)();
    const lemmas = lib.all();
    (0, vitest_1.it)('indexa todos los lemas sin errores', () => {
        const rag = new query_1.LemmaRAG();
        (0, vitest_1.expect)(() => rag.index(lemmas)).not.toThrow();
        (0, vitest_1.expect)(rag.size()).toBe(lemmas.length);
    });
    (0, vitest_1.it)('query de "double negation" recupera prop.double-negation-elim en top-3', () => {
        const rag = new query_1.LemmaRAG();
        rag.index(lemmas);
        const results = rag.query('double negation elimination', { k: 3 });
        const ids = results.map((r) => r.lemma.id);
        (0, vitest_1.expect)(ids).toContain('prop.double-negation-elim');
    });
    (0, vitest_1.it)('query de "modus ponens" recupera prop.modus-ponens en top-5', () => {
        const rag = new query_1.LemmaRAG();
        rag.index(lemmas);
        const results = rag.query('modus ponens inference rule implication', { k: 5 });
        const ids = results.map((r) => r.lemma.id);
        (0, vitest_1.expect)(ids).toContain('prop.modus-ponens');
    });
    (0, vitest_1.it)('filtro de dominio no devuelve lemas de otros dominios', () => {
        const rag = new query_1.LemmaRAG();
        rag.index(lemmas);
        const results = rag.query('commutativity identity', { k: 10, domain: 'arithmetic' });
        for (const r of results) {
            (0, vitest_1.expect)(r.lemma.domain).toBe('arithmetic');
        }
    });
});
//# sourceMappingURL=integration.test.js.map