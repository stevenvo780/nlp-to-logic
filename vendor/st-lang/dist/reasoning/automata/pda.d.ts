import type { PDA, Symbol } from './types';
/** ¿`M` acepta `input`?
 *  `maxSteps` cota el número de configuraciones expandidas. */
export declare function pdaAccepts(M: PDA, input: string, maxSteps?: number): boolean;
/** PDA que acepta palíndromes pares e impares sobre {a, b} usando un
 *  marcador no determinista (transición ε al "espejo"). */
export declare function pdaPalindromes(alphabet?: ReadonlyArray<Symbol>): PDA;
/** PDA que acepta paréntesis balanceados (alfabeto '(' ')'). */
export declare function pdaBalancedParens(): PDA;
//# sourceMappingURL=pda.d.ts.map