import type { CTerm } from './types';
export declare function reduceStep(t: CTerm): CTerm | null;
export interface NormalizeResult {
    result: CTerm;
    steps: number;
    terminated: boolean;
}
export declare function normalize(t: CTerm, maxSteps?: number): NormalizeResult;
export declare function isNormalForm(t: CTerm): boolean;
//# sourceMappingURL=reduce.d.ts.map