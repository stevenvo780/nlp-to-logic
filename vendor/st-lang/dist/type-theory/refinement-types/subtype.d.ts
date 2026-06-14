import type { RefType } from './types';
import { type SolverOpts } from './solver';
export interface SubtypeOpts extends SolverOpts {
    /** Predicados adicionales del contexto que pueden asumirse válidos. */
    extraAssumptions?: string[];
}
/**
 * isSubtype — devuelve true si T1 <: T2 bajo las suposiciones del contexto.
 *
 * - Para tipos base iguales: chequea P(x) ⇒ Q(x) renombrando el binding.
 * - Para arrows: contravarianza en `from`, covarianza en `to`.
 */
export declare function isSubtype(t1: RefType, t2: RefType, opts?: SubtypeOpts): boolean;
//# sourceMappingURL=subtype.d.ts.map