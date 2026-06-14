"use strict";
// ============================================================
// HOL — Reglas primitivas de inferencia
// ============================================================
//
// Núcleo deductivo estilo HOL Light. 10 reglas primitivas:
//
//   REFL                 : |- t = t
//   TRANS                : |- a = b, |- b = c  ⇒  |- a = c
//   MK_COMB              : |- f = g, |- x = y  ⇒  |- f x = g y
//   ABS                  : |- s = t            ⇒  |- (λv.s) = (λv.t)
//   BETA                 : |- (λv.t) v = t
//   ASSUME(p)            : p |- p
//   EQ_MP                : |- p ↔ q, |- p     ⇒  |- q
//   DEDUCT_ANTISYM_RULE  : A |- p, B |- q      ⇒  (A\{q}) ∪ (B\{p}) |- p ↔ q
//   INST_TYPE            : sustitución de tipos
//   INST                 : sustitución de términos en variables libres
//
// Las hipótesis son una multiset modelada como array; al unir
// hipótesis deduplicamos por α-equivalencia.
Object.defineProperty(exports, "__esModule", { value: true });
exports.funTy = exports.freeVars = void 0;
exports.refl = refl;
exports.trans = trans;
exports.mkCombRule = mkCombRule;
exports.mkComb = mkCombRule;
exports.abs = abs;
exports.beta = beta;
exports.assume = assume;
exports.eqMp = eqMp;
exports.deductAntisymRule = deductAntisymRule;
exports.instType = instType;
exports.inst = inst;
exports.instTyped = instTyped;
const type_system_1 = require("./type-system");
Object.defineProperty(exports, "funTy", { enumerable: true, get: function () { return type_system_1.funTy; } });
const term_1 = require("./term");
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return term_1.freeVars; } });
// Helpers ----------------------------------------------------
function unionHyps(a, b) {
    const out = [...a];
    for (const h of b) {
        if (!out.some((existing) => (0, term_1.alphaEq)(existing, h))) {
            out.push(h);
        }
    }
    return out;
}
function removeHyp(hyps, target) {
    let removed = false;
    const out = [];
    for (const h of hyps) {
        if (!removed && (0, term_1.alphaEq)(h, target)) {
            removed = true;
            continue;
        }
        out.push(h);
    }
    return out;
}
function thm(rule, hyps, concl, derived) {
    return Object.freeze({ rule, hyps, concl, derived });
}
// REFL : |- t = t ---------------------------------------------
/** Regla REFL: produce el teorema `⊢ t = t` para cualquier término `t`. */
function refl(t) {
    // typeOf valida bien-formación.
    (0, term_1.typeOf)(t);
    return thm('REFL', [], (0, term_1.mkEq)(t, t));
}
// TRANS : |- a = b, |- b = c -> |- a = c ----------------------
/**
 * Regla TRANS: dados `⊢ a = b` y `⊢ b = c` produce `⊢ a = c`.
 * @throws Si alguna premisa no es una igualdad o los extremos no encajan.
 */
function trans(thm1, thm2) {
    const eq1 = (0, term_1.destEq)(thm1.concl);
    const eq2 = (0, term_1.destEq)(thm2.concl);
    if (eq1 === null) {
        throw new Error(`TRANS: la primera premisa no es una igualdad: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    if (eq2 === null) {
        throw new Error(`TRANS: la segunda premisa no es una igualdad: ${(0, term_1.termToString)(thm2.concl)}`);
    }
    if (!(0, term_1.alphaEq)(eq1[1], eq2[0])) {
        throw new Error(`TRANS: las premisas no encajan: ${(0, term_1.termToString)(eq1[1])} ≠ ${(0, term_1.termToString)(eq2[0])}`);
    }
    return thm('TRANS', unionHyps(thm1.hyps, thm2.hyps), (0, term_1.mkEq)(eq1[0], eq2[1]), [thm1, thm2]);
}
// MK_COMB : |- f = g, |- x = y -> |- f x = g y ----------------
/**
 * Regla MK_COMB: dados `⊢ f = g` y `⊢ x = y` produce `⊢ f x = g y`.
 * @throws Si alguna premisa no es igualdad o `f` no tiene tipo función.
 */
function mkCombRule(thm1, thm2) {
    const fg = (0, term_1.destEq)(thm1.concl);
    const xy = (0, term_1.destEq)(thm2.concl);
    if (fg === null) {
        throw new Error(`MK_COMB: la primera premisa no es igualdad: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    if (xy === null) {
        throw new Error(`MK_COMB: la segunda premisa no es igualdad: ${(0, term_1.termToString)(thm2.concl)}`);
    }
    // mkComb validará compatibilidad de tipos; lo hacemos en orden para
    // dar un mensaje claro si fuesen incompatibles.
    const fxType = (0, term_1.typeOf)(fg[0]);
    if (!(0, type_system_1.isFunType)(fxType)) {
        throw new Error(`MK_COMB: lado izquierdo no es función: ${(0, term_1.termToString)(fg[0])} : ${(0, type_system_1.typeToString)(fxType)}`);
    }
    const left = (0, term_1.mkComb)(fg[0], xy[0]);
    const right = (0, term_1.mkComb)(fg[1], xy[1]);
    return thm('MK_COMB', unionHyps(thm1.hyps, thm2.hyps), (0, term_1.mkEq)(left, right), [thm1, thm2]);
}
// ABS : |- s = t -> |- (λv.s) = (λv.t) ------------------------
/**
 * Regla ABS: dado `⊢ s = t` produce `⊢ (λv.s) = (λv.t)`.
 * `v` no puede aparecer libre en las hipótesis de `thm1`.
 * @throws Si `v` no es variable, la premisa no es igualdad, o la condición de variable es violada.
 */
function abs(v, thm1) {
    if (v.kind !== 'var') {
        throw new Error(`ABS: el binder debe ser una variable, no ${v.kind}`);
    }
    const eq = (0, term_1.destEq)(thm1.concl);
    if (eq === null) {
        throw new Error(`ABS: la premisa no es una igualdad: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    // La variable abstraida no puede aparecer libre en las hipótesis.
    for (const h of thm1.hyps) {
        if ((0, term_1.occursFree)(v.name, v.type, h)) {
            throw new Error(`ABS: la variable ${v.name} aparece libre en una hipótesis: ${(0, term_1.termToString)(h)}`);
        }
    }
    const lhs = (0, term_1.mkAbs)(v.name, v.type, eq[0]);
    const rhs = (0, term_1.mkAbs)(v.name, v.type, eq[1]);
    return thm('ABS', thm1.hyps.slice(), (0, term_1.mkEq)(lhs, rhs), [thm1]);
}
// BETA : |- (λv.t) v = t --------------------------------------
// HOL Light original: BETA solo acepta el término exacto `(λx.t) x`.
// Para usar β a forma `(λx.t) y` se compone con INST.
/**
 * Regla BETA: dado `(λv.t) v` produce `⊢ (λv.t) v = t`.
 * Solo acepta la forma exacta donde el argumento es el propio binder; usar INST para otros.
 * @throws Si `t` no es una aplicación de lambda o el argumento no coincide con el binder.
 */
function beta(t) {
    if (t.kind !== 'comb' || t.fn.kind !== 'abs') {
        throw new Error(`BETA: necesita una aplicación de λ: ${(0, term_1.termToString)(t)}`);
    }
    const lambda = t.fn;
    const arg = t.arg;
    if (arg.kind !== 'var' || arg.name !== lambda.param || !(0, type_system_1.typeEq)(arg.type, lambda.paramType)) {
        throw new Error(`BETA: el argumento debe ser exactamente el binder; usa INST para argumentos arbitrarios. ` +
            `Recibido: ${(0, term_1.termToString)(arg)}`);
    }
    // Resultado: (λv.body) v = body
    return thm('BETA', [], (0, term_1.mkEq)(t, lambda.body), []);
}
// ASSUME(p) : p |- p ------------------------------------------
/**
 * Regla ASSUME: produce `p ⊢ p` (hipótesis no descargada).
 * @throws Si `p` no tiene tipo `bool`.
 */
function assume(p) {
    const ty = (0, term_1.typeOf)(p);
    if (!(0, type_system_1.typeEq)(ty, type_system_1.TyBool)) {
        throw new Error(`ASSUME: la hipótesis debe ser de tipo bool, tiene tipo ${(0, type_system_1.typeToString)(ty)}`);
    }
    return thm('ASSUME', [p], p);
}
// EQ_MP : |- p = q (bool), |- p -> |- q -----------------------
/**
 * Regla EQ_MP: dados `⊢ p = q` y `⊢ p` produce `⊢ q` (modus ponens vía igualdad booleana).
 * @throws Si la primera premisa no es igualdad de bools, o la segunda no es α-igual al LHS.
 */
function eqMp(thm1, thm2) {
    const eq = (0, term_1.destEq)(thm1.concl);
    if (eq === null) {
        throw new Error(`EQ_MP: la primera premisa no es igualdad: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    if (!(0, type_system_1.typeEq)((0, term_1.typeOf)(eq[0]), type_system_1.TyBool)) {
        throw new Error(`EQ_MP: la igualdad no es entre booleanos: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    if (!(0, term_1.alphaEq)(eq[0], thm2.concl)) {
        throw new Error(`EQ_MP: la segunda premisa no es α-igual al LHS: ${(0, term_1.termToString)(thm2.concl)} vs ${(0, term_1.termToString)(eq[0])}`);
    }
    return thm('EQ_MP', unionHyps(thm1.hyps, thm2.hyps), eq[1], [thm1, thm2]);
}
// DEDUCT_ANTISYM_RULE -----------------------------------------
//   A |- p, B |- q -> (A - {q}) ∪ (B - {p}) |- p ↔ q
//
// Equivalente: deriva la bi-implicación a partir de dos
// teoremas que se "implican" via descarga de hipótesis.
/**
 * Regla DEDUCT_ANTISYM_RULE: dados `A ⊢ p` y `B ⊢ q` produce
 * `(A \ {q}) ∪ (B \ {p}) ⊢ p ↔ q`.
 * @throws Si alguna conclusión no es de tipo `bool`.
 */
function deductAntisymRule(thm1, thm2) {
    if (!(0, type_system_1.typeEq)((0, term_1.typeOf)(thm1.concl), type_system_1.TyBool)) {
        throw new Error(`DEDUCT_ANTISYM_RULE: thm1 no es bool: ${(0, term_1.termToString)(thm1.concl)}`);
    }
    if (!(0, type_system_1.typeEq)((0, term_1.typeOf)(thm2.concl), type_system_1.TyBool)) {
        throw new Error(`DEDUCT_ANTISYM_RULE: thm2 no es bool: ${(0, term_1.termToString)(thm2.concl)}`);
    }
    const p = thm1.concl;
    const q = thm2.concl;
    const hyps = unionHyps(removeHyp(thm1.hyps, q), removeHyp(thm2.hyps, p));
    return thm('DEDUCT_ANTISYM_RULE', hyps, (0, term_1.mkEq)(p, q), [thm1, thm2]);
}
// INST_TYPE : sustitución de variables de tipo ----------------
/**
 * Regla INST_TYPE: instancia variables de tipo en `thm1` según `subst`.
 * Deduplica hipótesis que colapsen tras la sustitución.
 */
function instType(subst, thm1) {
    const newHyps = thm1.hyps.map((h) => (0, term_1.instTypeInTerm)(subst, h));
    const newConcl = (0, term_1.instTypeInTerm)(subst, thm1.concl);
    // Deduplicamos hipótesis tras la sustitución porque pueden
    // colapsar (e.g. P[α] y P[β] con α↦β).
    const dedup = [];
    for (const h of newHyps) {
        if (!dedup.some((existing) => (0, term_1.alphaEq)(existing, h)))
            dedup.push(h);
    }
    return thm('INST_TYPE', dedup, newConcl, [thm1]);
}
/**
 * Sustituye variables libres en `thm1` según `subst`. El mapa
 * usa keys `name::typeString` para distinguir variables con
 * mismo nombre y distinto tipo.
 */
function inst(subst, thm1) {
    // El usuario provee `Record<string, HOLTerm>`: las keys son
    // los nombres de variables. Inferimos el tipo de la variable
    // a partir del valor (debe coincidir con el de la ocurrencia
    // libre). Si una variable libre tiene mismo nombre pero
    // distintos tipos en distintos lugares, esta API es ambigua;
    // recomendamos pasar `instTyped` (más abajo) en ese caso.
    const entries = Object.entries(subst).map(([name, value]) => ({
        name,
        type: (0, term_1.typeOf)(value),
        value,
    }));
    return instTyped(entries, thm1);
}
/**
 * Variante explícita: cada entrada especifica `{ name, type, value }`.
 * Necesaria si dos variables comparten nombre pero distinto tipo.
 */
function instTyped(entries, thm1) {
    // Validación: cada `value` debe tener el tipo declarado.
    for (const e of entries) {
        if (!(0, type_system_1.typeEq)((0, term_1.typeOf)(e.value), e.type)) {
            throw new Error(`INST: tipo del valor no coincide con la variable ${e.name}: ` +
                `${(0, type_system_1.typeToString)((0, term_1.typeOf)(e.value))} vs ${(0, type_system_1.typeToString)(e.type)}`);
        }
    }
    // Sustituimos en paralelo: para evitar interferencia con
    // sustituciones encadenadas, primero renombramos las variables
    // a fresh y luego instanciamos. En la práctica, HOL Light hace
    // una sustitución secuencial usando un mapeo y reescribiendo
    // los binders cuando hace falta para evitar captura. Nuestra
    // `substTerm` ya es capture-free, así que sustituimos en orden,
    // pero con un truco para "paralelismo": renombramos cada var
    // a un nombre intermedio único antes de aplicar los valores.
    const intermediate = entries.map((e, i) => ({
        name: e.name,
        type: e.type,
        intermediateName: `__inst${i}__`,
        value: e.value,
    }));
    let curHyps = thm1.hyps.slice();
    let curConcl = thm1.concl;
    // Fase 1: renombrar var(name, type) → var(intermediateName, type)
    for (const e of intermediate) {
        const intermediateVar = (0, term_1.mkVar)(e.intermediateName, e.type);
        curHyps = curHyps.map((h) => (0, term_1.substTerm)(e.name, e.type, intermediateVar, h));
        curConcl = (0, term_1.substTerm)(e.name, e.type, intermediateVar, curConcl);
    }
    // Fase 2: reemplazar intermediateName → value real.
    for (const e of intermediate) {
        curHyps = curHyps.map((h) => (0, term_1.substTerm)(e.intermediateName, e.type, e.value, h));
        curConcl = (0, term_1.substTerm)(e.intermediateName, e.type, e.value, curConcl);
    }
    // Dedup tras sustitución.
    const dedup = [];
    for (const h of curHyps) {
        if (!dedup.some((existing) => (0, term_1.alphaEq)(existing, h)))
            dedup.push(h);
    }
    return thm('INST', dedup, curConcl, [thm1]);
}
//# sourceMappingURL=rules.js.map