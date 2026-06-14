import type { LogicProfile, Formula, RunResult, Theory, Diagnostic } from '../../../types';
import type { DLFormula } from './ast';
export declare class DLHybridProfile implements LogicProfile {
    name: string;
    description: string;
    checkWellFormed(_formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, _theory: Theory, _premises?: string[]): RunResult;
    derive(goal: Formula, _premises: string[], _theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    private notApplicable;
    explainSystem(): string;
}
/**
 * Adaptador: ejecuta `checkValid` sobre una DLFormula nativa y devuelve
 * un `RunResult` ST-compatible (con witness en `output`).
 */
export declare function runValidity(formula: DLFormula): RunResult;
/** Versión satisfacibilidad. */
export declare function runSatisfiability(formula: DLFormula): RunResult;
//# sourceMappingURL=profile.d.ts.map