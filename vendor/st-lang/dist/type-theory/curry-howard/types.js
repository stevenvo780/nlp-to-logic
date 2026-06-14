"use strict";
// ============================================================
// Curry-Howard — Tipos y términos
// ============================================================
//
// Correspondencia Curry-Howard:
//   tipo            ↔  proposición
//   programa        ↔  prueba
//   β-reducción     ↔  normalización de pruebas
//
// Constructores soportados:
//   →   (arrow)    →  implicación
//   ∧   (product)  →  conjunción
//   ∨   (sum)      →  disyunción
//   ⊥   (bottom)   →  falso
//   atom           →  variable proposicional
Object.defineProperty(exports, "__esModule", { value: true });
exports.absurd = exports.cse = exports.inr = exports.inl = exports.snd = exports.fst = exports.pair = exports.abs = exports.app = exports.vr = exports.bottom = exports.sum = exports.product = exports.arrow = exports.atom = void 0;
exports.eqType = eqType;
exports.typeToString = typeToString;
exports.termToString = termToString;
// ---------- Constructores convenientes ----------
/** Tipo atómico (variable proposicional). */
const atom = (name) => ({ kind: 'atom', name });
exports.atom = atom;
/** Tipo flecha `from → to` (implicación). */
const arrow = (from, to) => ({ kind: 'arrow', from, to });
exports.arrow = arrow;
/** Tipo producto `left ∧ right` (conjunción). */
const product = (left, right) => ({
    kind: 'product',
    left,
    right,
});
exports.product = product;
/** Tipo suma `left ∨ right` (disyunción). */
const sum = (left, right) => ({ kind: 'sum', left, right });
exports.sum = sum;
/** Tipo bottom `⊥` (falsedad / tipo vacío). */
const bottom = () => ({ kind: 'bottom' });
exports.bottom = bottom;
/** Variable λ. */
const vr = (name) => ({ kind: 'var', name });
exports.vr = vr;
/** Aplicación de función (modus ponens). */
const app = (fn, arg) => ({ kind: 'app', fn, arg });
exports.app = app;
/** Abstracción λ (implicación-intro): `λparam:paramType. body`. */
const abs = (param, paramType, body) => ({
    kind: 'abs',
    param,
    paramType,
    body,
});
exports.abs = abs;
/** Par `⟨f, s⟩` (conjunción-intro). */
const pair = (f, s) => ({
    kind: 'pair',
    fst: f,
    snd: s,
});
exports.pair = pair;
/** Proyección izquierda `fst(p)` (∧E-L). */
const fst = (p) => ({ kind: 'fst', pair: p });
exports.fst = fst;
/** Proyección derecha `snd(p)` (∧E-R). */
const snd = (p) => ({ kind: 'snd', pair: p });
exports.snd = snd;
/** Inyección izquierda `inl(left)` (∨I-L); requiere el tipo del lado derecho. */
const inl = (left, rightType) => ({
    kind: 'inl',
    left,
    rightType,
});
exports.inl = inl;
/** Inyección derecha `inr(right)` (∨I-R); requiere el tipo del lado izquierdo. */
const inr = (right, leftType) => ({
    kind: 'inr',
    right,
    leftType,
});
exports.inr = inr;
/** Eliminación de disyunción `case scrutinee of inl(lb)→leftBody | inr(rb)→rightBody` (∨E). */
const cse = (scrutinee, leftBind, leftBody, rightBind, rightBody) => ({
    kind: 'case',
    scrutinee,
    leftBind,
    leftBody,
    rightBind,
    rightBody,
});
exports.cse = cse;
/** Ex falso: dado `proofOfFalse : ⊥`, produce cualquier tipo `resultType` (⊥E). */
const absurd = (proofOfFalse, resultType) => ({
    kind: 'absurd',
    proofOfFalse,
    resultType,
});
exports.absurd = absurd;
// ---------- Igualdad estructural de tipos ----------
/** Igualdad estructural entre dos tipos proposicionales. */
function eqType(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'atom':
            return a.name === b.name;
        case 'arrow': {
            const bb = b;
            return eqType(a.from, bb.from) && eqType(a.to, bb.to);
        }
        case 'product': {
            const bb = b;
            return eqType(a.left, bb.left) && eqType(a.right, bb.right);
        }
        case 'sum': {
            const bb = b;
            return eqType(a.left, bb.left) && eqType(a.right, bb.right);
        }
        case 'bottom':
            return true;
    }
}
// ---------- Serialización legible ----------
/** Serializa un tipo proposicional a texto con notación estándar (→, ∧, ∨, ⊥). */
function typeToString(t) {
    switch (t.kind) {
        case 'atom':
            return t.name;
        case 'bottom':
            return '⊥';
        case 'arrow': {
            const lhs = t.from.kind === 'arrow' ? `(${typeToString(t.from)})` : typeToString(t.from);
            return `${lhs} → ${typeToString(t.to)}`;
        }
        case 'product':
            return `(${typeToString(t.left)} ∧ ${typeToString(t.right)})`;
        case 'sum':
            return `(${typeToString(t.left)} ∨ ${typeToString(t.right)})`;
    }
}
/** Serializa un término λ a texto con notación estándar (λ, fst, snd, inl, inr, case, absurd). */
function termToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'app':
            return `(${termToString(t.fn)} ${termToString(t.arg)})`;
        case 'abs':
            return `(λ${t.param}:${typeToString(t.paramType)}. ${termToString(t.body)})`;
        case 'pair':
            return `⟨${termToString(t.fst)}, ${termToString(t.snd)}⟩`;
        case 'fst':
            return `fst(${termToString(t.pair)})`;
        case 'snd':
            return `snd(${termToString(t.pair)})`;
        case 'inl':
            return `inl(${termToString(t.left)})`;
        case 'inr':
            return `inr(${termToString(t.right)})`;
        case 'case':
            return `case ${termToString(t.scrutinee)} of inl(${t.leftBind})→${termToString(t.leftBody)} | inr(${t.rightBind})→${termToString(t.rightBody)}`;
        case 'absurd':
            return `absurd(${termToString(t.proofOfFalse)} : ${typeToString(t.resultType)})`;
    }
}
//# sourceMappingURL=types.js.map