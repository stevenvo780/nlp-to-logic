export type { Sort, CubeSystem, CubeTerm, CubeContext } from './types';
export { cVar, cSort, cStar, cBox, cPi, cLam, cApp, cArrow, occursFree, freeVars, termToString, alphaEq, emptyContext, extendContext, } from './types';
export type { FormationRule, CubeRules } from './rules';
export { SYSTEMS, hasRule, rulesOf, AXIOMS, axiomFor } from './rules';
export { substitute, reduceStep, normalize, alphaBetaEq, isNormal } from './normalize';
export type { InferError, InferResult } from './typecheck';
export { inferType, checkType, isInferError, isClosedUnder } from './typecheck';
export type { UntypedTerm, EraseError } from './erase';
export { erase, isEraseError, untypedToString } from './erase';
export { polymorphicIdentity, polymorphicIdentityType, churchNumeral, churchNumeralType, churchPairType, dependentList, predicateOverNat, typeLevelIdentity, typeLevelIdentityKind, cocPolyIdentityType, } from './examples';
//# sourceMappingURL=index.d.ts.map