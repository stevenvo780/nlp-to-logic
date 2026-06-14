"use strict";
// ============================================================
// Lambda Cube — Pure Type System type-checker
// ============================================================
//
// Algoritmo bidireccional uniforme para los 8 vértices del cubo. El
// sistema activo se pasa como parámetro y restringe qué Π / λ son
// legales mediante sus reglas de formación.
//
// Reglas PTS (versión cubo de Barendregt):
//
//   AX:       ⊢ * : ◻
//   VAR:      Γ, x:A ⊢ x : A                  (si A está bien formado)
//   APP:      Γ ⊢ f : (Π x:A. B)
//             Γ ⊢ a : A
//             ───────────────────
//             Γ ⊢ f a : B[a/x]
//
//   LAM:      Γ, x:A ⊢ b : B
//             Γ ⊢ (Π x:A. B) : s                (well-formed)
//             ───────────────────────────
//             Γ ⊢ (λ x:A. b) : (Π x:A. B)
//
//   PI:       Γ ⊢ A : s1
//             Γ, x:A ⊢ B : s2
//             (s1, s2) ∈ R(system)
//             ───────────────────────
//             Γ ⊢ (Π x:A. B) : s2
//
//   CONV:     Γ ⊢ t : A,  A =βη B,  Γ ⊢ B : s
//             ──────────────────────────────────
//             Γ ⊢ t : B
//
// Sin η, sin universos jerárquicos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInferError = isInferError;
exports.inferType = inferType;
exports.checkType = checkType;
exports.isClosedUnder = isClosedUnder;
const types_1 = require("./types");
const rules_1 = require("./rules");
const normalize_1 = require("./normalize");
function isInferError(r) {
    return typeof r === 'object' && r !== null && 'error' in r && typeof r.error === 'string';
}
/** Whnf parcial: normaliza solo lo necesario para revelar el head. */
function whnf(term, system) {
    return (0, normalize_1.normalize)(term, system);
}
function getSort(term) {
    return term.kind === 'sort' ? term.sort : undefined;
}
/**
 * Infiere el tipo de `term` bajo `ctx` en el sistema dado. Devuelve
 * el tipo, o `{ error }` si no es tipable.
 */
function inferType(term, ctx = new Map(), system = 'lambda-C') {
    switch (term.kind) {
        case 'sort': {
            const axiom = (0, rules_1.axiomFor)(term.sort);
            if (axiom === undefined) {
                return { error: `sort '${term.sort}' no tiene axioma de tipado` };
            }
            return (0, types_1.cSort)(axiom);
        }
        case 'var': {
            const t = ctx.get(term.name);
            if (!t)
                return { error: `variable libre sin tipo: ${term.name}` };
            return t;
        }
        case 'pi': {
            // (PI) Γ ⊢ A : s1 ; Γ, x:A ⊢ B : s2 ; (s1,s2) ∈ R
            const domType = inferType(term.domain, ctx, system);
            if (isInferError(domType))
                return domType;
            const s1 = getSort(whnf(domType, system));
            if (!s1) {
                return {
                    error: `dominio de Π debe ser un sort, pero ${(0, types_1.termToString)(term.domain)} : ${(0, types_1.termToString)(domType)}`,
                };
            }
            const ctx2 = (0, types_1.extendContext)(ctx, term.bind, term.domain);
            const codType = inferType(term.codomain, ctx2, system);
            if (isInferError(codType))
                return codType;
            const s2 = getSort(whnf(codType, system));
            if (!s2) {
                return {
                    error: `codominio de Π debe ser un sort, pero ${(0, types_1.termToString)(term.codomain)} : ${(0, types_1.termToString)(codType)}`,
                };
            }
            if (!(0, rules_1.hasRule)(system, s1, s2)) {
                return {
                    error: `regla de formación (${s1}, ${s2}) no disponible en el sistema ${system}`,
                };
            }
            return (0, types_1.cSort)(s2);
        }
        case 'lam': {
            // (LAM) Γ, x:A ⊢ b : B ; Γ ⊢ Π x:A. B : s
            const domType = inferType(term.domain, ctx, system);
            if (isInferError(domType))
                return domType;
            const s1 = getSort(whnf(domType, system));
            if (!s1) {
                return {
                    error: `parámetro de λ debe tener un tipo (sort), pero ${(0, types_1.termToString)(term.domain)} : ${(0, types_1.termToString)(domType)}`,
                };
            }
            const ctx2 = (0, types_1.extendContext)(ctx, term.bind, term.domain);
            const bodyType = inferType(term.body, ctx2, system);
            if (isInferError(bodyType))
                return bodyType;
            // El Π reconstruido debe ser bien-formado en el sistema activo.
            const piType = {
                kind: 'pi',
                bind: term.bind,
                domain: term.domain,
                codomain: bodyType,
            };
            const piSort = inferType(piType, ctx, system);
            if (isInferError(piSort))
                return piSort;
            return piType;
        }
        case 'app': {
            // (APP) f : (Π x:A. B) ; a : A ⟹ f a : B[a/x]
            const fnType = inferType(term.fn, ctx, system);
            if (isInferError(fnType))
                return fnType;
            const fnWhnf = whnf(fnType, system);
            if (fnWhnf.kind !== 'pi') {
                return {
                    error: `aplicación requiere función Π, pero ${(0, types_1.termToString)(term.fn)} : ${(0, types_1.termToString)(fnType)}`,
                };
            }
            const argType = inferType(term.arg, ctx, system);
            if (isInferError(argType))
                return argType;
            if (!(0, normalize_1.alphaBetaEq)(argType, fnWhnf.domain, system)) {
                return {
                    error: `argumento incompatible: esperaba ${(0, types_1.termToString)(fnWhnf.domain)}, recibió ${(0, types_1.termToString)(argType)}`,
                };
            }
            return (0, normalize_1.substitute)(fnWhnf.codomain, fnWhnf.bind, term.arg);
        }
    }
}
/**
 * Verifica que `term` tiene tipo `expected` bajo `ctx` en `system`.
 * Igualdad de tipos: módulo α y β.
 */
function checkType(term, expected, ctx = new Map(), system = 'lambda-C') {
    const actual = inferType(term, ctx, system);
    if (isInferError(actual))
        return false;
    return (0, normalize_1.alphaBetaEq)(actual, expected, system);
}
/** ¿Las variables libres del término tienen todas un binding en `ctx`? */
function isClosedUnder(term, ctx) {
    for (const fv of (0, types_1.freeVars)(term)) {
        if (!ctx.has(fv))
            return false;
    }
    return true;
}
//# sourceMappingURL=typecheck.js.map