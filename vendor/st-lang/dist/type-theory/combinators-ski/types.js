"use strict";
// ============================================================
// SKI combinatory logic — Términos y constructores
// ============================================================
//
// Sistema base de combinadores S, K, I (Schönfinkel / Curry). Es
// Turing-completo y equivalente al λ-cálculo, pero sin variables
// ligadas: toda función se construye combinando S, K, I y variables
// libres mediante aplicación. Las λ-abstracciones se "eliminan"
// vía bracket abstraction (ver `abstract.ts`).
//
// Reglas de reducción:
//   I x      → x
//   K x y    → x
//   S x y z  → x z (y z)
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvar = exports.I = exports.K = exports.S = void 0;
exports.app = app;
exports.ctermEq = ctermEq;
exports.termToString = termToString;
exports.freeVars = freeVars;
// ---------- Constructores convenientes ----------
const S = () => ({ kind: 'S' });
exports.S = S;
const K = () => ({ kind: 'K' });
exports.K = K;
const I = () => ({ kind: 'I' });
exports.I = I;
const cvar = (name) => ({ kind: 'var', name });
exports.cvar = cvar;
// Aplicación n-aria asociativa a la izquierda: app(f, a, b, c) = ((f a) b) c.
// Con un solo argumento devuelve el término tal cual; sin argumentos lanza.
function app(...ts) {
    const head = ts[0];
    if (head === undefined) {
        throw new Error('app() requiere al menos un término');
    }
    let acc = head;
    for (let i = 1; i < ts.length; i += 1) {
        const next = ts[i];
        if (next === undefined)
            break;
        acc = { kind: 'app', fn: acc, arg: next };
    }
    return acc;
}
// Igualdad estructural (no hay alpha — no hay binders).
function ctermEq(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'S':
        case 'K':
        case 'I':
            return true;
        case 'var':
            return a.name === b.name;
        case 'app': {
            const bb = b;
            return ctermEq(a.fn, bb.fn) && ctermEq(a.arg, bb.arg);
        }
    }
}
// Pretty-printer. Aplicación asociativa a la izquierda: agrupa con
// paréntesis sólo cuando el argumento es a su vez una aplicación.
function termToString(t) {
    switch (t.kind) {
        case 'S':
            return 'S';
        case 'K':
            return 'K';
        case 'I':
            return 'I';
        case 'var':
            return t.name;
        case 'app': {
            const fn = termToString(t.fn);
            const arg = t.arg.kind === 'app' ? `(${termToString(t.arg)})` : termToString(t.arg);
            return `${fn} ${arg}`;
        }
    }
}
// Variables libres del término (no hay ligadas en SKI puro).
function freeVars(t) {
    const acc = new Set();
    collect(t, acc);
    return acc;
}
function collect(t, acc) {
    switch (t.kind) {
        case 'var':
            acc.add(t.name);
            return;
        case 'app':
            collect(t.fn, acc);
            collect(t.arg, acc);
            return;
        default:
            return;
    }
}
//# sourceMappingURL=types.js.map