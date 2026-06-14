"use strict";
// ============================================================
// Cubical Type Theory (CTT-Lite) — términos y constructores
// ============================================================
//
// Subset pedagógico de Cubical Type Theory. La diferencia esencial
// con HoTT (homotopy type theory) es que aquí univalence pasa a ser
// COMPUTACIONAL via:
//
//   - Un intervalo formal I con dos extremos i0, i1 y conexiones
//     (∧ min, ∨ max) más involutiva (1 - i).
//   - PathP A x y = caminos con familia dependiente sobre I.
//   - Path-abstracción y aplicación (λi. t) @ i con reducción por
//     sustitución de la variable de intervalo.
//   - Glue como precursor sintáctico de transport sobre ua.
//
// Re-empaquetamos las construcciones MLTT mínimas que el subset
// necesita (Π, λ, app, var, universo). Para evitar conflictos de
// tipos con HoTT, este módulo es autocontenido: CubicalTerm vive en
// su propio universo de tipos.
//
// API mínima compatible con MLTT/HoTT:
//   inferType / normalize / isIntervalExpr / evalInterval
Object.defineProperty(exports, "__esModule", { value: true });
exports.cArrow = exports.cApp = exports.cLam = exports.cPi = exports.cUniverse = exports.cVar = exports.cGlue = exports.cPApp = exports.cPLam = exports.cPathP = exports.cINeg = exports.cIMax = exports.cIMin = exports.cIVar = exports.cI1 = exports.cI0 = void 0;
exports.isIntervalExpr = isIntervalExpr;
exports.occursFreeCubical = occursFreeCubical;
exports.freeVarsCubical = freeVarsCubical;
exports.termToStringCubical = termToStringCubical;
// ── Constructores convenientes ──────────────────────────────
/** Extremo inferior del intervalo `i0 : I`. */
const cI0 = () => ({ kind: 'i0' });
exports.cI0 = cI0;
/** Extremo superior del intervalo `i1 : I`. */
const cI1 = () => ({ kind: 'i1' });
exports.cI1 = cI1;
/** Variable de intervalo `name : I`. */
const cIVar = (name) => ({ kind: 'iVar', name });
exports.cIVar = cIVar;
/** Mínimo de intervalo `left ∧ right` (conexión). */
const cIMin = (left, right) => ({
    kind: 'iMin',
    left,
    right,
});
exports.cIMin = cIMin;
/** Máximo de intervalo `left ∨ right` (conexión). */
const cIMax = (left, right) => ({
    kind: 'iMax',
    left,
    right,
});
exports.cIMax = cIMax;
/** Negación de intervalo `~arg` (involución: `~i0 = i1`). */
const cINeg = (arg) => ({ kind: 'iNeg', arg });
exports.cINeg = cINeg;
/** `PathP family left right` — tipo de caminos dependientes sobre la familia `family`. */
const cPathP = (family, left, right) => ({
    kind: 'pathP',
    family,
    left,
    right,
});
exports.cPathP = cPathP;
/** Abstracción de camino `λi. body` donde `bind` es la variable de intervalo. */
const cPLam = (bind, body) => ({
    kind: 'pLam',
    bind,
    body,
});
exports.cPLam = cPLam;
/** Aplicación de camino `path @ arg` (evaluación en un punto del intervalo). */
const cPApp = (path, arg) => ({
    kind: 'pApp',
    path,
    arg,
});
exports.cPApp = cPApp;
/** Glue: construcción precursora de univalencia computacional con equivalencia `equiv` y parcial `partial`. */
const cGlue = (equiv, partial) => ({
    kind: 'glue',
    equiv,
    partial,
});
exports.cGlue = cGlue;
/** Variable del cálculo de tipos. */
const cVar = (name) => ({ kind: 'var', name });
exports.cVar = cVar;
/** Universo de tipos de nivel `level` (default 0). */
const cUniverse = (level = 0) => ({ kind: 'universe', level });
exports.cUniverse = cUniverse;
/** Tipo Π dependiente `Π (bind : domain). codomain`. */
const cPi = (bind, domain, codomain) => ({
    kind: 'pi',
    bind,
    domain,
    codomain,
});
exports.cPi = cPi;
/** Abstracción dependiente `λ (bind : domain). body`. */
const cLam = (bind, domain, body) => ({
    kind: 'lam',
    bind,
    domain,
    body,
});
exports.cLam = cLam;
/** Aplicación de término `fn arg`. */
const cApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.cApp = cApp;
/** Flecha no dependiente `from → to` (azúcar para `cPi('_', from, to)`). */
const cArrow = (from, to) => (0, exports.cPi)('_', from, to);
exports.cArrow = cArrow;
// ── Discriminador de fragmentos del intervalo ───────────────
/** Devuelve `true` si el término `t` es una expresión pura del intervalo I (i0, i1, iVar, iMin, iMax, iNeg). */
function isIntervalExpr(t) {
    switch (t.kind) {
        case 'i0':
        case 'i1':
        case 'iVar':
            return true;
        case 'iMin':
        case 'iMax':
            return isIntervalExpr(t.left) && isIntervalExpr(t.right);
        case 'iNeg':
            return isIntervalExpr(t.arg);
        default:
            return false;
    }
}
// ── Inspección estructural ───────────────────────────────────
/** Devuelve `true` si `name` ocurre libre en `term`. */
function occursFreeCubical(name, term) {
    switch (term.kind) {
        case 'i0':
        case 'i1':
        case 'universe':
            return false;
        case 'var':
        case 'iVar':
            return term.name === name;
        case 'iMin':
        case 'iMax':
            return occursFreeCubical(name, term.left) || occursFreeCubical(name, term.right);
        case 'iNeg':
            return occursFreeCubical(name, term.arg);
        case 'pathP':
            return (occursFreeCubical(name, term.family) ||
                occursFreeCubical(name, term.left) ||
                occursFreeCubical(name, term.right));
        case 'pLam':
            if (term.bind === name)
                return false;
            return occursFreeCubical(name, term.body);
        case 'pApp':
            return occursFreeCubical(name, term.path) || occursFreeCubical(name, term.arg);
        case 'glue':
            return occursFreeCubical(name, term.equiv) || occursFreeCubical(name, term.partial);
        case 'pi': {
            if (occursFreeCubical(name, term.domain))
                return true;
            if (term.bind === name)
                return false;
            return occursFreeCubical(name, term.codomain);
        }
        case 'lam': {
            if (occursFreeCubical(name, term.domain))
                return true;
            if (term.bind === name)
                return false;
            return occursFreeCubical(name, term.body);
        }
        case 'app':
            return occursFreeCubical(name, term.fn) || occursFreeCubical(name, term.arg);
    }
}
/** Acumula en `acc` (o devuelve un nuevo Set) el conjunto de variables libres del término. */
function freeVarsCubical(term, acc = new Set()) {
    switch (term.kind) {
        case 'i0':
        case 'i1':
        case 'universe':
            break;
        case 'var':
        case 'iVar':
            acc.add(term.name);
            break;
        case 'iMin':
        case 'iMax':
            freeVarsCubical(term.left, acc);
            freeVarsCubical(term.right, acc);
            break;
        case 'iNeg':
            freeVarsCubical(term.arg, acc);
            break;
        case 'pathP':
            freeVarsCubical(term.family, acc);
            freeVarsCubical(term.left, acc);
            freeVarsCubical(term.right, acc);
            break;
        case 'pLam': {
            const inner = freeVarsCubical(term.body);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'pApp':
            freeVarsCubical(term.path, acc);
            freeVarsCubical(term.arg, acc);
            break;
        case 'glue':
            freeVarsCubical(term.equiv, acc);
            freeVarsCubical(term.partial, acc);
            break;
        case 'pi': {
            freeVarsCubical(term.domain, acc);
            const inner = freeVarsCubical(term.codomain);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'lam': {
            freeVarsCubical(term.domain, acc);
            const inner = freeVarsCubical(term.body);
            inner.delete(term.bind);
            for (const v of inner)
                acc.add(v);
            break;
        }
        case 'app':
            freeVarsCubical(term.fn, acc);
            freeVarsCubical(term.arg, acc);
            break;
    }
    return acc;
}
// ── Serialización ────────────────────────────────────────────
/** Serializa un término CTT-Lite a su representación textual estándar. */
function termToStringCubical(t) {
    switch (t.kind) {
        case 'i0':
            return 'i0';
        case 'i1':
            return 'i1';
        case 'iVar':
            return t.name;
        case 'iMin':
            return `(${termToStringCubical(t.left)} ∧ ${termToStringCubical(t.right)})`;
        case 'iMax':
            return `(${termToStringCubical(t.left)} ∨ ${termToStringCubical(t.right)})`;
        case 'iNeg':
            return `~${termToStringCubical(t.arg)}`;
        case 'pathP':
            return `PathP(${termToStringCubical(t.family)}, ${termToStringCubical(t.left)}, ${termToStringCubical(t.right)})`;
        case 'pLam':
            return `(λi:I. ${t.bind} → ${termToStringCubical(t.body)})`;
        case 'pApp':
            return `(${termToStringCubical(t.path)} @ ${termToStringCubical(t.arg)})`;
        case 'glue':
            return `glue(${termToStringCubical(t.equiv)}, ${termToStringCubical(t.partial)})`;
        case 'var':
            return t.name;
        case 'universe':
            return t.level === 0 ? 'Type' : `Type ${t.level}`;
        case 'pi':
            if (t.bind === '_' || !occursFreeCubical(t.bind, t.codomain)) {
                return `(${termToStringCubical(t.domain)} → ${termToStringCubical(t.codomain)})`;
            }
            return `(Π (${t.bind} : ${termToStringCubical(t.domain)}). ${termToStringCubical(t.codomain)})`;
        case 'lam':
            return `(λ (${t.bind} : ${termToStringCubical(t.domain)}). ${termToStringCubical(t.body)})`;
        case 'app':
            return `(${termToStringCubical(t.fn)} ${termToStringCubical(t.arg)})`;
    }
}
//# sourceMappingURL=types.js.map