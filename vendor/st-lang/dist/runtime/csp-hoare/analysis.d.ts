import type { FailurePair, Process, Trace } from './types';
/**
 * Enumera todas las trazas de `p` hasta longitud `maxLength` (inclusive).
 * Incluye la traza vacía (siempre presente) y los prefijos intermedios.
 *
 * Las trazas se devuelven sin duplicados, ordenadas por longitud
 * ascendente, y como copias de arrays inmutables (las modificaciones no
 * afectan el motor).
 */
export declare function traces(p: Process, maxLength?: number): Trace[];
/**
 * Calcula failures hasta `maxLength`. Para cada traza alcanzable, registra
 * los refusal sets posibles iterando todas las resoluciones internas del
 * estado tras la traza.
 *
 * Devuelve una lista (no un set) porque los refusal sets son objetos —
 * agrupamos por igualdad estructural y deduplicamos manualmente.
 */
export declare function failures(p: Process, maxLength?: number): FailurePair[];
/**
 * Hay deadlock si el proceso no ofrece NINGÚN evento (ni siquiera ✓) en
 * ALGUNA resolución interna alcanzable desde el estado inicial.
 *
 * En `STOP` el chequeo es trivial: `nextEvents(STOP) = ∅`.
 */
export declare function isDeadlocked(p: Process): boolean;
/**
 * Detección heurística de livelock: el proceso recorre eventos ocultos
 * (τ) indefinidamente sin avanzar visiblemente. Implementación: chequea
 * si la profundidad de despliegues internos excede `depth` sin ofrecer
 * eventos visibles.
 *
 * No es decisión: usamos límite acotado. Útil para advertir sobre `μX.X`
 * o `(a → STOP) \ {a}` con loop.
 */
export declare function isLiveLocked(p: Process, depth?: number): boolean;
/**
 * P ⊑_T Q : Q refina a P en trazas sii cada traza de Q es traza de P.
 * Equivalentemente: Q no puede hacer nada que P no pudiera observar.
 */
export declare function refinesTraces(spec: Process, impl: Process, maxLength?: number): boolean;
/**
 * P ⊑_F Q : refinamiento en failures. Q refina a P sii:
 *   (a) traces(Q) ⊆ traces(P)
 *   (b) failures(Q) ⊆ failures(P)
 *
 * Una falla `(t, R)` de Q debe poder ser exhibida también por P. Esto
 * capta el principio de que Q es "menos no-determinista" que P.
 */
export declare function refinesFailures(spec: Process, impl: Process, maxLength?: number): boolean;
//# sourceMappingURL=analysis.d.ts.map