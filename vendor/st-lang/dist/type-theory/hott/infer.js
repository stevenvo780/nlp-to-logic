"use strict";
// ============================================================
// HoTT — Inferencia / chequeo de tipos
// ============================================================
//
// Reglas extra sobre MLTT:
//
//   Γ ⊢ A : Type i   Γ ⊢ a : A   Γ ⊢ b : A
//   ── (Path-form)            Path A a b : Type i
//
//   Γ ⊢ a : A
//   ── (Path-intro)           refl a : Path A a a
//
//   Γ ⊢ p : Path A x y
//   ── (sym)                  sym p : Path A y x
//
//   Γ ⊢ p : Path A x y   Γ ⊢ q : Path A y z
//   ── (concat)               p · q : Path A x z
//
//   Γ ⊢ f : A → B   Γ ⊢ p : Path A x y
//   ── (ap)                   ap f p : Path B (f x) (f y)
//
//   Γ ⊢ P : A → Type   Γ ⊢ p : Path A x y   Γ ⊢ e : P x
//   ── (transport)            transport P p e : P y
//
//   Γ ⊢ p : Path A x y
//   motive : Π (y : A). Π (q : Path A x y). Type
//   base   : motive x (refl x)
//   ── (J)                    J motive base p : motive y p
//
//   ── (S¹)                   S¹ : Type 0
//                             base : S¹
//                             loop : Path S¹ base base
//
//   Γ ⊢ A : Type i
//   ── (Σ-susp)               Σ A : Type i
//                             north : Σ A
//                             south : Σ A
//                             meridian a : Path (Σ A) north south
//
//   Γ ⊢ e : A ≃ B
//   ── (ua)                   ua e : Path U A B    (axioma)
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInferErrorHoTT = isInferErrorHoTT;
exports.inferType = inferType;
exports.checkType = checkType;
const types_1 = require("./types");
const substitute_1 = require("./substitute");
const normalize_1 = require("./normalize");
const equality_1 = require("./equality");
function isInferErrorHoTT(r) {
    return typeof r === 'object' && r !== null && 'error' in r && typeof r.error === 'string';
}
const emptyCtx = () => new Map();
function inferType(term, ctx = emptyCtx()) {
    switch (term.kind) {
        case 'var': {
            const t = ctx.get(term.name);
            if (!t)
                return { error: `variable libre sin tipo en contexto: '${term.name}'` };
            return t;
        }
        case 'universe':
            return (0, types_1.hUniverse)(term.level + 1);
        case 'nat':
            return (0, types_1.hUniverse)(0);
        case 'zero':
            return (0, types_1.hNat)();
        case 'succ': {
            const argT = inferType(term.arg, ctx);
            if (isInferErrorHoTT(argT))
                return argT;
            if (!isNat(argT)) {
                return { error: `succ espera Nat, recibí: ${(0, types_1.termToStringHoTT)(argT)}` };
            }
            return (0, types_1.hNat)();
        }
        case 'pi': {
            const domT = inferType(term.domain, ctx);
            if (isInferErrorHoTT(domT))
                return domT;
            const i = universeLevel(domT);
            if (i === null) {
                return {
                    error: `dominio de Π no es un universo: ${(0, types_1.termToStringHoTT)(term.domain)} : ${(0, types_1.termToStringHoTT)(domT)}`,
                };
            }
            const newCtx = extend(ctx, term.bind, term.domain);
            const codT = inferType(term.codomain, newCtx);
            if (isInferErrorHoTT(codT))
                return codT;
            const j = universeLevel(codT);
            if (j === null) {
                return {
                    error: `codominio de Π no es un universo: ${(0, types_1.termToStringHoTT)(term.codomain)} : ${(0, types_1.termToStringHoTT)(codT)}`,
                };
            }
            return (0, types_1.hUniverse)(Math.max(i, j));
        }
        case 'sigma': {
            const fT = inferType(term.first, ctx);
            if (isInferErrorHoTT(fT))
                return fT;
            const i = universeLevel(fT);
            if (i === null) {
                return {
                    error: `primer componente de Σ no es un universo: ${(0, types_1.termToStringHoTT)(term.first)} : ${(0, types_1.termToStringHoTT)(fT)}`,
                };
            }
            const newCtx = extend(ctx, term.bind, term.first);
            const sT = inferType(term.second, newCtx);
            if (isInferErrorHoTT(sT))
                return sT;
            const j = universeLevel(sT);
            if (j === null) {
                return {
                    error: `segundo componente de Σ no es un universo: ${(0, types_1.termToStringHoTT)(term.second)} : ${(0, types_1.termToStringHoTT)(sT)}`,
                };
            }
            return (0, types_1.hUniverse)(Math.max(i, j));
        }
        case 'lam': {
            const domT = inferType(term.domain, ctx);
            if (isInferErrorHoTT(domT))
                return domT;
            if (universeLevel(domT) === null) {
                return {
                    error: `anotación de λ no es un tipo: ${(0, types_1.termToStringHoTT)(term.domain)} : ${(0, types_1.termToStringHoTT)(domT)}`,
                };
            }
            const newCtx = extend(ctx, term.bind, term.domain);
            const bodyT = inferType(term.body, newCtx);
            if (isInferErrorHoTT(bodyT))
                return bodyT;
            return { kind: 'pi', bind: term.bind, domain: term.domain, codomain: bodyT };
        }
        case 'app': {
            const fnT = inferType(term.fn, ctx);
            if (isInferErrorHoTT(fnT))
                return fnT;
            const fnTNorm = (0, normalize_1.normalizeHoTT)(fnT);
            if (fnTNorm.kind !== 'pi') {
                return { error: `aplicación requiere Π, encontré: ${(0, types_1.termToStringHoTT)(fnTNorm)}` };
            }
            const argT = inferType(term.arg, ctx);
            if (isInferErrorHoTT(argT))
                return argT;
            if (!(0, equality_1.alphaBetaEqHoTT)(fnTNorm.domain, argT)) {
                return {
                    error: `tipo de argumento no coincide: esperaba ${(0, types_1.termToStringHoTT)(fnTNorm.domain)}, obtuve ${(0, types_1.termToStringHoTT)(argT)}`,
                };
            }
            return (0, substitute_1.substituteHoTT)(fnTNorm.codomain, fnTNorm.bind, term.arg);
        }
        case 'pair': {
            const aT = inferType(term.fst, ctx);
            if (isInferErrorHoTT(aT))
                return aT;
            const bT = inferType(term.snd, ctx);
            if (isInferErrorHoTT(bT))
                return bT;
            return { kind: 'sigma', bind: '_', first: aT, second: bT };
        }
        case 'fst': {
            const pT = inferType(term.pair, ctx);
            if (isInferErrorHoTT(pT))
                return pT;
            const pTNorm = (0, normalize_1.normalizeHoTT)(pT);
            if (pTNorm.kind !== 'sigma') {
                return { error: `fst espera Σ, recibí: ${(0, types_1.termToStringHoTT)(pTNorm)}` };
            }
            return pTNorm.first;
        }
        case 'snd': {
            const pT = inferType(term.pair, ctx);
            if (isInferErrorHoTT(pT))
                return pT;
            const pTNorm = (0, normalize_1.normalizeHoTT)(pT);
            if (pTNorm.kind !== 'sigma') {
                return { error: `snd espera Σ, recibí: ${(0, types_1.termToStringHoTT)(pTNorm)}` };
            }
            return (0, substitute_1.substituteHoTT)(pTNorm.second, pTNorm.bind, { kind: 'fst', pair: term.pair });
        }
        case 'path': {
            const typeT = inferType(term.type, ctx);
            if (isInferErrorHoTT(typeT))
                return typeT;
            const i = universeLevel(typeT);
            if (i === null) {
                return { error: `argumento A de Path no es un tipo: ${(0, types_1.termToStringHoTT)(term.type)}` };
            }
            const lT = inferType(term.left, ctx);
            if (isInferErrorHoTT(lT))
                return lT;
            if (!(0, equality_1.alphaBetaEqHoTT)(lT, term.type)) {
                return {
                    error: `lado izquierdo de Path tiene tipo ${(0, types_1.termToStringHoTT)(lT)}, esperaba ${(0, types_1.termToStringHoTT)(term.type)}`,
                };
            }
            const rT = inferType(term.right, ctx);
            if (isInferErrorHoTT(rT))
                return rT;
            if (!(0, equality_1.alphaBetaEqHoTT)(rT, term.type)) {
                return {
                    error: `lado derecho de Path tiene tipo ${(0, types_1.termToStringHoTT)(rT)}, esperaba ${(0, types_1.termToStringHoTT)(term.type)}`,
                };
            }
            return (0, types_1.hUniverse)(i);
        }
        case 'refl': {
            const aT = inferType(term.term, ctx);
            if (isInferErrorHoTT(aT))
                return aT;
            return { kind: 'path', type: aT, left: term.term, right: term.term };
        }
        case 'transport': {
            // family : A → Type, path : Path A x y, term : (family x)
            const famT = inferType(term.family, ctx);
            if (isInferErrorHoTT(famT))
                return famT;
            const famTNorm = (0, normalize_1.normalizeHoTT)(famT);
            if (famTNorm.kind !== 'pi') {
                return {
                    error: `transport: family debe ser A → Type, recibí: ${(0, types_1.termToStringHoTT)(famTNorm)}`,
                };
            }
            if (universeLevel(famTNorm.codomain) === null) {
                return {
                    error: `transport: codominio de family no es universo: ${(0, types_1.termToStringHoTT)(famTNorm.codomain)}`,
                };
            }
            const pathT = inferType(term.path, ctx);
            if (isInferErrorHoTT(pathT))
                return pathT;
            const pathTNorm = (0, normalize_1.normalizeHoTT)(pathT);
            if (pathTNorm.kind !== 'path') {
                return {
                    error: `transport: path debe ser Path A x y, recibí: ${(0, types_1.termToStringHoTT)(pathTNorm)}`,
                };
            }
            if (!(0, equality_1.alphaBetaEqHoTT)(famTNorm.domain, pathTNorm.type)) {
                return {
                    error: `transport: dominio de family (${(0, types_1.termToStringHoTT)(famTNorm.domain)}) no coincide con A del path (${(0, types_1.termToStringHoTT)(pathTNorm.type)})`,
                };
            }
            // term : family(left)
            const termT = inferType(term.term, ctx);
            if (isInferErrorHoTT(termT))
                return termT;
            const expectedLeft = (0, substitute_1.substituteHoTT)(famTNorm.codomain, famTNorm.bind, pathTNorm.left);
            if (!(0, equality_1.alphaBetaEqHoTT)(termT, expectedLeft)) {
                return {
                    error: `transport: term debería tener tipo ${(0, types_1.termToStringHoTT)(expectedLeft)}, recibí ${(0, types_1.termToStringHoTT)(termT)}`,
                };
            }
            // Resultado: family(right)
            return (0, substitute_1.substituteHoTT)(famTNorm.codomain, famTNorm.bind, pathTNorm.right);
        }
        case 'pathSym': {
            const pT = inferType(term.path, ctx);
            if (isInferErrorHoTT(pT))
                return pT;
            const pTNorm = (0, normalize_1.normalizeHoTT)(pT);
            if (pTNorm.kind !== 'path') {
                return {
                    error: `sym requiere Path, recibí: ${(0, types_1.termToStringHoTT)(pTNorm)}`,
                };
            }
            // Path A x y → Path A y x
            return { kind: 'path', type: pTNorm.type, left: pTNorm.right, right: pTNorm.left };
        }
        case 'pathConcat': {
            const lT = inferType(term.left, ctx);
            if (isInferErrorHoTT(lT))
                return lT;
            const rT = inferType(term.right, ctx);
            if (isInferErrorHoTT(rT))
                return rT;
            const lTNorm = (0, normalize_1.normalizeHoTT)(lT);
            const rTNorm = (0, normalize_1.normalizeHoTT)(rT);
            if (lTNorm.kind !== 'path' || rTNorm.kind !== 'path') {
                return { error: `concat requiere ambos lados Path` };
            }
            if (!(0, equality_1.alphaBetaEqHoTT)(lTNorm.type, rTNorm.type)) {
                return {
                    error: `concat: tipos base difieren (${(0, types_1.termToStringHoTT)(lTNorm.type)} vs ${(0, types_1.termToStringHoTT)(rTNorm.type)})`,
                };
            }
            if (!(0, equality_1.alphaBetaEqHoTT)(lTNorm.right, rTNorm.left)) {
                return {
                    error: `concat: extremo derecho de p (${(0, types_1.termToStringHoTT)(lTNorm.right)}) no coincide con izquierdo de q (${(0, types_1.termToStringHoTT)(rTNorm.left)})`,
                };
            }
            return { kind: 'path', type: lTNorm.type, left: lTNorm.left, right: rTNorm.right };
        }
        case 'ap': {
            const fnT = inferType(term.fn, ctx);
            if (isInferErrorHoTT(fnT))
                return fnT;
            const fnTNorm = (0, normalize_1.normalizeHoTT)(fnT);
            if (fnTNorm.kind !== 'pi') {
                return { error: `ap: fn debe ser Π, recibí: ${(0, types_1.termToStringHoTT)(fnTNorm)}` };
            }
            const pT = inferType(term.path, ctx);
            if (isInferErrorHoTT(pT))
                return pT;
            const pTNorm = (0, normalize_1.normalizeHoTT)(pT);
            if (pTNorm.kind !== 'path') {
                return { error: `ap: path debe ser Path, recibí: ${(0, types_1.termToStringHoTT)(pTNorm)}` };
            }
            if (!(0, equality_1.alphaBetaEqHoTT)(fnTNorm.domain, pTNorm.type)) {
                return {
                    error: `ap: dominio de fn (${(0, types_1.termToStringHoTT)(fnTNorm.domain)}) no coincide con A del path (${(0, types_1.termToStringHoTT)(pTNorm.type)})`,
                };
            }
            // Resultado: Path B (f x) (f y), donde B = codomain[left] (asumiendo no-dependiente)
            // Para garantizar no-dependencia, sustituimos en ambos lados y exigimos coincidencia.
            const bLeft = (0, substitute_1.substituteHoTT)(fnTNorm.codomain, fnTNorm.bind, pTNorm.left);
            const bRight = (0, substitute_1.substituteHoTT)(fnTNorm.codomain, fnTNorm.bind, pTNorm.right);
            if (!(0, equality_1.alphaBetaEqHoTT)(bLeft, bRight)) {
                return {
                    error: `ap: codomain dependiente no soportado (${(0, types_1.termToStringHoTT)(bLeft)} vs ${(0, types_1.termToStringHoTT)(bRight)})`,
                };
            }
            const fApp = (arg) => ({ kind: 'app', fn: term.fn, arg });
            return {
                kind: 'path',
                type: bLeft,
                left: fApp(pTNorm.left),
                right: fApp(pTNorm.right),
            };
        }
        case 'jElim': {
            // motive : Π (y : A). Π (q : Path A x y). Type
            // base   : motive x (refl x)
            // path   : Path A x y
            const pathT = inferType(term.path, ctx);
            if (isInferErrorHoTT(pathT))
                return pathT;
            const pathTNorm = (0, normalize_1.normalizeHoTT)(pathT);
            if (pathTNorm.kind !== 'path') {
                return { error: `J: path debe ser Path, recibí: ${(0, types_1.termToStringHoTT)(pathTNorm)}` };
            }
            const motiveT = inferType(term.motive, ctx);
            if (isInferErrorHoTT(motiveT))
                return motiveT;
            // No verificamos en detalle la forma de motive (Π anidada);
            // confiamos que motive aplicado a (right, path) da Type, y devolvemos
            // motive y p como tipo del resultado.
            const baseT = inferType(term.baseCase, ctx);
            if (isInferErrorHoTT(baseT))
                return baseT;
            // Resultado: motive aplicado a (path.right) y luego a path.
            const applied = {
                kind: 'app',
                fn: { kind: 'app', fn: term.motive, arg: pathTNorm.right },
                arg: term.path,
            };
            return (0, normalize_1.normalizeHoTT)(applied);
        }
        case 'circle':
            return (0, types_1.hUniverse)(0);
        case 'baseOfCircle':
            return { kind: 'circle' };
        case 'loopOfCircle':
            return {
                kind: 'path',
                type: { kind: 'circle' },
                left: { kind: 'baseOfCircle' },
                right: { kind: 'baseOfCircle' },
            };
        case 'suspension': {
            const tT = inferType(term.type, ctx);
            if (isInferErrorHoTT(tT))
                return tT;
            const i = universeLevel(tT);
            if (i === null) {
                return { error: `suspension de no-tipo: ${(0, types_1.termToStringHoTT)(term.type)}` };
            }
            return (0, types_1.hUniverse)(i);
        }
        case 'north':
        case 'south':
            return { kind: 'suspension', type: term.type };
        case 'meridian': {
            const tT = inferType(term.type, ctx);
            if (isInferErrorHoTT(tT))
                return tT;
            if (universeLevel(tT) === null) {
                return { error: `meridian sobre no-tipo: ${(0, types_1.termToStringHoTT)(term.type)}` };
            }
            const pT = inferType(term.point, ctx);
            if (isInferErrorHoTT(pT))
                return pT;
            if (!(0, equality_1.alphaBetaEqHoTT)(pT, term.type)) {
                return {
                    error: `meridian: punto tiene tipo ${(0, types_1.termToStringHoTT)(pT)}, esperaba ${(0, types_1.termToStringHoTT)(term.type)}`,
                };
            }
            const susp = { kind: 'suspension', type: term.type };
            return {
                kind: 'path',
                type: susp,
                left: { kind: 'north', type: term.type },
                right: { kind: 'south', type: term.type },
            };
        }
        case 'ua': {
            // Axioma: dada e : A ≃ B, retornamos Path U A B con A y B abstraídos.
            // Convención: e debe ser un par ⟨A, ⟨B, _⟩⟩ con `fst` y `snd ∘ fst` los tipos.
            // No verificamos la equivalencia (es justamente lo que el axioma no checkea).
            // Devolvemos un Path en el universo de A si A es inferible.
            const eT = inferType(term.equiv, ctx);
            if (isInferErrorHoTT(eT))
                return eT;
            // Reportamos un path en Type 0 por defecto; el chequeo fino queda al usuario.
            // Estructura: ⟨A, B⟩ : Σ (_ : Type). Type — sólo aceptamos esta forma.
            const eTN = (0, normalize_1.normalizeHoTT)(eT);
            if (eTN.kind === 'sigma') {
                const a = eTN.first;
                const b = (0, normalize_1.normalizeHoTT)(eTN.second);
                return { kind: 'path', type: (0, types_1.hUniverse)(0), left: a, right: b };
            }
            return { kind: 'path', type: (0, types_1.hUniverse)(0), left: term.equiv, right: term.equiv };
        }
    }
}
function checkType(term, expected, ctx = emptyCtx()) {
    const expectedNorm = (0, normalize_1.normalizeHoTT)(expected);
    if (term.kind === 'pair' && expectedNorm.kind === 'sigma') {
        if (!checkType(term.fst, expectedNorm.first, ctx))
            return false;
        const expectedSnd = (0, substitute_1.substituteHoTT)(expectedNorm.second, expectedNorm.bind, term.fst);
        return checkType(term.snd, expectedSnd, ctx);
    }
    if (term.kind === 'lam' && expectedNorm.kind === 'pi') {
        if (!(0, equality_1.alphaBetaEqHoTT)(term.domain, expectedNorm.domain))
            return false;
        const newCtx = extend(ctx, term.bind, term.domain);
        const expectedBody = expectedNorm.bind === term.bind
            ? expectedNorm.codomain
            : (0, substitute_1.substituteHoTT)(expectedNorm.codomain, expectedNorm.bind, {
                kind: 'var',
                name: term.bind,
            });
        return checkType(term.body, expectedBody, newCtx);
    }
    const inferred = inferType(term, ctx);
    if (isInferErrorHoTT(inferred))
        return false;
    return (0, equality_1.alphaBetaEqHoTT)(inferred, expected);
}
function extend(ctx, name, type) {
    const next = new Map(ctx);
    next.set(name, type);
    return next;
}
function isNat(t) {
    return (0, normalize_1.normalizeHoTT)(t).kind === 'nat';
}
function universeLevel(t) {
    const n = (0, normalize_1.normalizeHoTT)(t);
    return n.kind === 'universe' ? n.level : null;
}
//# sourceMappingURL=infer.js.map