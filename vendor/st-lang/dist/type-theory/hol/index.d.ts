export type { HOLType, HOLTerm, HOLTheorem, HOLSequent } from './types';
export { tvar, tconst, tapp, TyBool, TyInd, funTy, funTyN, typeEq, isFunType, funDomain, funCodomain, typeToString, substType, freeTypeVars, } from './type-system';
export { mkVar, mkConst, mkAbs, typeOf, alphaEq, freeVars, occursFree, freshName, substTerm, instTypeInTerm, termToString, eqConst, mkEq, destEq, isEq, isIff, } from './term';
export { mkComb as mkCombTerm } from './term';
export { refl, trans, mkComb, abs, beta, assume, eqMp, deductAntisymRule, instType, inst, instTyped, } from './rules';
export { True, Bottom, And, Or, Not, Implies, Forall, Exists, mkAnd, mkOr, mkNot, mkImplies, mkForall, mkExists, assertBool, } from './connectives';
//# sourceMappingURL=index.d.ts.map