"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parser_1 = require("../parser");
const VALID_NOTEBOOK = {
    version: '1.0',
    kernel: 'st-lang',
    kernelVersion: '4.14',
    metadata: {
        title: 'Test',
        profile: 'classical.propositional',
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z',
    },
    cells: [],
};
function makeJson(overrides = {}) {
    return JSON.stringify({ ...VALID_NOTEBOOK, ...overrides });
}
(0, vitest_1.describe)('parseNotebook', () => {
    (0, vitest_1.it)('parses a minimal valid notebook', () => {
        const nb = (0, parser_1.parseNotebook)(makeJson());
        (0, vitest_1.expect)(nb.version).toBe('1.0');
        (0, vitest_1.expect)(nb.kernel).toBe('st-lang');
        (0, vitest_1.expect)(nb.cells).toHaveLength(0);
    });
    (0, vitest_1.it)('parses notebook with markdown and code cells', () => {
        const json = JSON.stringify({
            ...VALID_NOTEBOOK,
            cells: [
                { id: 'md-1', type: 'markdown', source: '# Hello' },
                { id: 'code-1', type: 'code', source: 'check valid P -> P', outputs: [] },
            ],
        });
        const nb = (0, parser_1.parseNotebook)(json);
        (0, vitest_1.expect)(nb.cells).toHaveLength(2);
        (0, vitest_1.expect)(nb.cells[0].type).toBe('markdown');
        (0, vitest_1.expect)(nb.cells[1].type).toBe('code');
    });
    (0, vitest_1.it)('parses code cell with outputs', () => {
        const json = JSON.stringify({
            ...VALID_NOTEBOOK,
            cells: [
                {
                    id: 'c1',
                    type: 'code',
                    source: 'check valid P',
                    outputs: [
                        {
                            type: 'result',
                            data: { valid: true, stdout: 'ok' },
                            metadata: { executionTime: 10 },
                        },
                    ],
                },
            ],
        });
        const nb = (0, parser_1.parseNotebook)(json);
        const cell = nb.cells[0];
        (0, vitest_1.expect)(cell?.type).toBe('code');
        if (cell?.type === 'code') {
            (0, vitest_1.expect)(cell.outputs).toHaveLength(1);
            (0, vitest_1.expect)(cell.outputs[0].type).toBe('result');
            (0, vitest_1.expect)(cell.outputs[0].metadata?.executionTime).toBe(10);
        }
    });
    (0, vitest_1.it)('throws ParseError for invalid JSON', () => {
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)('not json')).toThrow(parser_1.ParseError);
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)('not json')).toThrow('Invalid JSON');
    });
    (0, vitest_1.it)('throws ParseError when version is missing', () => {
        const json = makeJson({ version: undefined });
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)(json)).toThrow(parser_1.ParseError);
    });
    (0, vitest_1.it)('throws ParseError for unsupported version', () => {
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)(makeJson({ version: '2.0' }))).toThrow(parser_1.ParseError);
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)(makeJson({ version: '2.0' }))).toThrow('Unsupported notebook version');
    });
    (0, vitest_1.it)('throws ParseError for invalid cell type', () => {
        const json = JSON.stringify({
            ...VALID_NOTEBOOK,
            cells: [{ id: 'x', type: 'invalid', source: '' }],
        });
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)(json)).toThrow(parser_1.ParseError);
        (0, vitest_1.expect)(() => (0, parser_1.parseNotebook)(json)).toThrow('invalid type');
    });
    (0, vitest_1.it)('parses code cell with per-cell profile override', () => {
        const json = JSON.stringify({
            ...VALID_NOTEBOOK,
            cells: [
                {
                    id: 'c1',
                    type: 'code',
                    source: 'check valid []P -> P',
                    profile: 'modal.s4',
                    outputs: [],
                },
            ],
        });
        const nb = (0, parser_1.parseNotebook)(json);
        const cell = nb.cells[0];
        if (cell?.type === 'code') {
            (0, vitest_1.expect)(cell.profile).toBe('modal.s4');
        }
    });
    (0, vitest_1.it)('preserves extra metadata fields', () => {
        const json = JSON.stringify({
            ...VALID_NOTEBOOK,
            metadata: {
                ...VALID_NOTEBOOK.metadata,
                customField: 'custom-value',
                tags: ['logic', 'intro'],
            },
        });
        const nb = (0, parser_1.parseNotebook)(json);
        (0, vitest_1.expect)(nb.metadata.customField).toBe('custom-value');
    });
});
//# sourceMappingURL=parser.test.js.map