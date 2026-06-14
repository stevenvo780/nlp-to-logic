"use strict";
// ============================================================
// Effect: Exception<E>
// ============================================================
//
// Una sola operación:
//   - Exception.throw : E → never
//
// La continuación nunca se invoca: tirar aborta el cómputo y
// `runException` devuelve `{ kind: 'error', error }`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCEPTION_THROW = void 0;
exports.throw_ = throw_;
exports.handleException = handleException;
exports.runException = runException;
const core_1 = require("./core");
exports.EXCEPTION_THROW = 'Exception.throw';
/** Lanza una excepción algebraica. La continuación se descarta. */
function throw_(error) {
    return (0, core_1.perform)(exports.EXCEPTION_THROW, error);
}
/**
 * Intérprete componible. Si el cómputo lanza, corta el árbol y emite
 * `{ kind: 'error', error }`. Si finaliza puro, emite `{ kind: 'ok', value }`.
 * Otros efectos se propagan tal cual.
 */
function handleException(eff) {
    function go(node) {
        if (node.kind === 'pure')
            return (0, core_1.pure)({ kind: 'ok', value: node.value });
        const op = node.effect;
        if (op.tag === exports.EXCEPTION_THROW) {
            return (0, core_1.pure)({ kind: 'error', error: op.input });
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
 * Intérprete terminal: ejecuta el cómputo y captura una eventual
 * excepción. Lanza si encuentra otra operación sin manejar.
 */
function runException(eff) {
    const node = eff;
    for (;;) {
        if (node.kind === 'pure')
            return { kind: 'ok', value: node.value };
        const op = node.effect;
        if (op.tag === exports.EXCEPTION_THROW) {
            return { kind: 'error', error: op.input };
        }
        throw new Error(`[runException] efecto no soportado: ${op.tag}`);
    }
}
//# sourceMappingURL=exception.js.map