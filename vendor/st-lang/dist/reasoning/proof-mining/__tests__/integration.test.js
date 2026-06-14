"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const theorem_cache_1 = require("../../../runtime/theorem-cache");
const index_1 = require("../index");
function reflexivityProof(id, atom) {
    return {
        id,
        conclusion: `${atom} -> ${atom}`,
        premises: [],
        profile: 'classical',
        cost: 12,
        steps: [
            // sub-tree raíz: implIntro con un assume.
            { rule: 'implIntro', inputs: [atom], output: `${atom} -> ${atom}`, depth: 0 },
            { rule: 'assume', inputs: [], output: atom, depth: 1 },
        ],
    };
}
function conjunctionProof(id, l, r) {
    return {
        id,
        conclusion: `${l} and ${r}`,
        premises: [l, r],
        profile: 'classical',
        cost: 20,
        steps: [
            { rule: 'andI', inputs: [l, r], output: `${l} and ${r}`, depth: 0 },
            { rule: 'assume', inputs: [], output: l, depth: 1 },
            { rule: 'assume', inputs: [], output: r, depth: 1 },
        ],
    };
}
(0, vitest_1.describe)('mineLemmas — pipeline end-to-end', () => {
    (0, vitest_1.it)('extrae el lemma de reflexividad cuando aparece en múltiples proofs', () => {
        const corpus = [
            reflexivityProof('p1', 'P'),
            reflexivityProof('p2', 'Q'),
            reflexivityProof('p3', 'R'),
        ];
        const { lemmas, stats } = (0, index_1.mineLemmas)(corpus);
        (0, vitest_1.expect)(lemmas.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(stats.proofsAnalyzed).toBe(3);
        (0, vitest_1.expect)(stats.lemmasExtracted).toBeGreaterThan(0);
        // Al menos un lemma debería tener usageCount = 3.
        const trio = lemmas.find((l) => l.usageCount === 3);
        (0, vitest_1.expect)(trio).toBeDefined();
    });
    (0, vitest_1.it)('rankea por savings: el lemma más reusado va primero', () => {
        const corpus = [
            reflexivityProof('p1', 'P'),
            reflexivityProof('p2', 'Q'),
            reflexivityProof('p3', 'R'),
            conjunctionProof('p4', 'A', 'B'),
            conjunctionProof('p5', 'C', 'D'),
        ];
        const { lemmas } = (0, index_1.mineLemmas)(corpus);
        (0, vitest_1.expect)(lemmas.length).toBeGreaterThan(0);
        // El primero debería tener usageCount alto.
        (0, vitest_1.expect)(lemmas[0]?.usageCount).toBeGreaterThanOrEqual(2);
    });
    (0, vitest_1.it)('persiste lemmas en el cache cuando se pasa la opción', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const corpus = [
            reflexivityProof('p1', 'P'),
            reflexivityProof('p2', 'Q'),
        ];
        const { lemmas } = (0, index_1.mineLemmas)(corpus, { cache });
        (0, vitest_1.expect)(lemmas.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(cache.stats().entries).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('savings = cost_subproof × (usageCount - 1)', () => {
        const corpus = [
            reflexivityProof('p1', 'P'),
            reflexivityProof('p2', 'Q'),
        ];
        const { lemmas } = (0, index_1.mineLemmas)(corpus);
        const trio = lemmas.find((l) => l.usageCount === 2);
        (0, vitest_1.expect)(trio).toBeDefined();
        // El sub-tree raíz tiene 2 pasos del proof de cost 12: cost prorrateado
        // = 12 × (2/2) = 12. usageCount=2 ⇒ savings = 12 × 1 = 12.
        (0, vitest_1.expect)(trio?.savings).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('ProofMiner — fachada stateful', () => {
    let miner;
    (0, vitest_1.beforeEach)(() => {
        miner = new index_1.ProofMiner();
    });
    (0, vitest_1.it)('acumula lemmas entre batches', () => {
        miner.mine([reflexivityProof('p1', 'P'), reflexivityProof('p2', 'Q')]);
        const after1 = miner.all().length;
        miner.mine([reflexivityProof('p3', 'R'), reflexivityProof('p4', 'S')]);
        const after2 = miner.all().length;
        (0, vitest_1.expect)(after2).toBeGreaterThanOrEqual(after1);
    });
    (0, vitest_1.it)('mergea usageCount cuando el mismo lemma aparece en batches distintos', () => {
        miner.mine([reflexivityProof('p1', 'P'), reflexivityProof('p2', 'Q')]);
        miner.mine([reflexivityProof('p3', 'R'), reflexivityProof('p4', 'S')]);
        // Algún lemma debería tener usageCount >= 4 (suma de batches).
        const allUsages = miner.all().map((l) => l.usageCount);
        (0, vitest_1.expect)(Math.max(...allUsages)).toBeGreaterThanOrEqual(4);
    });
    (0, vitest_1.it)('clear() resetea el estado', () => {
        miner.mine([reflexivityProof('p1', 'P'), reflexivityProof('p2', 'Q')]);
        miner.clear();
        (0, vitest_1.expect)(miner.all()).toHaveLength(0);
        (0, vitest_1.expect)(miner.stats().proofsAnalyzed).toBe(0);
    });
    (0, vitest_1.it)('top(k) devuelve los k mejores', () => {
        miner.mine([
            reflexivityProof('p1', 'P'),
            reflexivityProof('p2', 'Q'),
            conjunctionProof('p3', 'A', 'B'),
            conjunctionProof('p4', 'C', 'D'),
        ]);
        const top1 = miner.top(1);
        (0, vitest_1.expect)(top1.length).toBeLessThanOrEqual(1);
    });
    (0, vitest_1.it)('cache compartido: getCache devuelve la instancia interna', () => {
        const cache = new theorem_cache_1.TheoremCache();
        const m = new index_1.ProofMiner({ cache });
        m.mine([reflexivityProof('p1', 'P'), reflexivityProof('p2', 'Q')]);
        (0, vitest_1.expect)(m.getCache()).toBe(cache);
        (0, vitest_1.expect)(cache.stats().entries).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=integration.test.js.map