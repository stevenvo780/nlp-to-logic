"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitions = partitions;
exports.partitionsCount = partitionsCount;
exports.partitionsIntoParts = partitionsIntoParts;
const bigint_helpers_1 = require("./bigint-helpers");
function partitions(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('partitions requiere entero no negativo');
    }
    if (n === 0)
        return [[]];
    const result = [];
    function recurse(remaining, maxPart, current) {
        if (remaining === 0) {
            result.push(current.slice());
            return;
        }
        const upper = Math.min(maxPart, remaining);
        for (let i = upper; i >= 1; i--) {
            current.push(i);
            recurse(remaining - i, i, current);
            current.pop();
        }
    }
    recurse(n, n, []);
    return result;
}
const PARTITION_COUNT_CACHE = [bigint_helpers_1.ONE];
function partitionsCount(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError('partitionsCount requiere entero no negativo');
    }
    // Euler pentagonal number recurrence:
    // p(n) = sum_{k!=0} (-1)^(k-1) [p(n - k(3k-1)/2) + p(n - k(3k+1)/2)]
    for (let m = PARTITION_COUNT_CACHE.length; m <= n; m++) {
        let total = bigint_helpers_1.ZERO;
        for (let k = 1;; k++) {
            const g1 = (k * (3 * k - 1)) / 2;
            const g2 = (k * (3 * k + 1)) / 2;
            if (g1 > m && g2 > m)
                break;
            const sign = k % 2 === 1 ? bigint_helpers_1.ONE : bigint_helpers_1.NEG_ONE;
            if (g1 <= m) {
                const v = PARTITION_COUNT_CACHE[m - g1];
                if (v === undefined)
                    throw new Error('partitionsCount cache miss');
                total += sign * v;
            }
            if (g2 <= m) {
                const v = PARTITION_COUNT_CACHE[m - g2];
                if (v === undefined)
                    throw new Error('partitionsCount cache miss');
                total += sign * v;
            }
        }
        PARTITION_COUNT_CACHE[m] = total;
    }
    const v = PARTITION_COUNT_CACHE[n];
    if (v === undefined)
        throw new Error('partitionsCount cache miss inesperado');
    return v;
}
function partitionsIntoParts(n, k) {
    if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0) {
        throw new RangeError('partitionsIntoParts requiere n,k enteros no negativos');
    }
    if (k === 0)
        return n === 0 ? bigint_helpers_1.ONE : bigint_helpers_1.ZERO;
    if (k > n)
        return bigint_helpers_1.ZERO;
    // p_k(n) = p_k(n-k) + p_{k-1}(n-1)
    // memoization 2D
    const memo = new Map();
    function pk(nn, kk) {
        if (kk === 0)
            return nn === 0 ? bigint_helpers_1.ONE : bigint_helpers_1.ZERO;
        if (nn <= 0 || kk > nn)
            return bigint_helpers_1.ZERO;
        const key = `${nn}|${kk}`;
        const cached = memo.get(key);
        if (cached !== undefined)
            return cached;
        const v = pk(nn - kk, kk) + pk(nn - 1, kk - 1);
        memo.set(key, v);
        return v;
    }
    return pk(n, k);
}
//# sourceMappingURL=partitions.js.map