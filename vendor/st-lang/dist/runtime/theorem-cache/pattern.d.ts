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
/**
 * Intenta matchear un patrón contra una fórmula. Retorna la
 * asignación de metavariables si matchea, o `undefined` si no.
 */
export declare function matchPattern(pattern: string, formula: string): Record<string, string> | undefined;
/**
 * Comprueba si un patrón matchea (al menos una vez) sobre la fórmula
 * completa, sin extraer las bindings.
 */
export declare function patternMatches(pattern: string, formula: string): boolean;
//# sourceMappingURL=pattern.d.ts.map