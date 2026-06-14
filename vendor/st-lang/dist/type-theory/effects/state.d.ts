import type { Eff, Effect } from './types';
export declare const STATE_GET: "State.get";
export declare const STATE_PUT: "State.put";
export type StateGet<S> = Effect<typeof STATE_GET, void, S>;
export type StatePut<S> = Effect<typeof STATE_PUT, S, undefined>;
export type State<S> = StateGet<S> | StatePut<S>;
/** Lee el estado actual. */
export declare function getState<S>(): Eff<StateGet<S>, S>;
/** Sobrescribe el estado completo. */
export declare function putState<S>(s: S): Eff<StatePut<S>, undefined>;
/** Modifica el estado aplicando una función pura. */
export declare function modify<S>(fn: (s: S) => S): Eff<State<S>, undefined>;
/**
 * Intérprete componible. Reescribe `State.get`/`State.put` en términos
 * de un acumulador transportado por la continuación, dejando otros
 * efectos intactos en la salida.
 */
export declare function handleState<R, S, A>(eff: Eff<unknown, A>, initial: S): Eff<R, {
    result: A;
    state: S;
}>;
/**
 * Intérprete terminal: ejecuta el cómputo asumiendo que sólo tiene
 * efectos State. Devuelve `{ result, state }`. Lanza si encuentra
 * otra operación sin manejar.
 */
export declare function runState<S, A>(eff: Eff<unknown, A>, initial: S): {
    result: A;
    state: S;
};
//# sourceMappingURL=state.d.ts.map