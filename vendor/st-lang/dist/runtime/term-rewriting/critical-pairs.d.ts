import type { RewriteRule, Term } from './types';
export interface CriticalPair {
    lhs: Term;
    rhs: Term;
    /** Reglas que originaron el par (informativo). */
    ruleOuterIndex: number;
    ruleInnerIndex: number;
}
/**
 * Calcula todos los critical pairs entre dos reglas.
 *
 * Las variables se renombran para evitar colisiones espurias
 * (la regla "outer" recibe sufijo `_o`, la inner sufijo `_i`).
 */
export declare function criticalPairsBetween(outer: RewriteRule, inner: RewriteRule, outerIdx: number, innerIdx: number): CriticalPair[];
/**
 * Critical pairs de un TRS completo: para cada par de reglas
 * (incluyendo (i, i) con i = i), calcula sus CPs.
 */
export declare function allCriticalPairs(rules: RewriteRule[]): CriticalPair[];
/**
 * Confluencia local: todos los CPs son joinables.
 *
 * Un CP (a, b) es joinable si normalize(a) = normalize(b).
 *
 * Por Newman's Lemma: terminating + locally confluent ⇒ confluent.
 * No verificamos terminación acá (eso requiere LPO/KBO/etc.).
 */
export declare function isConfluent(trs: {
    rules: RewriteRule[];
}): boolean;
/**
 * Helper: ¿la variable v aparece libre en t?
 *
 * Re-export para facilidad de imports.
 */
export declare function freeVarsOf(t: Term): Set<string>;
//# sourceMappingURL=critical-pairs.d.ts.map