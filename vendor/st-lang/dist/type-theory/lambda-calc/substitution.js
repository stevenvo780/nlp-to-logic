"use strict";
// ============================================================
// λ-cálculo untyped — Variables libres, α-renombrado, sustitución
// capture-avoiding
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeVars = freeVars;
exports.makeFreshSupply = makeFreshSupply;
exports.alphaRename = alphaRename;
exports.substitute = substitute;
// Free variables del término.
function freeVars(t) {
    const acc = new Set();
    collectFree(t, acc);
    return acc;
}
function collectFree(t, acc) {
    switch (t.kind) {
        case 'var':
            acc.add(t.name);
            return;
        case 'app':
            collectFree(t.fn, acc);
            collectFree(t.arg, acc);
            return;
        case 'abs': {
            const inner = new Set();
            collectFree(t.body, inner);
            inner.delete(t.param);
            for (const x of inner)
                acc.add(x);
            return;
        }
    }
}
// Conjunto de todos los nombres mencionados (libres o ligados).
function allNames(t, acc = new Set()) {
    switch (t.kind) {
        case 'var':
            acc.add(t.name);
            return acc;
        case 'app':
            allNames(t.fn, acc);
            allNames(t.arg, acc);
            return acc;
        case 'abs':
            acc.add(t.param);
            allNames(t.body, acc);
            return acc;
    }
}
// Generador de nombres frescos. Mantiene un contador local para
// reproducibilidad — el patrón es `<base>#<n>`.
function makeFreshSupply(seed = 0) {
    let n = seed;
    return () => `_x${n++}`;
}
function freshName(base, avoid) {
    // Quita un sufijo `#N` previo para no acumular hashes.
    const stripped = base.replace(/#\d+$/, '');
    let i = 0;
    let candidate = `${stripped}#${i}`;
    while (avoid.has(candidate)) {
        i += 1;
        candidate = `${stripped}#${i}`;
    }
    return candidate;
}
// α-renombra todos los binders del término usando `freshSupply`. Útil
// para canonicalizar términos sin ambigüedad de nombres.
function alphaRename(t, freshSupply) {
    return rename(t, new Map(), freshSupply);
}
function rename(t, env, supply) {
    switch (t.kind) {
        case 'var':
            return { kind: 'var', name: env.get(t.name) ?? t.name };
        case 'app':
            return { kind: 'app', fn: rename(t.fn, env, supply), arg: rename(t.arg, env, supply) };
        case 'abs': {
            const fresh = supply();
            const newEnv = new Map(env);
            newEnv.set(t.param, fresh);
            return { kind: 'abs', param: fresh, body: rename(t.body, newEnv, supply) };
        }
    }
}
// Sustitución capture-avoiding: t[varName := replacement].
// Cuando un binder choca con FV(replacement), α-renombra el binder a
// un nombre fresco antes de descender — evita captura silenciosa.
function substitute(t, varName, replacement) {
    const fvRep = freeVars(replacement);
    return subst(t, varName, replacement, fvRep);
}
function subst(t, name, value, fvValue) {
    switch (t.kind) {
        case 'var':
            return t.name === name ? value : t;
        case 'app':
            return {
                kind: 'app',
                fn: subst(t.fn, name, value, fvValue),
                arg: subst(t.arg, name, value, fvValue),
            };
        case 'abs': {
            if (t.param === name)
                return t; // ligado: la sustitución se detiene
            if (!fvValue.has(t.param)) {
                return { kind: 'abs', param: t.param, body: subst(t.body, name, value, fvValue) };
            }
            // Captura inminente: renombra el binder.
            const avoid = new Set([...fvValue, ...allNames(t.body)]);
            avoid.add(name);
            const fresh = freshName(t.param, avoid);
            const renamedBody = subst(t.body, t.param, { kind: 'var', name: fresh }, new Set([fresh]));
            return { kind: 'abs', param: fresh, body: subst(renamedBody, name, value, fvValue) };
        }
    }
}
//# sourceMappingURL=substitution.js.map