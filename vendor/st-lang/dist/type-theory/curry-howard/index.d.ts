export type { PropType, LambdaTerm, ProofTree, ProofRule, Context } from './types';
export { atom, arrow, product, sum, bottom, vr, app, abs, pair, fst, snd, inl, inr, cse, absurd, eqType, typeToString, termToString, } from './types';
export { inferType, isInferError } from './infer';
export type { InferResult } from './infer';
export { reduceBeta, normalize, isNormal, freeVars, substituteTerm } from './reduce';
export { termToProof, proofToTerm, proofIsConsistent, ProofConversionError } from './proof';
//# sourceMappingURL=index.d.ts.map