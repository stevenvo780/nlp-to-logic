import type { Ring, VerificationResult } from './types';
/**
 * Verifica los axiomas de anillo (con identidad multiplicativa):
 *   - (R, +, 0) grupo abeliano.
 *   - (R, ·, 1) monoide (asociatividad + identidad).
 *   - · distribuye sobre + por ambos lados.
 */
export declare function verifyRing<T>(r: Ring<T>, elements: T[], eq?: (a: T, b: T) => boolean): VerificationResult;
/**
 * Un anillo conmutativo R es campo si todo elemento no nulo tiene
 * inverso multiplicativo dentro del conjunto. `div` debe devolver
 * un T para argumentos válidos o `undefined` cuando no existe inverso.
 */
export declare function isField<T>(r: Ring<T>, elements: T[], div: (a: T, b: T) => T | undefined, eq?: (a: T, b: T) => boolean): boolean;
//# sourceMappingURL=ring.d.ts.map