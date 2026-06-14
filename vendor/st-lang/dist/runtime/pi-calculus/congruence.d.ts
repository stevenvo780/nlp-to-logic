import type { PiProcess } from './types';
/**
 * Decide si dos procesos son estructuralmente congruentes (módulo los
 * axiomas listados arriba + α-equivalencia).
 *
 * Cobertura intencional:
 *   - Conmutatividad/asociatividad/nil de | y +.
 *   - Renaming de binders.
 *   - `(νc) 0 ≡ 0`.
 * Cobertura intencionalmente limitada (excede el scope mínimo del runtime):
 *   - Scope extrusion `(νc)(P|Q) ≡ P | (νc) Q`.
 *   - Unfold de replicación.
 */
export declare function structuralCongruence(a: PiProcess, b: PiProcess): boolean;
//# sourceMappingURL=congruence.d.ts.map