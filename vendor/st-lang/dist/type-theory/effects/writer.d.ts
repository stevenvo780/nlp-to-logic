import type { Eff, Effect, Monoid } from './types';
export declare const WRITER_TELL: "Writer.tell";
export type WriterTell<W> = Effect<typeof WRITER_TELL, W, undefined>;
export type Writer<W> = WriterTell<W>;
/** Acumula un mensaje en el log. */
export declare function tell<W>(w: W): Eff<WriterTell<W>, undefined>;
/**
 * Intérprete componible. Acumula los `tell` con el monoide y deja
 * otros efectos intactos.
 */
export declare function handleWriter<R, W, A>(eff: Eff<unknown, A>, monoid: Monoid<W>): Eff<R, {
    result: A;
    log: W;
}>;
/**
 * Intérprete terminal: ejecuta combinando todos los `tell` con el
 * monoide dado. Devuelve `{ result, log }`. Lanza si encuentra otra
 * operación sin manejar.
 */
export declare function runWriter<W, A>(eff: Eff<unknown, A>, monoid: Monoid<W>): {
    result: A;
    log: W;
};
/** Monoide concatenación de listas. */
export declare function listMonoid<W>(): Monoid<W[]>;
/** Monoide concatenación de strings. */
export declare const stringMonoid: Monoid<string>;
/** Monoide aditivo sobre números. */
export declare const sumMonoid: Monoid<number>;
//# sourceMappingURL=writer.d.ts.map