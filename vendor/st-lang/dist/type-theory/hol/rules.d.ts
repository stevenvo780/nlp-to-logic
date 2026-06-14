import { HOLTerm, HOLTheorem, HOLType } from './types';
import { funTy } from './type-system';
import { freeVars } from './term';
/** Regla REFL: produce el teorema `⊢ t = t` para cualquier término `t`. */
export declare function refl(t: HOLTerm): HOLTheorem;
/**
 * Regla TRANS: dados `⊢ a = b` y `⊢ b = c` produce `⊢ a = c`.
 * @throws Si alguna premisa no es una igualdad o los extremos no encajan.
 */
export declare function trans(thm1: HOLTheorem, thm2: HOLTheorem): HOLTheorem;
/**
 * Regla MK_COMB: dados `⊢ f = g` y `⊢ x = y` produce `⊢ f x = g y`.
 * @throws Si alguna premisa no es igualdad o `f` no tiene tipo función.
 */
export declare function mkCombRule(thm1: HOLTheorem, thm2: HOLTheorem): HOLTheorem;
/**
 * Regla ABS: dado `⊢ s = t` produce `⊢ (λv.s) = (λv.t)`.
 * `v` no puede aparecer libre en las hipótesis de `thm1`.
 * @throws Si `v` no es variable, la premisa no es igualdad, o la condición de variable es violada.
 */
export declare function abs(v: HOLTerm, thm1: HOLTheorem): HOLTheorem;
/**
 * Regla BETA: dado `(λv.t) v` produce `⊢ (λv.t) v = t`.
 * Solo acepta la forma exacta donde el argumento es el propio binder; usar INST para otros.
 * @throws Si `t` no es una aplicación de lambda o el argumento no coincide con el binder.
 */
export declare function beta(t: HOLTerm): HOLTheorem;
/**
 * Regla ASSUME: produce `p ⊢ p` (hipótesis no descargada).
 * @throws Si `p` no tiene tipo `bool`.
 */
export declare function assume(p: HOLTerm): HOLTheorem;
/**
 * Regla EQ_MP: dados `⊢ p = q` y `⊢ p` produce `⊢ q` (modus ponens vía igualdad booleana).
 * @throws Si la primera premisa no es igualdad de bools, o la segunda no es α-igual al LHS.
 */
export declare function eqMp(thm1: HOLTheorem, thm2: HOLTheorem): HOLTheorem;
/**
 * Regla DEDUCT_ANTISYM_RULE: dados `A ⊢ p` y `B ⊢ q` produce
 * `(A \ {q}) ∪ (B \ {p}) ⊢ p ↔ q`.
 * @throws Si alguna conclusión no es de tipo `bool`.
 */
export declare function deductAntisymRule(thm1: HOLTheorem, thm2: HOLTheorem): HOLTheorem;
/**
 * Regla INST_TYPE: instancia variables de tipo en `thm1` según `subst`.
 * Deduplica hipótesis que colapsen tras la sustitución.
 */
export declare function instType(subst: Record<string, HOLType>, thm1: HOLTheorem): HOLTheorem;
interface InstEntry {
    name: string;
    type: HOLType;
    value: HOLTerm;
}
/**
 * Sustituye variables libres en `thm1` según `subst`. El mapa
 * usa keys `name::typeString` para distinguir variables con
 * mismo nombre y distinto tipo.
 */
export declare function inst(subst: Record<string, HOLTerm>, thm1: HOLTheorem): HOLTheorem;
/**
 * Variante explícita: cada entrada especifica `{ name, type, value }`.
 * Necesaria si dos variables comparten nombre pero distinto tipo.
 */
export declare function instTyped(entries: InstEntry[], thm1: HOLTheorem): HOLTheorem;
export { mkCombRule as mkComb };
export { freeVars, funTy };
//# sourceMappingURL=rules.d.ts.map