import { type RefType, type RTerm } from './types';
export interface TypeCheckResult {
    ok: boolean;
    errors: string[];
    type?: RefType;
    vcs: string[];
}
export type RCtx = Map<string, RefType>;
/**
 * typeCheck — API principal: chequea o sintetiza el tipo de `term`.
 * Si `expected` se provee, valida contra ese tipo.
 */
export declare function typeCheck(term: RTerm, expected?: RefType, ctx?: RCtx): TypeCheckResult;
/**
 * generateVC — colecta los predicados que deben mantenerse para que
 * `term` sea bien tipado en `ctx`. Útil para inspección / debugging.
 */
export declare function generateVC(term: RTerm, ctx?: RCtx): string[];
//# sourceMappingURL=checker.d.ts.map