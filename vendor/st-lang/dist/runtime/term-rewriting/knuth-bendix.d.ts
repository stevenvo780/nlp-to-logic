import type { KBOptions, KBResult, RewriteRule, Term, TRS } from './types';
/**
 * Orienta una ecuación s = t a regla l → r usando LPO.
 *
 * - Si s >LPO t: devuelve s → t.
 * - Si t >LPO s: devuelve t → s.
 * - Si son incomparables: null (KB falla aquí, el caller debe abortar
 *   o pedir al user una precedencia distinta).
 * - Si son iguales: ecuación trivial, devuelve null sin error.
 */
export declare function orient(s: Term, t: Term, precedence: Map<string, number>): RewriteRule | null;
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
export declare function knuthBendixCompletion(initialRules: RewriteRule[], opts?: KBOptions): KBResult;
/**
 * Sugar: construye un TRS plano.
 */
export declare function makeTRS(rules: RewriteRule[]): TRS;
//# sourceMappingURL=knuth-bendix.d.ts.map