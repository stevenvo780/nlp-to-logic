"use strict";
// ============================================================
// Cubical — Inferencia / chequeo de tipos
// ============================================================
//
// Reglas principales del subset CTT-Lite:
//
//   ── (I-form)     i0 : I    i1 : I    iVar i : I
//
//   Γ ⊢ r : I   Γ ⊢ s : I
//   ── (∧, ∨)       r ∧ s : I    r ∨ s : I
//
//   Γ ⊢ r : I
//   ── (~)          ~ r : I
//
//   Γ ⊢ A : I → Type   Γ ⊢ x : A i0   Γ ⊢ y : A i1
//   ── (PathP)      PathP A x y : Type
//
//   Γ, i : I ⊢ t : A i
//   ── (pLam)       λi. t : PathP (λi. A i) (t[i := i0]) (t[i := i1])
//
//   Γ ⊢ p : PathP A x y   Γ ⊢ r : I
//   ── (pApp)       p @ r : A r
//                   con (p @ i0) ≡ x y (p @ i1) ≡ y
//
//   Γ ⊢ e : A ≃ B (codificado como Σ)
//   Γ ⊢ partial : algún término candidato
//   ── (glue)       glue(e, partial) : PathP _ A B  (precursor de ua)
Object.defineProperty(exports, "__esModule", { value: true });
exports.cArrow = exports.intervalType = void 0;
exports.isInferErrorCubical = isInferErrorCubical;
exports.makeContext = makeContext;
exports.inferType = inferType;
exports.checkType = checkType;
const types_1 = require("./types");
Object.defineProperty(exports, "cArrow", { enumerable: true, get: function () { return types_1.cArrow; } });
const substitute_1 = require("./substitute");
const normalize_1 = require("./normalize");
const equality_1 = require("./equality");
const intervalType = () => ({ kind: 'var', name: '__I__' });
exports.intervalType = intervalType;
function isInferErrorCubical(r) {
    return typeof r === 'object' && r !== null && 'error' in r && typeof r.error === 'string';
}
function makeContext() {
    return { termVars: new Map(), intervalVars: new Set() };
}
function extendTerm(ctx, name, type) {
    const next = {
        termVars: new Map(ctx.termVars),
        intervalVars: new Set(ctx.intervalVars),
    };
    next.termVars.set(name, type);
    return next;
}
function extendInterval(ctx, name) {
    const next = {
        termVars: new Map(ctx.termVars),
        intervalVars: new Set(ctx.intervalVars),
    };
    next.intervalVars.add(name);
    return next;
}
function inferType(term, ctx = makeContext()) {
    switch (term.kind) {
        case 'i0':
        case 'i1':
            return (0, exports.intervalType)();
        case 'iVar':
            if (ctx.intervalVars.has(term.name))
                return (0, exports.intervalType)();
            return { error: `variable de intervalo libre: ${term.name}` };
        case 'iNeg': {
            if (!checkInterval(term.arg, ctx)) {
                return { error: `~: argumento no es I: ${(0, types_1.termToStringCubical)(term.arg)}` };
            }
            return (0, exports.intervalType)();
        }
        case 'iMin':
        case 'iMax': {
            if (!checkInterval(term.left, ctx) || !checkInterval(term.right, ctx)) {
                return { error: `${term.kind === 'iMin' ? '∧' : '∨'}: ambos lados deben ser I` };
            }
            return (0, exports.intervalType)();
        }
        case 'var': {
            const t = ctx.termVars.get(term.name);
            if (!t)
                return { error: `variable libre sin tipo: ${term.name}` };
            return t;
        }
        case 'universe':
            return (0, types_1.cUniverse)(term.level + 1);
        case 'pi': {
            const domT = inferType(term.domain, ctx);
            if (isInferErrorCubical(domT))
                return domT;
            const i = universeLevel(domT);
            if (i === null) {
                return {
                    error: `dominio de Π no es universo: ${(0, types_1.termToStringCubical)(term.domain)}`,
                };
            }
            const newCtx = extendTerm(ctx, term.bind, term.domain);
            const codT = inferType(term.codomain, newCtx);
            if (isInferErrorCubical(codT))
                return codT;
            const j = universeLevel(codT);
            if (j === null) {
                return {
                    error: `codominio de Π no es universo: ${(0, types_1.termToStringCubical)(term.codomain)}`,
                };
            }
            return (0, types_1.cUniverse)(Math.max(i, j));
        }
        case 'lam': {
            const domT = inferType(term.domain, ctx);
            if (isInferErrorCubical(domT))
                return domT;
            if (universeLevel(domT) === null) {
                return {
                    error: `anotación de λ no es un tipo: ${(0, types_1.termToStringCubical)(term.domain)}`,
                };
            }
            const newCtx = extendTerm(ctx, term.bind, term.domain);
            const bodyT = inferType(term.body, newCtx);
            if (isInferErrorCubical(bodyT))
                return bodyT;
            return { kind: 'pi', bind: term.bind, domain: term.domain, codomain: bodyT };
        }
        case 'app': {
            const fnT = inferType(term.fn, ctx);
            if (isInferErrorCubical(fnT))
                return fnT;
            const fnTNorm = (0, normalize_1.normalizeCubical)(fnT);
            if (fnTNorm.kind !== 'pi') {
                return { error: `aplicación requiere Π, encontré: ${(0, types_1.termToStringCubical)(fnTNorm)}` };
            }
            const argT = inferType(term.arg, ctx);
            if (isInferErrorCubical(argT))
                return argT;
            if (!(0, equality_1.alphaBetaEqCubical)(fnTNorm.domain, argT)) {
                return {
                    error: `tipo de argumento no coincide: esperaba ${(0, types_1.termToStringCubical)(fnTNorm.domain)}, obtuve ${(0, types_1.termToStringCubical)(argT)}`,
                };
            }
            return (0, substitute_1.substituteCubical)(fnTNorm.codomain, fnTNorm.bind, term.arg);
        }
        case 'pathP': {
            // family : I → Type
            const famT = inferType(term.family, ctx);
            if (isInferErrorCubical(famT))
                return famT;
            const famTNorm = (0, normalize_1.normalizeCubical)(famT);
            if (famTNorm.kind !== 'pi' || !isIntervalTypeMark(famTNorm.domain)) {
                return {
                    error: `PathP: family debe ser I → Type, recibí: ${(0, types_1.termToStringCubical)(famTNorm)}`,
                };
            }
            // left : A i0, right : A i1
            const leftT = inferType(term.left, ctx);
            if (isInferErrorCubical(leftT))
                return leftT;
            const rightT = inferType(term.right, ctx);
            if (isInferErrorCubical(rightT))
                return rightT;
            const expectedLeft = (0, normalize_1.normalizeCubical)((0, types_1.cApp)(term.family, (0, types_1.cI0)()));
            const expectedRight = (0, normalize_1.normalizeCubical)((0, types_1.cApp)(term.family, (0, types_1.cI1)()));
            if (!(0, equality_1.alphaBetaEqCubical)(leftT, expectedLeft)) {
                return {
                    error: `PathP: left tiene tipo ${(0, types_1.termToStringCubical)(leftT)}, esperaba ${(0, types_1.termToStringCubical)(expectedLeft)}`,
                };
            }
            if (!(0, equality_1.alphaBetaEqCubical)(rightT, expectedRight)) {
                return {
                    error: `PathP: right tiene tipo ${(0, types_1.termToStringCubical)(rightT)}, esperaba ${(0, types_1.termToStringCubical)(expectedRight)}`,
                };
            }
            const codLevel = universeLevel(famTNorm.codomain);
            return (0, types_1.cUniverse)(codLevel ?? 0);
        }
        case 'pLam': {
            // λi. t : PathP (λi. infer(t)) (t[i:=i0]) (t[i:=i1])
            const innerCtx = extendInterval(ctx, term.bind);
            const bodyT = inferType(term.body, innerCtx);
            if (isInferErrorCubical(bodyT))
                return bodyT;
            const left = (0, normalize_1.normalizeCubical)((0, substitute_1.substituteCubical)(term.body, term.bind, (0, types_1.cI0)()));
            const right = (0, normalize_1.normalizeCubical)((0, substitute_1.substituteCubical)(term.body, term.bind, (0, types_1.cI1)()));
            const family = (0, types_1.cPLam)(term.bind, bodyT);
            return (0, types_1.cPathP)(family, left, right);
        }
        case 'pApp': {
            const pT = inferType(term.path, ctx);
            if (isInferErrorCubical(pT))
                return pT;
            const pTNorm = (0, normalize_1.normalizeCubical)(pT);
            if (pTNorm.kind !== 'pathP') {
                return { error: `p @ r requiere PathP, recibí: ${(0, types_1.termToStringCubical)(pTNorm)}` };
            }
            if (!checkInterval(term.arg, ctx)) {
                return { error: `p @ r: r debe ser I, recibí: ${(0, types_1.termToStringCubical)(term.arg)}` };
            }
            // tipo resultado = family @ r (que puede ser pApp o app dependiendo de la forma)
            return (0, normalize_1.normalizeCubical)({ kind: 'pApp', path: pTNorm.family, arg: term.arg });
        }
        case 'glue': {
            // Sintáctica: aceptamos equiv : Σ_A,B y devolvemos un PathP universo
            const eT = inferType(term.equiv, ctx);
            if (isInferErrorCubical(eT))
                return eT;
            // partial: opcional, contribuye sólo al término
            const pT = inferType(term.partial, ctx);
            if (isInferErrorCubical(pT))
                return pT;
            // glue introduce un path en el universo entre el dominio y codominio
            // del par de tipos codificado en equiv. Sin estructura formal en este
            // subset, devolvemos una marca de PathP genérica.
            const family = (0, types_1.cPLam)('i', (0, types_1.cUniverse)(0));
            return (0, types_1.cPathP)(family, term.equiv, term.equiv);
        }
    }
}
function checkInterval(t, ctx) {
    const r = inferType(t, ctx);
    return !isInferErrorCubical(r) && isIntervalTypeMark(r);
}
function isIntervalTypeMark(t) {
    return t.kind === 'var' && t.name === '__I__';
}
function universeLevel(t) {
    const n = (0, normalize_1.normalizeCubical)(t);
    return n.kind === 'universe' ? n.level : null;
}
function checkType(term, expected, ctx = makeContext()) {
    const inferred = inferType(term, ctx);
    if (isInferErrorCubical(inferred))
        return false;
    return (0, equality_1.alphaBetaEqCubical)(inferred, expected);
}
//# sourceMappingURL=infer.js.map