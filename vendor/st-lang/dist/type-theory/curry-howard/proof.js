"use strict";
// ============================================================
// Curry-Howard — Conversión bidireccional term ↔ ProofTree
// ============================================================
//
// term → proof: caminamos el λ-term anotado y emitimos el árbol
// de deducción natural correspondiente. El contexto de tipado se
// duplica como conjunto de supuestos disponibles.
//
// proof → term: por inducción sobre las reglas usadas, fabricamos
// el λ-término. Cada `axiom` produce una variable libre cuyo
// nombre lo trae el árbol (`assumption`). Las reglas que descargan
// supuestos (→I, ∨E) los reflejan en `discharged`, lo que nos da el
// binder del λ.
//
// Round-trip: term → proof → term preserva el tipo inferido.
// (No necesariamente preserva el término sintácticamente — bajo β-
// equivalencia tampoco se pretende: `proofToTerm(termToProof(t))`
// devuelve t en los casos directos cubiertos por los tests.)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofConversionError = void 0;
exports.termToProof = termToProof;
exports.proofToTerm = proofToTerm;
exports.proofIsConsistent = proofIsConsistent;
const infer_1 = require("./infer");
const types_1 = require("./types");
class ProofConversionError extends Error {
}
exports.ProofConversionError = ProofConversionError;
// ---------- term → proof ----------
function termToProof(term, ctx = {}) {
    return buildProof(term, ctx);
}
function buildProof(term, ctx) {
    switch (term.kind) {
        case 'var': {
            const t = ctx[term.name];
            if (!t) {
                throw new ProofConversionError(`variable '${term.name}' no está en contexto`);
            }
            return { rule: 'axiom', conclusion: t, premises: [], assumption: term.name };
        }
        case 'abs': {
            const innerCtx = { ...ctx, [term.param]: term.paramType };
            const sub = buildProof(term.body, innerCtx);
            return {
                rule: '→I',
                conclusion: { kind: 'arrow', from: term.paramType, to: sub.conclusion },
                premises: [sub],
                discharged: [{ name: term.param, type: term.paramType }],
            };
        }
        case 'app': {
            const left = buildProof(term.fn, ctx);
            const right = buildProof(term.arg, ctx);
            if (left.conclusion.kind !== 'arrow') {
                throw new ProofConversionError(`→E aplicado a no-flecha: ${(0, types_1.typeToString)(left.conclusion)}`);
            }
            if (!(0, types_1.eqType)(left.conclusion.from, right.conclusion)) {
                throw new ProofConversionError(`→E con argumento de tipo equivocado: esperaba ${(0, types_1.typeToString)(left.conclusion.from)} obtuve ${(0, types_1.typeToString)(right.conclusion)}`);
            }
            return {
                rule: '→E',
                conclusion: left.conclusion.to,
                premises: [left, right],
            };
        }
        case 'pair': {
            const l = buildProof(term.fst, ctx);
            const r = buildProof(term.snd, ctx);
            return {
                rule: '∧I',
                conclusion: { kind: 'product', left: l.conclusion, right: r.conclusion },
                premises: [l, r],
            };
        }
        case 'fst': {
            const p = buildProof(term.pair, ctx);
            if (p.conclusion.kind !== 'product') {
                throw new ProofConversionError(`∧E-L sobre no-producto`);
            }
            return { rule: '∧E-L', conclusion: p.conclusion.left, premises: [p] };
        }
        case 'snd': {
            const p = buildProof(term.pair, ctx);
            if (p.conclusion.kind !== 'product') {
                throw new ProofConversionError(`∧E-R sobre no-producto`);
            }
            return { rule: '∧E-R', conclusion: p.conclusion.right, premises: [p] };
        }
        case 'inl': {
            const sub = buildProof(term.left, ctx);
            return {
                rule: '∨I-L',
                conclusion: { kind: 'sum', left: sub.conclusion, right: term.rightType },
                premises: [sub],
            };
        }
        case 'inr': {
            const sub = buildProof(term.right, ctx);
            return {
                rule: '∨I-R',
                conclusion: { kind: 'sum', left: term.leftType, right: sub.conclusion },
                premises: [sub],
            };
        }
        case 'case': {
            const s = buildProof(term.scrutinee, ctx);
            if (s.conclusion.kind !== 'sum') {
                throw new ProofConversionError(`∨E sobre no-disyunción`);
            }
            const leftCtx = { ...ctx, [term.leftBind]: s.conclusion.left };
            const lBranch = buildProof(term.leftBody, leftCtx);
            const rightCtx = { ...ctx, [term.rightBind]: s.conclusion.right };
            const rBranch = buildProof(term.rightBody, rightCtx);
            if (!(0, types_1.eqType)(lBranch.conclusion, rBranch.conclusion)) {
                throw new ProofConversionError(`∨E con ramas de tipos distintos: ${(0, types_1.typeToString)(lBranch.conclusion)} vs ${(0, types_1.typeToString)(rBranch.conclusion)}`);
            }
            return {
                rule: '∨E',
                conclusion: lBranch.conclusion,
                premises: [s, lBranch, rBranch],
                discharged: [
                    { name: term.leftBind, type: s.conclusion.left },
                    { name: term.rightBind, type: s.conclusion.right },
                ],
            };
        }
        case 'absurd': {
            const sub = buildProof(term.proofOfFalse, ctx);
            if (sub.conclusion.kind !== 'bottom') {
                throw new ProofConversionError(`⊥E sobre no-bottom`);
            }
            return {
                rule: '⊥E',
                conclusion: term.resultType,
                premises: [sub],
            };
        }
    }
}
// ---------- proof → term ----------
function proofToTerm(proof) {
    switch (proof.rule) {
        case 'axiom': {
            if (!proof.assumption) {
                throw new ProofConversionError(`axiom sin nombre de hipótesis`);
            }
            return { kind: 'var', name: proof.assumption };
        }
        case '→I': {
            if (proof.premises.length !== 1 || !proof.discharged || proof.discharged.length !== 1) {
                throw new ProofConversionError(`→I mal formado`);
            }
            const sub = proofToTerm(proof.premises[0]);
            const d = proof.discharged[0];
            return { kind: 'abs', param: d.name, paramType: d.type, body: sub };
        }
        case '→E': {
            if (proof.premises.length !== 2)
                throw new ProofConversionError(`→E mal formado`);
            return {
                kind: 'app',
                fn: proofToTerm(proof.premises[0]),
                arg: proofToTerm(proof.premises[1]),
            };
        }
        case '∧I': {
            if (proof.premises.length !== 2)
                throw new ProofConversionError(`∧I mal formado`);
            return {
                kind: 'pair',
                fst: proofToTerm(proof.premises[0]),
                snd: proofToTerm(proof.premises[1]),
            };
        }
        case '∧E-L': {
            if (proof.premises.length !== 1)
                throw new ProofConversionError(`∧E-L mal formado`);
            return { kind: 'fst', pair: proofToTerm(proof.premises[0]) };
        }
        case '∧E-R': {
            if (proof.premises.length !== 1)
                throw new ProofConversionError(`∧E-R mal formado`);
            return { kind: 'snd', pair: proofToTerm(proof.premises[0]) };
        }
        case '∨I-L': {
            if (proof.premises.length !== 1 || proof.conclusion.kind !== 'sum') {
                throw new ProofConversionError(`∨I-L mal formado`);
            }
            return {
                kind: 'inl',
                left: proofToTerm(proof.premises[0]),
                rightType: proof.conclusion.right,
            };
        }
        case '∨I-R': {
            if (proof.premises.length !== 1 || proof.conclusion.kind !== 'sum') {
                throw new ProofConversionError(`∨I-R mal formado`);
            }
            return {
                kind: 'inr',
                right: proofToTerm(proof.premises[0]),
                leftType: proof.conclusion.left,
            };
        }
        case '∨E': {
            if (proof.premises.length !== 3 || !proof.discharged || proof.discharged.length !== 2) {
                throw new ProofConversionError(`∨E mal formado`);
            }
            return {
                kind: 'case',
                scrutinee: proofToTerm(proof.premises[0]),
                leftBind: proof.discharged[0].name,
                leftBody: proofToTerm(proof.premises[1]),
                rightBind: proof.discharged[1].name,
                rightBody: proofToTerm(proof.premises[2]),
            };
        }
        case '⊥E': {
            if (proof.premises.length !== 1)
                throw new ProofConversionError(`⊥E mal formado`);
            return {
                kind: 'absurd',
                proofOfFalse: proofToTerm(proof.premises[0]),
                resultType: proof.conclusion,
            };
        }
    }
}
// Sanity check: la conclusión final de un proof equivale al tipo
// inferido del término generado (mismo contexto vacío de externos).
function proofIsConsistent(proof) {
    let term;
    try {
        term = proofToTerm(proof);
    }
    catch {
        return false;
    }
    // El árbol puede dejar hipótesis abiertas (axioms no descargados).
    // Inferimos con ctx con esas hipótesis.
    const ctx = collectOpenAssumptions(proof);
    const t = (0, infer_1.inferType)(term, ctx);
    if ((0, infer_1.isInferError)(t))
        return false;
    return (0, types_1.eqType)(t, proof.conclusion);
}
function collectOpenAssumptions(proof, discharged = new Set()) {
    const ctx = {};
    function walk(p, scopedDischarged) {
        if (p.rule === 'axiom') {
            if (p.assumption && !scopedDischarged.has(p.assumption)) {
                ctx[p.assumption] = p.conclusion;
            }
            return;
        }
        if (p.rule === '→I' && p.discharged) {
            const next = new Set(scopedDischarged);
            for (const d of p.discharged)
                next.add(d.name);
            for (const sub of p.premises)
                walk(sub, next);
            return;
        }
        if (p.rule === '∨E' && p.discharged && p.premises.length === 3) {
            walk(p.premises[0], scopedDischarged);
            const lScope = new Set(scopedDischarged);
            lScope.add(p.discharged[0].name);
            walk(p.premises[1], lScope);
            const rScope = new Set(scopedDischarged);
            rScope.add(p.discharged[1].name);
            walk(p.premises[2], rScope);
            return;
        }
        for (const sub of p.premises)
            walk(sub, scopedDischarged);
    }
    walk(proof, discharged);
    return ctx;
}
//# sourceMappingURL=proof.js.map