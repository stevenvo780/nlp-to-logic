"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePermutations = generatePermutations;
exports.generateCombinations = generateCombinations;
exports.generatePowerSet = generatePowerSet;
exports.generateSubsetsOfSize = generateSubsetsOfSize;
function* generatePermutations(items) {
    const n = items.length;
    if (n === 0) {
        yield [];
        return;
    }
    const arr = items.slice();
    function swap(i, j) {
        const a = arr[i];
        const b = arr[j];
        if (a === undefined || b === undefined) {
            if (!(i in arr) || !(j in arr)) {
                throw new Error('generatePermutations: índice fuera de rango');
            }
        }
        arr[i] = b;
        arr[j] = a;
    }
    function* heap(k) {
        if (k === 1) {
            yield arr.slice();
            return;
        }
        for (let i = 0; i < k; i++) {
            yield* heap(k - 1);
            if (k % 2 === 0) {
                swap(i, k - 1);
            }
            else {
                swap(0, k - 1);
            }
        }
    }
    yield* heap(n);
}
function* generateCombinations(items, r) {
    if (!Number.isInteger(r) || r < 0) {
        throw new RangeError('generateCombinations: r debe ser entero no negativo');
    }
    const n = items.length;
    if (r > n)
        return;
    if (r === 0) {
        yield [];
        return;
    }
    const indices = [];
    for (let i = 0; i < r; i++)
        indices.push(i);
    while (true) {
        const out = [];
        for (const idx of indices) {
            const v = items[idx];
            if (v === undefined && !(idx in items)) {
                throw new Error('generateCombinations: índice fuera de rango');
            }
            out.push(v);
        }
        yield out;
        let i = r - 1;
        while (i >= 0) {
            const cur = indices[i];
            if (cur === undefined) {
                throw new Error('generateCombinations: índice undefined');
            }
            if (cur !== i + n - r)
                break;
            i--;
        }
        if (i < 0)
            return;
        const cur = indices[i];
        if (cur === undefined)
            return;
        indices[i] = cur + 1;
        for (let j = i + 1; j < r; j++) {
            const prev = indices[j - 1];
            if (prev === undefined) {
                throw new Error('generateCombinations: prev undefined');
            }
            indices[j] = prev + 1;
        }
    }
}
function* generatePowerSet(items) {
    const n = items.length;
    const total = 1 << n;
    for (let mask = 0; mask < total; mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                const v = items[i];
                if (v === undefined && !(i in items)) {
                    throw new Error('generatePowerSet: índice fuera de rango');
                }
                subset.push(v);
            }
        }
        yield subset;
    }
}
function* generateSubsetsOfSize(items, k) {
    yield* generateCombinations(items, k);
}
//# sourceMappingURL=generators.js.map