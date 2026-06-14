import { Formula, RunResult, Theory, LogicProfile, Diagnostic, TruthTableResult } from '../../../types';
/**
 * Valores de verdad en la lógica de Belnap (A4):
 * T: True (Solo verdad)
 * F: False (Solo falsedad)
 * B: Both (Verdadero y Falso - Inconsistente)
 * N: None (Ni Verdadero ni Falso - Indeterminado)
 */
export type BelnapValue = 'T' | 'F' | 'B' | 'N';
export declare class ParaconsistentBelnap implements LogicProfile {
    name: string;
    description: string;
    checkWellFormed(formula: Formula): Diagnostic[];
    /**
     * En Belnap, una fórmula es válida si siempre evalúa a un valor "designado" (T o B).
     */
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
    private evaluateBelnap;
    private generateBelnapTable;
    truthTable(formula: Formula): TruthTableResult;
}
//# sourceMappingURL=belnap.d.ts.map