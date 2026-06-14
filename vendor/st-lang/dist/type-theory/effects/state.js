"use strict";
// ============================================================
// Effect: State<S>
// ============================================================
//
// Dos operaciones canónicas:
//   - State.get  : ()  → S      (lee el estado actual)
//   - State.put  : S   → undefined (sobrescribe el estado)
//
// `modify` se deriva como get >>= (s -> put (fn s)).
//
// Dos formas de interpretar:
//   - `runState`        : intérprete terminal. Devuelve {result, state}.
//                         Útil cuando State es el único efecto.
//   - `handleState`     : intérprete componible. Transforma
//                         Eff<State<S> | R, A> en Eff<R, [A, S]>.
//                         Útil para stack de efectos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE_PUT = exports.STATE_GET = void 0;
exports.getState = getState;
exports.putState = putState;
exports.modify = modify;
exports.handleState = handleState;
exports.runState = runState;
const core_1 = require("./core");
exports.STATE_GET = 'State.get';
exports.STATE_PUT = 'State.put';
/** Lee el estado actual. */
function getState() {
    return (0, core_1.perform)(exports.STATE_GET, undefined);
}
/** Sobrescribe el estado completo. */
function putState(s) {
    return (0, core_1.perform)(exports.STATE_PUT, s);
}
/** Modifica el estado aplicando una función pura. */
function modify(fn) {
    return (0, core_1.bind)(getState(), (s) => putState(fn(s)));
}
/**
 * Intérprete componible. Reescribe `State.get`/`State.put` en términos
 * de un acumulador transportado por la continuación, dejando otros
 * efectos intactos en la salida.
 */
function handleState(eff, initial) {
    // Helper recursivo: dado un estado actual, reescribe el árbol.
    function go(node, current) {
        if (node.kind === 'pure')
            return (0, core_1.pure)({ result: node.value, state: current });
        const op = node.effect;
        if (op.tag === exports.STATE_GET) {
            return go(node.continuation(current), current);
        }
        if (op.tag === exports.STATE_PUT) {
            const next = op.input;
            return go(node.continuation(undefined), next);
        }
        // Otro efecto: lo dejamos pasar, propagando el estado en la cont.
        return {
            kind: 'impure',
            effect: op,
            continuation: (value) => go(node.continuation(value), current),
        };
    }
    return go(eff, initial);
}
/**
 * Intérprete terminal: ejecuta el cómputo asumiendo que sólo tiene
 * efectos State. Devuelve `{ result, state }`. Lanza si encuentra
 * otra operación sin manejar.
 */
function runState(eff, initial) {
    let current = initial;
    let node = eff;
    for (;;) {
        if (node.kind === 'pure')
            return { result: node.value, state: current };
        const op = node.effect;
        if (op.tag === exports.STATE_GET) {
            node = node.continuation(current);
            continue;
        }
        if (op.tag === exports.STATE_PUT) {
            current = op.input;
            node = node.continuation(undefined);
            continue;
        }
        throw new Error(`[runState] efecto no soportado: ${op.tag}`);
    }
}
//# sourceMappingURL=state.js.map