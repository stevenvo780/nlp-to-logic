"use strict";
// ============================================================
// gcd, lcm y algoritmo extendido sobre bigint.
// ============================================================
// gcd(a,b) por Euclides binario-aritmético, siempre no-negativo.
// extendedGcd devuelve coeficientes Bézout (x,y) con a·x + b·y = gcd.
// Convención: para a=b=0 el gcd es 0 (consistente con álgebra
// conmutativa: el único divisor común es 0).
Object.defineProperty(exports, "__esModule", { value: true });
exports.gcd = gcd;
exports.lcm = lcm;
exports.extendedGcd = extendedGcd;
const absBig = (n) => (n < 0n ? -n : n);
function gcd(a, b) {
    let x = absBig(a);
    let y = absBig(b);
    while (y !== 0n) {
        const r = x % y;
        x = y;
        y = r;
    }
    return x;
}
function lcm(a, b) {
    if (a === 0n || b === 0n)
        return 0n;
    const g = gcd(a, b);
    return absBig((a / g) * b);
}
// Extended Euclidean algorithm.
// Garantiza: a·x + b·y = gcd(a,b) (con signo original conservado).
// Si a o b son negativos, x/y se ajustan automáticamente.
function extendedGcd(a, b) {
    // Trabajamos con valores absolutos y ajustamos signos al final.
    const signA = a < 0n ? -1n : 1n;
    const signB = b < 0n ? -1n : 1n;
    let oldR = absBig(a);
    let r = absBig(b);
    let oldS = 1n;
    let s = 0n;
    let oldT = 0n;
    let t = 1n;
    while (r !== 0n) {
        const q = oldR / r;
        [oldR, r] = [r, oldR - q * r];
        [oldS, s] = [s, oldS - q * s];
        [oldT, t] = [t, oldT - q * t];
    }
    return { gcd: oldR, x: oldS * signA, y: oldT * signB };
}
//# sourceMappingURL=gcd.js.map