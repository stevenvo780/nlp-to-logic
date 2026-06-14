export type { MLTTTerm } from './types';
export { mVar, mUniverse, mPi, mLam, mApp, mSigma, mPair, mFst, mSnd, mId, mRefl, mNat, mZero, mSucc, mArrow, freeVars, occursFree, termToString, } from './types';
export { substitute } from './substitute';
export { reduceStep, normalize, isNormal } from './normalize';
export { alphaEq, alphaBetaEq } from './equality';
export { inferType, checkType, isInferError } from './infer';
export type { InferContext, InferResult } from './infer';
//# sourceMappingURL=index.d.ts.map