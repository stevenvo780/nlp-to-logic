import type { Event, Process } from './types';
/** The deadlocked process: offers no events and never terminates. */
export declare const STOP: Process;
/** The successfully terminated process: offers only the tick event `✓`. */
export declare const SKIP: Process;
/** Creates a prefixed process `event → cont`. */
export declare function prefix(event: Event, cont: Process): Process;
/** Creates an external (deterministic) choice `left □ right`. */
export declare function choice(left: Process, right: Process): Process;
/** Creates an internal (non-deterministic) choice `left ⊓ right`. */
export declare function internal(left: Process, right: Process): Process;
/** Creates a parallel composition synchronized on the given `alphabet`. */
export declare function parallel(left: Process, right: Process, alphabet: Event[]): Process;
/** Creates an interleaving composition (synchronized only on `✓`). */
export declare function interleave(left: Process, right: Process): Process;
/** Creates a sequential composition: `right` starts after `left` terminates. */
export declare function sequence(left: Process, right: Process): Process;
/** Creates a hiding operator that conceals `events` from the environment. */
export declare function hide(process: Process, events: Event[]): Process;
/** Creates a renaming operator that maps events according to `mapping`. */
export declare function rename(process: Process, mapping: Map<Event, Event>): Process;
/** Creates a recursive process `μname.body`. */
export declare function recursion(name: string, body: Process): Process;
/** Creates a process variable reference (for use inside `recursion` bodies). */
export declare function processVar(name: string): Process;
/**
 * Conjunto de eventos visibles mencionados sintácticamente en `p`.
 * Los eventos renombrados aportan tanto la fuente como el destino
 * (la fuente puede aparecer en una rama no recorrida, y el destino
 * es lo que el entorno observa).
 */
export declare function alphabet(p: Process): Set<Event>;
/**
 * Eventos visibles que `p` puede ofrecer inmediatamente como su primer
 * evento (tomando todas las resoluciones internas). No incluye τ (los
 * eventos ocultos son silenciosos por construcción).
 *
 * Para `SKIP` reportamos el tick `✓` — termina exitosamente.
 */
export declare function nextEvents(p: Process): Set<Event>;
/**
 * `step(P, a)` aplica una transición visible etiquetada con `a` y devuelve
 * el continuante, o `null` si `a` no está habilitado. Para procesos no-
 * deterministas elegimos arbitrariamente cualquier rama que habilite `a`
 * (eso es válido para análisis de trazas; para failures inspeccionamos
 * todas las resoluciones aparte).
 */
export declare function step(p: Process, event: Event): Process | null;
/**
 * Enumera todos los estados "estables" alcanzables desde `p` resolviendo
 * elecciones internas (`⊓`) y desplegando recursiones inmediatas, sin
 * consumir eventos visibles. Útil para la semántica de failures, donde
 * el conjunto de refusal depende de QUÉ rama interna se eligió.
 *
 * Devuelve procesos sin un `internal` en la raíz (después de empujarlo
 * hacia adentro de operadores asociativos cuando aplica). El número de
 * resoluciones es 2^(# de internals encadenados), así que limitamos a un
 * número razonable para no explotar.
 */
export declare function internalResolutions(p: Process, limit?: number): Process[];
//# sourceMappingURL=semantics.d.ts.map