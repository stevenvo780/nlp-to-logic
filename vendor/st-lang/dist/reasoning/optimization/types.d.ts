export type ObjectiveKind = 'minimize' | 'maximize';
export type ConstraintOperator = '<=' | '>=' | '=';
export interface LPConstraint {
    coefficients: number[];
    operator: ConstraintOperator;
    rhs: number;
}
export interface LPProblem {
    objective: {
        kind: ObjectiveKind;
        coefficients: number[];
    };
    constraints: LPConstraint[];
    variableBounds?: Array<{
        lower?: number;
        upper?: number;
    }>;
    variableNames?: string[];
}
export type LPStatus = 'optimal' | 'unbounded' | 'infeasible' | 'iteration_limit';
export interface LPSolution {
    status: LPStatus;
    variables: number[];
    objectiveValue: number;
    iterations: number;
}
export interface ILPProblem extends LPProblem {
    integerVars: number[];
    binaryVars?: number[];
}
export interface ILPSolution extends LPSolution {
    nodesExplored: number;
    gap?: number;
}
export interface LPOptions {
    maxIterations?: number;
    eps?: number;
}
export interface ILPOptions {
    maxNodes?: number;
    timeoutMs?: number;
    lpOptions?: LPOptions;
}
//# sourceMappingURL=types.d.ts.map