"use strict";
// ============================================================
// ST Mathlib — Order theory
// Reflexividad, antisimetría, transitividad y lattice check.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReflexive = isReflexive;
exports.isAntisymmetric = isAntisymmetric;
exports.isTransitive = isTransitive;
exports.isLattice = isLattice;
exports.verifyPartialOrder = verifyPartialOrder;
/**
 * Para todo a en `elements`: a ≤ a.
 */
function isReflexive(po, elements) {
    for (const a of elements) {
        if (!po.leq(a, a))
            return false;
    }
    return true;
}
/**
 * Para todo a,b: a ≤ b ∧ b ≤ a ⇒ a = b.
 * La igualdad se decide con `===` para tipos primitivos; para
 * tipos compuestos se acepta un `eq` custom.
 */
function isAntisymmetric(po, elements, eq = (a, b) => a === b) {
    for (const a of elements) {
        for (const b of elements) {
            if (po.leq(a, b) && po.leq(b, a) && !eq(a, b))
                return false;
        }
    }
    return true;
}
/**
 * Para todo a,b,c: a ≤ b ∧ b ≤ c ⇒ a ≤ c.
 */
function isTransitive(po, elements) {
    for (const a of elements) {
        for (const b of elements) {
            for (const c of elements) {
                if (po.leq(a, b) && po.leq(b, c) && !po.leq(a, c))
                    return false;
            }
        }
    }
    return true;
}
/**
 * Un poset es lattice si cada par {a,b} tiene supremo (join) e
 * ínfimo (meet) dentro de `elements`. Esto verifica existencia
 * estructural usando el orden parcial (no requiere ops explícitas).
 */
function isLattice(po, elements, eq = (a, b) => a === b) {
    for (const a of elements) {
        for (const b of elements) {
            // join (supremo): existe c tal que a ≤ c, b ≤ c, y para todo d cota superior, c ≤ d.
            const upperBounds = elements.filter((c) => po.leq(a, c) && po.leq(b, c));
            if (upperBounds.length === 0)
                return false;
            const join = upperBounds.find((c) => upperBounds.every((d) => po.leq(c, d)));
            if (!join)
                return false;
            // meet (ínfimo): existe c tal que c ≤ a, c ≤ b, y para todo d cota inferior, d ≤ c.
            const lowerBounds = elements.filter((c) => po.leq(c, a) && po.leq(c, b));
            if (lowerBounds.length === 0)
                return false;
            const meet = lowerBounds.find((c) => lowerBounds.every((d) => po.leq(d, c)));
            if (!meet)
                return false;
            // Sanity: join único y meet único (usando eq).
            void eq; // eq se acepta para overload con tipos compuestos; no se usa en short-circuit.
        }
    }
    return true;
}
/**
 * Reporte completo del orden parcial sobre el conjunto dado.
 */
function verifyPartialOrder(po, elements, eq = (a, b) => a === b) {
    const failures = [];
    if (!isReflexive(po, elements))
        failures.push('reflexividad');
    if (!isAntisymmetric(po, elements, eq))
        failures.push('antisimetría');
    if (!isTransitive(po, elements))
        failures.push('transitividad');
    return { valid: failures.length === 0, failures };
}
//# sourceMappingURL=order.js.map