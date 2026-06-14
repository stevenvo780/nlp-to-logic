"use strict";
// ============================================================
// Tests: HashEmbedding — propiedades del vector de embedding
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const embedding_1 = require("../embedding");
const types_1 = require("../types");
(0, vitest_1.describe)('hashEmbed — dimensión y tipos', () => {
    (0, vitest_1.it)('devuelve un Float32Array de dimensión EMBEDDING_DIM', () => {
        const v = (0, embedding_1.hashEmbed)('P → Q');
        (0, vitest_1.expect)(v).toBeInstanceOf(Float32Array);
        (0, vitest_1.expect)(v.length).toBe(types_1.EMBEDDING_DIM);
    });
    (0, vitest_1.it)('no contiene NaN ni Infinity', () => {
        const v = (0, embedding_1.hashEmbed)('∀x. P(x) ∧ Q(x)');
        for (let i = 0; i < v.length; i++) {
            (0, vitest_1.expect)(Number.isFinite(v[i])).toBe(true);
        }
    });
    (0, vitest_1.it)('vector vacío no tiene NaN', () => {
        const v = (0, embedding_1.hashEmbed)('');
        for (let i = 0; i < v.length; i++) {
            (0, vitest_1.expect)(Number.isFinite(v[i])).toBe(true);
        }
    });
    (0, vitest_1.it)('EMBEDDING_DIM es 256', () => {
        (0, vitest_1.expect)(types_1.EMBEDDING_DIM).toBe(256);
    });
});
(0, vitest_1.describe)('hashEmbed — determinismo', () => {
    (0, vitest_1.it)('la misma fórmula produce el mismo vector (llamada simple)', () => {
        const f = '(P ∧ Q) → P';
        const v1 = (0, embedding_1.hashEmbed)(f);
        const v2 = (0, embedding_1.hashEmbed)(f);
        (0, vitest_1.expect)(Array.from(v1)).toEqual(Array.from(v2));
    });
    (0, vitest_1.it)('la misma fórmula produce el mismo vector (llamadas repetidas)', () => {
        const f = '¬¬P → P';
        const vecs = Array.from({ length: 5 }, () => (0, embedding_1.hashEmbed)(f));
        for (const v of vecs) {
            (0, vitest_1.expect)(Array.from(v)).toEqual(Array.from(vecs[0]));
        }
    });
    (0, vitest_1.it)('fórmulas diferentes producen vectores diferentes', () => {
        const v1 = (0, embedding_1.hashEmbed)('P → Q');
        const v2 = (0, embedding_1.hashEmbed)('P ∧ Q');
        const diff = Array.from(v1).reduce((acc, x, i) => acc + Math.abs(x - (v2[i] ?? 0)), 0);
        (0, vitest_1.expect)(diff).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('hashEmbed — normalización L2', () => {
    (0, vitest_1.it)('el vector normalizado tiene norma ≈ 1', () => {
        const v = (0, embedding_1.hashEmbed)('P ∨ ¬P');
        let norm = 0;
        for (let i = 0; i < v.length; i++)
            norm += (v[i] ?? 0) ** 2;
        (0, vitest_1.expect)(Math.sqrt(norm)).toBeCloseTo(1.0, 5);
    });
    (0, vitest_1.it)('normalizeEmbedding(zero) no produce NaN', () => {
        const zero = new Float32Array(types_1.EMBEDDING_DIM);
        const norm = (0, embedding_1.normalizeEmbedding)(zero);
        for (let i = 0; i < norm.length; i++) {
            (0, vitest_1.expect)(Number.isFinite(norm[i])).toBe(true);
        }
    });
    (0, vitest_1.it)('normalizeEmbedding idempotente sobre vector ya normalizado', () => {
        const v = (0, embedding_1.hashEmbed)('□P → P');
        const v2 = (0, embedding_1.normalizeEmbedding)(v);
        let norm = 0;
        for (let i = 0; i < v2.length; i++)
            norm += (v2[i] ?? 0) ** 2;
        (0, vitest_1.expect)(Math.sqrt(norm)).toBeCloseTo(1.0, 5);
    });
});
(0, vitest_1.describe)('hashEmbed — localidad semántica', () => {
    (0, vitest_1.it)('commutativity: P∧Q y Q∧P tienen similarity > 0.5', () => {
        const v1 = (0, embedding_1.hashEmbed)('P ∧ Q');
        const v2 = (0, embedding_1.hashEmbed)('Q ∧ P');
        let dot = 0;
        for (let i = 0; i < v1.length; i++)
            dot += (v1[i] ?? 0) * (v2[i] ?? 0);
        (0, vitest_1.expect)(dot).toBeGreaterThan(0.5);
    });
    (0, vitest_1.it)('fórmulas modales cercanas tienen similarity > 0.3', () => {
        const v1 = (0, embedding_1.hashEmbed)('□P → P');
        const v2 = (0, embedding_1.hashEmbed)('□Q → Q');
        let dot = 0;
        for (let i = 0; i < v1.length; i++)
            dot += (v1[i] ?? 0) * (v2[i] ?? 0);
        (0, vitest_1.expect)(dot).toBeGreaterThan(0.3);
    });
    (0, vitest_1.it)('fórmulas de distintos dominios tienen similarity < 0.95', () => {
        const vProp = (0, embedding_1.hashEmbed)('P ∧ Q → P');
        const vArith = (0, embedding_1.hashEmbed)('∀n. n + 0 = n');
        let dot = 0;
        for (let i = 0; i < vProp.length; i++)
            dot += (vProp[i] ?? 0) * (vArith[i] ?? 0);
        (0, vitest_1.expect)(dot).toBeLessThan(0.95);
    });
});
//# sourceMappingURL=embedding.test.js.map