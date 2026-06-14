import type { FTerm, FType } from './types';
export declare function freeVars(t: FTerm, acc?: Set<string>): Set<string>;
export declare function termTypeVars(t: FTerm, acc?: Set<string>): Set<string>;
export declare function substType(target: FType, name: string, replacement: FType): FType;
export declare function substTypeInTerm(term: FTerm, name: string, replacement: FType): FTerm;
export declare function substTerm(term: FTerm, name: string, value: FTerm): FTerm;
export declare function reduceBeta(term: FTerm): FTerm;
export declare function isNormal(term: FTerm): boolean;
export interface NormalizeResult {
    result: FTerm;
    steps: number;
    terminated: boolean;
}
export declare function normalize(term: FTerm, maxSteps?: number): NormalizeResult;
//# sourceMappingURL=reduce.d.ts.map