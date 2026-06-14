"use strict";
// ============================================================
// ST Argumentation — Computación de extensiones (Dung 1995)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundedExtension = groundedExtension;
exports.isComplete = isComplete;
exports.isStable = isStable;
exports.lazyAdmissibleSets = lazyAdmissibleSets;
exports.preferredExtensions = preferredExtensions;
exports.completeExtensions = completeExtensions;
exports.stableExtensions = stableExtensions;
exports.semiStableExtensions = semiStableExtensions;
exports.computeExtensions = computeExtensions;
const types_1 = require("./types");
const framework_1 = require("./framework");
function emptySet() {
    return new Set();
}
function groundedExtension(af) {
    let current = emptySet();
    while (true) {
        const next = (0, framework_1.characteristicFunction)(af, current);
        if ((0, framework_1.setsEqual)(current, next))
            return current;
        current = next;
    }
}
function isComplete(af, set) {
    if (!(0, framework_1.isAdmissible)(af, set))
        return false;
    const defended = (0, framework_1.characteristicFunction)(af, set);
    return (0, framework_1.setsEqual)(defended, set);
}
function isStable(af, set) {
    if (!(0, framework_1.isConflictFree)(af, set))
        return false;
    const attacked = (0, framework_1.attackedBySet)(af, set);
    for (const arg of af.arguments) {
        if (set.has(arg))
            continue;
        if (!attacked.has(arg))
            return false;
    }
    return true;
}
function enumerateAdmissibleSets(af, options) {
    const args = Array.from(af.arguments).sort();
    const n = args.length;
    if (n > options.exhaustiveLimit) {
        if (options.warnOnLarge) {
            console.warn(`[argumentation] AF con ${String(n)} argumentos excede límite exhaustivo ${String(options.exhaustiveLimit)} — usar iterador lazy`);
        }
    }
    const result = [];
    const total = 1 << n;
    for (let mask = 0; mask < total; mask++) {
        const subset = new Set();
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                const arg = args[i];
                if (arg !== undefined)
                    subset.add(arg);
            }
        }
        if ((0, framework_1.isAdmissible)(af, subset))
            result.push(subset);
    }
    return result;
}
function* lazyAdmissibleSets(af) {
    const args = Array.from(af.arguments).sort();
    const n = args.length;
    if (n > 30) {
        throw new Error(`[argumentation] AF con ${String(n)} argumentos: el iterador lazy también es exponencial. Considera otra técnica.`);
    }
    const total = 1 << n;
    for (let mask = 0; mask < total; mask++) {
        const subset = new Set();
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                const arg = args[i];
                if (arg !== undefined)
                    subset.add(arg);
            }
        }
        if ((0, framework_1.isAdmissible)(af, subset))
            yield subset;
    }
}
function maximalSets(sets) {
    const result = [];
    for (let i = 0; i < sets.length; i++) {
        const candidate = sets[i];
        if (candidate === undefined)
            continue;
        let dominated = false;
        for (let j = 0; j < sets.length; j++) {
            if (i === j)
                continue;
            const other = sets[j];
            if (other === undefined)
                continue;
            if (other.size > candidate.size && (0, framework_1.isSubset)(candidate, other)) {
                dominated = true;
                break;
            }
        }
        if (!dominated)
            result.push(candidate);
    }
    return result;
}
function preferredExtensions(af, options) {
    const admissible = enumerateAdmissibleSets(af, options);
    return maximalSets(admissible);
}
function completeExtensions(af, options) {
    const admissible = enumerateAdmissibleSets(af, options);
    const result = [];
    for (const set of admissible) {
        const defended = (0, framework_1.characteristicFunction)(af, set);
        if ((0, framework_1.setsEqual)(defended, set))
            result.push(set);
    }
    return result;
}
function stableExtensions(af, options) {
    const admissible = enumerateAdmissibleSets(af, options);
    const result = [];
    for (const set of admissible) {
        if (isStable(af, set))
            result.push(set);
    }
    return result;
}
function semiStableExtensions(af, options) {
    const completes = completeExtensions(af, options);
    if (completes.length === 0)
        return [];
    let bestRange = -1;
    let candidates = [];
    for (const set of completes) {
        const range = set.size + (0, framework_1.attackedBySet)(af, set).size;
        if (range > bestRange) {
            bestRange = range;
            candidates = [set];
        }
        else if (range === bestRange) {
            candidates.push(set);
        }
    }
    return maximalSets(candidates);
}
function computeExtensions(af, semantics, options = {}) {
    const opts = {
        exhaustiveLimit: options.exhaustiveLimit ?? types_1.DEFAULT_EXHAUSTIVE_LIMIT,
        warnOnLarge: options.warnOnLarge ?? true,
    };
    switch (semantics) {
        case 'grounded':
            return [groundedExtension(af)];
        case 'preferred':
            return preferredExtensions(af, opts);
        case 'stable':
            return stableExtensions(af, opts);
        case 'complete':
            return completeExtensions(af, opts);
        case 'semi-stable':
            return semiStableExtensions(af, opts);
    }
}
//# sourceMappingURL=extensions.js.map