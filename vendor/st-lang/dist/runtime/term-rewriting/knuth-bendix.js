"use strict";
// ============================================================
// ST Term Rewriting — Knuth-Bendix Completion
// ============================================================
//
// KB completion transforma un conjunto de ecuaciones E en un TRS
// terminante y confluente (cuando existe). Procedimiento clásico:
//
//   1. Orientar cada ecuación s = t en regla l → r usando una
//      reducción ordering > (LPO acá).
//   2. Inter-reducir las reglas (simplify) para mantener minimalidad.
//   3. Calcular critical pairs.
//   4. Por cada CP (a, b):
//        a' = normalize(a)
//        b' = normalize(b)
//        si a' ≡ b' → joinable, descartar.
//        si no → agregar como nueva regla orientada.
//   5. Volver al paso 2 hasta que no haya nuevos CPs ⇒ completed.
//
// KB es **semi-decidible**: puede no terminar (orientar nuevas
// ecuaciones puede no ser posible, o el espacio crecer sin cota).
// Por eso exigimos `maxSteps`.
//
// Implementación: estrategia simple "outer loop", no la versión
// optimizada de Huet con prioridades. Suficiente para teorías
// pequeñas de testing (grupos, conmutatividad-a-medias, etc.).
Object.defineProperty(exports, "__esModule", { value: true });
exports.orient = orient;
exports.knuthBendixCompletion = knuthBendixCompletion;
exports.makeTRS = makeTRS;
const term_utils_1 = require("./term-utils");
const rewrite_1 = require("./rewrite");
const critical_pairs_1 = require("./critical-pairs");
const lpo_1 = require("./lpo");
/**
 * Orienta una ecuación s = t a regla l → r usando LPO.
 *
 * - Si s >LPO t: devuelve s → t.
 * - Si t >LPO s: devuelve t → s.
 * - Si son incomparables: null (KB falla aquí, el caller debe abortar
 *   o pedir al user una precedencia distinta).
 * - Si son iguales: ecuación trivial, devuelve null sin error.
 */
function orient(s, t, precedence) {
    const cmp = (0, lpo_1.lpoCompare)(s, t, precedence);
    if (cmp === 'eq')
        return null;
    if (cmp === 'gt')
        return { lhs: s, rhs: t };
    if (cmp === 'lt')
        return { lhs: t, rhs: s };
    // incomparable
    return null;
}
/**
 * ¿La regla `r` es subsumida (redundante) dada la lista `rules`?
 *
 * Una regla l → r es redundante si normalize(l, rules \ {r}) ya
 * llega a r. En particular, si su LHS es reducible por otra regla,
 * la regla nunca dispara y puede eliminarse.
 */
function isRedundant(rule, rules) {
    const others = rules.filter((x) => x !== rule);
    const reducedLhs = (0, rewrite_1.normalize)(rule.lhs, others, 1000);
    if (!(0, term_utils_1.termEquals)(reducedLhs, rule.lhs))
        return true;
    const reducedRhs = (0, rewrite_1.normalize)(rule.rhs, rules, 1000);
    if ((0, term_utils_1.termEquals)(reducedLhs, reducedRhs)) {
        // ambos lados convergen sin la regla
        return true;
    }
    return false;
}
/**
 * Inter-reduce: simplifica los RHS y elimina reglas redundantes.
 */
function interReduce(rules) {
    let current = rules.slice();
    let changed = true;
    let guard = 0;
    while (changed && guard++ < 50) {
        changed = false;
        // Normalizar RHS de cada regla con las demás
        const nextRules = [];
        for (const r of current) {
            const others = current.filter((x) => x !== r);
            const newRhs = (0, rewrite_1.normalize)(r.rhs, others, 1000);
            if (!(0, term_utils_1.termEquals)(newRhs, r.rhs)) {
                changed = true;
                nextRules.push({ lhs: r.lhs, rhs: newRhs });
            }
            else {
                nextRules.push(r);
            }
        }
        // Quitar reglas redundantes
        const filtered = nextRules.filter((r) => !isRedundant(r, nextRules));
        if (filtered.length !== nextRules.length)
            changed = true;
        current = filtered;
    }
    return current;
}
/**
 * Detecta duplicados sintácticos.
 */
function ruleAlreadyPresent(rule, rules) {
    return rules.some((r) => (0, term_utils_1.termEquals)(r.lhs, rule.lhs) && (0, term_utils_1.termEquals)(r.rhs, rule.rhs));
}
/**
 * Knuth-Bendix completion.
 *
 * `initialRules` se interpretan como ecuaciones orientadas. La
 * orientación inicial se respeta si ya está bien dirigida según
 * la precedencia; si no, se re-orienta.
 *
 * Devuelve un `KBResult` con:
 *   - `completed: true` si convergió.
 *   - `completed: false` si se excedió `maxSteps` o un CP no-joinable
 *     no pudo orientarse (LPO incomparable).
 */
function knuthBendixCompletion(initialRules, opts = {}) {
    const precedence = opts.precedence ?? new Map();
    const maxSteps = opts.maxSteps ?? 100;
    // Re-orientar las reglas iniciales con LPO. Si una ecuación no
    // es trivial (lhs ≠ rhs) y LPO no la decide, KB falla de
    // inmediato: la orientabilidad de las ecuaciones iniciales es un
    // pre-requisito.
    let rules = [];
    for (const r of initialRules) {
        if ((0, term_utils_1.termEquals)(r.lhs, r.rhs))
            continue; // ecuación trivial
        const oriented = orient(r.lhs, r.rhs, precedence);
        if (oriented === null) {
            return {
                trs: { rules },
                completed: false,
                criticalPairs: 0,
                steps: 0,
            };
        }
        if (!ruleAlreadyPresent(oriented, rules)) {
            rules.push(oriented);
        }
    }
    let cpCount = 0;
    let step;
    for (step = 0; step < maxSteps; step++) {
        rules = interReduce(rules);
        const cps = (0, critical_pairs_1.allCriticalPairs)(rules);
        cpCount += cps.length;
        let addedAny = false;
        for (const cp of cps) {
            const a = (0, rewrite_1.normalize)(cp.lhs, rules);
            const b = (0, rewrite_1.normalize)(cp.rhs, rules);
            if ((0, term_utils_1.termEquals)(a, b))
                continue; // joinable
            const oriented = orient(a, b, precedence);
            if (oriented === null) {
                // CP no joinable y no orientable ⇒ KB falla.
                return {
                    trs: { rules },
                    completed: false,
                    criticalPairs: cpCount,
                    steps: step + 1,
                };
            }
            if (!ruleAlreadyPresent(oriented, rules)) {
                rules.push(oriented);
                addedAny = true;
            }
        }
        if (!addedAny) {
            // No se añadió ninguna regla nueva ⇒ converged.
            return {
                trs: { rules },
                completed: true,
                criticalPairs: cpCount,
                steps: step + 1,
            };
        }
    }
    return {
        trs: { rules },
        completed: false,
        criticalPairs: cpCount,
        steps: step,
    };
}
/**
 * Sugar: construye un TRS plano.
 */
function makeTRS(rules) {
    return { rules };
}
//# sourceMappingURL=knuth-bendix.js.map