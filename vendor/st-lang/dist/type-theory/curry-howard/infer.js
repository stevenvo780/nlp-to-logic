"use strict";
// ============================================================
// Curry-Howard — Type inference (checking) para λ-terms anotados
// ============================================================
//
// El λ-cálculo simplemente tipado con anotaciones en el binder
// admite type-checking directo (no requiere Hindley-Milner): cada
// abstracción declara el tipo de su parámetro, así que el tipo
// del cuerpo se obtiene recursivamente.
//
// Devuelve `{ error }` en lugar de lanzar para que sea fácil
// componer en tests y herramientas didácticas.
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferType = inferType;
exports.isInferError = isInferError;
const types_1 = require("./types");
function inferType(term, ctx = {}) {
    return inferInternal(term, ctx);
}
function isInferError(r) {
    return typeof r === 'object' && r !== null && 'error' in r;
}
function inferInternal(term, ctx) {
    switch (term.kind) {
        case 'var': {
            const t = ctx[term.name];
            if (!t)
                return { error: `variable libre sin tipo en contexto: '${term.name}'` };
            return t;
        }
        case 'abs': {
            const newCtx = { ...ctx, [term.param]: term.paramType };
            const bodyType = inferInternal(term.body, newCtx);
            if (isInferError(bodyType))
                return bodyType;
            return { kind: 'arrow', from: term.paramType, to: bodyType };
        }
        case 'app': {
            const fnT = inferInternal(term.fn, ctx);
            if (isInferError(fnT))
                return fnT;
            if (fnT.kind !== 'arrow') {
                return {
                    error: `aplicación requiere función A→B, encontré: ${(0, types_1.typeToString)(fnT)}`,
                };
            }
            const argT = inferInternal(term.arg, ctx);
            if (isInferError(argT))
                return argT;
            if (!(0, types_1.eqType)(fnT.from, argT)) {
                return {
                    error: `tipo de argumento no coincide: esperaba ${(0, types_1.typeToString)(fnT.from)}, obtuve ${(0, types_1.typeToString)(argT)}`,
                };
            }
            return fnT.to;
        }
        case 'pair': {
            const a = inferInternal(term.fst, ctx);
            if (isInferError(a))
                return a;
            const b = inferInternal(term.snd, ctx);
            if (isInferError(b))
                return b;
            return { kind: 'product', left: a, right: b };
        }
        case 'fst': {
            const p = inferInternal(term.pair, ctx);
            if (isInferError(p))
                return p;
            if (p.kind !== 'product') {
                return { error: `fst espera A∧B, recibí: ${(0, types_1.typeToString)(p)}` };
            }
            return p.left;
        }
        case 'snd': {
            const p = inferInternal(term.pair, ctx);
            if (isInferError(p))
                return p;
            if (p.kind !== 'product') {
                return { error: `snd espera A∧B, recibí: ${(0, types_1.typeToString)(p)}` };
            }
            return p.right;
        }
        case 'inl': {
            const l = inferInternal(term.left, ctx);
            if (isInferError(l))
                return l;
            return { kind: 'sum', left: l, right: term.rightType };
        }
        case 'inr': {
            const r = inferInternal(term.right, ctx);
            if (isInferError(r))
                return r;
            return { kind: 'sum', left: term.leftType, right: r };
        }
        case 'case': {
            const sT = inferInternal(term.scrutinee, ctx);
            if (isInferError(sT))
                return sT;
            if (sT.kind !== 'sum') {
                return { error: `case espera A∨B, recibí: ${(0, types_1.typeToString)(sT)}` };
            }
            const leftCtx = { ...ctx, [term.leftBind]: sT.left };
            const lT = inferInternal(term.leftBody, leftCtx);
            if (isInferError(lT))
                return lT;
            const rightCtx = { ...ctx, [term.rightBind]: sT.right };
            const rT = inferInternal(term.rightBody, rightCtx);
            if (isInferError(rT))
                return rT;
            if (!(0, types_1.eqType)(lT, rT)) {
                return {
                    error: `ramas de case con tipos distintos: ${(0, types_1.typeToString)(lT)} vs ${(0, types_1.typeToString)(rT)}`,
                };
            }
            return lT;
        }
        case 'absurd': {
            const p = inferInternal(term.proofOfFalse, ctx);
            if (isInferError(p))
                return p;
            if (p.kind !== 'bottom') {
                return { error: `absurd espera ⊥, recibí: ${(0, types_1.typeToString)(p)}` };
            }
            return term.resultType;
        }
    }
}
//# sourceMappingURL=infer.js.map