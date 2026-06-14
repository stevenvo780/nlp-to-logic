export type { FType, FTerm, FContext } from './types';
export { fAtom, fArrow, fForall, fVar, fAbs, fApp, fTAbs, fTApp, freeTypeVars, alphaEqType, isWellFormed, fTypeToString, fTermToString, emptyContext, cloneContext, } from './types';
export type { FTypeResult } from './infer';
export { typeOf, isTypeError } from './infer';
export type { NormalizeResult } from './reduce';
export { reduceBeta, normalize, isNormal, freeVars, termTypeVars, substType, substTypeInTerm, substTerm, } from './reduce';
//# sourceMappingURL=index.d.ts.map