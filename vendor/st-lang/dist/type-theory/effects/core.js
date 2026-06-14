"use strict";
// ============================================================
// Algebraic effects — Constructores y combinadores del free monad
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.pure = pure;
exports.perform = perform;
exports.bind = bind;
exports.map = map;
exports.sequence = sequence;
exports.handle = handle;
exports.run = run;
/** Inyecta un valor puro en la mónada. */
function pure(value) {
    return { kind: 'pure', value };
}
/**
 * Construye una computación que ejecuta una operación `tag` con `input`
 * y entrega su resultado al consumidor. La continuación es la identidad:
 * "haz la operación y devuelve su salida".
 */
function perform(tag, input) {
    return {
        kind: 'impure',
        effect: { tag, input },
        // El runtime garantiza que `value` es `O`; lo elevamos a través del tipo.
        continuation: (value) => pure(value),
    };
}
/** Bind monádico (>>= en notación de Haskell). */
function bind(eff, fn) {
    if (eff.kind === 'pure')
        return fn(eff.value);
    // Componemos la continuación con `fn` para extender el árbol.
    const k = eff.continuation;
    return {
        kind: 'impure',
        effect: eff.effect,
        continuation: (value) => bind(k(value), fn),
    };
}
/** Alias funtorial: aplica una función pura al resultado. */
function map(eff, fn) {
    return bind(eff, (a) => pure(fn(a)));
}
/** Secuencia una lista de computaciones y colecta sus resultados. */
function sequence(effs) {
    return effs.reduce((acc, cur) => bind(acc, (xs) => bind(cur, (x) => pure([...xs, x]))), pure([]));
}
/**
 * Interpreta un efecto concreto. Recorre el árbol: las hojas `pure`
 * pasan tal cual; los nodos `impure` cuyo `tag` coincida con el
 * handler son delegados a `handle`; el resto se propaga.
 */
function handle(eff, handler) {
    if (eff.kind === 'pure')
        return pure(eff.value);
    if (eff.effect.tag === handler.effect) {
        return handler.handle(eff.effect.input, (value) => handle(eff.continuation(value), handler));
    }
    // Efecto distinto: reconstruimos el nodo dejando intacta su operación,
    // pero envolvemos recursivamente la continuación para que siga viendo
    // este handler aguas abajo.
    return {
        kind: 'impure',
        effect: eff.effect,
        continuation: (value) => handle(eff.continuation(value), handler),
    };
}
/**
 * Extrae el valor de una computación 100% pura. Lanza si quedan efectos
 * sin interpretar — útil tras componer todos los handlers.
 */
function run(eff) {
    if (eff.kind === 'pure')
        return eff.value;
    throw new Error(`[effects] efecto sin manejar: ${eff.effect.tag}`);
}
//# sourceMappingURL=core.js.map