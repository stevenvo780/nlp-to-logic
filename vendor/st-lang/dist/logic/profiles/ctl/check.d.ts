import type { CTLFormula, KripkeStructure } from './types';
/**
 * Model checking de Computation Tree Logic.
 * Devuelve un mapa `stateId → φ se cumple en ese estado`.
 */
export declare function modelCheckCTL(M: KripkeStructure, phi: CTLFormula): Map<string, boolean>;
/**
 * `M ⊨ φ` cuando φ se cumple en todos los estados iniciales.
 * Si `initial` está vacío, devuelve `true` por vacuidad (consistente con
 * la lectura "no hay contraejemplo en S0").
 */
export declare function satisfiesCTL(M: KripkeStructure, phi: CTLFormula): boolean;
//# sourceMappingURL=check.d.ts.map