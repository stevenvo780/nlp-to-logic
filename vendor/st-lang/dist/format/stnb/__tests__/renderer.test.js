"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const renderer_html_1 = require("../renderer-html");
const renderer_markdown_1 = require("../renderer-markdown");
const DEMO_NOTEBOOK = {
    version: '1.0',
    kernel: 'st-lang',
    kernelVersion: '4.14',
    metadata: {
        title: 'Renderer Demo',
        author: 'Test Author',
        profile: 'classical.propositional',
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z',
    },
    cells: [
        {
            id: 'md-1',
            type: 'markdown',
            source: '# Intro\n\nEsta es una prueba $p \\to p$',
        },
        {
            id: 'code-1',
            type: 'code',
            source: 'check valid P -> P',
            outputs: [
                {
                    type: 'result',
                    data: { valid: true, stdout: '✓ valid' },
                    metadata: { executionTime: 5 },
                },
            ],
        },
        {
            id: 'code-err',
            type: 'code',
            source: 'invalid',
            outputs: [
                {
                    type: 'error',
                    data: { valid: false, message: 'Syntax error' },
                    metadata: { executionTime: 2 },
                },
            ],
        },
    ],
};
(0, vitest_1.describe)('renderHTML', () => {
    (0, vitest_1.it)('produces a valid HTML document', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('<!DOCTYPE html>');
        (0, vitest_1.expect)(html).toContain('<html');
        (0, vitest_1.expect)(html).toContain('</html>');
    });
    (0, vitest_1.it)('includes the notebook title', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('Renderer Demo');
    });
    (0, vitest_1.it)('includes KaTeX script tags', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('katex');
    });
    (0, vitest_1.it)('renders markdown cells', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('cell-markdown');
    });
    (0, vitest_1.it)('renders code cells with source', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('cell-code');
        (0, vitest_1.expect)(html).toContain('check valid P -&gt; P');
    });
    (0, vitest_1.it)('marks successful outputs with ok class', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('output-ok');
    });
    (0, vitest_1.it)('marks error outputs with err class', () => {
        const html = (0, renderer_html_1.renderHTML)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(html).toContain('output-err');
    });
});
(0, vitest_1.describe)('renderMarkdown', () => {
    (0, vitest_1.it)('starts with the notebook title', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md.startsWith('# Renderer Demo')).toBe(true);
    });
    (0, vitest_1.it)('includes kernel metadata', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md).toContain('st-lang');
    });
    (0, vitest_1.it)('renders code cells as fenced st blocks', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md).toContain('```st');
        (0, vitest_1.expect)(md).toContain('check valid P -> P');
    });
    (0, vitest_1.it)('renders outputs as table or code block', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md).toContain('| Estado |');
    });
    (0, vitest_1.it)('includes markdown cell content verbatim', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md).toContain('# Intro');
    });
    (0, vitest_1.it)('renders error outputs with error marker', () => {
        const md = (0, renderer_markdown_1.renderMarkdown)(DEMO_NOTEBOOK);
        (0, vitest_1.expect)(md).toContain('Error');
    });
});
//# sourceMappingURL=renderer.test.js.map