import type { Term } from './types';
export type BetaStrategy = 'leftmost-outermost' | 'leftmost-innermost';
export type NormalStrategy = 'normal' | 'cbn' | 'cbv';
export declare function betaStep(t: Term, strategy?: BetaStrategy): Term | null;
export declare function etaStep(t: Term): Term | null;
export declare function isNormalForm(t: Term): boolean;
export declare function isWeakHeadNormalForm(t: Term): boolean;
export interface NormalizeResult {
    result: Term;
    steps: number;
    terminated: boolean;
}
export interface NormalizeOpts {
    maxSteps?: number;
    strategy?: NormalStrategy;
}
export declare function normalize(t: Term, opts?: NormalizeOpts): NormalizeResult;
//# sourceMappingURL=reduce.d.ts.map