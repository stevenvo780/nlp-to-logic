"use strict";
// ============================================================
// ST Mathlib — Instancias estándar
// Z aditivo, anillo Z, racionales como campo, Z/nZ, S_3.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sym3 = exports.sym3Elements = exports.rationalsField = exports.intRing = exports.intAdditiveGroup = void 0;
exports.rational = rational;
exports.rationalEq = rationalEq;
exports.rationalDiv = rationalDiv;
exports.zModN = zModN;
exports.zModNElements = zModNElements;
exports.zModNDiv = zModNDiv;
exports.perm3Eq = perm3Eq;
// ------------------------------------------------------------
// (Z, +): grupo abeliano aditivo de enteros.
// ------------------------------------------------------------
exports.intAdditiveGroup = {
    op: (a, b) => a + b,
    identity: 0n,
    inverse: (a) => -a,
};
// ------------------------------------------------------------
// (Z, +, ·): anillo conmutativo con unidad.
// ------------------------------------------------------------
exports.intRing = {
    add: (a, b) => a + b,
    mul: (a, b) => a * b,
    zero: 0n,
    one: 1n,
    neg: (a) => -a,
};
function gcd(a, b) {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x === 0n ? 1n : x;
}
function rational(num, den) {
    if (den === 0n)
        throw new Error('rational: denominador cero');
    const sign = den < 0n ? -1n : 1n;
    const n = num * sign;
    const d = den * sign;
    const g = gcd(n < 0n ? -n : n, d);
    return { num: n / g, den: d / g };
}
function rationalEq(a, b) {
    return a.num === b.num && a.den === b.den;
}
exports.rationalsField = {
    add: (a, b) => rational(a.num * b.den + b.num * a.den, a.den * b.den),
    mul: (a, b) => rational(a.num * b.num, a.den * b.den),
    zero: { num: 0n, den: 1n },
    one: { num: 1n, den: 1n },
    neg: (a) => ({ num: -a.num, den: a.den }),
};
/**
 * División en Q. `undefined` solo cuando b = 0/1 (división por cero).
 */
function rationalDiv(a, b) {
    if (b.num === 0n)
        return undefined;
    return rational(a.num * b.den, a.den * b.num);
}
// ------------------------------------------------------------
// Z/nZ: enteros módulo n. Es campo sii n es primo.
// ------------------------------------------------------------
function mod(a, n) {
    const r = a % n;
    return r < 0n ? r + n : r;
}
function zModN(n) {
    if (n <= 0n)
        throw new Error('zModN: n debe ser positivo');
    return {
        add: (a, b) => mod(a + b, n),
        mul: (a, b) => mod(a * b, n),
        zero: 0n,
        one: mod(1n, n),
        neg: (a) => mod(-a, n),
    };
}
/**
 * Lista los n representantes canónicos {0, 1, ..., n-1}.
 */
function zModNElements(n) {
    const out = [];
    for (let i = 0n; i < n; i++)
        out.push(i);
    return out;
}
/**
 * División modular: busca b tal que a · b ≡ 1 (mod n) por fuerza bruta
 * sobre el dominio finito. Devuelve undefined si no existe inverso.
 */
function zModNDiv(n) {
    return (a, b) => {
        if (b === 0n)
            return undefined;
        for (let x = 0n; x < n; x++) {
            if (mod(b * x, n) === 1n)
                return mod(a * x, n);
        }
        return undefined;
    };
}
exports.sym3Elements = [
    [0, 1, 2], // identidad
    [1, 0, 2], // transposición (0 1)
    [2, 1, 0], // transposición (0 2)
    [0, 2, 1], // transposición (1 2)
    [1, 2, 0], // ciclo (0 1 2)
    [2, 0, 1], // ciclo (0 2 1)
];
function composePerm3(a, b) {
    // (a ∘ b)(i) = a(b(i))
    return [a[b[0]], a[b[1]], a[b[2]]];
}
function invertPerm3(a) {
    const out = [0, 0, 0];
    out[a[0]] = 0;
    out[a[1]] = 1;
    out[a[2]] = 2;
    return out;
}
function perm3Eq(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
exports.sym3 = {
    op: composePerm3,
    identity: [0, 1, 2],
    inverse: invertPerm3,
};
//# sourceMappingURL=instances.js.map