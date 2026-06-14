"use strict";
// ============================================================
// Lambda Cube — Erasure a λ-cálculo no tipado
// ============================================================
//
// La función de borrado (erasure / type-erasure) traduce un término
// del cubo a un λ-término puro:
//
//   |x|            = x
//   |s|            = ⊥  (sorts no tienen representante runtime)
//   |λ x:A. b|     = λ x. |b|
//   |Π x:A. B|     = ⊥  (los Π son tipos, no se ejecutan)
//   |f a|          = |f| |a|
//
// El erasure preserva β: si `t →β t'` en el cubo entonces
// `|t| →β |t'|` en λ-untyped. Esa es la base de la "phase distinction"
// estándar de los sistemas de tipos polimórficos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEraseError = isEraseError;
exports.erase = erase;
exports.untypedToString = untypedToString;
function isEraseError(r) {
    return typeof r === 'object' && r !== null && 'error' in r && typeof r.error === 'string';
}
/**
 * Borrado total a λ-cálculo no tipado. Sorts y Π no tienen
 * representante runtime — si aparecen como sub-término principal,
 * el resultado es un error de borrado.
 */
function erase(term) {
    switch (term.kind) {
        case 'var':
            return { kind: 'var', name: term.name };
        case 'sort':
            return { error: `no se puede borrar el sort '${term.sort}' a λ-untyped` };
        case 'pi':
            return { error: `no se puede borrar un Π-type a λ-untyped` };
        case 'lam': {
            const body = erase(term.body);
            if (isEraseError(body))
                return body;
            return { kind: 'abs', param: term.bind, body };
        }
        case 'app': {
            const fn = erase(term.fn);
            if (isEraseError(fn))
                return fn;
            const arg = erase(term.arg);
            if (isEraseError(arg))
                return arg;
            return { kind: 'app', fn, arg };
        }
    }
}
/** Serialización legible del λ-untyped. */
function untypedToString(t) {
    switch (t.kind) {
        case 'var':
            return t.name;
        case 'abs':
            return `(λ${t.param}. ${untypedToString(t.body)})`;
        case 'app': {
            const arg = t.arg.kind === 'app' ? `(${untypedToString(t.arg)})` : untypedToString(t.arg);
            return `(${untypedToString(t.fn)} ${arg})`;
        }
    }
}
//# sourceMappingURL=erase.js.map