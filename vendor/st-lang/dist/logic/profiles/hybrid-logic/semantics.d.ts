import type { HybridFormula, HybridFrame } from './types';
/**
 * Verdad relativa a un mundo.
 *
 * - `atom` consulta la valuación.
 * - `nominal` es verdadero en w sii la asignación combinada lo manda a w.
 * - `box`/`diamond` cuantifican sobre R-sucesores.
 * - `@i φ` saltamos al mundo nombrado por i (ignora el mundo actual).
 * - `↓i. φ` extiende env con i := w y evalúa φ en w.
 * - `∃i. φ` busca algún mundo w' tal que con i := w' la fórmula
 *   se satisfaga en el mundo actual (¡el "punto de evaluación" no
 *   cambia con ∃; sólo se introduce un nombre nuevo).
 */
export declare function satisfies(frame: HybridFrame, world: string, phi: HybridFormula, env?: Record<string, string>): boolean;
/**
 * Verdad global: ∃w ∈ W. M, w ⊨ φ.
 * Útil para chequear satisfacibilidad sobre un frame concreto.
 */
export declare function isSatisfiableInFrame(frame: HybridFrame, phi: HybridFormula): string | undefined;
//# sourceMappingURL=semantics.d.ts.map