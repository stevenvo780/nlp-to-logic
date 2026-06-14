"use strict";
// ============================================================
// HoTT — Homotopy Type Theory: términos y constructores
// ============================================================
//
// Extiende MLTT (Π, Σ, Universe, Nat) con la lectura homotópica
// del tipo identidad: Path A x y es el espacio de caminos entre
// x e y en A, no una proposición trivial. Esto habilita:
//
//   - refl(x)            : Path A x x         (camino constante)
//   - p⁻¹ = sym p        : Path A y x          (inverso)
//   - p · q              : Path A x z          (concatenación)
//   - ap f p             : Path B (f x) (f y) (functorialidad)
//   - transport P p e    : P y                (transporte a lo largo)
//   - J(motive, base, p) : motive y p          (eliminador inductivo)
//
// Tipos inductivos superiores incluidos (subconjunto pedagógico):
//   - S¹    con base, loop : Path S¹ base base
//   - Σ A   suspensión con north, south, meridian a : Path north south
//
// La univalence se trata como axioma (no computacional):
// dada una equivalencia e : A ≃ B, postulamos un path ua(e) :
// Path U A B. La computación de transport sobre ua(e) NO se
// implementa (eso requiere modelos cúbicos); la consistencia
// sintáctica sí.
Object.defineProperty(exports, "__esModule", { value: true });
exports.hArrow = exports.hUa = exports.hMeridian = exports.hSouth = exports.hNorth = exports.hSuspension = exports.hLoopOfCircle = exports.hBaseOfCircle = exports.hCircle = exports.hJElim = exports.hAp = exports.hPathConcat = exports.hPathSym = exports.hTransport = exports.hRefl = exports.hPath = exports.hSucc = exports.hZero = exports.hNat = exports.hSnd = exports.hFst = exports.hPair = exports.hSigma = exports.hApp = exports.hLam = exports.hPi = exports.hUniverse = exports.hVar = void 0;
exports.occursFreeHoTT = occursFreeHoTT;
exports.freeVarsHoTT = freeVarsHoTT;
exports.termToStringHoTT = termToStringHoTT;
// ── Constructores convenientes ──────────────────────────────
/** Constructor de variable HoTT referenciada por nombre. */
const hVar = (name) => ({ kind: 'var', name });
exports.hVar = hVar;
/** Constructor del universo jerárquico Typeₙ (default: Type₀). */
const hUniverse = (level = 0) => ({ kind: 'universe', level });
exports.hUniverse = hUniverse;
/** Constructor del tipo Π (función dependiente): `Π(bind : domain). codomain`. */
const hPi = (bind, domain, codomain) => ({
    kind: 'pi',
    bind,
    domain,
    codomain,
});
exports.hPi = hPi;
/** Constructor de lambda con dominio anotado: `λ(bind : domain). body`. */
const hLam = (bind, domain, body) => ({
    kind: 'lam',
    bind,
    domain,
    body,
});
exports.hLam = hLam;
/** Constructor de aplicación de función: `fn arg`. */
const hApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.hApp = hApp;
/** Constructor del tipo Σ (par dependiente): `Σ(bind : first). second`. */
const hSigma = (bind, first, second) => ({
    kind: 'sigma',
    bind,
    first,
    second,
});
exports.hSigma = hSigma;
/** Constructor de par dependiente: `⟨fst, snd⟩`. */
const hPair = (fst, snd) => ({ kind: 'pair', fst, snd });
exports.hPair = hPair;
/** Proyección de la primera componente de un par dependiente. */
const hFst = (pair) => ({ kind: 'fst', pair });
exports.hFst = hFst;
/** Proyección de la segunda componente de un par dependiente. */
const hSnd = (pair) => ({ kind: 'snd', pair });
exports.hSnd = hSnd;
/** Tipo de los números naturales en HoTT (tipo inductivo). */
const hNat = () => ({ kind: 'nat' });
exports.hNat = hNat;
/** Constante cero del tipo Nat en HoTT. */
const hZero = () => ({ kind: 'zero' });
exports.hZero = hZero;
/** Constructor sucesor del tipo Nat en HoTT. */
const hSucc = (arg) => ({ kind: 'succ', arg });
exports.hSucc = hSucc;
/** Constructor del tipo de caminos: `Path type left right` (espacio de caminos entre `left` y `right`). */
const hPath = (type, left, right) => ({
    kind: 'path',
    type,
    left,
    right,
});
exports.hPath = hPath;
/** Camino reflexivo (constante): `refl(term) : Path A term term`. */
const hRefl = (term) => ({ kind: 'refl', term });
exports.hRefl = hRefl;
/** Transporte a lo largo de un camino: mueve `term` de la fibra `family left` a `family right`. */
const hTransport = (family, path, term) => ({
    kind: 'transport',
    family,
    path,
    term,
});
exports.hTransport = hTransport;
/** Inversión de camino: dado `p : Path A x y` produce `p⁻¹ : Path A y x`. */
const hPathSym = (path) => ({ kind: 'pathSym', path });
exports.hPathSym = hPathSym;
/** Concatenación de caminos: `p · q : Path A x z` dado `p : Path A x y` y `q : Path A y z`. */
const hPathConcat = (left, right) => ({
    kind: 'pathConcat',
    left,
    right,
});
exports.hPathConcat = hPathConcat;
/** Functorialidad: `ap f p : Path B (f x) (f y)` dado `f : A → B` y `p : Path A x y`. */
const hAp = (fn, path) => ({ kind: 'ap', fn, path });
exports.hAp = hAp;
/** Eliminador J: principio inductivo del tipo identidad en HoTT. */
const hJElim = (motive, baseCase, path) => ({
    kind: 'jElim',
    motive,
    baseCase,
    path,
});
exports.hJElim = hJElim;
/** HIT S¹: el círculo, tipo inductivo superior con un punto base y un loop. */
const hCircle = () => ({ kind: 'circle' });
exports.hCircle = hCircle;
/** Punto base de S¹: `base : S¹`. */
const hBaseOfCircle = () => ({ kind: 'baseOfCircle' });
exports.hBaseOfCircle = hBaseOfCircle;
/** Generador del loop de S¹: `loop : Path S¹ base base`. */
const hLoopOfCircle = () => ({ kind: 'loopOfCircle' });
exports.hLoopOfCircle = hLoopOfCircle;
/** Tipo suspensión ΣA (HIT): colapsa `A` añadiendo dos polos y meridianos. */
const hSuspension = (type) => ({ kind: 'suspension', type });
exports.hSuspension = hSuspension;
/** Polo norte de la suspensión de `type`. */
const hNorth = (type) => ({ kind: 'north', type });
exports.hNorth = hNorth;
/** Polo sur de la suspensión de `type`. */
const hSouth = (type) => ({ kind: 'south', type });
exports.hSouth = hSouth;
/** Meridiano de la suspensión: `meridian a : Path north south` para cada `a : type`. */
const hMeridian = (type, point) => ({
    kind: 'meridian',
    type,
    point,
});
exports.hMeridian = hMeridian;
/** Axioma de univalencia: `ua(equiv) : Path U A B` dada una equivalencia `equiv : A ≃ B`. */
const hUa = (equiv) => ({ kind: 'ua', equiv });
exports.hUa = hUa;
/** Tipo flecha no-dependiente: `from → to` (azúcar sobre Π con bind ignorado). */
const hArrow = (from, to) => (0, exports.hPi)('_', from, to);
exports.hArrow = hArrow;
// ── Inspección estructural ───────────────────────────────────
/** Comprueba si la variable `name` ocurre libre en el término HoTT `term`. */
function occursFreeHoTT(name, term) {
    switch (term.kind) {
        case 'var':
            return term.name === name;
        case 'universe':
        case 'nat':
        case 'zero':
        case 'circle':
        case 'baseOfCircle':
        case 'loopOfCircle':
            return false;
        case 'pi':
        case 'sigma': {
            const dom = term.kind === 'pi' ? term.domain : term.first;
            const cod = term.kind === 'pi' ? term.codomain : term.second;
            if (occursFreeHoTT(name, dom))
                return true;
            if (term.bind === name)
                return false;
            return occursFreeHoTT(name, cod);
        }
        case 'lam':
            if (occursFreeHoTT(name, term.domain))
                return true;
            if (term.bind === name)
                return false;
            return occursFreeHoTT(name, term.body);
        case 'app':
            return occursFreeHoTT(name, term.fn) || occursFreeHoTT(name, term.arg);
        case 'pair':
            return occursFreeHoTT(name, term.fst) || occursFreeHoTT(name, term.snd);
        case 'fst':
        case 'snd':
            return occursFreeHoTT(name, term.pair);
        case 'path':
            return (occursFreeHoTT(name, term.type) ||
                occursFreeHoTT(name, term.left) ||
                occursFreeHoTT(name, term.right));
        case 'refl':
            return occursFreeHoTT(name, term.term);
        case 'succ':
            return occursFreeHoTT(name, term.arg);
        case 'transport':
            return (occursFreeHoTT(name, term.family) ||
                occursFreeHoTT(name, term.path) ||
                occursFreeHoTT(name, term.term));
        case 'pathSym':
            return occursFreeHoTT(name, term.path);
        case 'pathConcat':
            return occursFreeHoTT(name, term.left) || occursFreeHoTT(name, term.right);
        case 'ap':
            return occursFreeHoTT(name, term.fn) || occursFreeHoTT(name, term.path);
        case 'jElim':
            return (occursFreeHoTT(name, term.motive) ||
                occursFreeHoTT(name, term.baseCase) ||
                occursFreeHoTT(name, term.path));
        case 'suspension':
        case 'north':
        case 'south':
            return occursFreeHoTT(name, term.type);
        case 'meridian':
            return occursFreeHoTT(name, term.type) || occursFreeHoTT(name, term.point);
        case 'ua':
            return occursFreeHoTT(name, term.equiv);
    }
}
/** Recolecta el conjunto de variables libres del término HoTT dado. */
function freeVarsHoTT(term, acc = new Set()) {
    switch (term.kind) {
        case 'var':
            acc.add(term.name);
            break;
        case 'universe':
        case 'nat':
        case 'zero':
        case 'circle':
        case 'baseOfCircle':
        case 'loopOfCircle':
            break;
        case 'pi':
        case 'sigma': {
            const dom = term.kind === 'pi' ? term.domain : term.first;
            const cod = term.kind === 'pi' ? term.codomain : term.second;
            freeVarsHoTT(dom, acc);
            const inner = freeVarsHoTT(cod);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'lam': {
            freeVarsHoTT(term.domain, acc);
            const inner = freeVarsHoTT(term.body);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'app':
            freeVarsHoTT(term.fn, acc);
            freeVarsHoTT(term.arg, acc);
            break;
        case 'pair':
            freeVarsHoTT(term.fst, acc);
            freeVarsHoTT(term.snd, acc);
            break;
        case 'fst':
        case 'snd':
            freeVarsHoTT(term.pair, acc);
            break;
        case 'path':
            freeVarsHoTT(term.type, acc);
            freeVarsHoTT(term.left, acc);
            freeVarsHoTT(term.right, acc);
            break;
        case 'refl':
            freeVarsHoTT(term.term, acc);
            break;
        case 'succ':
            freeVarsHoTT(term.arg, acc);
            break;
        case 'transport':
            freeVarsHoTT(term.family, acc);
            freeVarsHoTT(term.path, acc);
            freeVarsHoTT(term.term, acc);
            break;
        case 'pathSym':
            freeVarsHoTT(term.path, acc);
            break;
        case 'pathConcat':
            freeVarsHoTT(term.left, acc);
            freeVarsHoTT(term.right, acc);
            break;
        case 'ap':
            freeVarsHoTT(term.fn, acc);
            freeVarsHoTT(term.path, acc);
            break;
        case 'jElim':
            freeVarsHoTT(term.motive, acc);
            freeVarsHoTT(term.baseCase, acc);
            freeVarsHoTT(term.path, acc);
            break;
        case 'suspension':
        case 'north':
        case 'south':
            freeVarsHoTT(term.type, acc);
            break;
        case 'meridian':
            freeVarsHoTT(term.type, acc);
            freeVarsHoTT(term.point, acc);
            break;
        case 'ua':
            freeVarsHoTT(term.equiv, acc);
            break;
    }
    return acc;
}
// ── Serialización ────────────────────────────────────────────
/** Serializa un término HoTT a una cadena legible usando notación matemática estándar. */
function termToStringHoTT(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'universe':
            return t.level === 0 ? 'Type' : `Type ${t.level}`;
        case 'pi':
            if (t.bind === '_' || !occursFreeHoTT(t.bind, t.codomain)) {
                return `(${termToStringHoTT(t.domain)} → ${termToStringHoTT(t.codomain)})`;
            }
            return `(Π (${t.bind} : ${termToStringHoTT(t.domain)}). ${termToStringHoTT(t.codomain)})`;
        case 'lam':
            return `(λ (${t.bind} : ${termToStringHoTT(t.domain)}). ${termToStringHoTT(t.body)})`;
        case 'app':
            return `(${termToStringHoTT(t.fn)} ${termToStringHoTT(t.arg)})`;
        case 'sigma':
            return `(Σ (${t.bind} : ${termToStringHoTT(t.first)}). ${termToStringHoTT(t.second)})`;
        case 'pair':
            return `⟨${termToStringHoTT(t.fst)}, ${termToStringHoTT(t.snd)}⟩`;
        case 'fst':
            return `fst(${termToStringHoTT(t.pair)})`;
        case 'snd':
            return `snd(${termToStringHoTT(t.pair)})`;
        case 'path':
            return `Path(${termToStringHoTT(t.type)}, ${termToStringHoTT(t.left)}, ${termToStringHoTT(t.right)})`;
        case 'refl':
            return `refl(${termToStringHoTT(t.term)})`;
        case 'nat':
            return 'Nat';
        case 'zero':
            return 'zero';
        case 'succ':
            return `succ(${termToStringHoTT(t.arg)})`;
        case 'transport':
            return `transport(${termToStringHoTT(t.family)}, ${termToStringHoTT(t.path)}, ${termToStringHoTT(t.term)})`;
        case 'pathSym':
            return `(${termToStringHoTT(t.path)})⁻¹`;
        case 'pathConcat':
            return `(${termToStringHoTT(t.left)} · ${termToStringHoTT(t.right)})`;
        case 'ap':
            return `ap(${termToStringHoTT(t.fn)}, ${termToStringHoTT(t.path)})`;
        case 'jElim':
            return `J(${termToStringHoTT(t.motive)}, ${termToStringHoTT(t.baseCase)}, ${termToStringHoTT(t.path)})`;
        case 'circle':
            return 'S¹';
        case 'baseOfCircle':
            return 'base';
        case 'loopOfCircle':
            return 'loop';
        case 'suspension':
            return `Σ-susp(${termToStringHoTT(t.type)})`;
        case 'north':
            return `north[${termToStringHoTT(t.type)}]`;
        case 'south':
            return `south[${termToStringHoTT(t.type)}]`;
        case 'meridian':
            return `meridian[${termToStringHoTT(t.type)}](${termToStringHoTT(t.point)})`;
        case 'ua':
            return `ua(${termToStringHoTT(t.equiv)})`;
    }
}
//# sourceMappingURL=types.js.map