"use strict";
// ============================================================
// Effect: Writer<W>
// ============================================================
//
// Una sola operación:
//   - Writer.tell : W → undefined
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumMonoid = exports.stringMonoid = exports.WRITER_TELL = void 0;
exports.tell = tell;
exports.handleWriter = handleWriter;
exports.runWriter = runWriter;
exports.listMonoid = listMonoid;
const core_1 = require("./core");
exports.WRITER_TELL = 'Writer.tell';
/** Acumula un mensaje en el log. */
function tell(w) {
    return (0, core_1.perform)(exports.WRITER_TELL, w);
}
/**
 * Intérprete componible. Acumula los `tell` con el monoide y deja
 * otros efectos intactos.
 */
function handleWriter(eff, monoid) {
    function go(node, log) {
        if (node.kind === 'pure')
            return (0, core_1.pure)({ result: node.value, log });
        const op = node.effect;
        if (op.tag === exports.WRITER_TELL) {
            const next = monoid.combine(log, op.input);
            return go(node.continuation(undefined), next);
        }
        return {
            kind: 'impure',
            effect: op,
            continuation: (value) => go(node.continuation(value), log),
        };
    }
    return go(eff, monoid.empty);
}
/**
 * Intérprete terminal: ejecuta combinando todos los `tell` con el
 * monoide dado. Devuelve `{ result, log }`. Lanza si encuentra otra
 * operación sin manejar.
 */
function runWriter(eff, monoid) {
    let log = monoid.empty;
    let node = eff;
    for (;;) {
        if (node.kind === 'pure')
            return { result: node.value, log };
        const op = node.effect;
        if (op.tag === exports.WRITER_TELL) {
            log = monoid.combine(log, op.input);
            node = node.continuation(undefined);
            continue;
        }
        throw new Error(`[runWriter] efecto no soportado: ${op.tag}`);
    }
}
// ---------- Monoides comunes ----------
/** Monoide concatenación de listas. */
function listMonoid() {
    return {
        empty: [],
        combine: (a, b) => [...a, ...b],
    };
}
/** Monoide concatenación de strings. */
exports.stringMonoid = {
    empty: '',
    combine: (a, b) => a + b,
};
/** Monoide aditivo sobre números. */
exports.sumMonoid = {
    empty: 0,
    combine: (a, b) => a + b,
};
//# sourceMappingURL=writer.js.map