import { type Env, type Term, type Type, type Value } from './types';
export declare function makeFreshSupply(prefix?: string): () => string;
export declare function apply(fn: Value, arg: Value): Value;
export declare function evaluate(t: Term, env: Env): Value;
export declare function reify(value: Value, type: Type, freshSupply: () => string): Term;
export declare function normalize(t: Term, type: Type, freshSupply?: () => string): Term;
//# sourceMappingURL=nbe.d.ts.map