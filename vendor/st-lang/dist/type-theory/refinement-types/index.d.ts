export type { BaseType, RefType, RTerm } from './types';
export { tInt, tBool, tString, tArrow, refine, rLit, rVar, rBinop, rIf, rLam, rApp, rLet, eqBase, eqRefType, baseToString, refTypeToString, termToString, } from './types';
export { typeCheck, generateVC } from './checker';
export type { TypeCheckResult, RCtx } from './checker';
export { isSubtype } from './subtype';
export type { SubtypeOpts } from './subtype';
export { checkVC, implies } from './solver';
export type { CheckResult, SolverOpts } from './solver';
export { parsePredicate, evalPredicate, freeVars as predicateFreeVars, substVar as predicateSubstVar, renameVar as predicateRenameVar, predicateToString, } from './predicate';
export type { PExpr, PEnv, PValue } from './predicate';
//# sourceMappingURL=index.d.ts.map