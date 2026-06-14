import type { NFA, Regex } from './types';
export declare function parseRegex(s: string): Regex;
export declare function regexToNfa(r: Regex): NFA;
/** Atajo: ¿la expresión regular `r` matchea exactamente `s`? */
export declare function regexMatches(r: Regex, s: string): boolean;
//# sourceMappingURL=regex.d.ts.map