"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const extractor_1 = require("../extractor");
function trace(conclusion, steps, cost = 10, profile = 'classical', premises = []) {
    return {
        conclusion,
        premises,
        profile,
        cost,
        steps: steps.map(([rule, inputs, output, depth]) => ({
            rule,
            inputs,
            output,
            depth,
        })),
    };
}
(0, vitest_1.describe)('extractSubtrees', () => {
    (0, vitest_1.it)('devuelve array vacío si el proof no tiene pasos', () => {
        const p = trace('X', []);
        (0, vitest_1.expect)((0, extractor_1.extractSubtrees)(p, 'p1')).toEqual([]);
    });
    (0, vitest_1.it)('genera un sub-tree por paso del proof', () => {
        const p = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const subs = (0, extractor_1.extractSubtrees)(p, 'p1');
        (0, vitest_1.expect)(subs).toHaveLength(3);
    });
    (0, vitest_1.it)('el sub-tree raíz cubre todos los pasos', () => {
        const p = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const root = (0, extractor_1.extractSubtrees)(p, 'p1')[0];
        (0, vitest_1.expect)(root).toBeDefined();
        (0, vitest_1.expect)(root?.steps).toHaveLength(3);
    });
    (0, vitest_1.it)('un sub-tree de hoja solo contiene un paso', () => {
        const p = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const subs = (0, extractor_1.extractSubtrees)(p, 'p1');
        const leaf = subs[2];
        (0, vitest_1.expect)(leaf?.steps).toHaveLength(1);
        (0, vitest_1.expect)(leaf?.steps[0]?.rule).toBe('axiom');
    });
    (0, vitest_1.it)('respeta el corte por depth cuando hay hermanos', () => {
        // Árbol: A tiene hijos B y C; B tiene hijo D
        //   A(0)
        //   ├ B(1)
        //   │  └ D(2)
        //   └ C(1)
        const p = trace('A', [
            ['rA', ['B', 'C'], 'A', 0],
            ['rB', ['D'], 'B', 1],
            ['rD', [], 'D', 2],
            ['rC', [], 'C', 1],
        ]);
        const subs = (0, extractor_1.extractSubtrees)(p, 'p1');
        // sub raíz en B: incluye B y D, no C
        const subB = subs[1];
        (0, vitest_1.expect)(subB?.steps.map((s) => s.output)).toEqual(['B', 'D']);
        // sub raíz en C: solo C
        const subC = subs[3];
        (0, vitest_1.expect)(subC?.steps).toHaveLength(1);
        (0, vitest_1.expect)(subC?.steps[0]?.output).toBe('C');
    });
});
(0, vitest_1.describe)('subtreeKey', () => {
    (0, vitest_1.it)('asigna la misma clave a sub-trees estructuralmente idénticos', () => {
        const p1 = trace('X', [
            ['MP', ['P->P', 'P'], 'P', 0],
            ['axiom', [], 'P->P', 1],
            ['axiom', [], 'P', 1],
        ]);
        const p2 = trace('X', [
            ['MP', ['Q->Q', 'Q'], 'Q', 0],
            ['axiom', [], 'Q->Q', 1],
            ['axiom', [], 'Q', 1],
        ]);
        const sub1 = (0, extractor_1.extractSubtrees)(p1, 'p1')[0];
        const sub2 = (0, extractor_1.extractSubtrees)(p2, 'p2')[0];
        (0, vitest_1.expect)(sub1).toBeDefined();
        (0, vitest_1.expect)(sub2).toBeDefined();
        (0, vitest_1.expect)((0, extractor_1.subtreeKey)(sub1)).toBe((0, extractor_1.subtreeKey)(sub2));
    });
    (0, vitest_1.it)('asigna distinta clave a sub-trees con distinta regla', () => {
        const p1 = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const p2 = trace('X', [
            ['andI', ['A', 'B'], 'A and B', 0],
            ['axiom', [], 'A', 1],
            ['axiom', [], 'B', 1],
        ]);
        (0, vitest_1.expect)((0, extractor_1.subtreeKey)((0, extractor_1.extractSubtrees)(p1, 'p1')[0])).not.toBe((0, extractor_1.subtreeKey)((0, extractor_1.extractSubtrees)(p2, 'p2')[0]));
    });
});
(0, vitest_1.describe)('groupSubtrees', () => {
    (0, vitest_1.it)('agrupa por clave canónica', () => {
        const p1 = trace('X', [
            ['MP', ['P->P', 'P'], 'P', 0],
            ['axiom', [], 'P->P', 1],
            ['axiom', [], 'P', 1],
        ]);
        const p2 = trace('X', [
            ['MP', ['R->R', 'R'], 'R', 0],
            ['axiom', [], 'R->R', 1],
            ['axiom', [], 'R', 1],
        ]);
        const sub1 = (0, extractor_1.extractSubtrees)(p1, 'p1');
        const sub2 = (0, extractor_1.extractSubtrees)(p2, 'p2');
        const groups = (0, extractor_1.groupSubtrees)([...sub1, ...sub2]);
        // los 3 sub-trees de p1 deberían tener al menos 1 par equivalente en p2
        const sized3 = groups.filter((g) => g.members.length >= 2);
        (0, vitest_1.expect)(sized3.length).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('extractAuxiliaryLemmas', () => {
    (0, vitest_1.it)('encuentra lemmas comunes a 2 proofs con misma estructura', () => {
        const p1 = trace('X', [
            ['MP', ['P->P', 'P'], 'P', 0],
            ['axiom', [], 'P->P', 1],
            ['axiom', [], 'P', 1],
        ]);
        const p2 = trace('Y', [
            ['MP', ['Q->Q', 'Q'], 'Q', 0],
            ['axiom', [], 'Q->Q', 1],
            ['axiom', [], 'Q', 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1, p2]);
        (0, vitest_1.expect)(groups.length).toBeGreaterThan(0);
        const root = groups.find((g) => g.members.some((m) => m.steps.length === 3));
        (0, vitest_1.expect)(root).toBeDefined();
        (0, vitest_1.expect)(root?.members.length).toBe(2);
    });
    (0, vitest_1.it)('respeta minReuseThreshold = 3 (no extrae si solo aparece 2 veces)', () => {
        const p1 = trace('X', [
            ['MP', ['P->P', 'P'], 'P', 0],
            ['axiom', [], 'P->P', 1],
            ['axiom', [], 'P', 1],
        ]);
        const p2 = trace('Y', [
            ['MP', ['Q->Q', 'Q'], 'Q', 0],
            ['axiom', [], 'Q->Q', 1],
            ['axiom', [], 'Q', 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1, p2], { minReuseThreshold: 3 });
        (0, vitest_1.expect)(groups).toHaveLength(0);
    });
    (0, vitest_1.it)('respeta minSubtreeSize = 3 (filtra sub-trees pequeños)', () => {
        const p1 = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
        ]);
        const p2 = trace('Y', [
            ['MP', ['C->D', 'C'], 'D', 0],
            ['axiom', [], 'C->D', 1],
        ]);
        // Ningún sub-tree tiene >= 3 pasos.
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1, p2], { minSubtreeSize: 3 });
        (0, vitest_1.expect)(groups).toHaveLength(0);
    });
    (0, vitest_1.it)('cuenta proofs distintos, no ocurrencias múltiples dentro del mismo proof', () => {
        // Dos sub-trees idénticos dentro del MISMO proof no califican.
        const p1 = trace('X', [
            ['andI', ['A=A', 'A=A'], '(A=A) and (A=A)', 0],
            ['refl', [], 'A=A', 1],
            ['refl', [], 'A=A', 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1], { minReuseThreshold: 2 });
        (0, vitest_1.expect)(groups).toHaveLength(0);
    });
    (0, vitest_1.it)('extrae con 1 proof si minReuseThreshold = 1', () => {
        const p1 = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1], {
            minReuseThreshold: 1,
            minSubtreeSize: 2,
        });
        (0, vitest_1.expect)(groups.length).toBeGreaterThanOrEqual(1);
    });
    (0, vitest_1.it)('agrupa correctamente cuando 3 proofs comparten un sub-tree', () => {
        const makeP = (label) => trace(label, [
            ['MP', [`${label}->${label}`, label], label, 0],
            ['axiom', [], `${label}->${label}`, 1],
            ['axiom', [], label, 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([makeP('P'), makeP('Q'), makeP('R')]);
        // El sub-tree raíz debería tener 3 miembros (uno por proof).
        const root = groups.find((g) => g.members.some((m) => m.steps.length === 3));
        (0, vitest_1.expect)(root?.members.length).toBe(3);
    });
    (0, vitest_1.it)('proofs sin solapamiento estructural no producen lemmas', () => {
        const p1 = trace('X', [
            ['MP', ['A->B', 'A'], 'B', 0],
            ['axiom', [], 'A->B', 1],
            ['axiom', [], 'A', 1],
        ]);
        const p2 = trace('Y', [
            ['andE', ['A and B'], 'A', 0],
            ['axiom', [], 'A and B', 1],
        ]);
        (0, vitest_1.expect)((0, extractor_1.extractAuxiliaryLemmas)([p1, p2])).toHaveLength(0);
    });
    (0, vitest_1.it)('asigna proofId automáticamente cuando el trace no trae id', () => {
        const p1 = trace('X', [
            ['MP', ['P->P', 'P'], 'P', 0],
            ['axiom', [], 'P->P', 1],
            ['axiom', [], 'P', 1],
        ]);
        const p2 = trace('Y', [
            ['MP', ['Q->Q', 'Q'], 'Q', 0],
            ['axiom', [], 'Q->Q', 1],
            ['axiom', [], 'Q', 1],
        ]);
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1, p2]);
        const allIds = new Set();
        for (const g of groups)
            for (const m of g.members)
                allIds.add(m.proofId);
        (0, vitest_1.expect)(allIds.has('proof-0')).toBe(true);
        (0, vitest_1.expect)(allIds.has('proof-1')).toBe(true);
    });
    (0, vitest_1.it)('respeta proofId explícito cuando se provee', () => {
        const p1 = {
            id: 'my-proof-A',
            ...trace('X', [
                ['MP', ['P->P', 'P'], 'P', 0],
                ['axiom', [], 'P->P', 1],
                ['axiom', [], 'P', 1],
            ]),
        };
        const p2 = {
            id: 'my-proof-B',
            ...trace('Y', [
                ['MP', ['Q->Q', 'Q'], 'Q', 0],
                ['axiom', [], 'Q->Q', 1],
                ['axiom', [], 'Q', 1],
            ]),
        };
        const groups = (0, extractor_1.extractAuxiliaryLemmas)([p1, p2]);
        const allIds = new Set();
        for (const g of groups)
            for (const m of g.members)
                allIds.add(m.proofId);
        (0, vitest_1.expect)(allIds.has('my-proof-A')).toBe(true);
        (0, vitest_1.expect)(allIds.has('my-proof-B')).toBe(true);
    });
});
//# sourceMappingURL=extractor.test.js.map