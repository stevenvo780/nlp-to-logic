"use strict";
// ============================================================
// Refinement types — Subtipado por implicación
// ============================================================
//
// Definición:
//   { x : B | P(x) } <: { y : B | Q(y) }
//     ⟺  B = B'  ∧  ∀x. P(x) ⇒ Q[x/y]
//
// Para tipos arrow se aplica contravarianza en el parámetro y
// covarianza en el resultado, como en sistemas refinados estándar.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubtype = isSubtype;
const solver_1 = require("./solver");
const predicate_1 = require("./predicate");
/**
 * isSubtype — devuelve true si T1 <: T2 bajo las suposiciones del contexto.
 *
 * - Para tipos base iguales: chequea P(x) ⇒ Q(x) renombrando el binding.
 * - Para arrows: contravarianza en `from`, covarianza en `to`.
 */
function isSubtype(t1, t2, opts = {}) {
    return isSubBase(t1.base, t2.base, opts) && isSubRefinement(t1, t2, opts);
}
function isSubBase(b1, b2, opts) {
    if (typeof b1 === 'string' || typeof b2 === 'string')
        return b1 === b2;
    // arrow: contravariant en from, covariant en to
    return isSubtype(b2.from, b1.from, opts) && isSubtype(b1.to, b2.to, opts);
}
function isSubRefinement(t1, t2, opts) {
    // Renombramos el binding de t2 al de t1 para chequear P(x) ⇒ Q(x).
    const sharedName = t1.binding;
    const p = t1.predicate.trim() === '' ? 'true' : t1.predicate;
    const q = (0, predicate_1.renameVar)(t2.predicate.trim() === '' ? 'true' : t2.predicate, t2.binding, sharedName);
    const premises = [p, ...(opts.extraAssumptions ?? [])];
    return (0, solver_1.implies)(premises, q, opts);
}
//# sourceMappingURL=subtype.js.map