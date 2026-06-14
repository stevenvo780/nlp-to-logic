"use strict";
// ============================================================
// ST Term Rewriting — Critical pairs
// ============================================================
//
// Un critical pair (CP) entre dos reglas l₁ → r₁ y l₂ → r₂ surge
// cuando un subtérmino no-variable de l₁ unifica con l₂. Esto
// representa dos formas distintas de reducir el mismo término, y
// si ambas convergen a la misma forma normal, las reglas son
// "join-able" en ese punto.
//
// Algoritmo (Knuth-Bendix Critical Pair Lemma):
//   Para cada posición p no-variable de l₁:
//     subterm = l₁ |_p
//     si unify(subterm, l₂) = σ existe:
//       cp₁ = σ(r₁)
//       cp₂ = σ(l₁[p ← r₂])
//       => (cp₁, cp₂) es un critical pair.
//
// El sistema es **localmente confluente** sii todos sus CPs son
// joinables (Newman's Lemma + decidible para sistemas terminantes).
Object.defineProperty(exports, "__esModule", { value: true });
exports.criticalPairsBetween = criticalPairsBetween;
exports.allCriticalPairs = allCriticalPairs;
exports.isConfluent = isConfluent;
exports.freeVarsOf = freeVarsOf;
const term_utils_1 = require("./term-utils");
const rewrite_1 = require("./rewrite");
/**
 * Calcula todos los critical pairs entre dos reglas.
 *
 * Las variables se renombran para evitar colisiones espurias
 * (la regla "outer" recibe sufijo `_o`, la inner sufijo `_i`).
 */
function criticalPairsBetween(outer, inner, outerIdx, innerIdx) {
    const oLhs = (0, term_utils_1.renameVars)(outer.lhs, 'o');
    const oRhs = (0, term_utils_1.renameVars)(outer.rhs, 'o');
    const iLhs = (0, term_utils_1.renameVars)(inner.lhs, 'i');
    const iRhs = (0, term_utils_1.renameVars)(inner.rhs, 'i');
    const pairs = [];
    const positions = (0, rewrite_1.allPositions)(oLhs);
    for (const pos of positions) {
        const sub = (0, rewrite_1.subtermAt)(oLhs, pos);
        if (sub === null)
            continue;
        if (sub.kind === 'var')
            continue; // CPs solo en posiciones no-variable
        const mgu = (0, term_utils_1.unify)(sub, iLhs);
        if (mgu === null)
            continue;
        // Trivial overlap: misma regla en raíz (outerIdx === innerIdx, pos = [])
        // ⇒ produce el CP (σ(rhs), σ(rhs)) que es siempre joinable. Lo omitimos.
        if (outerIdx === innerIdx && pos.length === 0)
            continue;
        const cpInner = (0, term_utils_1.applySubst)(oRhs, mgu);
        const cpOuter = (0, term_utils_1.applySubst)((0, rewrite_1.replaceAt)(oLhs, pos, iRhs), mgu);
        pairs.push({
            lhs: cpOuter,
            rhs: cpInner,
            ruleOuterIndex: outerIdx,
            ruleInnerIndex: innerIdx,
        });
    }
    return pairs;
}
/**
 * Critical pairs de un TRS completo: para cada par de reglas
 * (incluyendo (i, i) con i = i), calcula sus CPs.
 */
function allCriticalPairs(rules) {
    const out = [];
    for (let i = 0; i < rules.length; i++) {
        for (let j = 0; j < rules.length; j++) {
            const ri = rules[i];
            const rj = rules[j];
            if (ri === undefined || rj === undefined)
                continue;
            out.push(...criticalPairsBetween(ri, rj, i, j));
        }
    }
    return out;
}
/**
 * Confluencia local: todos los CPs son joinables.
 *
 * Un CP (a, b) es joinable si normalize(a) = normalize(b).
 *
 * Por Newman's Lemma: terminating + locally confluent ⇒ confluent.
 * No verificamos terminación acá (eso requiere LPO/KBO/etc.).
 */
function isConfluent(trs) {
    const cps = allCriticalPairs(trs.rules);
    for (const cp of cps) {
        const a = (0, rewrite_1.normalize)(cp.lhs, trs.rules);
        const b = (0, rewrite_1.normalize)(cp.rhs, trs.rules);
        if (!(0, term_utils_1.termEquals)(a, b))
            return false;
    }
    return true;
}
/**
 * Helper: ¿la variable v aparece libre en t?
 *
 * Re-export para facilidad de imports.
 */
function freeVarsOf(t) {
    return (0, term_utils_1.varsOf)(t);
}
//# sourceMappingURL=critical-pairs.js.map