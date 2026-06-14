import type { BayesianNetwork, Evidence, PosteriorDistribution } from './types';
export declare function jointProbability(net: BayesianNetwork, assignment: Record<string, string>): number;
export declare function variableElimination(net: BayesianNetwork, queryVar: string, evidence?: Evidence): PosteriorDistribution;
export declare function query(net: BayesianNetwork, queryVar: string, evidence?: Evidence): PosteriorDistribution;
export declare function mostProbableExplanation(net: BayesianNetwork, evidence?: Evidence): Record<string, string>;
//# sourceMappingURL=inference.d.ts.map