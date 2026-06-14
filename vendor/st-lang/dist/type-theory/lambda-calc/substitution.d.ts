import type { Term } from './types';
export declare function freeVars(t: Term): Set<string>;
export declare function makeFreshSupply(seed?: number): () => string;
export declare function alphaRename(t: Term, freshSupply: () => string): Term;
export declare function substitute(t: Term, varName: string, replacement: Term): Term;
//# sourceMappingURL=substitution.d.ts.map