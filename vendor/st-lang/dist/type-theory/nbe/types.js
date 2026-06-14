"use strict";
// ============================================================
// NbE para STLC — Tipos sintácticos y dominio semántico
// ============================================================
//
// Términos del λ-cálculo simplemente tipado (STLC) y los valores
// semánticos sobre los que evaluamos. La separación entre sintaxis
// (Term, Type) y semántica (Value, Neutral) es lo que hace al
// algoritmo NbE limpio: evaluar produce valores; reificar los baja
// otra vez a términos en forma normal η-larga.
Object.defineProperty(exports, "__esModule", { value: true });
exports.vClosure = exports.vNeutral = exports.vNeutralVar = exports.apN = exports.ap = exports.lam = exports.v = exports.tArr = exports.tBase = void 0;
exports.alphaEq = alphaEq;
exports.typeEq = typeEq;
exports.typeToString = typeToString;
exports.termToString = termToString;
// ---------- Constructores sintácticos ----------
/** Tipo base (primitivo) con nombre. */
const tBase = (name) => ({ kind: 'base', name });
exports.tBase = tBase;
/** Tipo flecha `from → to`. */
const tArr = (from, to) => ({ kind: 'arrow', from, to });
exports.tArr = tArr;
/** Variable sintáctica. */
const v = (name) => ({ kind: 'var', name });
exports.v = v;
/** Abstracción λ sintáctica. */
const lam = (param, paramType, body) => ({
    kind: 'abs',
    param,
    paramType,
    body,
});
exports.lam = lam;
/** Aplicación binaria `fn arg`. */
const ap = (fn, arg) => ({ kind: 'app', fn, arg });
exports.ap = ap;
/** Aplicación n-aria: `apN(f, a, b, c)` = `((f a) b) c`. */
const apN = (head, ...args) => args.reduce(exports.ap, head);
exports.apN = apN;
// ---------- Constructores semánticos ----------
/** Valor neutral de una variable libre `name`. */
const vNeutralVar = (name) => ({
    kind: 'neutral',
    head: { kind: 'var', name },
});
exports.vNeutralVar = vNeutralVar;
/** Valor neutral a partir de una cabeza neutral. */
const vNeutral = (head) => ({ kind: 'neutral', head });
exports.vNeutral = vNeutral;
/** Valor closure (λ semántica) con entorno léxico. */
const vClosure = (env, param, paramType, body) => ({
    kind: 'closure',
    env,
    param,
    paramType,
    body,
});
exports.vClosure = vClosure;
// ---------- Igualdad estructural módulo α ----------
/** Igualdad α-equivalente entre términos STLC (renombra binders a posiciones canónicas). */
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
            if (!typeEq(a.paramType, bb.paramType))
                return false;
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
/** Igualdad estructural entre dos tipos STLC. */
function typeEq(a, b) {
    if (a.kind !== b.kind)
        return false;
    if (a.kind === 'base' && b.kind === 'base')
        return a.name === b.name;
    if (a.kind === 'arrow' && b.kind === 'arrow') {
        return typeEq(a.from, b.from) && typeEq(a.to, b.to);
    }
    return false;
}
// Pretty-printer mínimo para términos y tipos (útil en tests/debug).
/** Serializa un tipo STLC a texto (flechas asociativas a la derecha). */
function typeToString(t) {
    if (t.kind === 'base')
        return t.name;
    // arrow es asociativo a la derecha: A → B → C  ≡  A → (B → C)
    const from = t.from.kind === 'arrow' ? `(${typeToString(t.from)})` : typeToString(t.from);
    return `${from} → ${typeToString(t.to)}`;
}
/** Serializa un término STLC a texto legible. */
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'abs':
            return `(λ${t.param}:${typeToString(t.paramType)}.${termToString(t.body)})`;
        case 'app': {
            const fn = termToString(t.fn);
            const arg = t.arg.kind === 'app' ? `(${termToString(t.arg)})` : termToString(t.arg);
            return `(${fn} ${arg})`;
        }
    }
}
//# sourceMappingURL=types.js.map