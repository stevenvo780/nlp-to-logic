import type { Eff, Effect } from './types';
export declare const READER_ASK: "Reader.ask";
export type ReaderAsk<R> = Effect<typeof READER_ASK, void, R>;
export type Reader<R> = ReaderAsk<R>;
/** Lee el ambiente del Reader. */
export declare function ask<R>(): Eff<ReaderAsk<R>, R>;
/** Lee el ambiente y aplica una proyección. */
export declare function asks<R, A>(fn: (r: R) => A): Eff<ReaderAsk<R>, A>;
/**
 * Intérprete componible. Reescribe `Reader.ask` proyectando el `env`
 * fijo y deja otros efectos intactos.
 */
export declare function handleReader<R, A, Env>(eff: Eff<unknown, A>, env: Env): Eff<R, A>;
/**
 * Intérprete terminal: ejecuta el cómputo con un ambiente fijo.
 * Cualquier `Reader.ask` recibe el mismo `env`. Lanza si encuentra
 * otra operación sin manejar.
 */
export declare function runReader<R, A>(eff: Eff<unknown, A>, env: R): A;
//# sourceMappingURL=reader.d.ts.map