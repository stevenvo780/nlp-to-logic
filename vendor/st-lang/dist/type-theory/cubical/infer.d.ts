import type { CubicalTerm } from './types';
import { cArrow } from './types';
export interface CubicalContext {
    termVars: Map<string, CubicalTerm>;
    intervalVars: Set<string>;
}
export type InferResultCubical = CubicalTerm | {
    error: string;
};
export declare const intervalType: () => CubicalTerm;
export declare function isInferErrorCubical(r: InferResultCubical): r is {
    error: string;
};
export declare function makeContext(): CubicalContext;
export declare function inferType(term: CubicalTerm, ctx?: CubicalContext): InferResultCubical;
export declare function checkType(term: CubicalTerm, expected: CubicalTerm, ctx?: CubicalContext): boolean;
export { cArrow };
//# sourceMappingURL=infer.d.ts.map