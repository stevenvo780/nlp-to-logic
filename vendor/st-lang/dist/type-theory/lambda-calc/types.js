"use strict";
// ============================================================
// λ-cálculo untyped — Términos, constructores y serialización
// ============================================================
//
// Distinto al módulo curry-howard (typed λ-cálculo con conexión a
// deducción natural): aquí trabajamos λ puro, sin tipos, con
// β/η-reducción, varias estrategias de normalización y los
// combinadores clásicos (I, K, S, Y) + Church numerals.
Object.defineProperty(exports, "__esModule", { value: true });
exports.apN = exports.ap = exports.lam = exports.v = void 0;
exports.alphaEq = alphaEq;
exports.termToString = termToString;
// ---------- Constructores convenientes ----------
const v = (name) => ({ kind: 'var', name });
exports.v = v;
const lam = (param, body) => ({ kind: 'abs', param, body });
exports.lam = lam;
const ap = (fn, arg) => ({ kind: 'app', fn, arg });
exports.ap = ap;
// Aplicación n-aria por la izquierda: apN(f, a, b, c) = ((f a) b) c
const apN = (head, ...args) => args.reduce(exports.ap, head);
exports.apN = apN;
// Igualdad estructural módulo α (alpha-equivalencia).
// Compara términos renombrando binders a posiciones canónicas.
function alphaEq(a, b) {
    return alphaEqEnv(a, b, new Map(), new Map(), { n: 0 });
}
function alphaEqEnv(a, b, envA, envB, counter) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'var': {
            const bb = b;
            const ia = envA.get(a.name);
            const ib = envB.get(bb.name);
            if (ia === undefined && ib === undefined)
                return a.name === bb.name; // free vars
            return ia === ib;
        }
        case 'abs': {
            const bb = b;
            const idx = counter.n++;
            const newA = new Map(envA);
            newA.set(a.param, idx);
            const newB = new Map(envB);
            newB.set(bb.param, idx);
            return alphaEqEnv(a.body, bb.body, newA, newB, counter);
        }
        case 'app': {
            const bb = b;
            return (alphaEqEnv(a.fn, bb.fn, envA, envB, counter) &&
                alphaEqEnv(a.arg, bb.arg, envA, envB, counter));
        }
    }
}
// Pretty-printer minimalista. Aplicación es asociativa a la izquierda,
// abstracción se extiende lo más posible a la derecha.
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'abs':
            return `(λ${t.param}.${termToString(t.body)})`;
        case 'app': {
            const fn = termToString(t.fn);
            const arg = t.arg.kind === 'app' ? `(${termToString(t.arg)})` : termToString(t.arg);
            return `(${fn} ${arg})`;
        }
    }
}
//# sourceMappingURL=types.js.map