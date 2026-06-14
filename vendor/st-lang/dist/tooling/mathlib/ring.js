"use strict";
// ============================================================
// ST Mathlib — Ring theory
// Verificación de axiomas de anillo y check de campo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRing = verifyRing;
exports.isField = isField;
const group_1 = require("./group");
/**
 * Verifica los axiomas de anillo (con identidad multiplicativa):
 *   - (R, +, 0) grupo abeliano.
 *   - (R, ·, 1) monoide (asociatividad + identidad).
 *   - · distribuye sobre + por ambos lados.
 */
function verifyRing(r, elements, eq = (a, b) => a === b) {
    const failures = [];
    // Grupo abeliano aditivo.
    const addMagma = { op: r.add };
    if (!(0, group_1.isAssociative)(addMagma, elements, eq))
        failures.push('asociatividad aditiva');
    if (!(0, group_1.hasIdentity)(addMagma, elements, r.zero, eq))
        failures.push('identidad aditiva (0)');
    if (!(0, group_1.hasInverses)({ op: r.add, identity: r.zero, inverse: r.neg }, elements, eq)) {
        failures.push('inversos aditivos');
    }
    if (!(0, group_1.isCommutative)(addMagma, elements, eq))
        failures.push('conmutatividad aditiva');
    // Monoide multiplicativo.
    const mulMagma = { op: r.mul };
    if (!(0, group_1.isAssociative)(mulMagma, elements, eq))
        failures.push('asociatividad multiplicativa');
    if (!(0, group_1.hasIdentity)(mulMagma, elements, r.one, eq))
        failures.push('identidad multiplicativa (1)');
    // Distributividad: a·(b+c) = a·b + a·c  y  (a+b)·c = a·c + b·c.
    for (const a of elements) {
        for (const b of elements) {
            for (const c of elements) {
                const left = r.mul(a, r.add(b, c));
                const right = r.add(r.mul(a, b), r.mul(a, c));
                if (!eq(left, right)) {
                    failures.push('distributividad por izquierda');
                    break;
                }
            }
            if (failures.includes('distributividad por izquierda'))
                break;
        }
        if (failures.includes('distributividad por izquierda'))
            break;
    }
    for (const a of elements) {
        for (const b of elements) {
            for (const c of elements) {
                const left = r.mul(r.add(a, b), c);
                const right = r.add(r.mul(a, c), r.mul(b, c));
                if (!eq(left, right)) {
                    failures.push('distributividad por derecha');
                    break;
                }
            }
            if (failures.includes('distributividad por derecha'))
                break;
        }
        if (failures.includes('distributividad por derecha'))
            break;
    }
    return { valid: failures.length === 0, failures };
}
/**
 * Un anillo conmutativo R es campo si todo elemento no nulo tiene
 * inverso multiplicativo dentro del conjunto. `div` debe devolver
 * un T para argumentos válidos o `undefined` cuando no existe inverso.
 */
function isField(r, elements, div, eq = (a, b) => a === b) {
    // Conmutatividad multiplicativa (requerido para campo).
    if (!(0, group_1.isCommutative)({ op: r.mul }, elements, eq))
        return false;
    // Todo elemento no cero tiene inverso multiplicativo.
    for (const a of elements) {
        if (eq(a, r.zero))
            continue;
        const inv = div(r.one, a);
        if (inv === undefined)
            return false;
        if (!eq(r.mul(a, inv), r.one))
            return false;
    }
    return true;
}
//# sourceMappingURL=ring.js.map