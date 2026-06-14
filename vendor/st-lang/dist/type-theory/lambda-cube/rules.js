"use strict";
// ============================================================
// Lambda Cube — Pure Type System rules per vértice
// ============================================================
//
// Cada sistema del cubo se identifica por su conjunto de reglas de
// formación (s1, s2): bajo qué sorts es legal formar `Π x:A. B` donde
// `A : s1` y `B : s2`.
//
// La regla común a todos los sistemas es (*, *) — la flecha sobre
// términos del λ-cálculo simplemente tipado. Las otras tres se
// "encienden" según la posición en el cubo:
//
//   eje X  (◻, *) — polimorfismo: cuantificar sobre tipos
//   eje Y  (◻, ◻) — operadores de tipo: funciones type→type
//   eje Z  (*, ◻) — tipos dependientes: tipo que depende de un valor
//
// Cualquier subconjunto que contenga (*, *) da un PTS coherente.
// El número total de vértices es 2^3 = 8.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXIOMS = exports.SYSTEMS = void 0;
exports.hasRule = hasRule;
exports.rulesOf = rulesOf;
exports.axiomFor = axiomFor;
const BASE = { from: '*', to: '*' };
const POLY = { from: '◻', to: '*' };
const OPS = { from: '◻', to: '◻' };
const DEP = { from: '*', to: '◻' };
exports.SYSTEMS = {
    lambda: { formationRules: [BASE] },
    lambda2: { formationRules: [BASE, POLY] },
    'lambda-omega-bar': { formationRules: [BASE, OPS] },
    'lambda-omega': { formationRules: [BASE, POLY, OPS] },
    'lambda-P': { formationRules: [BASE, DEP] },
    'lambda-P2': { formationRules: [BASE, POLY, DEP] },
    'lambda-P-omega': { formationRules: [BASE, OPS, DEP] },
    'lambda-C': { formationRules: [BASE, POLY, OPS, DEP] },
};
/** ¿El par (s1, s2) está en las reglas de formación de `system`? */
function hasRule(system, from, to) {
    const rules = exports.SYSTEMS[system].formationRules;
    for (const r of rules) {
        if (r.from === from && r.to === to)
            return true;
    }
    return false;
}
/** Conjunto de pares de formación de un sistema, en orden canónico. */
function rulesOf(system) {
    return exports.SYSTEMS[system].formationRules;
}
/**
 * Reglas de axioma. En el cubo Barendregt clásico el único axioma es
 *   * : ◻
 * (no hay jerarquía de universos: ◻ no tiene tipo propio, por eso los
 * términos del cubo no pueden anidar ◻ : ?). Si se intentara tipar ◻
 * directamente, el typechecker reportará error.
 */
exports.AXIOMS = [{ sort: '*', type: '◻' }];
function axiomFor(sort) {
    for (const a of exports.AXIOMS) {
        if (a.sort === sort)
            return a.type;
    }
    return undefined;
}
//# sourceMappingURL=rules.js.map