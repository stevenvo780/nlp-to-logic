"use strict";
// ============================================================
// Hindley-Milner — Algorithm W (Damas-Milner)
// ============================================================
//
// Implementación de Algorithm W tal como aparece en Damas & Milner
// 1982. La función W toma un entorno Γ y una expresión e, y devuelve
// un par (S, τ) donde S es la sustitución principal y τ el tipo
// principal de e bajo S(Γ).
//
// Reglas (esquemáticas):
//   W(Γ, x)        = (∅, [β/α] τ) si Γ(x) = ∀α. τ con β frescas
//   W(Γ, λx.e)     = sea β fresca; (S, τ) = W(Γ[x:β], e);
//                    devolver (S, S(β) → τ)
//   W(Γ, e₁ e₂)    = (S₁, τ₁) = W(Γ, e₁);
//                    (S₂, τ₂) = W(S₁(Γ), e₂);
//                    β fresca; V = mgu(S₂(τ₁), τ₂ → β);
//                    devolver (V ∘ S₂ ∘ S₁, V(β))
//   W(Γ, let x = e₁ in e₂) =
//                    (S₁, τ₁) = W(Γ, e₁);
//                    σ = generalize(S₁(Γ), τ₁);
//                    (S₂, τ₂) = W(S₁(Γ)[x:σ], e₂);
//                    devolver (S₂ ∘ S₁, τ₂)
//   W(Γ, if c then a else b) = unificar c con Bool y a con b.
//   W(Γ, letRec [n₁=e₁,...] in e) — todos los nᵢ con tvars frescos
//   en el entorno mientras se infieren los eᵢ; luego generalizar.
//
// Convención: trabajamos con `freshTypeVar('t')`. Para tests con
// nombres predecibles se llama `resetFreshSupply()`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInferError = isInferError;
exports.initialEnv = initialEnv;
exports.algorithmW = algorithmW;
exports.infer = infer;
exports.inferScheme = inferScheme;
exports.normalizeScheme = normalizeScheme;
const types_1 = require("./types");
const substitution_1 = require("./substitution");
function isInferError(r) {
    return typeof r === 'object' && r !== null && 'error' in r && !('type' in r);
}
// ---------- Entorno inicial con primitivos ----------
//
// Operadores aritméticos como Int → Int → Int. Comparadores son
// polimórficos: ∀α. α → α → Bool. Listas y pares con sus
// constructores y proyectores.
function initialEnv() {
    const a = 'a';
    const b = 'b';
    const TA = { kind: 'tvar', name: a };
    const TB = { kind: 'tvar', name: b };
    const arithBinop = (0, types_1.mono)((0, types_1.tArrow)(types_1.TInt, (0, types_1.tArrow)(types_1.TInt, types_1.TInt)));
    const cmpBinop = (0, types_1.scheme)([a], (0, types_1.tArrow)(TA, (0, types_1.tArrow)(TA, types_1.TBool)));
    const pairTy = (0, types_1.tApp)('Pair', TA, TB);
    const listTyA = (0, types_1.tApp)('List', TA);
    return new types_1.TypeEnv(new Map([
        ['+', arithBinop],
        ['-', arithBinop],
        ['*', arithBinop],
        ['/', arithBinop],
        ['mod', arithBinop],
        ['==', cmpBinop],
        ['!=', cmpBinop],
        ['<', cmpBinop],
        ['>', cmpBinop],
        ['<=', cmpBinop],
        ['>=', cmpBinop],
        ['true', (0, types_1.mono)(types_1.TBool)],
        ['false', (0, types_1.mono)(types_1.TBool)],
        ['not', (0, types_1.mono)((0, types_1.tArrow)(types_1.TBool, types_1.TBool))],
        ['&&', (0, types_1.mono)((0, types_1.tArrow)(types_1.TBool, (0, types_1.tArrow)(types_1.TBool, types_1.TBool)))],
        ['||', (0, types_1.mono)((0, types_1.tArrow)(types_1.TBool, (0, types_1.tArrow)(types_1.TBool, types_1.TBool)))],
        ['pair', (0, types_1.scheme)([a, b], (0, types_1.tArrow)(TA, (0, types_1.tArrow)(TB, pairTy)))],
        ['fst', (0, types_1.scheme)([a, b], (0, types_1.tArrow)(pairTy, TA))],
        ['snd', (0, types_1.scheme)([a, b], (0, types_1.tArrow)(pairTy, TB))],
        ['nil', (0, types_1.scheme)([a], listTyA)],
        ['cons', (0, types_1.scheme)([a], (0, types_1.tArrow)(TA, (0, types_1.tArrow)(listTyA, listTyA)))],
        ['head', (0, types_1.scheme)([a], (0, types_1.tArrow)(listTyA, TA))],
        ['tail', (0, types_1.scheme)([a], (0, types_1.tArrow)(listTyA, listTyA))],
        ['isEmpty', (0, types_1.scheme)([a], (0, types_1.tArrow)(listTyA, types_1.TBool))],
        // fixpoint, útil para introducir letRec puntualmente sin el azúcar
        ['fix', (0, types_1.scheme)([a], (0, types_1.tArrow)((0, types_1.tArrow)(TA, TA), TA))],
    ]));
}
// ---------- Algorithm W ----------
function algorithmW(expr, env) {
    switch (expr.kind) {
        case 'lit': {
            const t = typeof expr.value === 'number' ? types_1.TInt : typeof expr.value === 'boolean' ? types_1.TBool : types_1.TStr;
            return { type: t, subst: (0, substitution_1.emptySubst)() };
        }
        case 'var': {
            const sc = env.lookup(expr.name);
            if (sc === undefined)
                return { error: `unbound variable: ${expr.name}` };
            return { type: (0, substitution_1.instantiate)(sc), subst: (0, substitution_1.emptySubst)() };
        }
        case 'lam': {
            const tv = (0, substitution_1.freshTypeVar)('t');
            const env2 = env.extend(expr.param, (0, types_1.mono)(tv));
            const body = algorithmW(expr.body, env2);
            if (isInferError(body))
                return body;
            return {
                type: (0, types_1.tArrow)((0, substitution_1.applySubst)(tv, body.subst), body.type),
                subst: body.subst,
            };
        }
        case 'app': {
            const r1 = algorithmW(expr.fn, env);
            if (isInferError(r1))
                return r1;
            const env2 = applyEnv(env, r1.subst);
            const r2 = algorithmW(expr.arg, env2);
            if (isInferError(r2))
                return r2;
            const tv = (0, substitution_1.freshTypeVar)('t');
            const u = (0, substitution_1.unify)((0, substitution_1.applySubst)(r1.type, r2.subst), (0, types_1.tArrow)(r2.type, tv));
            if ((0, substitution_1.isUnifyError)(u))
                return { error: u.error };
            const finalSubst = (0, substitution_1.composeSubsts)(u, (0, substitution_1.composeSubsts)(r2.subst, r1.subst));
            return { type: (0, substitution_1.applySubst)(tv, u), subst: finalSubst };
        }
        case 'let': {
            const r1 = algorithmW(expr.value, env);
            if (isInferError(r1))
                return r1;
            const env1 = applyEnv(env, r1.subst);
            const sc = (0, substitution_1.generalize)(env1.freeVars(), r1.type);
            const env2 = env1.extend(expr.bind, sc);
            const r2 = algorithmW(expr.body, env2);
            if (isInferError(r2))
                return r2;
            return {
                type: r2.type,
                subst: (0, substitution_1.composeSubsts)(r2.subst, r1.subst),
            };
        }
        case 'letRec': {
            // Asignar tvar fresco a cada def, inferir cada body bajo el
            // entorno extendido, unificar el tipo de cada body con el tvar
            // declarado, y al final generalizar.
            if (expr.defs.length === 0)
                return algorithmW(expr.body, env);
            const freshVars = expr.defs.map(() => (0, substitution_1.freshTypeVar)('t'));
            let envExt = env;
            for (let i = 0; i < expr.defs.length; i++) {
                envExt = envExt.extend(expr.defs[i].name, (0, types_1.mono)(freshVars[i]));
            }
            let s = (0, substitution_1.emptySubst)();
            for (let i = 0; i < expr.defs.length; i++) {
                const def = expr.defs[i];
                const fv = freshVars[i];
                const ri = algorithmW(def.body, applyEnv(envExt, s));
                if (isInferError(ri))
                    return ri;
                const u = (0, substitution_1.unify)((0, substitution_1.applySubst)(fv, (0, substitution_1.composeSubsts)(ri.subst, s)), ri.type);
                if ((0, substitution_1.isUnifyError)(u))
                    return { error: u.error };
                s = (0, substitution_1.composeSubsts)(u, (0, substitution_1.composeSubsts)(ri.subst, s));
            }
            // Reconstruir entorno generalizado.
            const envAfter = applyEnv(env, s);
            const envFv = envAfter.freeVars();
            let envGen = envAfter;
            for (let i = 0; i < expr.defs.length; i++) {
                const ty = (0, substitution_1.applySubst)(freshVars[i], s);
                const sc = (0, substitution_1.generalize)(envFv, ty);
                envGen = envGen.extend(expr.defs[i].name, sc);
            }
            const rBody = algorithmW(expr.body, envGen);
            if (isInferError(rBody))
                return rBody;
            return {
                type: rBody.type,
                subst: (0, substitution_1.composeSubsts)(rBody.subst, s),
            };
        }
        case 'if': {
            const rc = algorithmW(expr.cond, env);
            if (isInferError(rc))
                return rc;
            const uCond = (0, substitution_1.unify)(rc.type, types_1.TBool);
            if ((0, substitution_1.isUnifyError)(uCond)) {
                return { error: `condition of 'if' must be Bool: ${uCond.error}` };
            }
            const s1 = (0, substitution_1.composeSubsts)(uCond, rc.subst);
            const rt = algorithmW(expr.then, applyEnv(env, s1));
            if (isInferError(rt))
                return rt;
            const s2 = (0, substitution_1.composeSubsts)(rt.subst, s1);
            const re = algorithmW(expr.else, applyEnv(env, s2));
            if (isInferError(re))
                return re;
            const s3 = (0, substitution_1.composeSubsts)(re.subst, s2);
            const u = (0, substitution_1.unify)((0, substitution_1.applySubst)(rt.type, s3), re.type);
            if ((0, substitution_1.isUnifyError)(u)) {
                return { error: `branches of 'if' must agree: ${u.error}` };
            }
            const finalSubst = (0, substitution_1.composeSubsts)(u, s3);
            return { type: (0, substitution_1.applySubst)(re.type, u), subst: finalSubst };
        }
    }
}
// ---------- API de alto nivel ----------
//
// infer() devuelve sólo lo necesario al consumidor: el tipo final
// y la sustitución que lo produjo (útil para imprimirla, debug,
// etc.). El esquema principal lo expone `inferScheme`.
function infer(expr, env = initialEnv()) {
    return algorithmW(expr, env);
}
function inferScheme(expr, env = initialEnv()) {
    const r = algorithmW(expr, env);
    if (isInferError(r))
        return r;
    const envAfter = applyEnv(env, r.subst);
    const sc = (0, substitution_1.generalize)(envAfter.freeVars(), r.type);
    return { scheme: sc, subst: r.subst, type: r.type };
}
// ---------- Helpers ----------
function applyEnv(env, s) {
    if (s.size === 0)
        return env;
    const next = new Map();
    for (const [name, sc] of env.bindings) {
        next.set(name, (0, substitution_1.applySubstScheme)(sc, s));
    }
    return new types_1.TypeEnv(next);
}
// Renombrado canónico de un esquema para tests: ∀t5 t9. t5 → t9
// pasa a ser ∀a b. a → b. Asegura comparaciones estables sin
// depender del contador global.
function normalizeScheme(sc) {
    const fv = Array.from((0, types_1.typeFreeVars)(sc.body));
    const ordered = sc.forall.filter((v) => fv.includes(v));
    const namePool = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const renames = new Map();
    let i = 0;
    function pick() {
        if (i < namePool.length)
            return namePool[i++];
        return `t${i++}`;
    }
    // Recorrer en orden de aparición en el cuerpo para que el nombre
    // resultante sea estable bajo equivalencia α.
    visitTypeVars(sc.body, (v) => {
        if (ordered.includes(v) && !renames.has(v)) {
            renames.set(v, pick());
        }
    });
    const sub = new Map();
    for (const [old, fresh] of renames) {
        sub.set(old, { kind: 'tvar', name: fresh });
    }
    return {
        forall: Array.from(renames.values()),
        body: (0, substitution_1.applySubst)(sc.body, sub),
    };
}
function visitTypeVars(t, cb) {
    switch (t.kind) {
        case 'tvar':
            cb(t.name);
            return;
        case 'tconst':
            return;
        case 'arrow':
            visitTypeVars(t.from, cb);
            visitTypeVars(t.to, cb);
            return;
        case 'tapp':
            for (const a of t.args)
                visitTypeVars(a, cb);
            return;
    }
}
//# sourceMappingURL=infer.js.map