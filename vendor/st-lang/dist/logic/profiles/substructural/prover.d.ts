import { LinearFormula, LinearProof, LinearSequent } from './types';
export declare function formulaKey(f: LinearFormula): string;
export interface ProveOptions {
    budget?: number;
}
export interface ProveResult {
    provable: boolean;
    proof?: LinearProof;
}
export declare function proveLinear(seqInput: LinearSequent, options?: ProveOptions): LinearProof | null;
export declare function proveAffine(seqInput: LinearSequent, options?: ProveOptions): LinearProof | null;
export declare function proofToString(p: LinearProof, indent?: number): string;
//# sourceMappingURL=prover.d.ts.map