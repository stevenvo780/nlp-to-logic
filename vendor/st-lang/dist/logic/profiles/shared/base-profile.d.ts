import { Formula, RunResult, Theory, LogicProfile, Diagnostic, Model } from '../../../types';
import { FrameRules, Branch } from './tableau-engine';
export declare abstract class BaseTableauProfile implements LogicProfile {
    abstract name: string;
    abstract description: string;
    abstract frameRules: FrameRules;
    /** Notación de dominio. Por defecto usa formulaToString. */
    formatFormula(f: Formula): string;
    /** Descripción del sistema para explain(). */
    abstract explainSystem(): string;
    checkWellFormed(formula: Formula): Diagnostic[];
    protected extractKripkeModel(branch: Branch): Model;
    protected enrichResult(formula: Formula, result: RunResult): RunResult;
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
}
//# sourceMappingURL=base-profile.d.ts.map