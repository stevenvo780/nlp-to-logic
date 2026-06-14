"use strict";
// ============================================================
// Higher-order unification — β-normalización y sustitución
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeVarsHO = freeVarsHO;
exports.allNamesHO = allNamesHO;
exports.freshName = freshName;
exports.resetFreshCounter = resetFreshCounter;
exports.substituteHO = substituteHO;
exports.applyHOSubst = applyHOSubst;
exports.normalize = normalize;
exports.flattenApp = flattenApp;
// ---- Variables libres y ligadas ----
function freeVarsHO(t) {
    const acc = new Set();
    collectFreeHO(t, new Set(), acc);
    return acc;
}
function collectFreeHO(t, bound, acc) {
    switch (t.kind) {
        case 'var':
            if (!bound.has(t.name))
                acc.add(t.name);
            return;
        case 'meta':
            return;
        case 'abs': {
            const b2 = new Set(bound);
            b2.add(t.param);
            collectFreeHO(t.body, b2, acc);
            return;
        }
        case 'app':
            collectFreeHO(t.fn, bound, acc);
            for (const a of t.args)
                collectFreeHO(a, bound, acc);
            return;
    }
}
function allNamesHO(t, acc = new Set()) {
    switch (t.kind) {
        case 'var':
            acc.add(t.name);
            return acc;
        case 'meta':
            return acc;
        case 'abs':
            acc.add(t.param);
            allNamesHO(t.body, acc);
            return acc;
        case 'app':
            allNamesHO(t.fn, acc);
            for (const a of t.args)
                allNamesHO(a, acc);
            return acc;
    }
}
// ---- Generador de nombres frescos ----
let _freshCounter = 0;
function freshName(avoid, base = '_h') {
    let name;
    do {
        name = `${base}${_freshCounter++}`;
    } while (avoid.has(name));
    return name;
}
function resetFreshCounter() {
    _freshCounter = 0;
}
// ---- Sustitución capture-avoiding en HOTerm ----
function substituteHO(t, varName, replacement) {
    const fvRep = freeVarsHO(replacement);
    return substHO(t, varName, replacement, fvRep);
}
function substHO(t, name, value, fvVal) {
    switch (t.kind) {
        case 'var':
            return t.name === name ? value : t;
        case 'meta':
            return t;
        case 'abs': {
            if (t.param === name)
                return t;
            if (!fvVal.has(t.param)) {
                return { kind: 'abs', param: t.param, body: substHO(t.body, name, value, fvVal) };
            }
            const avoid = new Set([...fvVal, ...allNamesHO(t.body)]);
            avoid.add(name);
            const fresh = freshName(avoid, t.param);
            const renamedBody = substHO(t.body, t.param, { kind: 'var', name: fresh }, new Set([fresh]));
            return { kind: 'abs', param: fresh, body: substHO(renamedBody, name, value, fvVal) };
        }
        case 'app':
            return {
                kind: 'app',
                fn: substHO(t.fn, name, value, fvVal),
                args: t.args.map((a) => substHO(a, name, value, fvVal)),
            };
    }
}
// ---- Aplicación de sustitución de meta-variables ----
function applyHOSubst(t, subst) {
    switch (t.kind) {
        case 'var':
            return t;
        case 'meta': {
            const binding = subst[t.name];
            return binding !== undefined ? applyHOSubst(binding, subst) : t;
        }
        case 'abs':
            return { kind: 'abs', param: t.param, body: applyHOSubst(t.body, subst) };
        case 'app': {
            const fn = applyHOSubst(t.fn, subst);
            const args = t.args.map((a) => applyHOSubst(a, subst));
            // β-reduce en cabeza si es posible tras expandir meta
            return betaReduceHead({ kind: 'app', fn, args });
        }
    }
}
// β-reducción en la cabeza (un solo paso si corresponde).
function betaReduceHead(t) {
    if (t.args.length === 0)
        return t.fn;
    let result = t.fn;
    for (const arg of t.args) {
        if (result.kind === 'abs') {
            result = substituteHO(result.body, result.param, arg);
        }
        else {
            // No podemos reducir más; reconstruir app parcial
            return { kind: 'app', fn: result, args: t.args.slice(t.args.indexOf(arg)) };
        }
    }
    return result;
}
// ---- Normalización β (leftmost-outermost, aplana apps) ----
function normalize(t) {
    const t2 = normalizeStep(t);
    return t2 === null ? t : normalize(t2);
}
function normalizeStep(t) {
    switch (t.kind) {
        case 'var':
        case 'meta':
            return null;
        case 'abs': {
            const b2 = normalizeStep(t.body);
            return b2 === null ? null : { kind: 'abs', param: t.param, body: b2 };
        }
        case 'app': {
            // Aplana args (app (app f [a,b]) [c]) → app f [a,b,c])
            const flat = flattenApp(t);
            const fn = flat.fn;
            const args = flat.args;
            // β-redex: cabeza es abs
            if (fn.kind === 'abs' && args.length > 0) {
                const [first, ...rest] = args;
                const reduced = substituteHO(fn.body, fn.param, first);
                const next = rest.length === 0 ? reduced : { kind: 'app', fn: reduced, args: rest };
                return next;
            }
            // Reducir cabeza
            const fn2 = normalizeStep(fn);
            if (fn2 !== null)
                return { kind: 'app', fn: fn2, args };
            // Reducir args izquierda a derecha
            for (let i = 0; i < args.length; i++) {
                const a2 = normalizeStep(args[i]);
                if (a2 !== null) {
                    const newArgs = [...args];
                    newArgs[i] = a2;
                    return { kind: 'app', fn, args: newArgs };
                }
            }
            return null;
        }
    }
}
// Aplana (app (app f [a]) [b]) → (app f [a,b])
function flattenApp(t) {
    if (t.kind !== 'app')
        return { fn: t, args: [] };
    const { fn, args } = t;
    if (fn.kind === 'app') {
        const inner = flattenApp(fn);
        return { fn: inner.fn, args: [...inner.args, ...args] };
    }
    return { fn, args };
}
//# sourceMappingURL=normalize.js.map