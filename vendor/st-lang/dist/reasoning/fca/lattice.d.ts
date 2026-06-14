import type { FormalConcept, HasseLattice } from './types';
/**
 * Computa el diagrama de Hasse del concept lattice como lista de aristas
 * de cobertura `[child, parent]` (índices en `concepts`).
 *
 * La orientación es de "específico" a "general":
 *   `[i, j]` significa `extent_i ⊊ extent_j` y la inclusión es inmediata.
 */
export declare function lattice(concepts: FormalConcept[]): HasseLattice;
//# sourceMappingURL=lattice.d.ts.map