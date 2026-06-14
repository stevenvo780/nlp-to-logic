import type { HybridFormula, HybridFrame } from './types';
/**
 * Búsqueda exhaustiva de modelo en frames de tamaño ≤ `maxWorlds`.
 *
 * Para una explosión combinatoria controlada, sólo intentamos
 * tamaños desde 1 hasta `maxWorlds`. Es completo dentro de ese rango.
 */
export declare function isSatisfiable(phi: HybridFormula, options?: {
    maxWorlds?: number;
}): {
    sat: boolean;
    frame?: HybridFrame;
    world?: string;
};
//# sourceMappingURL=sat.d.ts.map