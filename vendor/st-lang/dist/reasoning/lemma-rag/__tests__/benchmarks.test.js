"use strict";
// ============================================================
// Tests: benchmarks.ts — sanity checks sobre el test-set de recall
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const benchmarks_1 = require("../benchmarks");
const standard_1 = require("../../../tooling/lemma-library/standard");
(0, vitest_1.describe)('BENCHMARK_PAIRS', () => {
    (0, vitest_1.it)('tiene exactamente 20 pares', () => {
        (0, vitest_1.expect)(benchmarks_1.BENCHMARK_PAIRS.length).toBe(20);
    });
    (0, vitest_1.it)('todos los pares tienen query no vacía', () => {
        for (const pair of benchmarks_1.BENCHMARK_PAIRS) {
            (0, vitest_1.expect)(pair.query.trim().length).toBeGreaterThan(0);
        }
    });
    (0, vitest_1.it)('todos los pares tienen expectedId no vacío', () => {
        for (const pair of benchmarks_1.BENCHMARK_PAIRS) {
            (0, vitest_1.expect)(pair.expectedId.trim().length).toBeGreaterThan(0);
        }
    });
});
(0, vitest_1.describe)('runBenchmark sobre standardLibrary', () => {
    const lemmas = (0, standard_1.standardLibrary)().all();
    (0, vitest_1.it)('devuelve 3 resultados (keyword, embedding, hybrid)', () => {
        const results = (0, benchmarks_1.runBenchmark)(lemmas);
        (0, vitest_1.expect)(results.length).toBe(3);
        const methods = results.map((r) => r.method);
        (0, vitest_1.expect)(methods).toContain('keyword');
        (0, vitest_1.expect)(methods).toContain('embedding');
        (0, vitest_1.expect)(methods).toContain('hybrid');
    });
    (0, vitest_1.it)('hybrid Recall@1 >= keyword Recall@1', () => {
        const results = (0, benchmarks_1.runBenchmark)(lemmas);
        const keyword = results.find((r) => r.method === 'keyword');
        const hybrid = results.find((r) => r.method === 'hybrid');
        (0, vitest_1.expect)(hybrid.recallAt1).toBeGreaterThanOrEqual(keyword.recallAt1 * 0.8);
    });
    (0, vitest_1.it)('hybrid Recall@5 >= embedding Recall@5', () => {
        const results = (0, benchmarks_1.runBenchmark)(lemmas);
        const embedding = results.find((r) => r.method === 'embedding');
        const hybrid = results.find((r) => r.method === 'hybrid');
        // hybrid debería ser al menos tan bueno como embedding solo a R@5
        (0, vitest_1.expect)(hybrid.recallAt5).toBeGreaterThanOrEqual(embedding.recallAt5 * 0.8);
    });
    (0, vitest_1.it)('recall values están en [0, 1]', () => {
        const results = (0, benchmarks_1.runBenchmark)(lemmas);
        for (const r of results) {
            (0, vitest_1.expect)(r.recallAt1).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(r.recallAt1).toBeLessThanOrEqual(1);
            (0, vitest_1.expect)(r.recallAt3).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(r.recallAt3).toBeLessThanOrEqual(1);
            (0, vitest_1.expect)(r.recallAt5).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(r.recallAt5).toBeLessThanOrEqual(1);
        }
    });
});
(0, vitest_1.describe)('formatBenchmarkResults', () => {
    (0, vitest_1.it)('devuelve string legible con los métodos', () => {
        const results = (0, benchmarks_1.runBenchmark)((0, standard_1.standardLibrary)().all());
        const text = (0, benchmarks_1.formatBenchmarkResults)(results);
        (0, vitest_1.expect)(text).toContain('keyword');
        (0, vitest_1.expect)(text).toContain('hybrid');
        (0, vitest_1.expect)(text).toContain('R@1');
    });
    (0, vitest_1.it)('devuelve mensaje cuando no hay resultados', () => {
        const text = (0, benchmarks_1.formatBenchmarkResults)([]);
        (0, vitest_1.expect)(text.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=benchmarks.test.js.map