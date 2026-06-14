export type { CubicalTerm } from './types';
export { cI0, cI1, cIVar, cIMin, cIMax, cINeg, cPathP, cPLam, cPApp, cGlue, cVar, cUniverse, cPi, cLam, cApp, cArrow, isIntervalExpr, freeVarsCubical, occursFreeCubical, termToStringCubical, } from './types';
export { substituteCubical } from './substitute';
export { evalInterval, normalizeInterval } from './interval';
export type { IntervalValue } from './interval';
export { reduceStepCubical, normalizeCubical, isNormalCubical } from './normalize';
export { alphaEqCubical, alphaBetaEqCubical } from './equality';
export { inferType, checkType, isInferErrorCubical, makeContext, intervalType } from './infer';
export type { CubicalContext, InferResultCubical } from './infer';
export { reflPath, pathInverse, pathCompose, glue } from './path-algebra';
export { normalizeCubical as normalize } from './normalize';
export { alphaBetaEqCubical as alphaBetaEq, alphaEqCubical as alphaEq } from './equality';
export { termToStringCubical as termToString } from './types';
//# sourceMappingURL=index.d.ts.map