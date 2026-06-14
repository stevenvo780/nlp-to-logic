/**
 * Renderer HTML para notebooks .stnb
 * Produce HTML standalone con KaTeX para $...$ y $$...$$
 */
import type { Notebook } from './types';
/**
 * Renderiza un Notebook a HTML standalone.
 * Incluye KaTeX desde CDN para renderizar LaTeX inline ($...$) y display ($$...$$).
 */
export declare function renderHTML(notebook: Notebook): string;
//# sourceMappingURL=renderer-html.d.ts.map