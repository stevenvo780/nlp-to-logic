import type { PiProcess } from './types';
/**
 * Sustitución `p[x := v]` capture-avoiding.
 *
 *  - Si `x === v` o `x` no aparece libre, devuelve `p` sin cambios
 *    estructurales (pero retorna un AST nuevo solo donde fue necesario).
 *  - En binders (input, new) verifica que el nombre ligado no capture
 *    `v`: si lo hiciera, refresca el binder con `freshName`.
 */
export declare function substitute(p: PiProcess, x: string, v: string): PiProcess;
//# sourceMappingURL=substitution.d.ts.map