"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const serializer_1 = require("../serializer");
const BASE_NOTEBOOK = {
    version: '1.0',
    kernel: 'st-lang',
    kernelVersion: '4.14',
    metadata: {
        title: 'Serializer Test',
        author: 'Test',
        profile: 'classical.propositional',
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z',
    },
    cells: [
        { id: 'md-1', type: 'markdown', source: '# Title' },
        {
            id: 'code-1',
            type: 'code',
            source: 'check valid P -> P',
            outputs: [],
        },
    ],
};
(0, vitest_1.describe)('serializeNotebook', () => {
    (0, vitest_1.it)('produces valid JSON', () => {
        const json = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        (0, vitest_1.expect)(() => JSON.parse(json)).not.toThrow();
    });
    (0, vitest_1.it)('uses 2-space indentation', () => {
        const json = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        (0, vitest_1.expect)(json).toContain('  "version"');
    });
    (0, vitest_1.it)('preserves all top-level fields', () => {
        const json = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        const parsed = JSON.parse(json);
        (0, vitest_1.expect)(parsed.version).toBe('1.0');
        (0, vitest_1.expect)(parsed.kernel).toBe('st-lang');
        (0, vitest_1.expect)(parsed.kernelVersion).toBe('4.14');
    });
    (0, vitest_1.it)('preserves cells array', () => {
        const json = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        const parsed = JSON.parse(json);
        (0, vitest_1.expect)(parsed.cells).toHaveLength(2);
    });
    (0, vitest_1.it)('preserves metadata fields', () => {
        const json = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        const parsed = JSON.parse(json);
        (0, vitest_1.expect)(parsed.metadata.title).toBe('Serializer Test');
        (0, vitest_1.expect)(parsed.metadata.author).toBe('Test');
    });
    (0, vitest_1.it)('produces different output from compact', () => {
        const pretty = (0, serializer_1.serializeNotebook)(BASE_NOTEBOOK);
        const compact = (0, serializer_1.serializeNotebookCompact)(BASE_NOTEBOOK);
        (0, vitest_1.expect)(pretty.length).toBeGreaterThan(compact.length);
        (0, vitest_1.expect)(compact).not.toContain('\n');
    });
});
//# sourceMappingURL=serializer.test.js.map