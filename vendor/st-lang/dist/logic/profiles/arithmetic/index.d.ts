import { Formula, Diagnostic, RunResult, Theory, LogicProfile } from '../../../types';
export declare function evalNumeric(f: Formula, vars?: Map<string, number>, trace?: string[]): number;
export declare class ArithmeticProfile implements LogicProfile {
    name: string;
    description: string;
    private result;
    checkWellFormed(formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
}
//# sourceMappingURL=index.d.ts.map