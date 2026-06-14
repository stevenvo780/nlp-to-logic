import type { BayesianNetwork, CPT, Evidence } from './types';
export interface Factor {
    variables: string[];
    domains: Record<string, string[]>;
    values: Map<string, number>;
}
export declare function assignmentKey(variables: string[], assignment: Record<string, string>): string;
export declare function parseParentKey(parents: string[], key: string): Record<string, string>;
export declare function buildParentKey(parents: string[], assignment: Record<string, string>): string;
export declare function iterateAssignments(variables: string[], domains: Record<string, string[]>): Generator<Record<string, string>>;
export declare function factorFromCPT(cpt: CPT, variableDomains: Record<string, string[]>): Factor;
export declare function restrictFactor(factor: Factor, evidence: Evidence): Factor;
export declare function parseAssignmentKey(key: string): Record<string, string>;
export declare function multiplyFactors(a: Factor, b: Factor): Factor;
export declare function sumOut(factor: Factor, variable: string): Factor;
export declare function maxOut(factor: Factor, variable: string): {
    factor: Factor;
    backpointer: Map<string, string>;
};
export declare function normalizeFactor(factor: Factor): Factor;
export declare function variableDomainsOf(net: BayesianNetwork): Record<string, string[]>;
//# sourceMappingURL=factor.d.ts.map