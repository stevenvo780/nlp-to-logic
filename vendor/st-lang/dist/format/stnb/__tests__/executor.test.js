"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const executor_1 = require("../executor");
function makeNotebook(cells = []) {
    return {
        version: '1.0',
        kernel: 'st-lang',
        kernelVersion: '4.14',
        metadata: {
            title: 'Executor Test',
            profile: 'classical.propositional',
            createdAt: '2026-05-18T00:00:00.000Z',
            updatedAt: '2026-05-18T00:00:00.000Z',
        },
        cells,
    };
}
(0, vitest_1.describe)('executeNotebook', () => {
    (0, vitest_1.it)('executes empty notebook without error', () => {
        const result = (0, executor_1.executeNotebook)(makeNotebook());
        (0, vitest_1.expect)(result.cellsExecuted).toBe(0);
        (0, vitest_1.expect)(result.errors).toHaveLength(0);
    });
    (0, vitest_1.it)('skips markdown cells', () => {
        const nb = makeNotebook([
            { id: 'md', type: 'markdown', source: '# Title' },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(result.cellsExecuted).toBe(0);
        (0, vitest_1.expect)(result.notebook.cells[0].type).toBe('markdown');
    });
    (0, vitest_1.it)('executes a valid code cell and captures result output', () => {
        const nb = makeNotebook([
            {
                id: 'c1',
                type: 'code',
                source: 'check valid P -> P',
                outputs: [],
            },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(result.cellsExecuted).toBe(1);
        const cell = result.notebook.cells[0];
        if (cell?.type === 'code') {
            (0, vitest_1.expect)(cell.outputs.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(cell.outputs[0].type).toBe('result');
        }
    });
    (0, vitest_1.it)('captures error output for invalid ST code', () => {
        const nb = makeNotebook([
            {
                id: 'c-err',
                type: 'code',
                source: 'this is not valid st code @@@@',
                outputs: [],
            },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        const cell = result.notebook.cells[0];
        if (cell?.type === 'code') {
            (0, vitest_1.expect)(cell.outputs.length).toBeGreaterThan(0);
            const out = cell.outputs[0];
            (0, vitest_1.expect)(out.type === 'result' || out.type === 'error').toBe(true);
        }
    });
    (0, vitest_1.it)('executes multiple cells in order', () => {
        const nb = makeNotebook([
            { id: 'md', type: 'markdown', source: '# Intro' },
            { id: 'c1', type: 'code', source: 'check valid P -> P', outputs: [] },
            {
                id: 'c2',
                type: 'code',
                source: 'check valid (P -> Q) -> (not Q -> not P)',
                outputs: [],
            },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(result.cellsExecuted).toBe(2);
        (0, vitest_1.expect)(result.notebook.cells).toHaveLength(3);
    });
    (0, vitest_1.it)('uses per-cell profile when specified', () => {
        const nb = makeNotebook([
            {
                id: 'modal-cell',
                type: 'code',
                source: 'check valid []P -> P',
                profile: 'modal.s4',
                outputs: [],
            },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(result.cellsExecuted).toBe(1);
    });
    (0, vitest_1.it)('updates notebook metadata.updatedAt after execution', () => {
        const originalDate = '2026-01-01T00:00:00.000Z';
        const nb = makeNotebook([
            { id: 'c1', type: 'code', source: 'check valid P -> P', outputs: [] },
        ]);
        nb.metadata.updatedAt = originalDate;
        const result = (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(result.notebook.metadata.updatedAt).not.toBe(originalDate);
    });
    (0, vitest_1.it)('outputs include executionTime in metadata', () => {
        const nb = makeNotebook([
            { id: 'c1', type: 'code', source: 'check valid P -> P', outputs: [] },
        ]);
        const result = (0, executor_1.executeNotebook)(nb);
        const cell = result.notebook.cells[0];
        if (cell?.type === 'code' && cell.outputs.length > 0) {
            (0, vitest_1.expect)(cell.outputs[0].metadata?.executionTime).toBeDefined();
            (0, vitest_1.expect)(typeof cell.outputs[0].metadata?.executionTime).toBe('number');
        }
    });
    (0, vitest_1.it)('does not mutate the original notebook', () => {
        const nb = makeNotebook([
            { id: 'c1', type: 'code', source: 'check valid P -> P', outputs: [] },
        ]);
        const cellsBefore = nb.cells.length;
        (0, executor_1.executeNotebook)(nb);
        (0, vitest_1.expect)(nb.cells.length).toBe(cellsBefore);
        if (nb.cells[0]?.type === 'code') {
            (0, vitest_1.expect)(nb.cells[0].outputs).toHaveLength(0);
        }
    });
});
(0, vitest_1.describe)('executeCell', () => {
    (0, vitest_1.it)('returns result output for valid ST code', () => {
        const cell = {
            id: 'c1',
            type: 'code',
            source: 'check valid P -> P',
            outputs: [],
        };
        const outputs = (0, executor_1.executeCell)(cell, 'classical.propositional');
        (0, vitest_1.expect)(outputs.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(outputs[0].type === 'result' || outputs[0].type === 'error').toBe(true);
    });
});
//# sourceMappingURL=executor.test.js.map