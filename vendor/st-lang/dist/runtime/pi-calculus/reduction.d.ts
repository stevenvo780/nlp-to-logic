import type { PiProcess } from './types';
/**
 * Devuelve todos los procesos sucesores tras un paso de reducción.
 *
 * Implementa la regla COMM atravesando new (canales restringidos pueden
 * comunicar internamente: scope extrusion básica intra-scope) y desplegando
 * replicaciones lazy. Match se evalúa al pasar.
 *
 * Si el resultado es vacío, no hay comunicación posible (deadlock o
 * proceso terminal).
 */
export declare function reduce(p: PiProcess): PiProcess[];
/**
 * `isDeadlocked(p)`: `true` si no hay ninguna reducción posible.
 * Incluye procesos terminales (`0`, `0 | 0`, etc.) y procesos con
 * prefijos que no pueden sincronizar por incompatibilidad de canales.
 */
export declare function isDeadlocked(p: PiProcess): boolean;
/**
 * `trace(p, maxSteps)`: explora una traza determinista (elige el
 * primer sucesor en cada paso). Útil para inspección, no pretende ser
 * una semántica completa. Se detiene en deadlock o tras `maxSteps`.
 */
export declare function trace(p: PiProcess, maxSteps?: number): PiProcess[];
//# sourceMappingURL=reduction.d.ts.map