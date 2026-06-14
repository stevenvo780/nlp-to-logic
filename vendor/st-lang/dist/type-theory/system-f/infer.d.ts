import type { FContext, FTerm, FType } from './types';
export type FTypeResult = FType | {
    error: string;
};
export declare function isTypeError(r: FTypeResult): r is {
    error: string;
};
export declare function typeOf(term: FTerm, ctx?: FContext): FTypeResult;
//# sourceMappingURL=infer.d.ts.map