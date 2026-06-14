import type { LemmaApplicationResult } from './types';
import type { LemmaLibrary } from './library';
/**
 * Devuelve los lemas de `library` cuyo esqueleto estructural es
 * subsequence del goal. Si se encuentra el más específico (mayor
 * cantidad de tokens estructurales), añade las sustituciones.
 */
export declare function tryApplyLemma(goal: string, library: LemmaLibrary): LemmaApplicationResult;
//# sourceMappingURL=apply.d.ts.map