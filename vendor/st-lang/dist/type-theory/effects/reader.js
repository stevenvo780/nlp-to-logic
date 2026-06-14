"use strict";
// ============================================================
// Effect: Reader<R>
// ============================================================
//
// Una sola operación:
//   - Reader.ask : () → R
Object.defineProperty(exports, "__esModule", { value: true });
exports.READER_ASK = void 0;
exports.ask = ask;
exports.asks = asks;
exports.handleReader = handleReader;
exports.runReader = runReader;
const core_1 = require("./core");
exports.READER_ASK = 'Reader.ask';
/** Lee el ambiente del Reader. */
function ask() {
    return (0, core_1.perform)(exports.READER_ASK, undefined);
}
/** Lee el ambiente y aplica una proyección. */
function asks(fn) {
    return (0, core_1.bind)(ask(), (r) => (0, core_1.pure)(fn(r)));
}
/**
 * Intérprete componible. Reescribe `Reader.ask` proyectando el `env`
 * fijo y deja otros efectos intactos.
 */
function handleReader(eff, env) {
    function go(node) {
        if (node.kind === 'pure')
            return (0, core_1.pure)(node.value);
        const op = node.effect;
        if (op.tag === exports.READER_ASK) {
            return go(node.continuation(env));
        }
        return {
            kind: 'impure',
            effect: op,
            continuation: (value) => go(node.continuation(value)),
        };
    }
    return go(eff);
}
/**
 * Intérprete terminal: ejecuta el cómputo con un ambiente fijo.
 * Cualquier `Reader.ask` recibe el mismo `env`. Lanza si encuentra
 * otra operación sin manejar.
 */
function runReader(eff, env) {
    let node = eff;
    for (;;) {
        if (node.kind === 'pure')
            return node.value;
        const op = node.effect;
        if (op.tag === exports.READER_ASK) {
            node = node.continuation(env);
            continue;
        }
        throw new Error(`[runReader] efecto no soportado: ${op.tag}`);
    }
}
//# sourceMappingURL=reader.js.map