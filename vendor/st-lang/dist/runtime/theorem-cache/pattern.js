"use strict";
/**
 * Matching de patrones contra fórmulas cacheadas.
 *
 * Un patrón usa `?x`, `?y`, … como metavariables. Para que un patrón
 * matchee una fórmula, debe existir una asignación consistente
 * (cada metavariable mapea a un único identificador en la fórmula).
 *
 * Ejemplos:
 *   patrón `?x -> ?x`  matchea  `P -> P`         (con x=P)
 *   patrón `?x -> ?x`  NO matchea  `P -> Q`
 *   patrón `?x -> ?y`  matchea  `P -> Q`         (con x=P, y=Q)
 *   patrón `?x -> ?y`  matchea  `P -> P`         (con x=P, y=P)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPattern = matchPattern;
exports.patternMatches = patternMatches;
const canonical_1 = require("./canonical");
const RESERVED = new Set([
    'not',
    'and',
    'or',
    'implies',
    'iff',
    'forall',
    'exists',
    'true',
    'false',
    'True',
    'False',
    'TRUE',
    'FALSE',
]);
// Token: meta-variable (?name), identificador, número, símbolo.
const TOKEN_RE = /\?[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_]*|\d+|[^\sA-Za-z0-9_]/g;
function tokenize(s) {
    const normalized = (0, canonical_1.normalizeWhitespace)(s);
    return normalized.match(TOKEN_RE) ?? [];
}
/**
 * Intenta matchear un patrón contra una fórmula. Retorna la
 * asignación de metavariables si matchea, o `undefined` si no.
 */
function matchPattern(pattern, formula) {
    const patternTokens = tokenize(pattern);
    const formulaTokens = tokenize(formula);
    if (patternTokens.length !== formulaTokens.length)
        return undefined;
    const bindings = {};
    for (let i = 0; i < patternTokens.length; i++) {
        const pt = patternTokens[i];
        const ft = formulaTokens[i];
        if (pt.startsWith('?')) {
            const metaName = pt.slice(1);
            const existing = bindings[metaName];
            if (existing === undefined) {
                // ft debe ser un identificador (no operador / paréntesis).
                if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(ft) || RESERVED.has(ft)) {
                    return undefined;
                }
                bindings[metaName] = ft;
            }
            else if (existing !== ft) {
                return undefined;
            }
        }
        else if (pt !== ft) {
            return undefined;
        }
    }
    return bindings;
}
/**
 * Comprueba si un patrón matchea (al menos una vez) sobre la fórmula
 * completa, sin extraer las bindings.
 */
function patternMatches(pattern, formula) {
    return matchPattern(pattern, formula) !== undefined;
}
//# sourceMappingURL=pattern.js.map