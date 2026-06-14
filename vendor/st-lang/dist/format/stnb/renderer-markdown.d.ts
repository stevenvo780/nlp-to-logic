/**
 * Renderer Markdown para notebooks .stnb
 * Exporta a Markdown con fenced blocks para code cells y tablas para outputs.
 */
import type { Notebook } from './types';
/**
 * Exporta un Notebook a Markdown.
 * - cells markdown → contenido directo
 * - cells code → fenced blocks ```st ... ```
 * - outputs → tablas Markdown
 */
export declare function renderMarkdown(notebook: Notebook): string;
//# sourceMappingURL=renderer-markdown.d.ts.map