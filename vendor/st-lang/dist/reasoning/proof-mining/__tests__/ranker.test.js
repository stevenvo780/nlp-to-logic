"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ranker_1 = require("../ranker");
function mkProof(profile = 'classical') {
    return {
        conclusion: 'X',
        premises: [],
        profile,
        cost: 10,
        steps: [{ rule: 'r', inputs: [], output: 'X', depth: 0 }],
    };
}
function mkLemma(id, opts) {
    return {
        id,
        statement: `lemma-${id}`,
        proof: mkProof(),
        abstractionLevel: opts.abstraction,
        usageCount: opts.usage,
        savings: opts.savings,
        sourceProofs: [],
    };
}
(0, vitest_1.describe)('scoreLemma', () => {
    (0, vitest_1.it)('score aumenta con savings', () => {
        const a = mkLemma('a', { usage: 1, savings: 0, abstraction: 0 });
        const b = mkLemma('b', { usage: 1, savings: 100, abstraction: 0 });
        (0, vitest_1.expect)((0, ranker_1.scoreLemma)(b)).toBeGreaterThan((0, ranker_1.scoreLemma)(a));
    });
    (0, vitest_1.it)('score aumenta con usageCount', () => {
        const a = mkLemma('a', { usage: 2, savings: 10, abstraction: 0 });
        const b = mkLemma('b', { usage: 20, savings: 10, abstraction: 0 });
        (0, vitest_1.expect)((0, ranker_1.scoreLemma)(b)).toBeGreaterThan((0, ranker_1.scoreLemma)(a));
    });
    (0, vitest_1.it)('score aumenta con abstractionLevel', () => {
        const a = mkLemma('a', { usage: 2, savings: 10, abstraction: 0 });
        const b = mkLemma('b', { usage: 2, savings: 10, abstraction: 3 });
        (0, vitest_1.expect)((0, ranker_1.scoreLemma)(b)).toBeGreaterThan((0, ranker_1.scoreLemma)(a));
    });
    (0, vitest_1.it)('weights override default', () => {
        const lemma = mkLemma('a', { usage: 1, savings: 0, abstraction: 10 });
        const baseScore = (0, ranker_1.scoreLemma)(lemma);
        const boosted = (0, ranker_1.scoreLemma)(lemma, { generality: 1 });
        (0, vitest_1.expect)(boosted).toBeGreaterThan(baseScore);
    });
});
(0, vitest_1.describe)('rankLemmas', () => {
    (0, vitest_1.it)('ordena descendente por score', () => {
        const a = mkLemma('a', { usage: 1, savings: 0, abstraction: 0 });
        const b = mkLemma('b', { usage: 10, savings: 100, abstraction: 2 });
        const c = mkLemma('c', { usage: 5, savings: 50, abstraction: 1 });
        const ranked = (0, ranker_1.rankLemmas)([a, b, c]);
        (0, vitest_1.expect)(ranked[0]?.id).toBe('b');
        (0, vitest_1.expect)(ranked[2]?.id).toBe('a');
    });
    (0, vitest_1.it)('en empate de score, mayor usageCount gana', () => {
        const x = mkLemma('x', { usage: 5, savings: 10, abstraction: 1 });
        const y = mkLemma('y', { usage: 5, savings: 10, abstraction: 1 });
        const ranked = (0, ranker_1.rankLemmas)([x, y]);
        // Misma score → orden por id asc (determinismo)
        (0, vitest_1.expect)(ranked[0]?.id).toBe('x');
    });
    (0, vitest_1.it)('no muta el array original', () => {
        const a = mkLemma('a', { usage: 1, savings: 0, abstraction: 0 });
        const b = mkLemma('b', { usage: 10, savings: 100, abstraction: 2 });
        const input = [a, b];
        (0, ranker_1.rankLemmas)(input);
        (0, vitest_1.expect)(input[0]?.id).toBe('a');
        (0, vitest_1.expect)(input[1]?.id).toBe('b');
    });
});
(0, vitest_1.describe)('topK', () => {
    (0, vitest_1.it)('devuelve los primeros K', () => {
        const lemmas = Array.from({ length: 10 }, (_, i) => mkLemma(`l${i}`, { usage: i, savings: i * 10, abstraction: 0 }));
        const top3 = (0, ranker_1.topK)(lemmas, 3);
        (0, vitest_1.expect)(top3).toHaveLength(3);
        // El de mayor usage/savings (l9) debe estar primero.
        (0, vitest_1.expect)(top3[0]?.id).toBe('l9');
    });
    (0, vitest_1.it)('K = 0 devuelve array vacío', () => {
        const lemmas = [mkLemma('a', { usage: 1, savings: 0, abstraction: 0 })];
        (0, vitest_1.expect)((0, ranker_1.topK)(lemmas, 0)).toHaveLength(0);
    });
    (0, vitest_1.it)('K mayor que la lista devuelve toda la lista', () => {
        const lemmas = [
            mkLemma('a', { usage: 1, savings: 0, abstraction: 0 }),
            mkLemma('b', { usage: 2, savings: 0, abstraction: 0 }),
        ];
        (0, vitest_1.expect)((0, ranker_1.topK)(lemmas, 100)).toHaveLength(2);
    });
});
//# sourceMappingURL=ranker.test.js.map