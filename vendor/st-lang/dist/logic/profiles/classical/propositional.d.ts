import { Formula, Diagnostic, RunResult, Theory, LogicProfile, TruthTableResult, Valuation } from '../../../types';
export declare function collectAtoms(f: Formula): Set<string>;
export declare function evaluateClassical(f: Formula, v: Valuation): boolean;
/**
 * Generador lazy de valuaciones para streaming (usado por el intérprete para truth_table masivas).
 */
export declare function generateValuationsLazy(atoms: string[]): Generator<Valuation>;
export declare function formulaToString(f: Formula): string;
export declare function toNNF(f: Formula): Formula;
export declare function toCNF(f: Formula): Formula;
export declare function toDNF(f: Formula): Formula;
/**
 * Extracts clauses from a CNF formula for resolution analysis (#28)
 * Returns an array of clauses, where each clause is an array of literals.
 */
export declare function extractClauses(f: Formula): string[][];
export declare class ClassicalPropositional implements LogicProfile {
    name: string;
    description: string;
    checkWellFormed(formula: Formula): Diagnostic[];
    checkValid(formula: Formula): RunResult;
    checkSatisfiable(formula: Formula): RunResult;
    prove(goal: Formula, theory: Theory, premises?: string[]): RunResult;
    derive(goal: Formula, premises: string[], theory: Theory): RunResult;
    countermodel(formula: Formula): RunResult;
    explain(formula: Formula): RunResult;
    truthTable(formula: Formula): TruthTableResult;
    checkEquivalent(a: Formula, b: Formula): RunResult;
}
//# sourceMappingURL=propositional.d.ts.map