"use strict";
// ============================================================
// λ-cálculo untyped — Church numerals y operaciones aritméticas
// ============================================================
//
// n̄ = λf.λx. f (f ... (f x) ... )    con n aplicaciones de f.
// 0̄ = λf.λx.x
// 1̄ = λf.λx.f x
//
// SUCC = λn.λf.λx. f (n f x)
// PLUS = λm.λn.λf.λx. m f (n f x)
// MULT = λm.λn.λf. m (n f)
Object.defineProperty(exports, "__esModule", { value: true });
exports.churchMul = exports.churchAdd = exports.churchSucc = void 0;
exports.churchNumeral = churchNumeral;
exports.decodeChurch = decodeChurch;
exports.evalChurch = evalChurch;
const types_1 = require("./types");
const reduce_1 = require("./reduce");
// Codifica un natural ≥ 0 como Church numeral.
function churchNumeral(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError(`churchNumeral: se esperaba entero ≥ 0, recibido ${n}`);
    }
    let body = (0, types_1.v)('x');
    for (let i = 0; i < n; i += 1)
        body = (0, types_1.ap)((0, types_1.v)('f'), body);
    return (0, types_1.lam)('f', (0, types_1.lam)('x', body));
}
// Decodifica un Church numeral en forma normal. Devuelve null si el
// término no tiene la forma λf.λx. f^n x (módulo α). El término debe
// ser ya una forma normal — si no, normalízalo primero.
function decodeChurch(t) {
    if (t.kind !== 'abs')
        return null;
    const fName = t.param;
    const inner = t.body;
    if (inner.kind !== 'abs')
        return null;
    const xName = inner.param;
    let cur = inner.body;
    let n = 0;
    while (cur.kind === 'app') {
        if (cur.fn.kind !== 'var' || cur.fn.name !== fName)
            return null;
        cur = cur.arg;
        n += 1;
    }
    if (cur.kind !== 'var' || cur.name !== xName)
        return null;
    return n;
}
// Normaliza y luego decodifica. Útil para tests que computan
// `decodeChurch(churchAdd m n)`.
function evalChurch(t, maxSteps = 5000) {
    const { result, terminated } = (0, reduce_1.normalize)(t, { maxSteps });
    if (!terminated)
        return null;
    return decodeChurch(result);
}
// SUCC = λn.λf.λx. f (n f x)
exports.churchSucc = (0, types_1.lam)('n', (0, types_1.lam)('f', (0, types_1.lam)('x', (0, types_1.ap)((0, types_1.v)('f'), (0, types_1.apN)((0, types_1.v)('n'), (0, types_1.v)('f'), (0, types_1.v)('x'))))));
// PLUS = λm.λn.λf.λx. m f (n f x)
exports.churchAdd = (0, types_1.lam)('m', (0, types_1.lam)('n', (0, types_1.lam)('f', (0, types_1.lam)('x', (0, types_1.apN)((0, types_1.v)('m'), (0, types_1.v)('f'), (0, types_1.apN)((0, types_1.v)('n'), (0, types_1.v)('f'), (0, types_1.v)('x')))))));
// MULT = λm.λn.λf. m (n f)
exports.churchMul = (0, types_1.lam)('m', (0, types_1.lam)('n', (0, types_1.lam)('f', (0, types_1.ap)((0, types_1.v)('m'), (0, types_1.ap)((0, types_1.v)('n'), (0, types_1.v)('f'))))));
//# sourceMappingURL=church.js.map