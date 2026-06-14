import type { MLTTTerm } from './types';
/** Aplica un único paso de reducción (leftmost-outermost) si hay redex. */
export declare function reduceStep(term: MLTTTerm): MLTTTerm;
/** Normaliza hasta forma normal (o agota `maxSteps`). */
export declare function normalize(term: MLTTTerm, maxSteps?: number): MLTTTerm;
export declare function isNormal(term: MLTTTerm): boolean;
//# sourceMappingURL=normalize.d.ts.map