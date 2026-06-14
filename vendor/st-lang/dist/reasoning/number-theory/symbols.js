"use strict";
// ============================================================
// Símbolos de Legendre y Jacobi.
// ============================================================
// legendreSymbol(a, p): a^((p-1)/2) mod p, normalizado a {-1, 0, 1}.
//                      Requiere p primo impar.
// jacobiSymbol(a, n):  generalización a n impar > 0 vía reciprocidad
//                      cuadrática. Coincide con Legendre cuando n es
//                      primo y siempre satisface jacobi(a,n) ∈ {-1,0,1}.
Object.defineProperty(exports, "__esModule", { value: true });
exports.legendreSymbol = legendreSymbol;
exports.jacobiSymbol = jacobiSymbol;
const modular_1 = require("./modular");
function legendreSymbol(a, p) {
    if (p < 3n || (p & 1n) === 0n) {
        throw new RangeError(`legendreSymbol: p debe ser primo impar, recibido ${p}`);
    }
    const aR = (0, modular_1.mod)(a, p);
    if (aR === 0n)
        return 0;
    const r = (0, modular_1.modPow)(aR, (p - 1n) / 2n, p);
    if (r === 1n)
        return 1;
    if (r === p - 1n)
        return -1;
    // Si p no es primo, modPow no garantiza ±1; lo reportamos como 0
    // (el contrato exige p primo, pero somos defensivos).
    return 0;
}
function jacobiSymbol(a, n) {
    if (n <= 0n || (n & 1n) === 0n) {
        throw new RangeError(`jacobiSymbol: n debe ser positivo impar, recibido ${n}`);
    }
    let aR = (0, modular_1.mod)(a, n);
    let nR = n;
    let result = 1;
    while (aR !== 0n) {
        while ((aR & 1n) === 0n) {
            aR >>= 1n;
            const r = nR & 7n; // nR mod 8
            if (r === 3n || r === 5n)
                result = -result;
        }
        // Swap (a,n).
        const tmp = aR;
        aR = nR;
        nR = tmp;
        if ((aR & 3n) === 3n && (nR & 3n) === 3n) {
            result = -result;
        }
        aR = aR % nR;
    }
    if (nR === 1n)
        return result;
    return 0;
}
//# sourceMappingURL=symbols.js.map