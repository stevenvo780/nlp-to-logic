/** Firma de un efecto algebraico: nombre, payload, resultado esperado. */
export type Effect<Name extends string, In, Out> = {
    readonly tag: Name;
    readonly input: In;
    /** Phantom: usado sólo a nivel de tipos para inferir la respuesta. */
    readonly output: Out;
};
/** Operación cruda almacenada en un nodo `impure`. */
export interface Operation {
    readonly tag: string;
    readonly input: unknown;
}
/** Computación con efectos `E` y resultado `A`. */
export type Eff<E, A> = {
    readonly kind: 'pure';
    readonly value: A;
} | {
    readonly kind: 'impure';
    readonly effect: Operation;
    readonly continuation: (value: never) => Eff<E, A>;
};
/**
 * Handler de un efecto concreto. Recibe el input crudo y una
 * continuación que, dado el resultado de la operación, produce el
 * resto del cómputo. Devuelve un cómputo (posiblemente con otros
 * efectos `R`) y resultado final `A`.
 */
export interface Handler<EName extends string, I, O, R, A> {
    readonly effect: EName;
    readonly handle: (input: I, continuation: (value: O) => Eff<R, A>) => Eff<R, A>;
}
/** Monoide para `runWriter`. */
export interface Monoid<W> {
    readonly empty: W;
    readonly combine: (a: W, b: W) => W;
}
/** Resultado de `runException`. */
export type ExceptionResult<E, A> = {
    kind: 'ok';
    value: A;
} | {
    kind: 'error';
    error: E;
};
//# sourceMappingURL=types.d.ts.map