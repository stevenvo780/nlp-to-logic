import type { Context, LambdaTerm, PropType } from './types';
export type InferResult = PropType | {
    error: string;
};
export declare function inferType(term: LambdaTerm, ctx?: Context): InferResult;
export declare function isInferError(r: InferResult): r is {
    error: string;
};
//# sourceMappingURL=infer.d.ts.map