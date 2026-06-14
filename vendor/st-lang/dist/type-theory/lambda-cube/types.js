"use strict";
// ============================================================
// Lambda Cube (Barendregt) — Términos como Pure Type System (PTS)
// ============================================================
//
// El cubo λ de Barendregt presenta 8 sistemas de tipos puros como
// activaciones de 3 ejes ortogonales sobre el λ-cálculo simplemente
// tipado:
//
//        polymorphism             ──   ∀ sobre términos     (λ2, λω, λC ...)
//        type operators           ──   funciones a nivel tipo (λω, λC ...)
//        dependent types          ──   tipos que dependen de términos (λP, λC ...)
//
// Cada combinación es un PTS con dos sorts:
//
//        * (Set / Prop)     y     ◻ (Type / Kind)
//
// y un conjunto de reglas de formación (s1, s2) para Π.
//
// La sintaxis unificada usada en este módulo:
//
//        t ::= x
//            | s                 sort (* | ◻)
//            | Π x:t. t          producto dependiente
//            | λ x:t. t          abstracción
//            | t t               aplicación
//
// Las reglas de formación de cada vértice del cubo deciden qué
// abstracciones son legales. Por ejemplo:
//
//   λ→         (*, *)                              STLC
//   λ2         (*, *) (◻, *)                       System F
//   λω̄         (*, *) (◻, ◻)                       λω débil
//   λω         (*, *) (◻, *) (◻, ◻)                System Fω
//   λP         (*, *) (*, ◻)                       LF / λΠ
//   λP2        (*, *) (◻, *) (*, ◻)
//   λPω̄        (*, *) (*, ◻) (◻, ◻)
//   λC         (*, *) (◻, *) (*, ◻) (◻, ◻)         Calculus of Constructions
Object.defineProperty(exports, "__esModule", { value: true });
exports.cArrow = exports.cApp = exports.cLam = exports.cPi = exports.cBox = exports.cStar = exports.cSort = exports.cVar = void 0;
exports.occursFree = occursFree;
exports.freeVars = freeVars;
exports.termToString = termToString;
exports.alphaEq = alphaEq;
exports.emptyContext = emptyContext;
exports.extendContext = extendContext;
// ---------- Constructores convenientes ----------
/** Variable de término o tipo. */
const cVar = (name) => ({ kind: 'var', name });
exports.cVar = cVar;
/** Sort arbitrario `'*'` o `'◻'`. */
const cSort = (sort) => ({ kind: 'sort', sort });
exports.cSort = cSort;
/** Sort `*` (tipo/proposición). */
exports.cStar = { kind: 'sort', sort: '*' };
/** Sort `◻` (kind / tipo de tipos). */
exports.cBox = { kind: 'sort', sort: '◻' };
/** Π-tipo dependiente `Π bind:domain. codomain`. */
const cPi = (bind, domain, codomain) => ({
    kind: 'pi',
    bind,
    domain,
    codomain,
});
exports.cPi = cPi;
/** Abstracción dependiente `λ bind:domain. body`. */
const cLam = (bind, domain, body) => ({
    kind: 'lam',
    bind,
    domain,
    body,
});
exports.cLam = cLam;
/** Aplicación `fn arg`. */
const cApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.cApp = cApp;
/** Flecha no-dependiente: Π (_ : A). B, cuando B no menciona el binder. */
const cArrow = (from, to) => (0, exports.cPi)('_', from, to);
exports.cArrow = cArrow;
// ---------- Variables libres ----------
/** Devuelve `true` si `name` ocurre libre en `term`. */
function occursFree(name, term) {
    switch (term.kind) {
        case 'var':
            return term.name === name;
        case 'sort':
            return false;
        case 'pi':
        case 'lam': {
            if (occursFree(name, term.domain))
                return true;
            if (term.bind === name)
                return false;
            const body = term.kind === 'pi' ? term.codomain : term.body;
            return occursFree(name, body);
        }
        case 'app':
            return occursFree(name, term.fn) || occursFree(name, term.arg);
    }
}
/** Acumula en `acc` (o devuelve un nuevo Set) el conjunto de variables libres del término. */
function freeVars(term, acc = new Set()) {
    switch (term.kind) {
        case 'var':
            acc.add(term.name);
            return acc;
        case 'sort':
            return acc;
        case 'pi':
        case 'lam': {
            freeVars(term.domain, acc);
            const body = term.kind === 'pi' ? term.codomain : term.body;
            const inner = freeVars(body);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            return acc;
        }
        case 'app':
            freeVars(term.fn, acc);
            freeVars(term.arg, acc);
            return acc;
    }
}
// ---------- Serialización legible ----------
/** Serializa un término del cubo λ a texto legible (Π, λ, →, sorts). */
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'sort':
            return t.sort;
        case 'pi': {
            if (t.bind === '_' || !occursFree(t.bind, t.codomain)) {
                const lhs = t.domain.kind === 'pi' || t.domain.kind === 'lam'
                    ? `(${termToString(t.domain)})`
                    : termToString(t.domain);
                return `${lhs} → ${termToString(t.codomain)}`;
            }
            return `Π ${t.bind}:${termToString(t.domain)}. ${termToString(t.codomain)}`;
        }
        case 'lam':
            return `λ ${t.bind}:${termToString(t.domain)}. ${termToString(t.body)}`;
        case 'app': {
            const fn = t.fn.kind === 'lam' || t.fn.kind === 'pi' ? `(${termToString(t.fn)})` : termToString(t.fn);
            const arg = t.arg.kind === 'app' || t.arg.kind === 'lam' || t.arg.kind === 'pi'
                ? `(${termToString(t.arg)})`
                : termToString(t.arg);
            return `${fn} ${arg}`;
        }
    }
}
// ---------- α-equivalencia ----------
/** α-equivalencia entre dos términos del cubo λ (renombra binders a índices canónicos). */
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
                return a.name === bb.name;
            return ia === ib;
        }
        case 'sort':
            return a.sort === b.sort;
        case 'pi':
        case 'lam': {
            const bb = b;
            const aDom = a.domain;
            const bDom = bb.domain;
            if (!alphaEqEnv(aDom, bDom, envA, envB, counter))
                return false;
            const idx = counter.n++;
            const newA = new Map(envA);
            newA.set(a.bind, idx);
            const newB = new Map(envB);
            newB.set(bb.bind, idx);
            const aBody = a.kind === 'pi' ? a.codomain : a.body;
            const bBody = bb.kind === 'pi' ? bb.codomain : bb.body;
            return alphaEqEnv(aBody, bBody, newA, newB, counter);
        }
        case 'app': {
            const bb = b;
            return (alphaEqEnv(a.fn, bb.fn, envA, envB, counter) &&
                alphaEqEnv(a.arg, bb.arg, envA, envB, counter));
        }
    }
}
/** Crea un contexto vacío para el cubo λ. */
function emptyContext() {
    return new Map();
}
/** Extiende el contexto con `name : type`. Devuelve un nuevo mapa (no muta el original). */
function extendContext(ctx, name, type) {
    const next = new Map(ctx);
    next.set(name, type);
    return next;
}
//# sourceMappingURL=types.js.map