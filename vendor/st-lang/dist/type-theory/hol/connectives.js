"use strict";
// ============================================================
// HOL — Conectivas y cuantificadores definidos
// ============================================================
//
// Siguiendo HOL Light, todo se define a partir de la igualdad
// primitiva (`=`) y λ-binding. Cada conectiva es un `const`
// con un tipo polimórfico fijo; las definiciones internas
// (qué λ-término representa) se documentan pero el núcleo no
// las usa directamente — son referencias para constructores
// ergonómicos.
//
// Definiciones canónicas:
//   T            = (λp:bool. p) = (λp:bool. p)
//   ∧ p q        = (λf. f p q) = (λf. f T T)
//   ⇒ p q        = (p ∧ q) = p
//   ∀ (P : α→bool) = P = (λx:α. T)
//   ∃ (P : α→bool) = ∀ q. (∀ x. P x ⇒ q) ⇒ q
//   ∨ p q        = ∀ r. (p ⇒ r) ⇒ (q ⇒ r) ⇒ r
//   ⊥            = ∀ p:bool. p
//   ¬ p          = p ⇒ ⊥
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exists = exports.Forall = exports.Implies = exports.Not = exports.Or = exports.And = exports.Bottom = exports.True = void 0;
exports.mkAnd = mkAnd;
exports.mkOr = mkOr;
exports.mkNot = mkNot;
exports.mkImplies = mkImplies;
exports.mkForall = mkForall;
exports.mkExists = mkExists;
exports.assertBool = assertBool;
const type_system_1 = require("./type-system");
const term_1 = require("./term");
// Constantes -------------------------------------------------
/** Constante `T : bool`. */
exports.True = (0, term_1.mkConst)('T', type_system_1.TyBool);
/** Constante `⊥ : bool`. */
exports.Bottom = (0, term_1.mkConst)('F', type_system_1.TyBool);
/** Constante `∧ : bool → bool → bool`. */
exports.And = (0, term_1.mkConst)('∧', (0, type_system_1.funTy)(type_system_1.TyBool, (0, type_system_1.funTy)(type_system_1.TyBool, type_system_1.TyBool)));
/** Constante `∨ : bool → bool → bool`. */
exports.Or = (0, term_1.mkConst)('∨', (0, type_system_1.funTy)(type_system_1.TyBool, (0, type_system_1.funTy)(type_system_1.TyBool, type_system_1.TyBool)));
/** Constante `¬ : bool → bool`. */
exports.Not = (0, term_1.mkConst)('¬', (0, type_system_1.funTy)(type_system_1.TyBool, type_system_1.TyBool));
/** Constante `⇒ : bool → bool → bool`. */
exports.Implies = (0, term_1.mkConst)('⇒', (0, type_system_1.funTy)(type_system_1.TyBool, (0, type_system_1.funTy)(type_system_1.TyBool, type_system_1.TyBool)));
/**
 * Constante `∀ : (α → bool) → bool`. Polimórfica vía la tvar `α`.
 * El consumidor debe usar `mkForall` para instanciar al tipo
 * correcto antes de aplicar.
 */
exports.Forall = (0, term_1.mkConst)('∀', (0, type_system_1.funTy)((0, type_system_1.funTy)((0, type_system_1.tvar)('α'), type_system_1.TyBool), type_system_1.TyBool));
/**
 * Constante `∃ : (α → bool) → bool`. Igual que `∀`, polimórfica.
 */
exports.Exists = (0, term_1.mkConst)('∃', (0, type_system_1.funTy)((0, type_system_1.funTy)((0, type_system_1.tvar)('α'), type_system_1.TyBool), type_system_1.TyBool));
// Constructores ergonómicos ---------------------------------
/** Construye `p ∧ q`. */
function mkAnd(p, q) {
    return (0, term_1.mkComb)((0, term_1.mkComb)(exports.And, p), q);
}
/** Construye `p ∨ q`. */
function mkOr(p, q) {
    return (0, term_1.mkComb)((0, term_1.mkComb)(exports.Or, p), q);
}
/** Construye `¬ p`. */
function mkNot(p) {
    return (0, term_1.mkComb)(exports.Not, p);
}
/** Construye `p ⇒ q`. */
function mkImplies(p, q) {
    return (0, term_1.mkComb)((0, term_1.mkComb)(exports.Implies, p), q);
}
/**
 * Construye `∀x:α. body`. Internamente: `(∀ : (α→bool)→bool) (λx:α. body)`
 * con el `∀` instanciado al tipo correcto.
 */
function mkForall(param, paramType, body) {
    // Instancia el ∀ al tipo del parámetro.
    const forallTy = (0, type_system_1.funTy)((0, type_system_1.funTy)(paramType, type_system_1.TyBool), type_system_1.TyBool);
    const forallInst = (0, term_1.mkConst)('∀', forallTy);
    const lambda = { kind: 'abs', param, paramType, body };
    return (0, term_1.mkComb)(forallInst, lambda);
}
/**
 * Construye `∃x:α. body`. Análogo a `mkForall`.
 */
function mkExists(param, paramType, body) {
    const existsTy = (0, type_system_1.funTy)((0, type_system_1.funTy)(paramType, type_system_1.TyBool), type_system_1.TyBool);
    const existsInst = (0, term_1.mkConst)('∃', existsTy);
    const lambda = { kind: 'abs', param, paramType, body };
    return (0, term_1.mkComb)(existsInst, lambda);
}
// Helpers para asegurar que un término es bool ---------------
/**
 * Validador: lanza si `t` no tiene tipo `bool`. Útil para checks
 * externos antes de pasarle a `assume` o construir conectivas.
 */
function assertBool(t) {
    const ty = (0, term_1.typeOf)(t);
    if (ty.kind !== 'tconst' || ty.name !== 'bool') {
        throw new Error(`Se esperaba bool, recibido ${ty.kind === 'tconst' ? ty.name : ty.kind}`);
    }
}
//# sourceMappingURL=connectives.js.map