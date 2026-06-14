"use strict";
// ============================================================
// Martin-Löf Type Theory (MLTT) — Términos y tipos dependientes
// ============================================================
//
// Sistema base con:
//   - Universos jerárquicos:        Type 0 : Type 1 : Type 2 : ...
//   - Funciones dependientes:       Π (x : A). B(x)
//   - Pares dependientes:           Σ (x : A). B(x)
//   - Tipo identidad:               Id(A, a, b), constructor refl(a)
//   - Naturales como tipo base:     Nat, zero, succ
//
// En MLTT no hay distinción sintáctica entre términos y tipos:
// los tipos *son* términos (de algún universo). Por eso un solo
// constructor `MLTTTerm` cubre ambos roles.
//
// Convenciones:
//   - `bind` es el nombre del binder (Π, Σ, lam).
//   - `domain` es el tipo del binder.
//   - `codomain` (Π) y `second` (Σ) pueden depender de `bind`.
//   - α-equivalencia se trata vía sustitución capture-avoiding.
Object.defineProperty(exports, "__esModule", { value: true });
exports.mArrow = exports.mSucc = exports.mZero = exports.mNat = exports.mRefl = exports.mId = exports.mSnd = exports.mFst = exports.mPair = exports.mSigma = exports.mApp = exports.mLam = exports.mPi = exports.mUniverse = exports.mVar = void 0;
exports.occursFree = occursFree;
exports.freeVars = freeVars;
exports.termToString = termToString;
// ---------- Constructores convenientes ----------
/** Variable. */
const mVar = (name) => ({ kind: 'var', name });
exports.mVar = mVar;
/** Universo `Type level`. */
const mUniverse = (level = 0) => ({ kind: 'universe', level });
exports.mUniverse = mUniverse;
/** Tipo Π dependiente `Π bind:domain. codomain`. */
const mPi = (bind, domain, codomain) => ({
    kind: 'pi',
    bind,
    domain,
    codomain,
});
exports.mPi = mPi;
/** Abstracción dependiente `λ bind:domain. body`. */
const mLam = (bind, domain, body) => ({
    kind: 'lam',
    bind,
    domain,
    body,
});
exports.mLam = mLam;
/** Aplicación `fn arg`. */
const mApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.mApp = mApp;
/** Tipo Σ dependiente `Σ bind:first. second`. */
const mSigma = (bind, first, second) => ({
    kind: 'sigma',
    bind,
    first,
    second,
});
exports.mSigma = mSigma;
/** Par dependiente `⟨fst, snd⟩`. */
const mPair = (fst, snd) => ({ kind: 'pair', fst, snd });
exports.mPair = mPair;
/** Proyección izquierda `fst pair`. */
const mFst = (pair) => ({ kind: 'fst', pair });
exports.mFst = mFst;
/** Proyección derecha `snd pair`. */
const mSnd = (pair) => ({ kind: 'snd', pair });
exports.mSnd = mSnd;
/** Tipo identidad `Id(type, left, right)`. */
const mId = (type, left, right) => ({
    kind: 'identity',
    type,
    left,
    right,
});
exports.mId = mId;
/** Prueba de reflexividad `refl(term)`. */
const mRefl = (term) => ({ kind: 'refl', term });
exports.mRefl = mRefl;
/** Tipo de los números naturales `Nat`. */
const mNat = () => ({ kind: 'nat' });
exports.mNat = mNat;
/** Constructor `zero : Nat`. */
const mZero = () => ({ kind: 'zero' });
exports.mZero = mZero;
/** Sucesor `succ(arg) : Nat`. */
const mSucc = (arg) => ({ kind: 'succ', arg });
exports.mSucc = mSucc;
/** Flecha no-dependiente `from → to` (azúcar: `Π _ : from. to`). */
const mArrow = (from, to) => (0, exports.mPi)('_', from, to);
exports.mArrow = mArrow;
// ---------- Helpers de inspección ----------
/** ¿`name` aparece libre en `term`? */
function occursFree(name, term) {
    switch (term.kind) {
        case 'var':
            return term.name === name;
        case 'universe':
        case 'nat':
        case 'zero':
            return false;
        case 'pi':
        case 'sigma': {
            const dom = term.kind === 'pi' ? term.domain : term.first;
            const cod = term.kind === 'pi' ? term.codomain : term.second;
            if (occursFree(name, dom))
                return true;
            if (term.bind === name)
                return false;
            return occursFree(name, cod);
        }
        case 'lam':
            if (occursFree(name, term.domain))
                return true;
            if (term.bind === name)
                return false;
            return occursFree(name, term.body);
        case 'app':
            return occursFree(name, term.fn) || occursFree(name, term.arg);
        case 'pair':
            return occursFree(name, term.fst) || occursFree(name, term.snd);
        case 'fst':
        case 'snd':
            return occursFree(name, term.pair);
        case 'identity':
            return (occursFree(name, term.type) || occursFree(name, term.left) || occursFree(name, term.right));
        case 'refl':
            return occursFree(name, term.term);
        case 'succ':
            return occursFree(name, term.arg);
    }
}
/** Conjunto de variables libres. */
function freeVars(term, acc = new Set()) {
    switch (term.kind) {
        case 'var':
            acc.add(term.name);
            break;
        case 'universe':
        case 'nat':
        case 'zero':
            break;
        case 'pi':
        case 'sigma': {
            const dom = term.kind === 'pi' ? term.domain : term.first;
            const cod = term.kind === 'pi' ? term.codomain : term.second;
            freeVars(dom, acc);
            const inner = freeVars(cod);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'lam': {
            freeVars(term.domain, acc);
            const inner = freeVars(term.body);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'app':
            freeVars(term.fn, acc);
            freeVars(term.arg, acc);
            break;
        case 'pair':
            freeVars(term.fst, acc);
            freeVars(term.snd, acc);
            break;
        case 'fst':
        case 'snd':
            freeVars(term.pair, acc);
            break;
        case 'identity':
            freeVars(term.type, acc);
            freeVars(term.left, acc);
            freeVars(term.right, acc);
            break;
        case 'refl':
            freeVars(term.term, acc);
            break;
        case 'succ':
            freeVars(term.arg, acc);
            break;
    }
    return acc;
}
// ---------- Serialización legible ----------
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'universe':
            return t.level === 0 ? 'Type' : `Type ${t.level}`;
        case 'pi':
            if (t.bind === '_' || !occursFree(t.bind, t.codomain)) {
                return `(${termToString(t.domain)} → ${termToString(t.codomain)})`;
            }
            return `(Π (${t.bind} : ${termToString(t.domain)}). ${termToString(t.codomain)})`;
        case 'lam':
            return `(λ (${t.bind} : ${termToString(t.domain)}). ${termToString(t.body)})`;
        case 'app':
            return `(${termToString(t.fn)} ${termToString(t.arg)})`;
        case 'sigma':
            return `(Σ (${t.bind} : ${termToString(t.first)}). ${termToString(t.second)})`;
        case 'pair':
            return `⟨${termToString(t.fst)}, ${termToString(t.snd)}⟩`;
        case 'fst':
            return `fst(${termToString(t.pair)})`;
        case 'snd':
            return `snd(${termToString(t.pair)})`;
        case 'identity':
            return `Id(${termToString(t.type)}, ${termToString(t.left)}, ${termToString(t.right)})`;
        case 'refl':
            return `refl(${termToString(t.term)})`;
        case 'nat':
            return 'Nat';
        case 'zero':
            return 'zero';
        case 'succ':
            return `succ(${termToString(t.arg)})`;
    }
}
//# sourceMappingURL=types.js.map