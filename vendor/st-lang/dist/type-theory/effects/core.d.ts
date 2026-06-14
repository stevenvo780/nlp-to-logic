import type { Eff, Effect, Handler } from './types';
/** Inyecta un valor puro en la mónada. */
export declare function pure<A>(value: A): Eff<never, A>;
/**
 * Construye una computación que ejecuta una operación `tag` con `input`
 * y entrega su resultado al consumidor. La continuación es la identidad:
 * "haz la operación y devuelve su salida".
 */
export declare function perform<EName extends string, I, O>(tag: EName, input: I): Eff<Effect<EName, I, O>, O>;
/** Bind monádico (>>= en notación de Haskell). */
export declare function bind<E, A, B>(eff: Eff<E, A>, fn: (a: A) => Eff<E, B>): Eff<E, B>;
/** Alias funtorial: aplica una función pura al resultado. */
export declare function map<E, A, B>(eff: Eff<E, A>, fn: (a: A) => B): Eff<E, B>;
/** Secuencia una lista de computaciones y colecta sus resultados. */
export declare function sequence<E, A>(effs: ReadonlyArray<Eff<E, A>>): Eff<E, A[]>;
/**
 * Interpreta un efecto concreto. Recorre el árbol: las hojas `pure`
 * pasan tal cual; los nodos `impure` cuyo `tag` coincida con el
 * handler son delegados a `handle`; el resto se propaga.
 */
export declare function handle<E1, E2, A>(eff: Eff<E1, A>, handler: Handler<string, unknown, unknown, E2, A>): Eff<E2, A>;
/**
 * Extrae el valor de una computación 100% pura. Lanza si quedan efectos
 * sin interpretar — útil tras componer todos los handlers.
 */
export declare function run<A>(eff: Eff<never, A>): A;
//# sourceMappingURL=core.d.ts.map