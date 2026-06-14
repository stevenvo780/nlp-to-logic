"use strict";
// ============================================================
// ST Mathlib — Group theory
// Axiomas: asociatividad, identidad, inversos, conmutatividad.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAssociative = isAssociative;
exports.isCommutative = isCommutative;
exports.hasIdentity = hasIdentity;
exports.hasInverses = hasInverses;
exports.verifyGroup = verifyGroup;
exports.verifyAbelianGroup = verifyAbelianGroup;
/**
 * (a · b) · c = a · (b · c) para todo a,b,c en el muestreo.
 */
function isAssociative(m, elements, eq = (a, b) => a === b) {
    for (const a of elements) {
        for (const b of elements) {
            for (const c of elements) {
                const left = m.op(m.op(a, b), c);
                const right = m.op(a, m.op(b, c));
                if (!eq(left, right))
                    return false;
            }
        }
    }
    return true;
}
/**
 * a · b = b · a para todo a,b. Falla rápido si encuentra contraejemplo.
 */
function isCommutative(m, elements, eq = (a, b) => a === b) {
    for (const a of elements) {
        for (const b of elements) {
            if (!eq(m.op(a, b), m.op(b, a)))
                return false;
        }
    }
    return true;
}
/**
 * Para todo a: id · a = a ∧ a · id = a.
 */
function hasIdentity(m, elements, id, eq = (a, b) => a === b) {
    for (const a of elements) {
        if (!eq(m.op(id, a), a))
            return false;
        if (!eq(m.op(a, id), a))
            return false;
    }
    return true;
}
/**
 * Para todo a: a · a⁻¹ = id ∧ a⁻¹ · a = id.
 */
function hasInverses(g, elements, eq = (a, b) => a === b) {
    for (const a of elements) {
        const inv = g.inverse(a);
        if (!eq(g.op(a, inv), g.identity))
            return false;
        if (!eq(g.op(inv, a), g.identity))
            return false;
    }
    return true;
}
/**
 * Verifica los 4 axiomas de grupo: clausura (implícita en el tipo),
 * asociatividad, identidad e inversos. Reporta qué axiomas fallaron.
 */
function verifyGroup(g, elements, eq = (a, b) => a === b) {
    const failures = [];
    if (!isAssociative(g, elements, eq))
        failures.push('asociatividad');
    if (!hasIdentity(g, elements, g.identity, eq))
        failures.push('identidad');
    if (!hasInverses(g, elements, eq))
        failures.push('inversos');
    return { valid: failures.length === 0, failures };
}
/**
 * Verifica que un grupo es abeliano (verifyGroup + conmutatividad).
 */
function verifyAbelianGroup(g, elements, eq = (a, b) => a === b) {
    const base = verifyGroup(g, elements, eq);
    if (!isCommutative(g, elements, eq))
        base.failures.push('conmutatividad');
    return { valid: base.failures.length === 0, failures: base.failures };
}
//# sourceMappingURL=group.js.map