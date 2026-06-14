import { Formula, RunResult, Theory, Diagnostic, LogicProfile } from '../../../types';
export declare class IntuitionisticPropositional implements LogicProfile {
    name: string;
    description: string;
    checkWellFormed(formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
}
//# sourceMappingURL=propositional.d.ts.map