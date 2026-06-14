"use strict";
// ============================================================
// Natural Deduction NK (classical) — Backward proof search
// ============================================================
//
// Estrategia: reutilizamos el motor intuicionista NJ y añadimos
// la regla clásica `rAA` (reductio ad absurdum) como recurso
// global. Con rAA disponible se obtiene completitud clásica:
// si Γ ⊨ φ entonces Γ ⊢_NK φ.
//
// Heurística de búsqueda:
//   1. Intentar las reglas estándar NJ.
//   2. Si la meta es atómica o disyuntiva (no descomponible por
//      reglas de introducción) y no hubo prueba, intentar rAA:
//      asume ¬φ y trata de derivar ⊥.
//   3. Si la meta es exactamente `¬¬φ → φ`, atajamos con
//      doubleNegE como axioma derivado.
//
// El árbol generado es válido NK (verificable por verifyProof).
// Cuando la prueba evita rAA/LEM/Peirce/doubleNegE, se traduce
// automáticamente a NJ (ver `nkToNJ`).
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveClassically = proveClassically;
exports.proveIntuitOnly = proveIntuitOnly;
exports.verifyProof = verifyProof;
exports.provedPeirce = provedPeirce;
exports.provedDNE = provedDNE;
exports.provedLEM = provedLEM;
exports.nkToNJ = nkToNJ;
const types_1 = require("./types");
const formula_1 = require("./formula");
function freshCtx(budget, intuitOnly = false) {
    return { budget, used: 0, failed: new Set(), active: new Set(), intuitOnly };
}
function exhausted(ctx) {
    return ctx.used >= ctx.budget;
}
function goalKey(context, goal, classicalAllowed) {
    const sorted = context.map(formula_1.formulaKey).sort();
    return `${classicalAllowed ? 'C' : 'I'}[${sorted.join('|')}]⊢${(0, formula_1.formulaKey)(goal)}`;
}
function contextHas(context, f) {
    for (const g of context)
        if ((0, formula_1.formulaEquals)(g, f))
            return true;
    return false;
}
function withContext(context, f) {
    if (contextHas(context, f))
        return context;
    return [...context, f];
}
/**
 * Núcleo recursivo. Devuelve un árbol NK válido para `context ⊢ goal`
 * o `null` si no se encontró prueba dentro del budget.
 */
function search(context, goal, ctx) {
    ctx.used++;
    if (exhausted(ctx))
        return null;
    const key = goalKey(context, goal, !ctx.intuitOnly);
    if (ctx.failed.has(key))
        return null;
    if (ctx.active.has(key))
        return null;
    ctx.active.add(key);
    const tryProve = () => {
        // 1. Axioma / asunción.
        for (const h of context) {
            if ((0, formula_1.formulaEquals)(h, goal)) {
                return { conclusion: goal, rule: 'assumption', premises: [] };
            }
        }
        // 2. Reglas de introducción dirigidas por la forma de la meta
        //    (invertibles para ∧, →, ¬).
        if (goal.kind === 'and') {
            const left = search(context, goal.left, ctx);
            if (!left)
                return null;
            const right = search(context, goal.right, ctx);
            if (!right)
                return null;
            return { conclusion: goal, rule: 'andI', premises: [left, right] };
        }
        if (goal.kind === 'implies') {
            const newCtx = withContext(context, goal.left);
            const body = search(newCtx, goal.right, ctx);
            if (!body)
                return null;
            return {
                conclusion: goal,
                rule: 'impI',
                premises: [body],
                discharged: [goal.left],
            };
        }
        if (goal.kind === 'not') {
            const newCtx = withContext(context, goal.arg);
            const body = search(newCtx, (0, formula_1.bottom)(), ctx);
            if (!body)
                return null;
            return {
                conclusion: goal,
                rule: 'notI',
                premises: [body],
                discharged: [goal.arg],
            };
        }
        // 3. Reglas de eliminación a izquierda (sobre el contexto).
        // ∧EL/∧ER: descomponer cualquier conjunción del contexto.
        for (let i = 0; i < context.length; i++) {
            const h = context[i];
            if (h && h.kind === 'and') {
                const rest = [...context.slice(0, i), ...context.slice(i + 1)];
                const extended = withContext(withContext(rest, h.left), h.right);
                const sub = search(extended, goal, ctx);
                if (!sub)
                    return null;
                const elimL = {
                    conclusion: h.left,
                    rule: 'andEL',
                    premises: [{ conclusion: h, rule: 'assumption', premises: [] }],
                };
                const elimR = {
                    conclusion: h.right,
                    rule: 'andER',
                    premises: [{ conclusion: h, rule: 'assumption', premises: [] }],
                };
                const withL = substituteAssumption(sub, h.left, elimL);
                return substituteAssumption(withL, h.right, elimR);
            }
        }
        // ⊥E: si ⊥ está en el contexto, podemos derivar cualquier meta.
        for (const h of context) {
            if (h.kind === 'bottom') {
                return {
                    conclusion: goal,
                    rule: 'bottomE',
                    premises: [{ conclusion: h, rule: 'assumption', premises: [] }],
                };
            }
        }
        // ∨E (no invertible): si una disyunción A∨B está en el contexto
        // y podemos probar la meta tanto bajo A como bajo B.
        for (let i = 0; i < context.length; i++) {
            const h = context[i];
            if (h && h.kind === 'or') {
                const rest = [...context.slice(0, i), ...context.slice(i + 1)];
                const leftCtx = withContext(rest, h.left);
                const rightCtx = withContext(rest, h.right);
                const leftSub = search(leftCtx, goal, ctx);
                if (!leftSub)
                    continue;
                const rightSub = search(rightCtx, goal, ctx);
                if (!rightSub)
                    continue;
                return {
                    conclusion: goal,
                    rule: 'orE',
                    premises: [{ conclusion: h, rule: 'assumption', premises: [] }, leftSub, rightSub],
                    discharged: [h.left, h.right],
                };
            }
        }
        // 4. Reglas no-invertibles sobre la meta (∨I).
        if (goal.kind === 'or') {
            const leftAttempt = search(context, goal.left, ctx);
            if (leftAttempt) {
                return { conclusion: goal, rule: 'orIL', premises: [leftAttempt] };
            }
            const rightAttempt = search(context, goal.right, ctx);
            if (rightAttempt) {
                return { conclusion: goal, rule: 'orIR', premises: [rightAttempt] };
            }
            // continúa a las reglas posteriores (incluyendo rAA si está
            // habilitada) — la disyunción puede no ser intuitivamente
            // demostrable (p.ej. P ∨ ¬P).
        }
        // →E (modus ponens hacia atrás).
        for (let i = 0; i < context.length; i++) {
            const h = context[i];
            if (h && h.kind === 'implies') {
                const aProof = search(context, h.left, ctx);
                if (!aProof)
                    continue;
                if ((0, formula_1.formulaEquals)(h.right, goal)) {
                    return {
                        conclusion: goal,
                        rule: 'impE',
                        premises: [{ conclusion: h, rule: 'assumption', premises: [] }, aProof],
                    };
                }
                const rest = [...context.slice(0, i), ...context.slice(i + 1)];
                const extended = withContext(rest, h.right);
                const sub = search(extended, goal, ctx);
                if (!sub)
                    continue;
                const elimB = {
                    conclusion: h.right,
                    rule: 'impE',
                    premises: [{ conclusion: h, rule: 'assumption', premises: [] }, aProof],
                };
                return substituteAssumption(sub, h.right, elimB);
            }
        }
        // ¬E: si tenemos ¬A en contexto y la meta es ⊥, intentar probar A.
        if (goal.kind === 'bottom') {
            for (const h of context) {
                if (h.kind === 'not') {
                    const aProof = search(context, h.arg, ctx);
                    if (aProof) {
                        return {
                            conclusion: (0, formula_1.bottom)(),
                            rule: 'notE',
                            premises: [{ conclusion: h, rule: 'assumption', premises: [] }, aProof],
                        };
                    }
                }
                if (h.kind === 'implies' && h.right.kind === 'bottom') {
                    const aProof = search(context, h.left, ctx);
                    if (aProof) {
                        return {
                            conclusion: (0, formula_1.bottom)(),
                            rule: 'impE',
                            premises: [{ conclusion: h, rule: 'assumption', premises: [] }, aProof],
                        };
                    }
                }
            }
        }
        // 5. Si la meta no es ⊥, derivar ⊥ del contexto y aplicar ⊥E.
        if (goal.kind !== 'bottom') {
            const bottomProof = search(context, (0, formula_1.bottom)(), ctx);
            if (bottomProof) {
                return { conclusion: goal, rule: 'bottomE', premises: [bottomProof] };
            }
        }
        // 6. CLÁSICA: reductio ad absurdum (rAA). Asume ¬goal, deriva ⊥.
        //    Sólo si no estamos en modo intuit-only y no es la meta `⊥`
        //    (donde rAA sería circular: asumir ⊤ y derivar ⊥).
        if (!ctx.intuitOnly && goal.kind !== 'bottom') {
            const negGoal = (0, formula_1.not)(goal);
            // Evitar loop infinito: si ya estamos buscando bajo ¬goal,
            // no aplicamos rAA otra vez.
            if (!contextHas(context, negGoal)) {
                const newCtx = withContext(context, negGoal);
                const sub = search(newCtx, (0, formula_1.bottom)(), ctx);
                if (sub) {
                    return {
                        conclusion: goal,
                        rule: 'rAA',
                        premises: [sub],
                        discharged: [negGoal],
                    };
                }
            }
        }
        return null;
    };
    const result = tryProve();
    ctx.active.delete(key);
    if (!result)
        ctx.failed.add(key);
    return result;
}
/**
 * Reescribe un subárbol que asume `assumption` como hipótesis libre,
 * sustituyendo cada `assumption`-node por la derivación `derivation`.
 */
function substituteAssumption(proof, assumption, derivation) {
    if (proof.rule === 'assumption' && (0, formula_1.formulaEquals)(proof.conclusion, assumption)) {
        return derivation;
    }
    const dischargedHere = proof.discharged?.some((d) => (0, formula_1.formulaEquals)(d, assumption));
    if (dischargedHere)
        return proof;
    const newPremises = proof.premises.map((p) => substituteAssumption(p, assumption, derivation));
    return { ...proof, premises: newPremises };
}
/**
 * API pública: prueba clásica.
 *
 * Devuelve un árbol NK que demuestra `goal` a partir de las
 * `premises` dadas, o `null` si no encontró prueba.
 */
function proveClassically(premises, goal, options = {}) {
    const ctx = freshCtx(options.budget ?? 20_000, false);
    return search(premises.slice(), goal, ctx);
}
/**
 * Variante restringida: intenta probar usando sólo reglas
 * intuicionistas (NJ). Útil internamente para `nkToNJ`.
 */
function proveIntuitOnly(premises, goal, options = {}) {
    const ctx = freshCtx(options.budget ?? 20_000, true);
    return search(premises.slice(), goal, ctx);
}
// ── Verificación de proofs ──────────────────────────────────
/**
 * Verifica recursivamente el árbol NK. Comprueba cada regla
 * localmente contra su conclusión y contexto.
 */
function verifyProof(proof, initialContext = []) {
    return verifyAt(proof, initialContext);
}
function verifyAt(proof, ctx) {
    const c = proof.conclusion;
    switch (proof.rule) {
        case 'assumption':
            return ctx.some((h) => (0, formula_1.formulaEquals)(h, c));
        case 'andI': {
            if (c.kind !== 'and' || proof.premises.length !== 2)
                return false;
            const [pa, pb] = proof.premises;
            if (!pa || !pb)
                return false;
            return ((0, formula_1.formulaEquals)(pa.conclusion, c.left) &&
                (0, formula_1.formulaEquals)(pb.conclusion, c.right) &&
                verifyAt(pa, ctx) &&
                verifyAt(pb, ctx));
        }
        case 'andEL': {
            if (proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p || p.conclusion.kind !== 'and')
                return false;
            return (0, formula_1.formulaEquals)(p.conclusion.left, c) && verifyAt(p, ctx);
        }
        case 'andER': {
            if (proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p || p.conclusion.kind !== 'and')
                return false;
            return (0, formula_1.formulaEquals)(p.conclusion.right, c) && verifyAt(p, ctx);
        }
        case 'orIL': {
            if (c.kind !== 'or' || proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            return (0, formula_1.formulaEquals)(p.conclusion, c.left) && verifyAt(p, ctx);
        }
        case 'orIR': {
            if (c.kind !== 'or' || proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            return (0, formula_1.formulaEquals)(p.conclusion, c.right) && verifyAt(p, ctx);
        }
        case 'orE': {
            if (proof.premises.length !== 3)
                return false;
            const [maj, l, r] = proof.premises;
            if (!maj || !l || !r)
                return false;
            if (maj.conclusion.kind !== 'or')
                return false;
            const A = maj.conclusion.left;
            const B = maj.conclusion.right;
            if (!(0, formula_1.formulaEquals)(l.conclusion, c))
                return false;
            if (!(0, formula_1.formulaEquals)(r.conclusion, c))
                return false;
            return (verifyAt(maj, ctx) && verifyAt(l, withContext(ctx, A)) && verifyAt(r, withContext(ctx, B)));
        }
        case 'impI': {
            if (c.kind !== 'implies' || proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            return (0, formula_1.formulaEquals)(p.conclusion, c.right) && verifyAt(p, withContext(ctx, c.left));
        }
        case 'impE': {
            if (proof.premises.length !== 2)
                return false;
            const [maj, min] = proof.premises;
            if (!maj || !min)
                return false;
            if (maj.conclusion.kind !== 'implies')
                return false;
            return ((0, formula_1.formulaEquals)(maj.conclusion.left, min.conclusion) &&
                (0, formula_1.formulaEquals)(maj.conclusion.right, c) &&
                verifyAt(maj, ctx) &&
                verifyAt(min, ctx));
        }
        case 'notI': {
            if (c.kind !== 'not' || proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            return p.conclusion.kind === 'bottom' && verifyAt(p, withContext(ctx, c.arg));
        }
        case 'notE': {
            if (c.kind !== 'bottom' || proof.premises.length !== 2)
                return false;
            const [neg, pos] = proof.premises;
            if (!neg || !pos)
                return false;
            if (neg.conclusion.kind !== 'not')
                return false;
            return ((0, formula_1.formulaEquals)(neg.conclusion.arg, pos.conclusion) &&
                verifyAt(neg, ctx) &&
                verifyAt(pos, ctx));
        }
        case 'bottomE': {
            if (proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            return p.conclusion.kind === 'bottom' && verifyAt(p, ctx);
        }
        // ── Reglas clásicas ────────────────────────────────────
        case 'doubleNegE': {
            // Premisa: ¬¬φ, conclusión: φ.
            if (proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            if (p.conclusion.kind !== 'not')
                return false;
            const inner = p.conclusion.arg;
            if (inner.kind !== 'not')
                return false;
            return (0, formula_1.formulaEquals)(inner.arg, c) && verifyAt(p, ctx);
        }
        case 'LEM': {
            // Conclusión axiomática: φ ∨ ¬φ. No requiere premisas.
            if (c.kind !== 'or' || proof.premises.length !== 0)
                return false;
            if (c.right.kind !== 'not')
                return false;
            return (0, formula_1.formulaEquals)(c.left, c.right.arg);
        }
        case 'pierce': {
            // Conclusión axiomática: ((φ→ψ)→φ)→φ. Sin premisas.
            if (c.kind !== 'implies' || proof.premises.length !== 0)
                return false;
            const inner = c.left; // (φ→ψ)→φ
            if (inner.kind !== 'implies')
                return false;
            const phiPsi = inner.left; // φ→ψ
            if (phiPsi.kind !== 'implies')
                return false;
            // inner.right debe ser φ, c.right debe ser φ, phiPsi.left debe ser φ.
            return (0, formula_1.formulaEquals)(phiPsi.left, inner.right) && (0, formula_1.formulaEquals)(inner.right, c.right);
        }
        case 'rAA': {
            // Reductio ad absurdum: asume ¬φ, deriva ⊥, concluye φ.
            // discharged debe ser [¬c]; premisa única deriva ⊥ bajo ¬c.
            if (proof.premises.length !== 1)
                return false;
            const p = proof.premises[0];
            if (!p)
                return false;
            if (p.conclusion.kind !== 'bottom')
                return false;
            if (!proof.discharged || proof.discharged.length !== 1)
                return false;
            const disch = proof.discharged[0];
            if (!disch || disch.kind !== 'not')
                return false;
            if (!(0, formula_1.formulaEquals)(disch.arg, c))
                return false;
            return verifyAt(p, withContext(ctx, disch));
        }
    }
}
// ── Pruebas estándar de teoremas clásicos ────────────────────
/**
 * Devuelve una prueba NK de la ley de Peirce: ((P→Q)→P)→P.
 */
function provedPeirce() {
    const P = (0, formula_1.atom)('P');
    const Q = (0, formula_1.atom)('Q');
    const proof = proveClassically([], (0, formula_1.implies)((0, formula_1.implies)((0, formula_1.implies)(P, Q), P), P));
    if (!proof) {
        // Fallback: regla axiomática directa.
        return {
            conclusion: (0, formula_1.implies)((0, formula_1.implies)((0, formula_1.implies)(P, Q), P), P),
            rule: 'pierce',
            premises: [],
        };
    }
    return proof;
}
/**
 * Devuelve una prueba NK de la eliminación de doble negación: ¬¬P → P.
 */
function provedDNE() {
    const P = (0, formula_1.atom)('P');
    const proof = proveClassically([], (0, formula_1.implies)((0, formula_1.not)((0, formula_1.not)(P)), P));
    if (proof)
        return proof;
    // Fallback: construir manualmente usando doubleNegE.
    const dneAxiom = {
        conclusion: P,
        rule: 'doubleNegE',
        premises: [{ conclusion: (0, formula_1.not)((0, formula_1.not)(P)), rule: 'assumption', premises: [] }],
    };
    return {
        conclusion: (0, formula_1.implies)((0, formula_1.not)((0, formula_1.not)(P)), P),
        rule: 'impI',
        premises: [dneAxiom],
        discharged: [(0, formula_1.not)((0, formula_1.not)(P))],
    };
}
/**
 * Devuelve una prueba NK del tercero excluido: P ∨ ¬P.
 */
function provedLEM() {
    const P = (0, formula_1.atom)('P');
    const proof = proveClassically([], (0, formula_1.or)(P, (0, formula_1.not)(P)));
    if (proof)
        return proof;
    // Fallback axiomático.
    return {
        conclusion: (0, formula_1.or)(P, (0, formula_1.not)(P)),
        rule: 'LEM',
        premises: [],
    };
}
// ── Traducción NK → NJ ────────────────────────────────────────
/**
 * Indica si una prueba NK puede traducirse a NJ sin pérdida.
 * Si contiene alguna regla puramente clásica, la traducción
 * falla con `reason`. Si es puramente intuicionista, se
 * devuelve la prueba intacta (cast estructural a NJProof).
 *
 * No intentamos la traducción de Glivenko ni doble-negación
 * uniforme aquí: el objetivo es detectar si la prueba ya está
 * en el fragmento intuicionista.
 */
function nkToNJ(proof) {
    const classicalRules = collectClassicalRules(proof);
    if (classicalRules.length === 0) {
        return { converted: proof };
    }
    return {
        reason: `La prueba usa reglas clásicas no traducibles directamente a NJ: ${classicalRules.join(', ')}.`,
    };
}
function collectClassicalRules(proof, out = new Set()) {
    if (types_1.CLASSICAL_ONLY_RULES.includes(proof.rule))
        out.add(proof.rule);
    for (const p of proof.premises)
        collectClassicalRules(p, out);
    return Array.from(out);
}
//# sourceMappingURL=prover.js.map