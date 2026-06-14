import { HOLTerm, HOLType } from './types';
/** Constante `T : bool`. */
export declare const True: HOLTerm;
/** Constante `⊥ : bool`. */
export declare const Bottom: HOLTerm;
/** Constante `∧ : bool → bool → bool`. */
export declare const And: HOLTerm;
/** Constante `∨ : bool → bool → bool`. */
export declare const Or: HOLTerm;
/** Constante `¬ : bool → bool`. */
export declare const Not: HOLTerm;
/** Constante `⇒ : bool → bool → bool`. */
export declare const Implies: HOLTerm;
/**
 * Constante `∀ : (α → bool) → bool`. Polimórfica vía la tvar `α`.
 * El consumidor debe usar `mkForall` para instanciar al tipo
 * correcto antes de aplicar.
 */
export declare const Forall: HOLTerm;
/**
 * Constante `∃ : (α → bool) → bool`. Igual que `∀`, polimórfica.
 */
export declare const Exists: HOLTerm;
/** Construye `p ∧ q`. */
export declare function mkAnd(p: HOLTerm, q: HOLTerm): HOLTerm;
/** Construye `p ∨ q`. */
export declare function mkOr(p: HOLTerm, q: HOLTerm): HOLTerm;
/** Construye `¬ p`. */
export declare function mkNot(p: HOLTerm): HOLTerm;
/** Construye `p ⇒ q`. */
export declare function mkImplies(p: HOLTerm, q: HOLTerm): HOLTerm;
/**
 * Construye `∀x:α. body`. Internamente: `(∀ : (α→bool)→bool) (λx:α. body)`
 * con el `∀` instanciado al tipo correcto.
 */
export declare function mkForall(param: string, paramType: HOLType, body: HOLTerm): HOLTerm;
/**
 * Construye `∃x:α. body`. Análogo a `mkForall`.
 */
export declare function mkExists(param: string, paramType: HOLType, body: HOLTerm): HOLTerm;
/**
 * Validador: lanza si `t` no tiene tipo `bool`. Útil para checks
 * externos antes de pasarle a `assume` o construir conectivas.
 */
export declare function assertBool(t: HOLTerm): void;
//# sourceMappingURL=connectives.d.ts.map