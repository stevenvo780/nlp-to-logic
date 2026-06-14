"use strict";
// ============================================================
// Aritmética modular sobre bigint.
// ============================================================
// modPow      — exponenciación modular por squaring.
// modInverse  — inverso multiplicativo usando Bézout (null si no existe).
// modSolve    — resuelve a·x ≡ b (mod m) (null si no hay solución).
// Convención: el resultado siempre vive en [0, m) cuando m > 0.
Object.defineProperty(exports, "__esModule", { value: true });
exports.modPow = modPow;
exports.modInverse = modInverse;
exports.modSolve = modSolve;
exports.mod = mod;
const gcd_1 = require("./gcd");
function mod(a, m) {
    if (m <= 0n) {
        throw new RangeError(`modulus must be positive, got ${m}`);
    }
    const r = a % m;
    return r < 0n ? r + m : r;
}
function modPow(base, exp, m) {
    if (m <= 0n) {
        throw new RangeError(`modulus must be positive, got ${m}`);
    }
    if (m === 1n)
        return 0n;
    if (exp < 0n) {
        // a^(-k) mod m = (a^-1)^k mod m  (si a^-1 existe).
        const inv = modInverse(base, m);
        if (inv === null) {
            throw new RangeError(`modPow: base ${base} no invertible mod ${m}`);
        }
        return modPow(inv, -exp, m);
    }
    let result = 1n;
    let b = mod(base, m);
    let e = exp;
    while (e > 0n) {
        if ((e & 1n) === 1n)
            result = (result * b) % m;
        e >>= 1n;
        b = (b * b) % m;
    }
    return result;
}
function modInverse(a, m) {
    if (m <= 0n) {
        throw new RangeError(`modulus must be positive, got ${m}`);
    }
    const { gcd: g, x } = (0, gcd_1.extendedGcd)(mod(a, m), m);
    if (g !== 1n)
        return null;
    return mod(x, m);
}
// Resuelve a·x ≡ b (mod m). Solución única (mod m/gcd) cuando existe.
// Devolvemos la solución mínima no-negativa.
function modSolve(a, b, m) {
    if (m <= 0n) {
        throw new RangeError(`modulus must be positive, got ${m}`);
    }
    const aR = mod(a, m);
    const bR = mod(b, m);
    const g = (0, gcd_1.gcd)(aR, m);
    if (bR % g !== 0n)
        return null;
    const aR2 = aR / g;
    const bR2 = bR / g;
    const m2 = m / g;
    const inv = modInverse(aR2, m2);
    if (inv === null)
        return null;
    return mod(bR2 * inv, m2);
}
//# sourceMappingURL=modular.js.map