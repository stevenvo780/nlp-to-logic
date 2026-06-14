"use strict";
// ============================================================
// Refinement types — Type checker bidireccional
// ============================================================
//
// El checker es bidireccional en el sentido estándar:
//   - synth : term → RefType    (inferir el tipo)
//   - check : term × RefType    (chequear contra un tipo esperado)
//
// Genera predicados de verificación (VCs) cuando es necesario:
//   - Aplicación: el argumento debe cumplir la precondición del parámetro.
//   - Anotación let: el valor debe cumplir el predicado anotado.
//   - Anotación contra `expected`: el tipo inferido debe ser subtipo.
//
// Las VCs se descargan con el solver acotado.
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeCheck = typeCheck;
exports.generateVC = generateVC;
const types_1 = require("./types");
const subtype_1 = require("./subtype");
const predicate_1 = require("./predicate");
function freshBinding(used, base = 'v') {
    let i = 0;
    let name = `_${base}${i}`;
    while (used.has(name)) {
        i++;
        name = `_${base}${i}`;
    }
    used.add(name);
    return name;
}
function ctxAssumptions(ctx) {
    const out = [];
    for (const [name, ty] of ctx.entries()) {
        const pred = ty.predicate.trim();
        if (pred === '' || pred === 'true')
            continue;
        if (typeof ty.base !== 'string')
            continue; // arrows no aportan asunciones aritméticas
        out.push((0, predicate_1.renameVar)(pred, ty.binding, name));
    }
    return out;
}
function singletonInt(value) {
    return { base: 'Int', binding: 'v', predicate: `v == ${value}` };
}
function singletonBool(value) {
    return { base: 'Bool', binding: 'v', predicate: `v == ${value}` };
}
function singletonString() {
    return (0, types_1.tString)('v', 'true');
}
function eqBase(a, b) {
    if (typeof a === 'string' || typeof b === 'string')
        return a === b;
    return eqBase(a.from.base, b.from.base) && eqBase(a.to.base, b.to.base);
}
/**
 * synthesize — infiere un RefType para `term` en el contexto dado.
 * Devuelve también la lista de VCs acumuladas y los errores fatales.
 */
function synthesize(term, ctx, errors, vcs) {
    switch (term.kind) {
        case 'lit':
            if (typeof term.value === 'number')
                return singletonInt(term.value);
            if (typeof term.value === 'boolean')
                return singletonBool(term.value);
            return singletonString();
        case 'var': {
            const ty = ctx.get(term.name);
            if (!ty) {
                errors.push(`variable libre "${term.name}"`);
                return undefined;
            }
            // Reflejamos el predicado de ctx como singleton sobre la variable.
            if (typeof ty.base === 'string') {
                const used = new Set(ctx.keys());
                used.add(term.name);
                const fresh = freshBinding(used);
                const refl = `${fresh} == ${term.name}`;
                const renamedPred = ty.predicate.trim() === '' || ty.predicate.trim() === 'true'
                    ? refl
                    : `(${refl}) && ${(0, predicate_1.renameVar)(ty.predicate, ty.binding, term.name)}`;
                return { base: ty.base, binding: fresh, predicate: renamedPred };
            }
            return ty;
        }
        case 'binop': {
            const lt = synthesize(term.left, ctx, errors, vcs);
            const rt = synthesize(term.right, ctx, errors, vcs);
            if (!lt || !rt)
                return undefined;
            const arith = ['+', '-', '*'].includes(term.op);
            const cmp = ['<', '<=', '>', '>=', '==', '!='].includes(term.op);
            const bool = ['&&', '||'].includes(term.op);
            if (arith) {
                if (lt.base !== 'Int' || rt.base !== 'Int') {
                    errors.push(`binop ${term.op}: requiere Int, recibido ${(0, types_1.refTypeToString)(lt)} y ${(0, types_1.refTypeToString)(rt)}`);
                    return undefined;
                }
                return (0, types_1.tInt)('v', 'true');
            }
            if (cmp) {
                if (lt.base !== rt.base) {
                    errors.push(`binop ${term.op}: lados de tipos distintos`);
                    return undefined;
                }
                return (0, types_1.tBool)('v', 'true');
            }
            if (bool) {
                if (lt.base !== 'Bool' || rt.base !== 'Bool') {
                    errors.push(`binop ${term.op}: requiere Bool`);
                    return undefined;
                }
                return (0, types_1.tBool)('v', 'true');
            }
            errors.push(`binop desconocido ${term.op}`);
            return undefined;
        }
        case 'if': {
            const ct = synthesize(term.cond, ctx, errors, vcs);
            if (!ct)
                return undefined;
            if (ct.base !== 'Bool') {
                errors.push(`if: condición no booleana: ${(0, types_1.refTypeToString)(ct)}`);
                return undefined;
            }
            const tt = synthesize(term.then, ctx, errors, vcs);
            const et = synthesize(term.else, ctx, errors, vcs);
            if (!tt || !et)
                return undefined;
            if (!eqBase(tt.base, et.base)) {
                errors.push(`if: ramas de tipos distintos (${(0, types_1.refTypeToString)(tt)} vs ${(0, types_1.refTypeToString)(et)})`);
                return undefined;
            }
            return { base: tt.base, binding: '_v', predicate: 'true' };
        }
        case 'lam': {
            const newCtx = new Map(ctx);
            newCtx.set(term.param, term.paramType);
            const bodyTy = synthesize(term.body, newCtx, errors, vcs);
            if (!bodyTy)
                return undefined;
            return {
                base: { kind: 'arrow', from: term.paramType, to: bodyTy },
                binding: '_f',
                predicate: 'true',
            };
        }
        case 'app': {
            const ft = synthesize(term.fn, ctx, errors, vcs);
            if (!ft)
                return undefined;
            if (typeof ft.base === 'string' || ft.base.kind !== 'arrow') {
                errors.push(`app: lado izquierdo no es función: ${(0, types_1.refTypeToString)(ft)}`);
                return undefined;
            }
            const paramTy = ft.base.from;
            const resTy = ft.base.to;
            // Chequeamos que el argumento sea subtipo del paramType.
            const ok = check(term.arg, paramTy, ctx, errors, vcs);
            if (!ok)
                return undefined;
            return resTy;
        }
        case 'let': {
            const valTy = synthesize(term.value, ctx, errors, vcs);
            if (!valTy)
                return undefined;
            let boundTy = valTy;
            if (term.bindType) {
                const ok = check(term.value, term.bindType, ctx, errors, vcs);
                if (!ok)
                    return undefined;
                boundTy = term.bindType;
            }
            const newCtx = new Map(ctx);
            newCtx.set(term.bind, boundTy);
            return synthesize(term.body, newCtx, errors, vcs);
        }
    }
}
function check(term, expected, ctx, errors, vcs) {
    const synth = synthesize(term, ctx, errors, vcs);
    if (!synth)
        return false;
    if (!eqBase(synth.base, expected.base)) {
        errors.push(`check: tipo base esperado ${(0, types_1.refTypeToString)(expected)}, obtenido ${(0, types_1.refTypeToString)(synth)} en ${(0, types_1.termToString)(term)}`);
        return false;
    }
    // Fast-path: si el término es un literal, evaluamos el predicado esperado
    // sustituyendo concretamente — esto es exacto y evita depender de la cota
    // del solver bounded para literales grandes.
    if (term.kind === 'lit') {
        const predSrc = expected.predicate.trim();
        if (predSrc === '' || predSrc === 'true')
            return true;
        try {
            const ast = (0, predicate_1.parsePredicate)(predSrc);
            const val = (0, predicate_1.evalPredicate)(ast, { [expected.binding]: term.value });
            if (val === true)
                return true;
            const vc = `${expected.binding} = ${JSON.stringify(term.value)} ⇒ ${predSrc}`;
            vcs.push(vc);
            errors.push(`check: literal ${(0, types_1.termToString)(term)} no satisface ${(0, types_1.refTypeToString)(expected)}`);
            return false;
        }
        catch (err) {
            errors.push(`check: error evaluando predicado: ${String(err)}`);
            return false;
        }
    }
    const assumptions = ctxAssumptions(ctx);
    const sub = (0, subtype_1.isSubtype)(synth, expected, { extraAssumptions: assumptions });
    if (!sub) {
        const vc = `${synth.predicate} ⇒ ${expected.predicate}`;
        vcs.push(vc);
        errors.push(`check: no se pudo verificar ${(0, types_1.refTypeToString)(synth)} <: ${(0, types_1.refTypeToString)(expected)} (VC: ${vc})`);
        return false;
    }
    return true;
}
/**
 * typeCheck — API principal: chequea o sintetiza el tipo de `term`.
 * Si `expected` se provee, valida contra ese tipo.
 */
function typeCheck(term, expected, ctx = new Map()) {
    const errors = [];
    const vcs = [];
    if (expected) {
        const ok = check(term, expected, ctx, errors, vcs);
        return { ok, errors, type: ok ? expected : undefined, vcs };
    }
    const ty = synthesize(term, ctx, errors, vcs);
    return { ok: errors.length === 0, errors, type: ty, vcs };
}
/**
 * generateVC — colecta los predicados que deben mantenerse para que
 * `term` sea bien tipado en `ctx`. Útil para inspección / debugging.
 */
function generateVC(term, ctx = new Map()) {
    const errors = [];
    const vcs = [];
    synthesize(term, ctx, errors, vcs);
    return vcs;
}
//# sourceMappingURL=checker.js.map