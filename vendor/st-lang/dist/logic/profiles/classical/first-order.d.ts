import { Formula, Diagnostic, RunResult, Theory, LogicProfile } from '../../../types';
export declare function toPrenex(f: Formula): Formula;
export declare function skolemize(f: Formula): Formula;
export declare class ClassicalFirstOrder implements LogicProfile {
    readonly name = "classical.first_order";
    readonly description = "Logica clasica de primer orden (FOL) \u2014 Motor de Tableau Hardened";
    checkWellFormed(formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
    private collectConstants;
    private solve;
    private substitute;
    private isEqual;
}
//# sourceMappingURL=first-order.d.ts.map