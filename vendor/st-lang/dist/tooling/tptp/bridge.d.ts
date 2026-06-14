import { Formula } from '../../types';
import { TptpAnnotated, TptpFormula, TptpProblem } from './ast';
export declare function tptpFormulaToFol(f: TptpFormula): Formula;
export interface FolProverBridgeOutput {
    axioms: Formula[];
    conjecture: Formula | null;
    negatedConjectures: Formula[];
    /** Otros anotados (lemmas, theorems, definitions, plain, hypothesis). */
    hypotheses: Formula[];
}
export declare function toFolProverFormat(problem: TptpProblem): FolProverBridgeOutput;
/** Helper para `TptpAnnotated` individual. */
export declare function annotatedToFol(a: TptpAnnotated): Formula;
//# sourceMappingURL=bridge.d.ts.map