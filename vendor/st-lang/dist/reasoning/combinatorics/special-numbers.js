"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stirlingSecondKind = stirlingSecondKind;
exports.stirlingFirstKind = stirlingFirstKind;
exports.catalan = catalan;
exports.bellNumber = bellNumber;
exports.eulerNumber = eulerNumber;
exports.eulerianNumber = eulerianNumber;
const basic_counts_1 = require("./basic-counts");
const bigint_helpers_1 = require("./bigint-helpers");
const STIRLING2_CACHE = new Map();
function stirlingSecondKind(n, k) {
    if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0) {
        throw new RangeError('stirlingSecondKind requiere enteros no negativos');
    }
    if (k === 0)
        return n === 0 ? bigint_helpers_1.ONE : bigint_helpers_1.ZERO;
    if (k > n)
        return bigint_helpers_1.ZERO;
    if (k === n)
        return bigint_helpers_1.ONE;
    if (k === 1)
        return bigint_helpers_1.ONE;
    const key = `${n}|${k}`;
    const cached = STIRLING2_CACHE.get(key);
    if (cached !== undefined)
        return cached;
    // S(n,k) = k*S(n-1,k) + S(n-1,k-1)
    const v = BigInt(k) * stirlingSecondKind(n - 1, k) + stirlingSecondKind(n - 1, k - 1);
    STIRLING2_CACHE.set(key, v);
    return v;
}
const STIRLING1_CACHE = new Map();
function stirlingFirstKind(n, k) {
    if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0) {
        throw new RangeError('stirlingFirstKind requiere enteros no negativos');
    }
    if (k === 0)
        return n === 0 ? bigint_helpers_1.ONE : bigint_helpers_1.ZERO;
    if (k > n)
        return bigint_helpers_1.ZERO;
    if (k === n)
        return bigint_helpers_1.ONE;
    const key = `${n}|${k}`;
    const cached = STIRLING1_CACHE.get(key);
    if (cached !== undefined)
        return cached;
    // c(n,k) = c(n-1,k-1) + (n-1)*c(n-1,k)  (unsigned)
    const v = stirlingFirstKind(n - 1, k - 1) + BigInt(n - 1) * stirlingFirstKind(n - 1, k);
    STIRLING1_CACHE.set(key, v);
    return v;
}
function catalan(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('catalan requiere entero no negativo');
    }
    // C_n = C(2n,n) / (n+1)
    return (0, basic_counts_1.binomial)(2 * n, n) / BigInt(n + 1);
}
const BELL_CACHE = [bigint_helpers_1.ONE];
function bellNumber(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('bellNumber requiere entero no negativo');
    }
    for (let m = BELL_CACHE.length; m <= n; m++) {
        let total = bigint_helpers_1.ZERO;
        for (let k = 0; k < m; k++) {
            const bk = BELL_CACHE[k];
            if (bk === undefined)
                throw new Error('bellNumber cache miss');
            total += (0, basic_counts_1.binomial)(m - 1, k) * bk;
        }
        BELL_CACHE[m] = total;
    }
    const v = BELL_CACHE[n];
    if (v === undefined)
        throw new Error('bellNumber cache miss');
    return v;
}
const EULER_CACHE = new Map();
function eulerianFirstOrder(n, k) {
    if (k < 0 || k >= n)
        return bigint_helpers_1.ZERO;
    if (k === 0)
        return bigint_helpers_1.ONE;
    const key = `${n}|${k}`;
    const cached = EULER_CACHE.get(key);
    if (cached !== undefined)
        return cached;
    // <n,k> = (k+1) <n-1,k> + (n-k) <n-1,k-1>
    const v = BigInt(k + 1) * eulerianFirstOrder(n - 1, k) + BigInt(n - k) * eulerianFirstOrder(n - 1, k - 1);
    EULER_CACHE.set(key, v);
    return v;
}
const ZIGZAG_CACHE = [bigint_helpers_1.ONE, bigint_helpers_1.ONE];
function eulerNumber(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('eulerNumber requiere entero no negativo');
    }
    // Número de permutaciones alternantes ("zigzag"): A(0)=1, A(1)=1,
    // 2*A(n+1) = sum_{k=0..n} C(n,k) * A(k) * A(n-k).
    for (let m = ZIGZAG_CACHE.length; m <= n; m++) {
        const prev = m - 1;
        let total = bigint_helpers_1.ZERO;
        for (let k = 0; k <= prev; k++) {
            const ak = ZIGZAG_CACHE[k];
            const ank = ZIGZAG_CACHE[prev - k];
            if (ak === undefined || ank === undefined)
                throw new Error('eulerNumber cache miss');
            total += (0, basic_counts_1.binomial)(prev, k) * ak * ank;
        }
        if (total % bigint_helpers_1.TWO !== bigint_helpers_1.ZERO) {
            throw new Error('eulerNumber: total impar inesperado');
        }
        ZIGZAG_CACHE[m] = total / bigint_helpers_1.TWO;
    }
    const v = ZIGZAG_CACHE[n];
    if (v === undefined)
        throw new Error('eulerNumber cache miss');
    return v;
}
function eulerianNumber(n, k) {
    if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0) {
        throw new RangeError('eulerianNumber requiere enteros no negativos');
    }
    return eulerianFirstOrder(n, k);
}
//# sourceMappingURL=special-numbers.js.map