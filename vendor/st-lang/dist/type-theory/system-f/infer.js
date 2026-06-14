"use strict";
// ============================================================
// System F — Type checking
// ============================================================
//
// Reglas:
//   x : T                   si (x:T) ∈ Γ
//   λx:T. M : T → U          si Γ, x:T ⊢ M : U  y T well-formed en Δ
//   M N : U                  si M : T → U  y  N : T
//   Λ X. M : ∀X. T           si Δ, X ⊢ M : T  (con X fresca)
//   M [T] : U[X := T]        si M : ∀X. U  y  T well-formed en Δ
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeError = isTypeError;
exports.typeOf = typeOf;
const types_1 = require("./types");
const reduce_1 = require("./reduce");
function isTypeError(r) {
    return typeof r === 'object' && r !== null && 'error' in r;
}
function typeOf(term, ctx = (0, types_1.emptyContext)()) {
    switch (term.kind) {
        case 'var': {
            const t = ctx.term.get(term.name);
            if (!t)
                return { error: `variable libre sin tipo en contexto: '${term.name}'` };
            return t;
        }
        case 'abs': {
            if (!(0, types_1.isWellFormed)(term.paramType, ctx.type)) {
                return {
                    error: `anotación de tipo no bien-formada: ${(0, types_1.fTypeToString)(term.paramType)} (variables de tipo libres no declaradas)`,
                };
            }
            const newCtx = (0, types_1.cloneContext)(ctx);
            newCtx.term.set(term.param, term.paramType);
            const bodyT = typeOf(term.body, newCtx);
            if (isTypeError(bodyT))
                return bodyT;
            return { kind: 'arrow', from: term.paramType, to: bodyT };
        }
        case 'app': {
            const fnT = typeOf(term.fn, ctx);
            if (isTypeError(fnT))
                return fnT;
            if (fnT.kind !== 'arrow') {
                return {
                    error: `aplicación requiere función A→B, encontré: ${(0, types_1.fTypeToString)(fnT)}`,
                };
            }
            const argT = typeOf(term.arg, ctx);
            if (isTypeError(argT))
                return argT;
            if (!(0, types_1.alphaEqType)(fnT.from, argT)) {
                return {
                    error: `tipo de argumento no coincide: esperaba ${(0, types_1.fTypeToString)(fnT.from)}, obtuve ${(0, types_1.fTypeToString)(argT)}`,
                };
            }
            return fnT.to;
        }
        case 'tabs': {
            // Λ X. M : ∀X. T  — extender Δ con la variable de tipo nueva.
            // Si ya estaba en Δ, podríamos shadowearla; preferimos rechazar
            // shadowing implícito para evitar confusión didáctica.
            if (ctx.type.has(term.bind)) {
                return {
                    error: `Λ${term.bind} shadowea una variable de tipo ya declarada — renómbrala`,
                };
            }
            const newCtx = (0, types_1.cloneContext)(ctx);
            newCtx.type.add(term.bind);
            const bodyT = typeOf(term.body, newCtx);
            if (isTypeError(bodyT))
                return bodyT;
            return { kind: 'forall', bind: term.bind, body: bodyT };
        }
        case 'tapp': {
            const fnT = typeOf(term.fn, ctx);
            if (isTypeError(fnT))
                return fnT;
            if (fnT.kind !== 'forall') {
                return {
                    error: `type application requiere ∀X. T, encontré: ${(0, types_1.fTypeToString)(fnT)}`,
                };
            }
            if (!(0, types_1.isWellFormed)(term.typeArg, ctx.type)) {
                return {
                    error: `argumento de tipo no bien-formado: ${(0, types_1.fTypeToString)(term.typeArg)} (variables libres no declaradas)`,
                };
            }
            return (0, reduce_1.substType)(fnT.body, fnT.bind, term.typeArg);
        }
    }
}
//# sourceMappingURL=infer.js.map