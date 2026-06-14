import type { DocOptions, GenerateResult } from './types';
/**
 * Genera documentación a disco según `opts.template`. Crea
 * `outputDir` y subdirectorios necesarios.
 *
 * El default cuando `template` no se especifica es `'markdown'`.
 */
export declare function generateDocs(opts: DocOptions): Promise<GenerateResult>;
//# sourceMappingURL=generate.d.ts.map