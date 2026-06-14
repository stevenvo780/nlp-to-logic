"use strict";
// ============================================================
// ST Automata — NFA + subset construction
// ============================================================
//
//   · epsilonClosure(M, S)   — cierre-ε de un set de estados.
//   · nfaAccepts(M, w)       — simulación BFS sobre el frontier.
//   · nfaToDfa(M)            — subset construction.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.epsilonClosure = epsilonClosure;
exports.nfaAccepts = nfaAccepts;
exports.nfaToDfa = nfaToDfa;
const types_1 = require("./types");
const epsOf = (M) => M.epsilon ?? types_1.EPSILON;
/** Cierre-ε: el menor conjunto T ⊇ S cerrado bajo transiciones ε. */
function epsilonClosure(M, states) {
    const eps = epsOf(M);
    const closure = new Set(states);
    const stack = [...states];
    while (stack.length > 0) {
        const s = stack.pop();
        if (s === undefined)
            break;
        const row = M.transitions.get(s);
        if (!row)
            continue;
        const nextSet = row.get(eps);
        if (!nextSet)
            continue;
        for (const n of nextSet) {
            if (!closure.has(n)) {
                closure.add(n);
                stack.push(n);
            }
        }
    }
    return closure;
}
/** Step de la simulación: a partir de un set de estados, consumir un
 *  símbolo y luego cerrar bajo ε. */
function nfaStep(M, states, sym) {
    const out = new Set();
    for (const s of states) {
        const row = M.transitions.get(s);
        if (!row)
            continue;
        const nextSet = row.get(sym);
        if (!nextSet)
            continue;
        for (const n of nextSet)
            out.add(n);
    }
    return epsilonClosure(M, out);
}
function nfaAccepts(M, input) {
    let current = epsilonClosure(M, new Set([M.initial]));
    for (const ch of input) {
        current = nfaStep(M, current, ch);
        if (current.size === 0)
            return false;
    }
    for (const s of current)
        if (M.accept.has(s))
            return true;
    return false;
}
/** Subset construction: cada estado del DFA = subconjunto cerrado por ε
 *  de estados del NFA. Sólo se generan estados alcanzables. */
function nfaToDfa(M) {
    const eps = epsOf(M);
    const encode = (set) => {
        return '{' + [...set].sort().join(',') + '}';
    };
    // Alfabeto del DFA = alfabeto del NFA sin ε.
    const alphabet = new Set();
    for (const a of M.alphabet)
        if (a !== eps)
            alphabet.add(a);
    const startSet = epsilonClosure(M, new Set([M.initial]));
    const startKey = encode(startSet);
    const states = new Set([startKey]);
    const transitions = new Map();
    const accept = new Set();
    const subsetOf = new Map();
    subsetOf.set(startKey, startSet);
    if ([...startSet].some((s) => M.accept.has(s)))
        accept.add(startKey);
    const queue = [startKey];
    while (queue.length > 0) {
        const key = queue.shift();
        if (key === undefined)
            break;
        const subset = subsetOf.get(key);
        if (!subset)
            continue;
        const row = new Map();
        transitions.set(key, row);
        for (const a of alphabet) {
            const next = nfaStep(M, subset, a);
            if (next.size === 0)
                continue;
            const nextKey = encode(next);
            row.set(a, nextKey);
            if (!states.has(nextKey)) {
                states.add(nextKey);
                subsetOf.set(nextKey, next);
                if ([...next].some((s) => M.accept.has(s)))
                    accept.add(nextKey);
                queue.push(nextKey);
            }
        }
    }
    return {
        states,
        alphabet,
        transitions,
        initial: startKey,
        accept,
    };
}
//# sourceMappingURL=nfa.js.map