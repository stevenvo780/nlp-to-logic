import type { LambdaTerm } from './types';
export declare function freeVars(t: LambdaTerm, acc?: Set<string>): Set<string>;
export declare function substituteTerm(term: LambdaTerm, name: string, value: LambdaTerm): LambdaTerm;
export declare function reduceBeta(term: LambdaTerm): LambdaTerm;
export declare function isNormal(term: LambdaTerm): boolean;
export declare function normalize(term: LambdaTerm, maxSteps?: number): LambdaTerm;
//# sourceMappingURL=reduce.d.ts.map