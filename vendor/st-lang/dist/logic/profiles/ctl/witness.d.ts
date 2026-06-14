import type { CTLFormula, KripkeStructure } from './types';
/**
 * Encuentra un camino testigo finito (`stateId[]`) que justifique
 * que `phi` se cumple en `state`. Devuelve `null` si:
 *  - `phi` no se cumple en `state`, o
 *  - `phi` es universal (AX/AF/AG/AU) — no admite un único witness path, o
 *  - `state` no existe en el modelo.
 *
 * Convenciones del path devuelto:
 *  - EX φ        → `[state, next]` con `next ⊨ φ`.
 *  - EF φ        → camino más corto desde `state` hasta un estado con `φ`.
 *  - EG φ        → camino que entra en un ciclo de estados con `φ`;
 *                  el último elemento del camino aparece dos veces para
 *                  marcar el lazo (lasso witness).
 *  - E[A U B]    → camino donde todos los intermedios cumplen A y el
 *                  último cumple B.
 *  - cualquier otro operador no existencial → `null`.
 */
export declare function generateWitness(M: KripkeStructure, phi: CTLFormula, state: string): string[] | null;
//# sourceMappingURL=witness.d.ts.map