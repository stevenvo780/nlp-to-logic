import type { MuFormula } from './types';
/**
 * Verifica que una fórmula sea sintácticamente bien formada:
 *  - Cerrada (sin variables libres).
 *  - Positiva en cada variable ligada (paridad par de negaciones).
 *  - Sin shadowing nocivo: rebindings ocultan al outer, lo cual es
 *    legal pero detectable. Aquí lo permitimos.
 */
export declare function isWellFormed(phi: MuFormula): boolean;
/** Variables libres del término. */
export declare function freeVars(phi: MuFormula): Set<string>;
/** Una fórmula es cerrada cuando no tiene variables libres. */
export declare function isClosed(phi: MuFormula): boolean;
/**
 * Una fórmula es positiva cuando toda `var X` ligada por un μ/ν
 * aparece bajo un número par de negaciones desde su binder.
 *
 * Implementación: caminamos el AST con un map `binder → paridad`
 * (0 = par, 1 = impar) que se actualiza al cruzar un `not`. Cuando
 * vemos `var X`, miramos su binder más cercano y verificamos que
 * su paridad relativa sea par.
 */
export declare function isPositive(phi: MuFormula): boolean;
/**
 * Profundidad de alternancia μ/ν. Métrica clásica:
 *   ad(p) = ad(X) = 0
 *   ad(¬φ) = ad(◇φ) = ad(□φ) = ad(φ)
 *   ad(φ ∧ ψ) = ad(φ ∨ ψ) = max(ad(φ), ad(ψ))
 *   ad(μX. φ) = max(1, ad(φ), 1 + maxNuAlt(φ))
 *   ad(νX. φ) = max(1, ad(φ), 1 + maxMuAlt(φ))
 * donde `maxNuAlt(φ)` es la profundidad considerando solo subfórmulas
 * con binder ν cuyo cuerpo menciona la variable ligada externamente,
 * y simétrico para μ.
 *
 * Aquí usamos la versión simplificada y muy usada en práctica
 * (Cleaveland/Steffen): contar el cambio de tipo de binder en el
 * camino sintáctico raíz→hoja.
 */
export declare function alternationDepth(phi: MuFormula): number;
//# sourceMappingURL=wellformed.d.ts.map