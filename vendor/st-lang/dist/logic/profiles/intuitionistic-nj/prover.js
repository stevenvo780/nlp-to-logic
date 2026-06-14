"use strict";
// ============================================================
// Intuitionistic Natural Deduction — Backward proof search
// ============================================================
//
// Estrategia: búsqueda hacia atrás en un cálculo de secuentes
// intuicionista (G3i-style, single-succedent) que se traduce a
// NJ "on the fly". El árbol NJ producido se valida luego con
// `verifyProof` (ver al final).
//
// Notas:
//   - Sólo hay UN consecuente (eso es lo que vuelve NJ
//     intuicionista; la lógica clásica usa multi-succedent).
//   - La regla `impL` (modus ponens hacia atrás) y `orL`
//     (eliminación de disyunción) no son invertibles, lo que
//     obliga a buscar con memoización para evitar bucles.
//   - Para `notI` aplicamos el patrón: si la meta es `¬φ`,
//     entonces es lo mismo que probar `φ ⊢ ⊥`.
//
// Completitud: G3i es completo para IPC (Dyckhoff, "Contraction-
// free sequent calculi for intuitionistic logic", 1992). Esta
// implementación es una variante pragmática con loop-checking;
// es completa para el fragmento proposicional dentro del budget.
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveIntuitionistically = proveIntuitionistically;
exports.verifyProof = verifyProof;
const formula_1 = require("./formula");
function freshCtx(budget) {
    return { budget, used: 0, failed: new Set(), active: new Set() };
}
function exhausted(ctx) {
    return ctx.used >= ctx.budget;
}
/**
 * Clave de un sub-problema (contexto + meta), normalizada y
 * ordenada para que `{A, B} ⊢ C` y `{B, A} ⊢ C` coincidan.
 */
function goalKey(context, goal) {
    const sorted = context.map(formula_1.formulaKey).sort();
    return `[${sorted.join('|')}]⊢${(0, formula_1.formulaKey)(goal)}`;
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
 * Núcleo recursivo de la búsqueda. Devuelve un árbol NJ válido
 * para `context ⊢ goal` o `null` si no se encontró prueba dentro
 * del budget.
 */
function search(context, goal, ctx) {
    ctx.used++;
    if (exhausted(ctx))
        return null;
    const key = goalKey(context, goal);
    if (ctx.failed.has(key))
        return null;
    if (ctx.active.has(key))
        return null; // ciclo: no hay progreso por este camino
    ctx.active.add(key);
    const tryProve = () => {
        // 1. Axioma / asunción: la meta está en el contexto.
        for (const h of context) {
            if ((0, formula_1.formulaEquals)(h, goal)) {
                return { conclusion: goal, rule: 'assumption', premises: [] };
            }
        }
        // 2. Reglas de introducción dirigidas por la forma de la meta
        //    (invertibles → se aplican sin retroceder).
        // ∧I
        if (goal.kind === 'and') {
            const left = search(context, goal.left, ctx);
            if (!left)
                return null;
            const right = search(context, goal.right, ctx);
            if (!right)
                return null;
            return { conclusion: goal, rule: 'andI', premises: [left, right] };
        }
        // →I (descarga el antecedente)
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
        // ¬I (descarga la fórmula, deriva ⊥)
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
        // 3. Reglas de eliminación a izquierda (sobre el contexto):
        //    son invertibles para ∧, no para ∨/→.
        //    Aplicamos primero las invertibles para reducir el contexto.
        // ∧EL/∧ER: descomponer cualquier conjunción del contexto.
        for (let i = 0; i < context.length; i++) {
            const h = context[i];
            if (h && h.kind === 'and') {
                const rest = [...context.slice(0, i), ...context.slice(i + 1)];
                const extended = withContext(withContext(rest, h.left), h.right);
                const sub = search(extended, goal, ctx);
                if (!sub)
                    return null;
                // El subárbol asumió h.left y h.right como hipótesis libres.
                // Las "convertimos" en derivaciones explícitas desde h vía
                // ∧EL/∧ER usando substituteAssumption.
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
                const withBoth = substituteAssumption(withL, h.right, elimR);
                return withBoth;
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
        // ∨E (no invertible pero útil): si una disyunción A∨B está
        // en el contexto y podemos probar la meta tanto bajo A como
        // bajo B, aplicamos ∨E descargándolas en cada rama.
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
        // 4. Reglas no-invertibles sobre la meta (∨I) y sobre el
        //    contexto (→E).
        // ∨IL / ∨IR: si la meta es disyunción, intentar cada disyunto.
        if (goal.kind === 'or') {
            const leftAttempt = search(context, goal.left, ctx);
            if (leftAttempt) {
                return { conclusion: goal, rule: 'orIL', premises: [leftAttempt] };
            }
            const rightAttempt = search(context, goal.right, ctx);
            if (rightAttempt) {
                return { conclusion: goal, rule: 'orIR', premises: [rightAttempt] };
            }
            // No volvemos: si ninguna funcionó, ∨I no es la respuesta.
        }
        // →E (modus ponens hacia atrás): para cada implicación A→B
        // en el contexto, intenta probar A; si lo logra, B queda como
        // nueva hipótesis y reintentamos la meta.
        for (let i = 0; i < context.length; i++) {
            const h = context[i];
            if (h && h.kind === 'implies') {
                // Caso especial: A→B donde B = goal — entonces sólo hace
                // falta probar A.
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
                // Caso general: B se añade al contexto y la meta sigue siendo `goal`.
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
        // ¬E (modus ponens negativa): si tenemos ¬A en contexto y la
        // meta es ⊥, intentar probar A; el resultado deriva ⊥.
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
                // Implicación a ⊥: igual que ¬ pero como φ → ⊥.
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
        // 5. Último recurso: si la meta NO es ⊥, intentar probar
        //    ⊥ desde el contexto (vía ¬E o impE-to-⊥) y aplicar
        //    ⊥E para concluir cualquier cosa.
        if (goal.kind !== 'bottom') {
            const bottomProof = search(context, (0, formula_1.bottom)(), ctx);
            if (bottomProof) {
                return { conclusion: goal, rule: 'bottomE', premises: [bottomProof] };
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
 * Esto permite que una eliminación de regla en el contexto (∧EL,
 * impE, etc.) "rellene" lo que el subgoal trató como hipótesis.
 */
function substituteAssumption(proof, assumption, derivation) {
    if (proof.rule === 'assumption' && (0, formula_1.formulaEquals)(proof.conclusion, assumption)) {
        return derivation;
    }
    // Si la regla aplicada descargó la asunción en cuestión, no la
    // sustituimos dentro de las premisas (alcance local).
    const dischargedHere = proof.discharged?.some((d) => (0, formula_1.formulaEquals)(d, assumption));
    if (dischargedHere)
        return proof;
    const newPremises = proof.premises.map((p) => substituteAssumption(p, assumption, derivation));
    return { ...proof, premises: newPremises };
}
/**
 * API pública.
 *
 * Devuelve un árbol NJ que demuestra `goal` a partir de las
 * `premises` dadas, o `null` si no encontró prueba dentro del
 * budget configurado.
 */
function proveIntuitionistically(premises, goal, options = {}) {
    const ctx = freshCtx(options.budget ?? 10_000);
    return search(premises.slice(), goal, ctx);
}
// ── Verificación de proofs ──────────────────────────────────
//
// `verifyProof` recorre el árbol y comprueba localmente cada
// regla. Útil para tests y para garantizar que el prover no
// produce derivaciones inconsistentes.
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
    }
}
//# sourceMappingURL=prover.js.map