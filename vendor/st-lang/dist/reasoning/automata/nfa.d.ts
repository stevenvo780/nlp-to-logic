import type { DFA, NFA } from './types';
/** Cierre-ε: el menor conjunto T ⊇ S cerrado bajo transiciones ε. */
export declare function epsilonClosure(M: NFA, states: ReadonlySet<string>): Set<string>;
export declare function nfaAccepts(M: NFA, input: string): boolean;
/** Subset construction: cada estado del DFA = subconjunto cerrado por ε
 *  de estados del NFA. Sólo se generan estados alcanzables. */
export declare function nfaToDfa(M: NFA): DFA;
//# sourceMappingURL=nfa.d.ts.map