"use strict";
// ============================================================
// ST Default Logic (Reiter) — Entailment credulous/skeptical
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInExtension = isInExtension;
exports.isSkepticallyEntailed = isSkepticallyEntailed;
exports.isCredulouslyEntailed = isCredulouslyEntailed;
const extensions_1 = require("./extensions");
/** Comprueba si el literal está en la extensión dada. */
function isInExtension(formula, ext) {
    return ext.formulas.has((0, extensions_1.normalizeLiteral)(formula));
}
/**
 * Entailment escéptico: el literal está en TODAS las extensiones.
 * Si la teoría no tiene extensiones, devuelve false (entailment vacuo
 * tampoco — la convención usual es no afirmar nada sin testigos).
 */
function isSkepticallyEntailed(formula, T, options = {}) {
    const exts = (0, extensions_1.computeExtensions)(T, options);
    if (exts.length === 0)
        return false;
    const target = (0, extensions_1.normalizeLiteral)(formula);
    return exts.every((e) => e.formulas.has(target));
}
/**
 * Entailment crédulo: el literal está en AL MENOS una extensión.
 */
function isCredulouslyEntailed(formula, T, options = {}) {
    const exts = (0, extensions_1.computeExtensions)(T, options);
    if (exts.length === 0)
        return false;
    const target = (0, extensions_1.normalizeLiteral)(formula);
    return exts.some((e) => e.formulas.has(target));
}
//# sourceMappingURL=entailment.js.map