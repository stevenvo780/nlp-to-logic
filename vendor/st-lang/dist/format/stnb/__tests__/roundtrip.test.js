"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parser_1 = require("../parser");
const serializer_1 = require("../serializer");
function roundtrip(nb) {
    return (0, parser_1.parseNotebook)((0, serializer_1.serializeNotebook)(nb));
}
const FULL_NOTEBOOK = {
    version: '1.0',
    kernel: 'st-lang',
    kernelVersion: '4.14',
    metadata: {
        title: 'Roundtrip Test',
        author: 'Test Author',
        profile: 'classical.propositional',
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z',
    },
    cells: [
        { id: 'md-1', type: 'markdown', source: '# Hello $p \\to p$' },
        {
            id: 'code-1',
            type: 'code',
            source: 'check valid P -> P',
            outputs: [
                {
                    type: 'result',
                    data: { valid: true, stdout: '✓ valid' },
                    metadata: { executionTime: 10 },
                },
            ],
        },
        {
            id: 'code-modal',
            type: 'code',
            source: 'check valid []P -> P',
            profile: 'modal.s4',
            outputs: [],
        },
    ],
};
(0, vitest_1.describe)('roundtrip parse → serialize → parse', () => {
    (0, vitest_1.it)('produces structurally identical notebooks', () => {
        const rt = roundtrip(FULL_NOTEBOOK);
        (0, vitest_1.expect)(rt.version).toBe(FULL_NOTEBOOK.version);
        (0, vitest_1.expect)(rt.kernel).toBe(FULL_NOTEBOOK.kernel);
        (0, vitest_1.expect)(rt.kernelVersion).toBe(FULL_NOTEBOOK.kernelVersion);
        (0, vitest_1.expect)(rt.metadata.title).toBe(FULL_NOTEBOOK.metadata.title);
        (0, vitest_1.expect)(rt.cells).toHaveLength(FULL_NOTEBOOK.cells.length);
    });
    (0, vitest_1.it)('preserves cell ids and types', () => {
        const rt = roundtrip(FULL_NOTEBOOK);
        for (let i = 0; i < FULL_NOTEBOOK.cells.length; i++) {
            (0, vitest_1.expect)(rt.cells[i].id).toBe(FULL_NOTEBOOK.cells[i].id);
            (0, vitest_1.expect)(rt.cells[i].type).toBe(FULL_NOTEBOOK.cells[i].type);
        }
    });
    (0, vitest_1.it)('is idempotent: double roundtrip equals single roundtrip', () => {
        const once = (0, serializer_1.serializeNotebook)(roundtrip(FULL_NOTEBOOK));
        const twice = (0, serializer_1.serializeNotebook)(roundtrip(roundtrip(FULL_NOTEBOOK)));
        (0, vitest_1.expect)(once).toBe(twice);
    });
    (0, vitest_1.it)('preserves code cell outputs through roundtrip', () => {
        const rt = roundtrip(FULL_NOTEBOOK);
        const codeCell = rt.cells.find((c) => c.id === 'code-1');
        (0, vitest_1.expect)(codeCell?.type).toBe('code');
        if (codeCell?.type === 'code') {
            (0, vitest_1.expect)(codeCell.outputs).toHaveLength(1);
            (0, vitest_1.expect)(codeCell.outputs[0].type).toBe('result');
            (0, vitest_1.expect)(codeCell.outputs[0].metadata?.executionTime).toBe(10);
        }
    });
    (0, vitest_1.it)('handles empty notebooks in roundtrip', () => {
        const empty = {
            version: '1.0',
            kernel: 'st-lang',
            kernelVersion: '4.14',
            metadata: {
                title: 'Empty',
                profile: 'classical.propositional',
                createdAt: '2026-05-18T00:00:00.000Z',
                updatedAt: '2026-05-18T00:00:00.000Z',
            },
            cells: [],
        };
        const rt = roundtrip(empty);
        (0, vitest_1.expect)(rt.cells).toHaveLength(0);
    });
});
//# sourceMappingURL=roundtrip.test.js.map