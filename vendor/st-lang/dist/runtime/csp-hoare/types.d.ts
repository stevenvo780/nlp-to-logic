export type Event = string;
export type Process = {
    kind: 'stop';
} | {
    kind: 'skip';
} | {
    kind: 'prefix';
    event: Event;
    cont: Process;
} | {
    kind: 'choice';
    left: Process;
    right: Process;
} | {
    kind: 'internal';
    left: Process;
    right: Process;
} | {
    kind: 'parallel';
    left: Process;
    right: Process;
    alphabet: Event[];
} | {
    kind: 'interleave';
    left: Process;
    right: Process;
} | {
    kind: 'sequence';
    left: Process;
    right: Process;
} | {
    kind: 'hide';
    process: Process;
    events: Event[];
} | {
    kind: 'rename';
    process: Process;
    mapping: Map<Event, Event>;
} | {
    kind: 'recursion';
    name: string;
    body: Process;
} | {
    kind: 'var';
    name: string;
};
/** Una traza es una secuencia finita de eventos visibles observados. */
export type Trace = Event[];
/**
 * Failure (failures-semantics): la traza `trace` es observable y, tras ella,
 * el proceso PUEDE rehusar cualquier subconjunto de `refusal` (en alguna
 * resolución del no-determinismo interno).
 */
export interface FailurePair {
    trace: Trace;
    refusal: Set<Event>;
}
/** Evento especial que marca la terminación exitosa (✓ / "tick"). */
export declare const TICK: Event;
//# sourceMappingURL=types.d.ts.map