import type { Feature, ProofState } from './types';
/**
 * Extrae features del estado. Estabilidad:
 * - mismo state → mismo array (orden, nombres, valores).
 * - todos los valores son números finitos.
 */
export declare function extractFeatures(state: ProofState): Feature[];
/** Lista cerrada de feature names — útil para inicializar el modelo. */
export declare function featureNames(): string[];
//# sourceMappingURL=features.d.ts.map