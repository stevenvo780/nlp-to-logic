/**
 * Contexto formal K = (G, M, I).
 *  - `objects`    G como lista finita ordenada.
 *  - `attributes` M como lista finita ordenada.
 *  - `incidence`  representación canónica como conjunto de pares
 *                 codificados "objeto|atributo" para test O(1).
 */
export interface FormalContext {
    objects: string[];
    attributes: string[];
    incidence: Set<string>;
}
/**
 * Concepto formal (A, B) con A = extent, B = intent.
 * Invariante: A' = B y B' = A (verificable con `isConcept`).
 */
export interface FormalConcept {
    extent: Set<string>;
    intent: Set<string>;
}
/**
 * Diagrama de Hasse del concept lattice como lista de aristas de cobertura.
 * `edges[i] = [child, parent]` significa que el concepto `child` está cubierto
 * inmediatamente por `parent` (no hay concepto intermedio estricto).
 * Los índices son posiciones en el array de conceptos devuelto por
 * `allConcepts`.
 */
export interface HasseLattice {
    edges: Array<[number, number]>;
}
//# sourceMappingURL=types.d.ts.map