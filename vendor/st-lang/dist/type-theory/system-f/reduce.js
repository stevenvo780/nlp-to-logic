"use strict";
// ============================================================
// System F — β-reducción + type-β
// ============================================================
//
// Reglas:
//   (λx:T. M) N      ↦  M[x := N]            (β a nivel término)
//   (Λ X. M) [T]     ↦  M[X := T]            (type-β)
//
// Estrategia: leftmost-outermost (call-by-name) en términos y tipos.
// `reduceBeta` aplica UN paso (devuelve el mismo término por
// identidad referencial si no había redex).
// `normalize` itera hasta forma normal con guardia anti-loop.
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeVars = freeVars;
exports.termTypeVars = termTypeVars;
exports.substType = substType;
exports.substTypeInTerm = substTypeInTerm;
exports.substTerm = substTerm;
exports.reduceBeta = reduceBeta;
exports.isNormal = isNormal;
exports.normalize = normalize;
const types_1 = require("./types");
// ---------- Variables libres a nivel término ----------
function freeVars(t, acc = new Set()) {
    switch (t.kind) {
        case 'var':
            acc.add(t.name);
            return acc;
        case 'abs': {
            const inner = freeVars(t.body);
            inner.delete(t.param);
            for (const v of inner)
                acc.add(v);
            return acc;
        }
        case 'app':
            freeVars(t.fn, acc);
            freeVars(t.arg, acc);
            return acc;
        case 'tabs':
            // Λ no liga variables de término, sólo de tipo.
            freeVars(t.body, acc);
            return acc;
        case 'tapp':
            freeVars(t.fn, acc);
            return acc;
    }
}
// Variables de tipo que aparecen en un término (en anotaciones y en
// type applications). Usado para capture-avoidance al sustituir.
function termTypeVars(t, acc = new Set()) {
    switch (t.kind) {
        case 'var':
            return acc;
        case 'abs':
            for (const v of (0, types_1.freeTypeVars)(t.paramType))
                acc.add(v);
            termTypeVars(t.body, acc);
            return acc;
        case 'app':
            termTypeVars(t.fn, acc);
            termTypeVars(t.arg, acc);
            return acc;
        case 'tabs': {
            const inner = termTypeVars(t.body);
            inner.delete(t.bind);
            for (const v of inner)
                acc.add(v);
            return acc;
        }
        case 'tapp':
            termTypeVars(t.fn, acc);
            for (const v of (0, types_1.freeTypeVars)(t.typeArg))
                acc.add(v);
            return acc;
    }
}
let freshCounter = 0;
function fresh(base, avoid) {
    let candidate = `${base}#${freshCounter++}`;
    while (avoid.has(candidate))
        candidate = `${base}#${freshCounter++}`;
    return candidate;
}
// ---------- Sustitución de tipo dentro de un tipo: T[X := S] ----------
function substType(target, name, replacement) {
    switch (target.kind) {
        case 'atom':
            return target.name === name ? replacement : target;
        case 'arrow':
            return {
                kind: 'arrow',
                from: substType(target.from, name, replacement),
                to: substType(target.to, name, replacement),
            };
        case 'forall': {
            if (target.bind === name)
                return target; // X queda ligado, no sustituir
            const fv = (0, types_1.freeTypeVars)(replacement);
            if (fv.has(target.bind)) {
                // captura → α-renombrar el binder
                const newName = fresh(target.bind, new Set([...fv, ...(0, types_1.freeTypeVars)(target.body)]));
                const renamed = substType(target.body, target.bind, { kind: 'atom', name: newName });
                return { kind: 'forall', bind: newName, body: substType(renamed, name, replacement) };
            }
            return { kind: 'forall', bind: target.bind, body: substType(target.body, name, replacement) };
        }
    }
}
// ---------- Sustitución de tipo dentro de un término: M[X := S] ----------
// (renombra anotaciones de tipo en λ, propaga al type-application).
function substTypeInTerm(term, name, replacement) {
    switch (term.kind) {
        case 'var':
            return term;
        case 'abs':
            return {
                kind: 'abs',
                param: term.param,
                paramType: substType(term.paramType, name, replacement),
                body: substTypeInTerm(term.body, name, replacement),
            };
        case 'app':
            return {
                kind: 'app',
                fn: substTypeInTerm(term.fn, name, replacement),
                arg: substTypeInTerm(term.arg, name, replacement),
            };
        case 'tabs': {
            if (term.bind === name)
                return term; // X queda ligado
            const fv = (0, types_1.freeTypeVars)(replacement);
            if (fv.has(term.bind)) {
                const avoid = new Set([...fv, ...termTypeVars(term.body)]);
                const newName = fresh(term.bind, avoid);
                const renamed = substTypeInTerm(term.body, term.bind, { kind: 'atom', name: newName });
                return { kind: 'tabs', bind: newName, body: substTypeInTerm(renamed, name, replacement) };
            }
            return { kind: 'tabs', bind: term.bind, body: substTypeInTerm(term.body, name, replacement) };
        }
        case 'tapp':
            return {
                kind: 'tapp',
                fn: substTypeInTerm(term.fn, name, replacement),
                typeArg: substType(term.typeArg, name, replacement),
            };
    }
}
// ---------- Sustitución de término dentro de término: M[x := N] ----------
function substTerm(term, name, value) {
    switch (term.kind) {
        case 'var':
            return term.name === name ? value : term;
        case 'app':
            return {
                kind: 'app',
                fn: substTerm(term.fn, name, value),
                arg: substTerm(term.arg, name, value),
            };
        case 'abs': {
            if (term.param === name)
                return term;
            const fv = freeVars(value);
            if (fv.has(term.param)) {
                // capture clash de variable de término → α-renombrar el binder
                const newName = fresh(term.param, new Set([...fv, ...freeVars(term.body)]));
                const renamed = substTerm(term.body, term.param, { kind: 'var', name: newName });
                return {
                    kind: 'abs',
                    param: newName,
                    paramType: term.paramType,
                    body: substTerm(renamed, name, value),
                };
            }
            return {
                kind: 'abs',
                param: term.param,
                paramType: term.paramType,
                body: substTerm(term.body, name, value),
            };
        }
        case 'tabs': {
            // Λ X. M — capture-avoidance respecto a variables de TIPO que
            // pudieran chocar entre el binder X y los tipos libres del value.
            const fvTypeInValue = termTypeVars(value);
            if (fvTypeInValue.has(term.bind)) {
                const avoid = new Set([...fvTypeInValue, ...termTypeVars(term.body)]);
                const newName = fresh(term.bind, avoid);
                const renamed = substTypeInTerm(term.body, term.bind, { kind: 'atom', name: newName });
                return { kind: 'tabs', bind: newName, body: substTerm(renamed, name, value) };
            }
            return { kind: 'tabs', bind: term.bind, body: substTerm(term.body, name, value) };
        }
        case 'tapp':
            return {
                kind: 'tapp',
                fn: substTerm(term.fn, name, value),
                typeArg: term.typeArg,
            };
    }
}
// ---------- Un paso de reducción ----------
// β: (λx:T. M) N → M[x := N]
// type-β: (Λ X. M) [T] → M[X := T]
// Estrategia leftmost-outermost. Identidad referencial si no hay redex.
function reduceBeta(term) {
    switch (term.kind) {
        case 'var':
            return term;
        case 'app': {
            if (term.fn.kind === 'abs') {
                return substTerm(term.fn.body, term.fn.param, term.arg);
            }
            const fn2 = reduceBeta(term.fn);
            if (fn2 !== term.fn)
                return { kind: 'app', fn: fn2, arg: term.arg };
            const arg2 = reduceBeta(term.arg);
            if (arg2 !== term.arg)
                return { kind: 'app', fn: term.fn, arg: arg2 };
            return term;
        }
        case 'abs': {
            const b2 = reduceBeta(term.body);
            if (b2 !== term.body)
                return { kind: 'abs', param: term.param, paramType: term.paramType, body: b2 };
            return term;
        }
        case 'tapp': {
            if (term.fn.kind === 'tabs') {
                return substTypeInTerm(term.fn.body, term.fn.bind, term.typeArg);
            }
            const fn2 = reduceBeta(term.fn);
            if (fn2 !== term.fn)
                return { kind: 'tapp', fn: fn2, typeArg: term.typeArg };
            return term;
        }
        case 'tabs': {
            const b2 = reduceBeta(term.body);
            if (b2 !== term.body)
                return { kind: 'tabs', bind: term.bind, body: b2 };
            return term;
        }
    }
}
function isNormal(term) {
    return reduceBeta(term) === term;
}
function normalize(term, maxSteps = 1000) {
    let current = term;
    for (let i = 0; i < maxSteps; i++) {
        const next = reduceBeta(current);
        if (next === current)
            return { result: current, steps: i, terminated: true };
        current = next;
    }
    return { result: current, steps: maxSteps, terminated: false };
}
//# sourceMappingURL=reduce.js.map