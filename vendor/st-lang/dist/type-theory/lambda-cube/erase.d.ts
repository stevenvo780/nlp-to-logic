import type { CubeTerm } from './types';
export type UntypedTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'abs';
    param: string;
    body: UntypedTerm;
} | {
    kind: 'app';
    fn: UntypedTerm;
    arg: UntypedTerm;
};
export interface EraseError {
    error: string;
}
export declare function isEraseError(r: UntypedTerm | EraseError): r is EraseError;
/**
 * Borrado total a λ-cálculo no tipado. Sorts y Π no tienen
 * representante runtime — si aparecen como sub-término principal,
 * el resultado es un error de borrado.
 */
export declare function erase(term: CubeTerm): UntypedTerm | EraseError;
/** Serialización legible del λ-untyped. */
export declare function untypedToString(t: UntypedTerm): string;
//# sourceMappingURL=erase.d.ts.map