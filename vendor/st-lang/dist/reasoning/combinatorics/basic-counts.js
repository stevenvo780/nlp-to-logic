"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factorial = factorial;
exports.binomial = binomial;
exports.multinomial = multinomial;
exports.permutations = permutations;
exports.combinations = combinations;
const bigint_helpers_1 = require("./bigint-helpers");
const FACT_CACHE = [bigint_helpers_1.ONE];
function ensureFactorialCache(n) {
    for (let i = FACT_CACHE.length; i <= n; i++) {
        const prev = FACT_CACHE[i - 1];
        if (prev === undefined) {
            throw new Error('factorial cache desincronizado');
        }
        FACT_CACHE[i] = prev * BigInt(i);
    }
}
function factorial(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError(`factorial requiere entero no negativo, recibido ${n}`);
    }
    ensureFactorialCache(n);
    const v = FACT_CACHE[n];
    if (v === undefined) {
        throw new Error('factorial cache miss inesperado');
    }
    return v;
}
function binomial(n, k) {
    if (!Number.isInteger(n) || !Number.isInteger(k)) {
        throw new RangeError('binomial requiere enteros');
    }
    if (k < 0 || k > n || n < 0) {
        return bigint_helpers_1.ZERO;
    }
    const kk = k > n - k ? n - k : k;
    let num = bigint_helpers_1.ONE;
    let den = bigint_helpers_1.ONE;
    for (let i = 1; i <= kk; i++) {
        num *= BigInt(n - kk + i);
        den *= BigInt(i);
    }
    return num / den;
}
function multinomial(n, ks) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('multinomial requiere n entero no negativo');
    }
    let sum = 0;
    for (const k of ks) {
        if (!Number.isInteger(k) || k < 0) {
            throw new RangeError('multinomial: cada k debe ser entero no negativo');
        }
        sum += k;
    }
    if (sum !== n) {
        throw new RangeError(`multinomial: sum(ks)=${sum} debe igualar n=${n}`);
    }
    let result = factorial(n);
    for (const k of ks) {
        result /= factorial(k);
    }
    return result;
}
function permutations(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r)) {
        throw new RangeError('permutations requiere enteros');
    }
    if (r < 0 || r > n || n < 0) {
        return bigint_helpers_1.ZERO;
    }
    let result = bigint_helpers_1.ONE;
    for (let i = 0; i < r; i++) {
        result *= BigInt(n - i);
    }
    return result;
}
function combinations(n, r) {
    return binomial(n, r);
}
//# sourceMappingURL=basic-counts.js.map