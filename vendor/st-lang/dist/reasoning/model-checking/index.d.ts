export interface StateSpace<S> {
    /** Estados iniciales (≥1). */
    initial: S[];
    /** Sucesores inmediatos de un estado. Vacío = estado deadlock. */
    successors: (s: S) => S[];
    /** Proposiciones atómicas que hold en el estado. */
    labels: (s: S) => Set<string>;
    /** Igualdad estructural (en práctica raramente usada: hash es la fuente de verdad). */
    equals: (a: S, b: S) => boolean;
    /** Clave canónica del estado para visited set. */
    hash: (s: S) => string;
}
export interface ReachabilityResult<S> {
    /** Estados únicos alcanzados desde initial. */
    states: S[];
    /** Total de estados visitados (== states.length salvo cota). */
    explored: number;
    /** True si se cortó por `maxStates`. */
    truncated: boolean;
}
export interface SafetyResult<S> {
    safe: boolean;
    /** Traza desde algún initial hasta el violatingState (incluido). */
    trace?: S[];
    /** Estado donde la propiedad falló. */
    violatingState?: S;
}
export interface LivenessResult<S> {
    holds: boolean;
    /** Si `holds=false`: ciclo testigo del contraejemplo (stem→loop). */
    lasso?: {
        stem: S[];
        loop: S[];
    };
}
export interface DeadlockResult<S> {
    deadlocked: boolean;
    state?: S;
    /** Traza desde initial hasta el estado sin sucesores. */
    trace?: S[];
}
interface ReachabilityOpts {
    /** Tope duro de estados visitados. Default 100000. */
    maxStates?: number;
}
/**
 * Calcula el conjunto de estados alcanzables desde los estados
 * iniciales del espacio. BFS por nivel; se detiene al agotar la
 * frontera o al alcanzar `maxStates`.
 */
export declare function reachableStates<S>(space: StateSpace<S>, opts?: ReachabilityOpts): ReachabilityResult<S>;
/**
 * Verifica que `predicate` se cumple en *todos* los estados
 * alcanzables. Si encuentra un estado violador, devuelve una
 * traza mínima desde algún initial hasta él. Equivale a G p.
 */
export declare function checkSafety<S>(space: StateSpace<S>, predicate: (s: S) => boolean, opts?: ReachabilityOpts): SafetyResult<S>;
/** Alias semántico: invariante = safety check con el mismo predicado. */
export declare function checkInvariant<S>(space: StateSpace<S>, invariant: (s: S) => boolean, opts?: ReachabilityOpts): SafetyResult<S>;
/**
 * BMC: busca un estado donde `predicate` falla dentro de los
 * primeros `depth` pasos desde initial. No certifica safety
 * global; sirve para encontrar contraejemplos cortos.
 *
 * `depth=0` solo evalúa estados iniciales.
 */
export declare function bmc<S>(space: StateSpace<S>, predicate: (s: S) => boolean, depth: number): SafetyResult<S>;
/**
 * Detecta el primer estado alcanzable sin sucesores. Devuelve la
 * traza desde initial hasta ese estado para diagnóstico.
 */
export declare function hasDeadlock<S>(space: StateSpace<S>, opts?: ReachabilityOpts): DeadlockResult<S>;
/**
 * GF p: en todo camino infinito, p ocurre infinitas veces.
 * Contraejemplo: lasso accesible (stem + loop) tal que NINGÚN
 * estado del loop satisface p (porque entonces existe un camino
 * infinito que evita p eventualmente).
 *
 * Algoritmo: SCCs no-triviales accesibles desde initial; si alguna
 * NO contiene estado p=true → contraejemplo. Si todas las SCCs
 * no-triviales accesibles contienen al menos un estado p=true,
 * holds.
 */
export declare function checkAlwaysEventually<S>(space: StateSpace<S>, p: (s: S) => boolean, opts?: ReachabilityOpts): LivenessResult<S>;
/**
 * FG p: existe un punto a partir del cual p siempre holds.
 *
 * Holds sii: existe un lasso accesible cuyo loop está contenido
 * íntegramente en {s | p(s)}. Es decir, SCC no-trivial accesible
 * dentro del sub-grafo inducido por p=true.
 */
export declare function checkEventuallyAlways<S>(space: StateSpace<S>, p: (s: S) => boolean, opts?: ReachabilityOpts): LivenessResult<S>;
export type MutexProcState = 'idle' | 'waiting' | 'critical';
export interface MutexState {
    p1: MutexProcState;
    p2: MutexProcState;
    turn: 1 | 2;
}
export declare function mutualExclusionSpace(): StateSpace<MutexState>;
export type PhilState = 'thinking' | 'has_left' | 'eating';
export interface DiningState {
    phils: PhilState[];
    forks: boolean[];
}
export declare function diningPhilosophersSpace(n: number): StateSpace<DiningState>;
export interface RWState {
    readers: number;
    writer: boolean;
    maxReaders: number;
}
export declare function readerWriterSpace(numReaders: number): StateSpace<RWState>;
export {};
//# sourceMappingURL=index.d.ts.map