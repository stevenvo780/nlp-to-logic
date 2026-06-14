"use strict";
// ============================================================
// Factorización entera y funciones aritméticas derivadas.
// ============================================================
// factorize  — combina trial-division (hasta primos pequeños),
//              Miller-Rabin y Pollard's rho con polinomio
//              x^2 + c para factores grandes.
// divisors   — todos los divisores positivos en orden creciente.
// eulerPhi   — totient de Euler: φ(n) = n · ∏ (1 - 1/p).
// mobius     — función de Möbius: 0 si hay primo al cuadrado,
//              (-1)^k si n = p1·...·pk con todos distintos.
Object.defineProperty(exports, "__esModule", { value: true });
exports._internal = void 0;
exports.factorize = factorize;
exports.divisors = divisors;
exports.eulerPhi = eulerPhi;
exports.mobius = mobius;
const gcd_1 = require("./gcd");
const primality_1 = require("./primality");
const modular_1 = require("./modular");
const absBig = (n) => (n < 0n ? -n : n);
// Pollard's rho con polinomio f(x) = x^2 + c (mod n).
// Reinicia con c distinto si converge a un factor trivial.
function pollardRho(n) {
    if (n % 2n === 0n)
        return 2n;
    for (let c = 1n;; c++) {
        let x = 2n;
        let y = 2n;
        let d = 1n;
        const f = (z) => (z * z + c) % n;
        while (d === 1n) {
            x = f(x);
            y = f(f(y));
            const diff = x > y ? x - y : y - x;
            d = (0, gcd_1.gcd)(diff, n);
        }
        if (d !== n)
            return d;
        // Trivial cycle: reintentar con otro c.
    }
}
function factorize(n) {
    if (n <= 0n) {
        throw new RangeError(`factorize: requiere n > 0, recibido ${n}`);
    }
    if (n === 1n)
        return [];
    const result = new Map();
    const addFactor = (p, k = 1) => {
        const prev = result.get(p) ?? 0;
        result.set(p, prev + k);
    };
    let m = n;
    // Trial division por primos pequeños (≤ 1000) cubre la mayoría
    // de casos de tests y deja al rho los factores grandes.
    for (let p = 2n; p < 1000n; p++) {
        if (m === 1n)
            break;
        while (m % p === 0n) {
            addFactor(p);
            m /= p;
        }
    }
    // Resto factorizable: stack-based (rho recursivo via iterativo).
    const stack = [];
    if (m > 1n)
        stack.push(m);
    while (stack.length > 0) {
        const cur = stack.pop();
        if (cur === undefined || cur === 1n)
            continue;
        if ((0, primality_1.isPrime)(cur)) {
            addFactor(cur);
            continue;
        }
        let f = pollardRho(cur);
        while (f === cur)
            f = pollardRho(cur);
        stack.push(f);
        stack.push(cur / f);
    }
    return Array.from(result.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
        .map(([prime, exponent]) => ({ prime, exponent }));
}
function divisors(n) {
    const a = absBig(n);
    if (a === 0n) {
        throw new RangeError('divisors(0) no está definido');
    }
    if (a === 1n)
        return [1n];
    const factors = factorize(a);
    let result = [1n];
    for (const { prime, exponent } of factors) {
        const next = [];
        let pk = 1n;
        for (let k = 0; k <= exponent; k++) {
            for (const d of result)
                next.push(d * pk);
            pk *= prime;
        }
        result = next;
    }
    return result.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
function eulerPhi(n) {
    if (n <= 0n) {
        throw new RangeError(`eulerPhi: requiere n > 0, recibido ${n}`);
    }
    if (n === 1n)
        return 1n;
    let result = n;
    for (const { prime } of factorize(n)) {
        result = (result / prime) * (prime - 1n);
    }
    return result;
}
function mobius(n) {
    if (n <= 0n) {
        throw new RangeError(`mobius: requiere n > 0, recibido ${n}`);
    }
    if (n === 1n)
        return 1;
    const factors = factorize(n);
    for (const { exponent } of factors) {
        if (exponent >= 2)
            return 0;
    }
    return factors.length % 2 === 0 ? 1 : -1;
}
// Helper para tests de millerRabin con Mersenne grandes — no exportado.
// (kept here only as a comment-anchor for the team)
exports._internal = { modPow: modular_1.modPow };
//# sourceMappingURL=factorization.js.map