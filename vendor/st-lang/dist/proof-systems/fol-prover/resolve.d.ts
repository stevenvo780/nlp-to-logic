import { FOLClause } from './types';
export declare function resolve(c1Raw: FOLClause, c2Raw: FOLClause): FOLClause[];
export interface ResolutionStepInternal {
    from: [number, number];
    resolvent: FOLClause;
    substitution: Record<string, string>;
}
interface ResolveWithRecordInput {
    c1Idx: number;
    c2Idx: number;
    c1: FOLClause;
    c2: FOLClause;
}
export declare function resolveWithRecord(input: ResolveWithRecordInput): ResolutionStepInternal[];
export declare function runResolutionLoop(params: {
    premiseClauses: FOLClause[];
    negatedGoalClauses: FOLClause[];
    timeoutMs: number;
    maxSteps: number;
}): {
    proven: boolean;
    steps: ResolutionStepInternal[];
    timeoutHit: boolean;
    reason?: string;
};
export {};
//# sourceMappingURL=resolve.d.ts.map