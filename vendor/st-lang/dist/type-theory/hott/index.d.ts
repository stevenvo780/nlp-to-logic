export type { HoTTTerm } from './types';
export { hVar, hUniverse, hPi, hLam, hApp, hSigma, hPair, hFst, hSnd, hNat, hZero, hSucc, hArrow, hPath, hRefl, hTransport, hPathSym, hPathConcat, hAp, hJElim, hCircle, hBaseOfCircle, hLoopOfCircle, hSuspension, hNorth, hSouth, hMeridian, hUa, freeVarsHoTT, occursFreeHoTT, termToStringHoTT, } from './types';
export { substituteHoTT } from './substitute';
export { reduceStepHoTT, normalizeHoTT, isNormalHoTT } from './normalize';
export { alphaEqHoTT, alphaBetaEqHoTT } from './equality';
export { inferType, checkType, isInferErrorHoTT } from './infer';
export type { InferContextHoTT, InferResultHoTT } from './infer';
export { refl, pathInverse, pathCompose, isHEquivalence, univalence, univalenceWitness, } from './path-algebra';
export type { UnivalenceWitness } from './path-algebra';
export { normalizeHoTT as normalize } from './normalize';
export { alphaBetaEqHoTT as alphaBetaEq, alphaEqHoTT as alphaEq } from './equality';
export { termToStringHoTT as termToString } from './types';
//# sourceMappingURL=index.d.ts.map