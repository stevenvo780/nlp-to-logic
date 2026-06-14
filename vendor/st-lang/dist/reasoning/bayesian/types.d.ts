export interface DiscreteVariable {
    name: string;
    values: string[];
}
export interface CPT {
    variable: string;
    parents: string[];
    entries: Record<string, Record<string, number>>;
}
export interface BayesianNetwork {
    variables: DiscreteVariable[];
    cpts: CPT[];
}
export type Evidence = Record<string, string>;
export interface PosteriorDistribution {
    variable: string;
    distribution: Record<string, number>;
}
//# sourceMappingURL=types.d.ts.map