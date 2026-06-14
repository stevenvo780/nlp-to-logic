import type { Eff, Effect, ExceptionResult } from './types';
export declare const EXCEPTION_THROW: "Exception.throw";
export type ExceptionThrow<E> = Effect<typeof EXCEPTION_THROW, E, never>;
export type Exception<E> = ExceptionThrow<E>;
/** Lanza una excepción algebraica. La continuación se descarta. */
export declare function throw_<E>(error: E): Eff<ExceptionThrow<E>, never>;
/**
 * Intérprete componible. Si el cómputo lanza, corta el árbol y emite
 * `{ kind: 'error', error }`. Si finaliza puro, emite `{ kind: 'ok', value }`.
 * Otros efectos se propagan tal cual.
 */
export declare function handleException<R, E, A>(eff: Eff<unknown, A>): Eff<R, ExceptionResult<E, A>>;
/**
 * Intérprete terminal: ejecuta el cómputo y captura una eventual
 * excepción. Lanza si encuentra otra operación sin manejar.
 */
export declare function runException<E, A>(eff: Eff<unknown, A>): ExceptionResult<E, A>;
//# sourceMappingURL=exception.d.ts.map