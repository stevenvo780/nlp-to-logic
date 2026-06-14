"use strict";
// ============================================================
// MLTT — Sustitución capture-avoiding y α-renombrado
// ============================================================
//
// La sustitución dependiente debe entrar también en `domain` /
// `first` / `second` / `codomain` / `type` porque los tipos son
// términos y pueden mencionar variables libres.
Object.defineProperty(exports, "__esModule", { value: true });
exports.substitute = substitute;
const types_1 = require("./types");
let freshCounter = 0;
function fresh(base, avoid) {
    let candidate = `${base}#${freshCounter++}`;
    while (avoid.has(candidate))
        candidate = `${base}#${freshCounter++}`;
    return candidate;
}
/** Sustitución capture-avoiding: term[value/name]. */
function substitute(term, name, value) {
    switch (term.kind) {
        case 'var':
            return term.name === name ? value : term;
        case 'universe':
        case 'nat':
        case 'zero':
            return term;
        case 'pi':
            return substBinder(term, name, value, term.domain, term.codomain, (bind, dom, cod) => ({
                kind: 'pi',
                bind,
                domain: dom,
                codomain: cod,
            }));
        case 'sigma':
            return substBinder(term, name, value, term.first, term.second, (bind, dom, cod) => ({
                kind: 'sigma',
                bind,
                first: dom,
                second: cod,
            }));
        case 'lam':
            return substBinder(term, name, value, term.domain, term.body, (bind, dom, body) => ({
                kind: 'lam',
                bind,
                domain: dom,
                body,
            }));
        case 'app':
            return {
                kind: 'app',
                fn: substitute(term.fn, name, value),
                arg: substitute(term.arg, name, value),
            };
        case 'pair':
            return {
                kind: 'pair',
                fst: substitute(term.fst, name, value),
                snd: substitute(term.snd, name, value),
            };
        case 'fst':
            return { kind: 'fst', pair: substitute(term.pair, name, value) };
        case 'snd':
            return { kind: 'snd', pair: substitute(term.pair, name, value) };
        case 'identity':
            return {
                kind: 'identity',
                type: substitute(term.type, name, value),
                left: substitute(term.left, name, value),
                right: substitute(term.right, name, value),
            };
        case 'refl':
            return { kind: 'refl', term: substitute(term.term, name, value) };
        case 'succ':
            return { kind: 'succ', arg: substitute(term.arg, name, value) };
    }
}
// Helper común para Π / Σ / λ: maneja captura y reusa la estructura.
function substBinder(source, name, value, dom, cod, build) {
    // El `domain` / `first` está fuera del binder → siempre se sustituye.
    const newDom = substitute(dom, name, value);
    // Si el binder coincide con `name`, el `cod` no contiene `name` libre.
    if (source.bind === name) {
        return build(source.bind, newDom, cod);
    }
    const fv = (0, types_1.freeVars)(value);
    if (fv.has(source.bind)) {
        const newBind = fresh(source.bind, new Set([...fv, ...(0, types_1.freeVars)(cod), name]));
        const renamedCod = substitute(cod, source.bind, { kind: 'var', name: newBind });
        return build(newBind, newDom, substitute(renamedCod, name, value));
    }
    return build(source.bind, newDom, substitute(cod, name, value));
}
//# sourceMappingURL=substitute.js.map