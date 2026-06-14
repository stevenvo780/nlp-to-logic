"use strict";
// ============================================================
// System F — Polymorphic lambda calculus (λ²)
// ============================================================
//
// Extiende el λ-cálculo simplemente tipado con cuantificación
// universal sobre tipos:
//
//   T ::= X | T → T | ∀X. T
//   t ::= x | λx:T. t | t t | Λ X. t | t [T]
//
// Curry-Howard: corresponde a la lógica proposicional intuicionista
// de segundo orden (cuantificación sobre proposiciones).
//
// Convenciones:
//   - Variables de término: minúsculas (x, y, f).
//   - Variables de tipo: mayúsculas convencionalmente (X, Y, Z), pero
//     no impuestas — `atom('foo')` también es legal.
//   - Λ usa `tabs` (type-abstraction); t [T] usa `tapp`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fTApp = exports.fTAbs = exports.fApp = exports.fAbs = exports.fVar = exports.fForall = exports.fArrow = exports.fAtom = void 0;
exports.freeTypeVars = freeTypeVars;
exports.alphaEqType = alphaEqType;
exports.isWellFormed = isWellFormed;
exports.fTypeToString = fTypeToString;
exports.fTermToString = fTermToString;
exports.emptyContext = emptyContext;
exports.cloneContext = cloneContext;
// ---------- Constructores convenientes ----------
/** Crea una variable de tipo atómica con nombre `name`. */
const fAtom = (name) => ({ kind: 'atom', name });
exports.fAtom = fAtom;
/** Crea el tipo función `from → to`. */
const fArrow = (from, to) => ({ kind: 'arrow', from, to });
exports.fArrow = fArrow;
/** Crea el tipo `∀bind. body`. */
const fForall = (bind, body) => ({ kind: 'forall', bind, body });
exports.fForall = fForall;
/** Crea una referencia a variable de término. */
const fVar = (name) => ({ kind: 'var', name });
exports.fVar = fVar;
/** Crea una abstracción `λparam:paramType. body`. */
const fAbs = (param, paramType, body) => ({
    kind: 'abs',
    param,
    paramType,
    body,
});
exports.fAbs = fAbs;
/** Crea una aplicación de término `fn arg`. */
const fApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.fApp = fApp;
/** Crea una abstracción de tipo `Λbind. body`. */
const fTAbs = (bind, body) => ({ kind: 'tabs', bind, body });
exports.fTAbs = fTAbs;
/** Crea una aplicación de tipo `fn [typeArg]`. */
const fTApp = (fn, typeArg) => ({ kind: 'tapp', fn, typeArg });
exports.fTApp = fTApp;
// ---------- Variables libres de tipo (sobre FType) ----------
/**
 * Calcula el conjunto de variables de tipo libres en `t`.
 * @param acc - Acumulador (se modifica in-place y se retorna).
 */
function freeTypeVars(t, acc = new Set()) {
    switch (t.kind) {
        case 'atom':
            acc.add(t.name);
            return acc;
        case 'arrow':
            freeTypeVars(t.from, acc);
            freeTypeVars(t.to, acc);
            return acc;
        case 'forall': {
            const inner = freeTypeVars(t.body);
            inner.delete(t.bind);
            for (const v of inner)
                acc.add(v);
            return acc;
        }
    }
}
// ---------- α-equivalencia de tipos ----------
/**
 * Comprueba α-equivalencia entre dos tipos de System F.
 * `∀X. T` y `∀Y. T[X:=Y]` se consideran iguales.
 */
function alphaEqType(a, b) {
    return alphaEqTypeEnv(a, b, new Map(), new Map(), { n: 0 });
}
function alphaEqTypeEnv(a, b, envA, envB, counter) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'atom': {
            const bb = b;
            const ia = envA.get(a.name);
            const ib = envB.get(bb.name);
            if (ia === undefined && ib === undefined)
                return a.name === bb.name;
            return ia === ib;
        }
        case 'arrow': {
            const bb = b;
            return (alphaEqTypeEnv(a.from, bb.from, envA, envB, counter) &&
                alphaEqTypeEnv(a.to, bb.to, envA, envB, counter));
        }
        case 'forall': {
            const bb = b;
            const idx = counter.n++;
            const newA = new Map(envA);
            newA.set(a.bind, idx);
            const newB = new Map(envB);
            newB.set(bb.bind, idx);
            return alphaEqTypeEnv(a.body, bb.body, newA, newB, counter);
        }
    }
}
// ---------- Well-formedness de tipos ----------
/**
 * Indica si `type` está bien formado: todas sus variables libres están
 * declaradas en el contexto de tipos `ctx`.
 */
function isWellFormed(type, ctx = new Set()) {
    switch (type.kind) {
        case 'atom':
            return ctx.has(type.name);
        case 'arrow':
            return isWellFormed(type.from, ctx) && isWellFormed(type.to, ctx);
        case 'forall': {
            const extended = new Set(ctx);
            extended.add(type.bind);
            return isWellFormed(type.body, extended);
        }
    }
}
// ---------- Serialización legible ----------
/** Serializa un `FType` en notación matemática (`∀X. …`, `A → B`). */
function fTypeToString(t) {
    switch (t.kind) {
        case 'atom':
            return t.name;
        case 'arrow': {
            const lhs = t.from.kind === 'arrow' || t.from.kind === 'forall'
                ? `(${fTypeToString(t.from)})`
                : fTypeToString(t.from);
            return `${lhs} → ${fTypeToString(t.to)}`;
        }
        case 'forall':
            return `∀${t.bind}. ${fTypeToString(t.body)}`;
    }
}
/** Serializa un `FTerm` en notación legible para debugging y mensajes de error. */
function fTermToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'abs':
            return `(λ${t.param}:${fTypeToString(t.paramType)}. ${fTermToString(t.body)})`;
        case 'app': {
            const fn = fTermToString(t.fn);
            const arg = t.arg.kind === 'app' ? `(${fTermToString(t.arg)})` : fTermToString(t.arg);
            return `(${fn} ${arg})`;
        }
        case 'tabs':
            return `(Λ${t.bind}. ${fTermToString(t.body)})`;
        case 'tapp':
            return `(${fTermToString(t.fn)} [${fTypeToString(t.typeArg)}])`;
    }
}
/** Crea un contexto de tipado vacío. */
function emptyContext() {
    return { term: new Map(), type: new Set() };
}
/** Crea una copia independiente del contexto para extensiones locales. */
function cloneContext(ctx) {
    return { term: new Map(ctx.term), type: new Set(ctx.type) };
}
//# sourceMappingURL=types.js.map