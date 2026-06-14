export type { Type, TypeScheme, Expr } from './types';
export type { Substitution, UnifyResult } from './substitution';
export type { InferResult, InferOutcome, InferSchemeResult } from './infer';
export { TypeEnv, tVar, tConst, tArrow, tApp, scheme, mono, eVar, eLit, eApp, eAppN, eLam, eLet, eLetRec, eIf, TInt, TBool, TStr, typeFreeVars, schemeFreeVars, typeToString, schemeToString, } from './types';
export { emptySubst, applySubst, applySubstScheme, composeSubsts, freshTypeVar, resetFreshSupply, occursIn, unify, isUnifyError, generalize, instantiate, } from './substitution';
export { algorithmW, infer, inferScheme, isInferError, initialEnv, normalizeScheme } from './infer';
//# sourceMappingURL=index.d.ts.map