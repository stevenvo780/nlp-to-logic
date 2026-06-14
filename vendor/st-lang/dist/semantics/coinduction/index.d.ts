export interface Stream<T> {
    head: T;
    tail: () => Stream<T>;
}
/**
 * Cons explícito: crea un stream con cabeza `h` y cola perezosa
 * `t` (una función que produce el resto cuando se evalúa).
 */
export declare function cons<T>(h: T, t: () => Stream<T>): Stream<T>;
/**
 * `repeat(x)` = x, x, x, ...  (stream constante)
 *
 * Definición corecursiva clásica: repeat(x) = cons(x, () => repeat(x)).
 * El thunk evita la recursión infinita en tiempo de construcción.
 */
export declare function repeat<T>(x: T): Stream<T>;
/**
 * `iterate(f, x)` = x, f(x), f(f(x)), ...
 *
 * Definición corecursiva: iterate(f, x) = cons(x, () => iterate(f, f(x))).
 */
export declare function iterate<T>(f: (x: T) => T, x: T): Stream<T>;
/**
 * `unfold(seed, step)`: anamorfismo genérico. `step(s)` devuelve
 * el siguiente par `[valor, próximaSemilla]` o `null` para terminar.
 * Para streams infinitos, `step` nunca debe devolver `null`. Si
 * devuelve `null` durante una iteración, devolvemos un stream que
 * cicla la última cabeza producida (decisión: streams totales).
 */
export declare function unfold<S, T>(seed: S, step: (s: S) => readonly [T, S] | null): Stream<T>;
/**
 * `take(s, n)`: extrae los primeros n elementos de un stream.
 * Observación finita; es la única forma de "ver" un stream.
 */
export declare function take<T>(s: Stream<T>, n: number): T[];
/**
 * `drop(s, n)`: descarta los primeros n elementos.
 */
export declare function drop<T>(s: Stream<T>, n: number): Stream<T>;
/**
 * `nth(s, i)`: i-ésimo elemento (0-indexed).
 */
export declare function nth<T>(s: Stream<T>, i: number): T;
/**
 * `map(f, s)`: aplica `f` a cada elemento.
 *
 * Definición corecursiva: map(f, s) = cons(f(head s), () => map(f, tail s)).
 */
export declare function map<T, U>(f: (x: T) => U, s: Stream<T>): Stream<U>;
/**
 * `zipWith(f, a, b)`: combina dos streams elemento a elemento.
 *
 * zipWith(f, a, b) = cons(f(head a, head b), () => zipWith(f, tail a, tail b))
 */
export declare function zipWith<A, B, C>(f: (a: A, b: B) => C, a: Stream<A>, b: Stream<B>): Stream<C>;
/**
 * `zip(a, b)`: par-zip estándar.
 */
export declare function zip<A, B>(a: Stream<A>, b: Stream<B>): Stream<[A, B]>;
/**
 * `filter(pred, s)`: PRECONDICIÓN — el predicado debe ser satisfecho
 * infinitas veces, de lo contrario el stream resultante se "atasca".
 * No protegemos contra eso porque coinductivamente no es decidible.
 */
export declare function filter<T>(pred: (x: T) => boolean, s: Stream<T>): Stream<T>;
/**
 * naturals = 0, 1, 2, 3, ...
 */
export declare const naturals: Stream<number>;
export declare const fibonacci: Stream<number>;
export interface BisimulationProof<T> {
    /** Par inicial cuyo membership en la bisimulación queremos probar. */
    initial: [Stream<T>, Stream<T>];
    /**
     * Relación candidata R. Por bisimulación, basta que R sea una
     * "bisimulación up-to": cerrada bajo los destructores en el sentido
     * de que R(s,t) ⇒ R(tail s, tail t).
     */
    relation: (a: Stream<T>, b: Stream<T>) => boolean;
}
/**
 * `isBisimilar(a, b, depth)`: chequeo de bisimilaridad acotado.
 * Compara cabezas hasta profundidad `depth`. Retorna `false` apenas
 * encuentra una divergencia (refutación constructiva); retorna `true`
 * si los primeros `depth` elementos coinciden (evidencia positiva
 * acotada — para una prueba real de bisimilaridad, usar `prove`).
 *
 * Usa `Object.is` para comparar primitivos. Para tipos compuestos
 * el caller debería envolver con un equality explícito (no hacemos
 * deep-equals porque tendría costo no obvio y semántica ambigua).
 */
export declare function isBisimilar<T>(a: Stream<T>, b: Stream<T>, depth?: number): boolean;
/**
 * Igualdad observacional para elementos de un stream. Soportamos:
 *   • primitivos (===, con Object.is para NaN/+0/-0)
 *   • arrays y tuplas (recursión elemento a elemento)
 *   • objetos planos por keys propias
 * No hace circular-detection: si pasás un grafo cíclico, va a colgar.
 */
declare function equal(x: unknown, y: unknown): boolean;
/**
 * `prove(claim, depth)`: aplica la técnica de bisimulación up-to.
 *
 * Algoritmo: empieza con el par inicial, y para cada paso i ∈ [0, depth):
 *   1. Verifica que la relación R sostenga el par actual (a_i, b_i).
 *   2. Verifica que las cabezas sean iguales: head(a_i) = head(b_i).
 *   3. Avanza: a_{i+1} = tail(a_i), b_{i+1} = tail(b_i).
 *
 * Si la relación R es genuinamente una bisimulación (clausurada bajo
 * tail), todos los pasos pasarán para cualquier `depth`. El método
 * es completo "en el límite": probar para `depth = ∞` ≡ probar bisim.
 * En la práctica devolvemos true si depth pasos pasaron sin error.
 *
 * Si la relación falla en algún paso, retornamos false (evidencia de
 * que R no es una bisimulación, o de que (a, b) no es bisimilar).
 */
export declare function prove<T>(claim: BisimulationProof<T>, depth?: number): boolean;
/**
 * `interleave(a, b)`: intercala a, b, a, b, ... toma 1 de a luego 1 de b.
 *
 * interleave(a, b) = cons(head a, () => interleave(b, tail a))
 *
 * Nota: el "switch" entre a y b se hace por el truco clásico:
 * llamar recursivamente con los argumentos invertidos.
 */
export declare function interleave<T>(a: Stream<T>, b: Stream<T>): Stream<T>;
/**
 * `scan(f, init, s)`: prefijos acumulados; análogo a Array.prototype.reduce
 * pero coinductivo. scan(+, 0, naturals) = 0, 0, 1, 3, 6, 10, ...
 */
export declare function scan<T, U>(f: (acc: U, x: T) => U, init: U, s: Stream<T>): Stream<U>;
export declare const __internals: {
    equal: typeof equal;
};
export {};
//# sourceMappingURL=index.d.ts.map