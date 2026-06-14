import type { DFA, Regex } from './types';
/** Palabras sobre {0,1} con un número par de ceros. */
export declare function dfaEvenZeros(): DFA;
/** Palabras sobre {a,b,c} que contienen "ab" como subcadena. */
export declare function dfaContainsAB(): DFA;
/** Regex simplificada de email: letras+ '@' letras+ '.' letras+
 *  (ASCII inferior, sin números / símbolos). Es deliberadamente
 *  pedagógica; no aspira a RFC 5322. */
export declare function regexEmail(): Regex;
//# sourceMappingURL=languages.d.ts.map