"use strict";
// ============================================================
// Tests de primalidad.
// ============================================================
// isPrime       — wrapper que decide entre trial-division y Miller-Rabin
//                 según el tamaño de n.
// millerRabin   — test probabilístico, determinístico para los testigos
//                 estándar hasta 3.3·10^14 (con la lista de testigos
//                 [2,3,5,7,11,13,17,19,23,29,31,37]).
// nextPrime / previousPrime — siguiente/previo primo respecto a n.
// primesBelow   — criba de Eratóstenes hasta n (n: number, exclusivo).
Object.defineProperty(exports, "__esModule", { value: true });
exports.millerRabin = millerRabin;
exports.isPrime = isPrime;
exports.nextPrime = nextPrime;
exports.previousPrime = previousPrime;
exports.primesBelow = primesBelow;
const modular_1 = require("./modular");
const SMALL_PRIMES = [
    2n,
    3n,
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
];
// Testigos suficientes (determinísticos) para n < 3,317,044,064,679,887,385,961,981.
const DEFAULT_WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
function millerRabin(n, witnesses = DEFAULT_WITNESSES) {
    if (n < 2n)
        return false;
    if (n < 4n)
        return true;
    if ((n & 1n) === 0n)
        return false;
    // Escribir n-1 = 2^s · d con d impar.
    let d = n - 1n;
    let s = 0n;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        s += 1n;
    }
    witness: for (const a0 of witnesses) {
        const a = a0 % n;
        if (a === 0n)
            continue;
        let x = (0, modular_1.modPow)(a, d, n);
        if (x === 1n || x === n - 1n)
            continue;
        for (let r = 1n; r < s; r++) {
            x = (x * x) % n;
            if (x === n - 1n)
                continue witness;
        }
        return false;
    }
    return true;
}
function isPrime(n) {
    if (n < 2n)
        return false;
    for (const p of SMALL_PRIMES) {
        if (n === p)
            return true;
        if (n % p === 0n)
            return false;
    }
    return millerRabin(n);
}
function nextPrime(n) {
    if (n < 2n)
        return 2n;
    let c = n + 1n;
    if (c === 2n)
        return 2n;
    if ((c & 1n) === 0n)
        c += 1n;
    while (!isPrime(c))
        c += 2n;
    return c;
}
function previousPrime(n) {
    if (n <= 2n) {
        throw new RangeError('previousPrime: no hay primo menor que 2');
    }
    if (n === 3n)
        return 2n;
    let c = n - 1n;
    if (c === 2n)
        return 2n;
    if ((c & 1n) === 0n)
        c -= 1n;
    while (c >= 2n && !isPrime(c))
        c -= 2n;
    if (c < 2n) {
        throw new RangeError(`previousPrime: no hay primo menor que ${n}`);
    }
    return c;
}
// Criba de Eratóstenes. n: number (acotamos a Number por la criba).
function primesBelow(n) {
    if (!Number.isFinite(n) || n < 2)
        return [];
    const limit = Math.floor(n);
    const sieve = new Uint8Array(limit);
    // sieve[i] === 0  →  i es primo candidato.
    // Marcamos 0 y 1 como compuestos.
    sieve[0] = 1;
    if (limit > 1)
        sieve[1] = 1;
    const sqrt = Math.floor(Math.sqrt(limit - 1));
    for (let i = 2; i <= sqrt; i++) {
        if (sieve[i] === 0) {
            for (let j = i * i; j < limit; j += i)
                sieve[j] = 1;
        }
    }
    const out = [];
    for (let i = 2; i < limit; i++) {
        if (sieve[i] === 0)
            out.push(BigInt(i));
    }
    return out;
}
//# sourceMappingURL=primality.js.map