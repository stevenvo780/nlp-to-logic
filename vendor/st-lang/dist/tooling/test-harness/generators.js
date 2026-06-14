"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nats = nats;
exports.range = range;
exports.randomInts = randomInts;
exports.take = take;
exports.toArray = toArray;
function* nats(max) {
    if (!Number.isFinite(max) || max < 0)
        return;
    const cap = Math.floor(max);
    for (let i = 0; i <= cap; i += 1) {
        yield i;
    }
}
function* range(start, end, step) {
    const s = step ?? 1;
    if (s === 0 || !Number.isFinite(s))
        return;
    if (s > 0) {
        for (let i = start; i < end; i += s) {
            yield i;
        }
    }
    else {
        for (let i = start; i > end; i += s) {
            yield i;
        }
    }
}
function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function* randomInts(seed, count, max) {
    if (count <= 0)
        return;
    const rng = mulberry32(seed);
    const cap = Math.max(1, Math.floor(max));
    for (let i = 0; i < count; i += 1) {
        yield Math.floor(rng() * cap);
    }
}
function take(gen, n) {
    const out = [];
    if (n <= 0)
        return out;
    let i = 0;
    for (const v of gen) {
        if (i >= n)
            break;
        out.push(v);
        i += 1;
    }
    return out;
}
function toArray(gen) {
    return Array.from(gen);
}
//# sourceMappingURL=generators.js.map