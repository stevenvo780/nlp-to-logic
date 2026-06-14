import type { Context, LambdaTerm, ProofTree } from './types';
export declare class ProofConversionError extends Error {
}
export declare function termToProof(term: LambdaTerm, ctx?: Context): ProofTree;
export declare function proofToTerm(proof: ProofTree): LambdaTerm;
export declare function proofIsConsistent(proof: ProofTree): boolean;
//# sourceMappingURL=proof.d.ts.map