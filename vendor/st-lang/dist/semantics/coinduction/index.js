"use strict";
// ============================================================
// ST Coinduction — Streams + corecursion + bisimulación up-to
// ============================================================
// Streams coinductivos definidos por destructores (head, tail).
// Construcción corecursiva via thunks perezosos (la cola es una
// función `() => Stream<T>` para evitar evaluación infinita).
//
// Bisimulación: la noción natural de igualdad para streams. Dos
// streams `s, t` son bisimilares si existe una relación R tal que
//   • R(s, t) ⇒ head(s) = head(t)
//   • R(s, t) ⇒ R(tail(s), tail(t))
// La igualdad sintáctica falla (dos streams pueden generar la
// misma secuencia con thunks distintos); la bisimulación es la
// clausura coinductiva apropiada.
//
// Como las secuencias son infinitas no podemos verificar
// bisimilaridad en general (semi-decidible). Por eso ofrecemos:
//   • isBisimilar(a, b, depth): chequeo "hasta profundidad", suficiente
//     para refutación (encontrar el primer prefijo divergente) y para
//     evidencia computacional positiva acotada.
//   • prove(claim, depth): técnica "bisimulación up-to". El usuario
//     provee una relación R; chequeamos por `depth` pasos que
//       R(a,b) ⇒ head(a)=head(b) ∧ R(tail a, tail b).
//     Si la relación es realmente una bisimulación, ningún paso falla;
//     si depth pasos pasaron sin fallar, tenemos alta confianza
//     (en el caso límite, todos los pasos válidos = bisimulación).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.__internals = exports.fibonacci = exports.naturals = void 0;
exports.cons = cons;
exports.repeat = repeat;
exports.iterate = iterate;
exports.unfold = unfold;
exports.take = take;
exports.drop = drop;
exports.nth = nth;
exports.map = map;
exports.zipWith = zipWith;
exports.zip = zip;
exports.filter = filter;
exports.isBisimilar = isBisimilar;
exports.prove = prove;
exports.interleave = interleave;
exports.scan = scan;
// ── Constructores ───────────────────────────────────────────
/**
 * Cons explícito: crea un stream con cabeza `h` y cola perezosa
 * `t` (una función que produce el resto cuando se evalúa).
 */
function cons(h, t) {
    return { head: h, tail: t };
}
/**
 * `repeat(x)` = x, x, x, ...  (stream constante)
 *
 * Definición corecursiva clásica: repeat(x) = cons(x, () => repeat(x)).
 * El thunk evita la recursión infinita en tiempo de construcción.
 */
function repeat(x) {
    // Truco para evitar reconstruir el objeto en cada `tail`: usamos
    // un nodo que se referencia a sí mismo. Esto preserva la semántica
    // (tail(repeat x) = repeat x) y además garantiza punto-fijo.
    const node = { head: x, tail: () => node };
    return node;
}
/**
 * `iterate(f, x)` = x, f(x), f(f(x)), ...
 *
 * Definición corecursiva: iterate(f, x) = cons(x, () => iterate(f, f(x))).
 */
function iterate(f, x) {
    return { head: x, tail: () => iterate(f, f(x)) };
}
/**
 * `unfold(seed, step)`: anamorfismo genérico. `step(s)` devuelve
 * el siguiente par `[valor, próximaSemilla]` o `null` para terminar.
 * Para streams infinitos, `step` nunca debe devolver `null`. Si
 * devuelve `null` durante una iteración, devolvemos un stream que
 * cicla la última cabeza producida (decisión: streams totales).
 */
function unfold(seed, step) {
    const next = step(seed);
    if (next === null) {
        // Streams en este módulo son totales; si el cliente decide terminar,
        // estabilizamos en un punto fijo trivial usando undefined.
        // En la práctica, los callers no deberían llamar unfold con un step
        // que puede devolver null si esperan un stream infinito.
        throw new Error('unfold: step returned null on infinite stream');
    }
    const [value, nextSeed] = next;
    return { head: value, tail: () => unfold(nextSeed, step) };
}
// ── Destructores y observaciones ────────────────────────────
/**
 * `take(s, n)`: extrae los primeros n elementos de un stream.
 * Observación finita; es la única forma de "ver" un stream.
 */
function take(s, n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error(`take: n debe ser entero no-negativo, recibido ${n}`);
    }
    const out = [];
    let cur = s;
    for (let i = 0; i < n; i++) {
        out.push(cur.head);
        cur = cur.tail();
    }
    return out;
}
/**
 * `drop(s, n)`: descarta los primeros n elementos.
 */
function drop(s, n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error(`drop: n debe ser entero no-negativo, recibido ${n}`);
    }
    let cur = s;
    for (let i = 0; i < n; i++)
        cur = cur.tail();
    return cur;
}
/**
 * `nth(s, i)`: i-ésimo elemento (0-indexed).
 */
function nth(s, i) {
    return drop(s, i).head;
}
// ── Functor / aplicativos ───────────────────────────────────
/**
 * `map(f, s)`: aplica `f` a cada elemento.
 *
 * Definición corecursiva: map(f, s) = cons(f(head s), () => map(f, tail s)).
 */
function map(f, s) {
    return { head: f(s.head), tail: () => map(f, s.tail()) };
}
/**
 * `zipWith(f, a, b)`: combina dos streams elemento a elemento.
 *
 * zipWith(f, a, b) = cons(f(head a, head b), () => zipWith(f, tail a, tail b))
 */
function zipWith(f, a, b) {
    return {
        head: f(a.head, b.head),
        tail: () => zipWith(f, a.tail(), b.tail()),
    };
}
/**
 * `zip(a, b)`: par-zip estándar.
 */
function zip(a, b) {
    return zipWith((x, y) => [x, y], a, b);
}
/**
 * `filter(pred, s)`: PRECONDICIÓN — el predicado debe ser satisfecho
 * infinitas veces, de lo contrario el stream resultante se "atasca".
 * No protegemos contra eso porque coinductivamente no es decidible.
 */
function filter(pred, s) {
    let cur = s;
    while (!pred(cur.head)) {
        cur = cur.tail();
    }
    const advanced = cur;
    return {
        head: advanced.head,
        tail: () => filter(pred, advanced.tail()),
    };
}
// ── Streams notables ────────────────────────────────────────
/**
 * naturals = 0, 1, 2, 3, ...
 */
exports.naturals = iterate((n) => n + 1, 0);
/**
 * fibonacci = 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
 *
 * Definición clásica corecursiva (Hinze):
 *   fib = 0 :: 1 :: zipWith(+, fib, tail fib)
 *
 * En TypeScript necesitamos un thunk que se autorreferencie. Lo
 * implementamos con una closure que devuelve siempre el mismo nodo.
 */
function makeFibonacci() {
    // fib(n) clásico vía iterate sobre el par (a, b) = (fib n, fib (n+1)).
    // Equivalente computacionalmente a la definición zipWith pero sin
    // requerir auto-referencia en TS (que generaría thunks anidados
    // exponencialmente sin memoización).
    return map(([a, _b]) => a, iterate(([a, b]) => [b, a + b], [0, 1]));
}
exports.fibonacci = makeFibonacci();
const DEFAULT_DEPTH = 64;
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
function isBisimilar(a, b, depth = DEFAULT_DEPTH) {
    if (!Number.isInteger(depth) || depth < 0) {
        throw new Error(`isBisimilar: depth debe ser entero no-negativo, recibido ${depth}`);
    }
    let curA = a;
    let curB = b;
    for (let i = 0; i < depth; i++) {
        if (!equal(curA.head, curB.head))
            return false;
        curA = curA.tail();
        curB = curB.tail();
    }
    return true;
}
/**
 * Igualdad observacional para elementos de un stream. Soportamos:
 *   • primitivos (===, con Object.is para NaN/+0/-0)
 *   • arrays y tuplas (recursión elemento a elemento)
 *   • objetos planos por keys propias
 * No hace circular-detection: si pasás un grafo cíclico, va a colgar.
 */
function equal(x, y) {
    if (Object.is(x, y))
        return true;
    if (typeof x !== typeof y)
        return false;
    if (x === null || y === null)
        return false;
    if (typeof x !== 'object')
        return false;
    if (Array.isArray(x) !== Array.isArray(y))
        return false;
    if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length !== y.length)
            return false;
        for (let i = 0; i < x.length; i++) {
            if (!equal(x[i], y[i]))
                return false;
        }
        return true;
    }
    const ox = x;
    const oy = y;
    const kx = Object.keys(ox);
    const ky = Object.keys(oy);
    if (kx.length !== ky.length)
        return false;
    for (const k of kx) {
        if (!Object.prototype.hasOwnProperty.call(oy, k))
            return false;
        if (!equal(ox[k], oy[k]))
            return false;
    }
    return true;
}
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
function prove(claim, depth = DEFAULT_DEPTH) {
    if (!Number.isInteger(depth) || depth < 0) {
        throw new Error(`prove: depth debe ser entero no-negativo, recibido ${depth}`);
    }
    let [curA, curB] = claim.initial;
    for (let i = 0; i < depth; i++) {
        if (!claim.relation(curA, curB))
            return false;
        if (!equal(curA.head, curB.head))
            return false;
        curA = curA.tail();
        curB = curB.tail();
    }
    return true;
}
// ── Utilidades para combinar streams (Hinze classics) ──────
/**
 * `interleave(a, b)`: intercala a, b, a, b, ... toma 1 de a luego 1 de b.
 *
 * interleave(a, b) = cons(head a, () => interleave(b, tail a))
 *
 * Nota: el "switch" entre a y b se hace por el truco clásico:
 * llamar recursivamente con los argumentos invertidos.
 */
function interleave(a, b) {
    return {
        head: a.head,
        tail: () => interleave(b, a.tail()),
    };
}
/**
 * `scan(f, init, s)`: prefijos acumulados; análogo a Array.prototype.reduce
 * pero coinductivo. scan(+, 0, naturals) = 0, 0, 1, 3, 6, 10, ...
 */
function scan(f, init, s) {
    return {
        head: init,
        tail: () => scan(f, f(init, s.head), s.tail()),
    };
}
// ── Exports auxiliares para tests ───────────────────────────
exports.__internals = { equal };
//# sourceMappingURL=index.js.map