/**
 * Calcula |A_1 ∪ A_2 ∪ ... ∪ A_n| usando el principio de inclusión-exclusión
 * a fuerza bruta sobre el reticulado de subconjuntos no vacíos de índices.
 *
 * |⋃ A_i| = Σ_{S≠∅} (-1)^(|S|+1) |⋂_{i∈S} A_i|
 */
export declare function inclusionExclusion(sets: Array<Set<number>>): number;
//# sourceMappingURL=inclusion-exclusion.d.ts.map