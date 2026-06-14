import { type CubeTerm, type CubeContext } from './types';
import type { CubeSystem } from './types';
export type InferError = {
    error: string;
};
export type InferResult = CubeTerm | InferError;
export declare function isInferError(r: InferResult): r is InferError;
/**
 * Infiere el tipo de `term` bajo `ctx` en el sistema dado. Devuelve
 * el tipo, o `{ error }` si no es tipable.
 */
export declare function inferType(term: CubeTerm, ctx?: CubeContext, system?: CubeSystem): InferResult;
/**
 * Verifica que `term` tiene tipo `expected` bajo `ctx` en `system`.
 * Igualdad de tipos: módulo α y β.
 */
export declare function checkType(term: CubeTerm, expected: CubeTerm, ctx?: CubeContext, system?: CubeSystem): boolean;
/** ¿Las variables libres del término tienen todas un binding en `ctx`? */
export declare function isClosedUnder(term: CubeTerm, ctx: CubeContext): boolean;
//# sourceMappingURL=typecheck.d.ts.map