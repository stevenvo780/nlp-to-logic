import type { Term } from './types';
export type LPOComparison = 'gt' | 'lt' | 'eq' | 'inc';
/**
 * LPO comparison "rica": incluye 'inc' (incomparable).
 */
export declare function lpoCompare(t1: Term, t2: Term, precedence: Map<string, number>): LPOComparison;
/**
 * API pública compacta: devuelve -1 | 0 | 1.
 *
 *  -1 si t1 <LPO t2
 *   0 si iguales o incomparables
 *  +1 si t1 >LPO t2
 *
 * Para distinguir incomparable vs igual, usar `lpoCompare`.
 */
export declare function lpo(t1: Term, t2: Term, precedence: Map<string, number>): -1 | 0 | 1;
//# sourceMappingURL=lpo.d.ts.map