import { Formula, RunResult, Theory, LogicProfile, Diagnostic, TruthTableResult } from '../../../types';
export declare class ProbabilisticBasic implements LogicProfile {
    name: string;
    description: string;
    checkWellFormed(formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    /**
     * Tabla de probabilidades (análogo a truth_table)
     */
    truthTable(formula: Formula): TruthTableResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
}
//# sourceMappingURL=basic.d.ts.map