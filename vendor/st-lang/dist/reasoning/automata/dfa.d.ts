import type { DFA } from './types';
/** ¿`M` acepta `input`? Si en algún punto no hay transición definida,
 *  rechaza inmediatamente (DFA visto como función parcial). */
export declare function dfaAccepts(M: DFA, input: string): boolean;
/** Totaliza un DFA agregando un sink-state para las aristas faltantes.
 *  Devuelve un DFA equivalente con `transitions` totales sobre alfabeto. */
export declare function dfaTotalize(M: DFA, sinkName?: string): DFA;
/** Complemento de `M`: misma estructura, accept = states \ accept. */
export declare function dfaComplement(M: DFA): DFA;
/** Producto cartesiano con predicado de aceptación arbitrario sobre
 *  (a-state, b-state). Sólo se crean estados alcanzables desde el par
 *  inicial. */
export declare function dfaProduct(a: DFA, b: DFA, acceptPair: (sa: string, sb: string) => boolean): DFA;
export declare function dfaUnion(a: DFA, b: DFA): DFA;
export declare function dfaIntersection(a: DFA, b: DFA): DFA;
export declare function dfaMinimize(M: DFA): DFA;
//# sourceMappingURL=dfa.d.ts.map