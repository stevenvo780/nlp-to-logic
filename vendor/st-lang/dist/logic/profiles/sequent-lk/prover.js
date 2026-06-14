"use strict";
// ============================================================
// LK — Backward proof search
// ============================================================
//
// Demostrador hacia atras para LK clasico multisuccedente. La
// estrategia es la siguiente:
//
//  1. Si Γ ⊢ Δ comparte una formula identica en ambos lados,
//     se cierra con `axiom` precedido (si es necesario) de
//     weakenings.
//  2. Aplicamos reglas no ramificantes (notL/notR, andL, orR, impR)
//     antes que las ramificantes (andR, orL, impL). Esto reduce el
//     branching factor y mantiene el arbol pequeño.
//  3. La contraccion implicita se obtiene "conservando" la formula
//     principal en la premisa (estandar en presentaciones LK con
//     contraccion implicita). Esto evita reglas explicitas de
//     contraccion en el prover, pero las exportamos para clientes
//     que construyan derivaciones a mano.
//
// El prover NO introduce cortes — produce derivaciones cut-free.
// La eliminacion de cortes vive en `cut-elimination.ts`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveLK = proveLK;
exports.proveLKFormula = proveLKFormula;
exports.isValid = isValid;
exports.hasCut = hasCut;
const util_1 = require("./util");
function exhausted(ctx) {
    return ctx.used >= ctx.budget;
}
function isAtomic(f) {
    return f.kind === 'atom';
}
function findAxiom(left, right) {
    const rkeys = new Set(right.map(util_1.lkKey));
    for (const f of left) {
        if (rkeys.has((0, util_1.lkKey)(f)))
            return f;
    }
    return undefined;
}
function firstComplex(xs) {
    for (let i = 0; i < xs.length; i++) {
        const f = xs[i];
        if (f && !isAtomic(f))
            return i;
    }
    return -1;
}
function prove(left, right, ctx) {
    ctx.used++;
    if (exhausted(ctx))
        return undefined;
    // 1. Axioma
    const axF = findAxiom(left, right);
    if (axF) {
        return {
            goal: { left: left.slice(), right: right.slice() },
            rule: 'axiom',
            premises: [],
            principalFormula: axF,
        };
    }
    // 2. Reglas no ramificantes a la izquierda
    for (let i = 0; i < left.length; i++) {
        const f = left[i];
        if (!f)
            continue;
        if (f.kind === 'not') {
            // ¬A, Γ ⊢ Δ   ↦   Γ ⊢ A, Δ
            const newL = (0, util_1.removeAt)(left, i);
            const newR = [f.arg, ...right];
            const sub = prove(newL, newR, ctx);
            if (!sub)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'notL',
                premises: [sub],
                principalFormula: f,
            };
        }
        if (f.kind === 'and') {
            // A∧B, Γ ⊢ Δ   ↦   A, B, Γ ⊢ Δ
            const newL = [f.left, f.right, ...(0, util_1.removeAt)(left, i)];
            const sub = prove(newL, right, ctx);
            if (!sub)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'andL',
                premises: [sub],
                principalFormula: f,
            };
        }
    }
    // 3. Reglas no ramificantes a la derecha
    for (let i = 0; i < right.length; i++) {
        const f = right[i];
        if (!f)
            continue;
        if (f.kind === 'not') {
            // Γ ⊢ ¬A, Δ   ↦   A, Γ ⊢ Δ
            const newR = (0, util_1.removeAt)(right, i);
            const newL = [f.arg, ...left];
            const sub = prove(newL, newR, ctx);
            if (!sub)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'notR',
                premises: [sub],
                principalFormula: f,
            };
        }
        if (f.kind === 'or') {
            // Γ ⊢ A∨B, Δ   ↦   Γ ⊢ A, B, Δ
            const newR = [f.left, f.right, ...(0, util_1.removeAt)(right, i)];
            const sub = prove(left, newR, ctx);
            if (!sub)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'orR',
                premises: [sub],
                principalFormula: f,
            };
        }
        if (f.kind === 'implies') {
            // Γ ⊢ A→B, Δ   ↦   A, Γ ⊢ B, Δ
            const newL = [f.left, ...left];
            const newR = [f.right, ...(0, util_1.removeAt)(right, i)];
            const sub = prove(newL, newR, ctx);
            if (!sub)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'impR',
                premises: [sub],
                principalFormula: f,
            };
        }
    }
    // 4. Reglas ramificantes
    for (let i = 0; i < right.length; i++) {
        const f = right[i];
        if (!f)
            continue;
        if (f.kind === 'and') {
            // Γ ⊢ A∧B, Δ   ↦   Γ ⊢ A, Δ   y   Γ ⊢ B, Δ
            const rest = (0, util_1.removeAt)(right, i);
            const subL = prove(left, [f.left, ...rest], ctx);
            if (!subL)
                return undefined;
            const subR = prove(left, [f.right, ...rest], ctx);
            if (!subR)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'andR',
                premises: [subL, subR],
                principalFormula: f,
            };
        }
    }
    for (let i = 0; i < left.length; i++) {
        const f = left[i];
        if (!f)
            continue;
        if (f.kind === 'or') {
            // A∨B, Γ ⊢ Δ   ↦   A, Γ ⊢ Δ   y   B, Γ ⊢ Δ
            const rest = (0, util_1.removeAt)(left, i);
            const subL = prove([f.left, ...rest], right, ctx);
            if (!subL)
                return undefined;
            const subR = prove([f.right, ...rest], right, ctx);
            if (!subR)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'orL',
                premises: [subL, subR],
                principalFormula: f,
            };
        }
        if (f.kind === 'implies') {
            // A→B, Γ ⊢ Δ   ↦   Γ ⊢ A, Δ   y   B, Γ ⊢ Δ
            const rest = (0, util_1.removeAt)(left, i);
            const subL = prove(rest, [f.left, ...right], ctx);
            if (!subL)
                return undefined;
            const subR = prove([f.right, ...rest], right, ctx);
            if (!subR)
                return undefined;
            return {
                goal: { left: left.slice(), right: right.slice() },
                rule: 'impL',
                premises: [subL, subR],
                principalFormula: f,
            };
        }
    }
    // 5. Sin reglas aplicables → secuente no derivable
    if (firstComplex(left) === -1 && firstComplex(right) === -1) {
        return undefined;
    }
    return undefined;
}
/**
 * Demuestra el secuente `seq` en LK clasico (sin cortes).
 * Devuelve `null` si no encuentra derivacion dentro del budget.
 */
function proveLK(seq, options = {}) {
    const ctx = { budget: options.budget ?? 5_000, used: 0 };
    const tree = prove(seq.left.slice(), seq.right.slice(), ctx);
    return tree ?? null;
}
/** Atajo: ⊢ φ. */
function proveLKFormula(formula, options = {}) {
    return proveLK({ left: [], right: [formula] }, options);
}
// ============================================================
// Validacion de derivaciones LK
// ============================================================
function multisetIncludes(haystack, needle) {
    const counts = new Map();
    for (const f of haystack)
        counts.set((0, util_1.lkKey)(f), (counts.get((0, util_1.lkKey)(f)) ?? 0) + 1);
    for (const f of needle) {
        const k = (0, util_1.lkKey)(f);
        const c = counts.get(k) ?? 0;
        if (c <= 0)
            return false;
        counts.set(k, c - 1);
    }
    return true;
}
function sameMultiset(a, b) {
    if (a.length !== b.length)
        return false;
    return multisetIncludes(a, b) && multisetIncludes(b, a);
}
/**
 * Verifica que `proof` sea una derivacion LK valida segun la regla
 * declarada en cada nodo. La validacion es estructural — comprueba
 * que las premisas y la conclusion encajen con el patron de la regla.
 *
 * Es deliberadamente flexible respecto al orden (multisets) y permite
 * contraccion implicita en las reglas logicas (la formula principal
 * puede aparecer en las premisas, como en presentaciones modernas).
 */
function isValid(proof) {
    const { goal, rule, premises } = proof;
    const L = goal.left;
    const R = goal.right;
    // Premisas validas recursivamente
    for (const p of premises) {
        if (!isValid(p))
            return false;
    }
    switch (rule) {
        case 'axiom': {
            // Necesita una formula compartida entre L y R
            if (premises.length !== 0)
                return false;
            const rkeys = new Set(R.map(util_1.lkKey));
            return L.some((f) => rkeys.has((0, util_1.lkKey)(f)));
        }
        case 'cut': {
            if (premises.length !== 2)
                return false;
            const cf = proof.cutFormula;
            if (!cf)
                return false;
            const [p1, p2] = premises;
            if (!p1 || !p2)
                return false;
            // p1: Γ ⊢ Δ, A   ;   p2: A, Σ ⊢ Π   ⟹   Γ, Σ ⊢ Δ, Π
            if (!(0, util_1.containsKey)(p1.goal.right, (0, util_1.lkKey)(cf)))
                return false;
            if (!(0, util_1.containsKey)(p2.goal.left, (0, util_1.lkKey)(cf)))
                return false;
            const gamma = p1.goal.left;
            const delta = (0, util_1.removeFirstByKey)(p1.goal.right, (0, util_1.lkKey)(cf));
            const sigma = (0, util_1.removeFirstByKey)(p2.goal.left, (0, util_1.lkKey)(cf));
            const pi = p2.goal.right;
            return sameMultiset(L, [...gamma, ...sigma]) && sameMultiset(R, [...delta, ...pi]);
        }
        case 'weakL': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            // p: Γ ⊢ Δ  ;  conclusion: A, Γ ⊢ Δ   (A = principalFormula)
            if (!sameMultiset(p.goal.right, R))
                return false;
            // L = principalFormula :: p.goal.left (multiset)
            // Existe alguna formula en L cuya remocion deje L \ {x} igual a p.goal.left
            for (let i = 0; i < L.length; i++) {
                const candidate = L[i];
                if (!candidate)
                    continue;
                if (sameMultiset((0, util_1.removeAt)(L, i), p.goal.left))
                    return true;
            }
            return false;
        }
        case 'weakR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            if (!sameMultiset(p.goal.left, L))
                return false;
            for (let i = 0; i < R.length; i++) {
                const candidate = R[i];
                if (!candidate)
                    continue;
                if (sameMultiset((0, util_1.removeAt)(R, i), p.goal.right))
                    return true;
            }
            return false;
        }
        case 'contrL': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            if (!sameMultiset(p.goal.right, R))
                return false;
            // p.goal.left = L con alguna formula duplicada → reducir una.
            // Existe x tal que p.goal.left ≡ L con x duplicada.
            for (let i = 0; i < L.length; i++) {
                const x = L[i];
                if (!x)
                    continue;
                const candidate = [x, ...L];
                if (sameMultiset(p.goal.left, candidate))
                    return true;
            }
            return false;
        }
        case 'contrR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            if (!sameMultiset(p.goal.left, L))
                return false;
            for (let i = 0; i < R.length; i++) {
                const x = R[i];
                if (!x)
                    continue;
                const candidate = [x, ...R];
                if (sameMultiset(p.goal.right, candidate))
                    return true;
            }
            return false;
        }
        case 'exL':
        case 'exR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            // Intercambio: la conclusion es una permutacion de la premisa.
            return sameMultiset(p.goal.left, L) && sameMultiset(p.goal.right, R);
        }
        case 'notL': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'not')
                return false;
            // conclusion: ¬A, Γ ⊢ Δ   ;   premisa: Γ ⊢ A, Δ
            if (!(0, util_1.containsKey)(L, (0, util_1.lkKey)(pf)))
                return false;
            const gamma = (0, util_1.removeFirstByKey)(L, (0, util_1.lkKey)(pf));
            if (!(0, util_1.containsKey)(p.goal.right, (0, util_1.lkKey)(pf.arg)))
                return false;
            const delta = (0, util_1.removeFirstByKey)(p.goal.right, (0, util_1.lkKey)(pf.arg));
            return sameMultiset(p.goal.left, gamma) && sameMultiset(delta, R);
        }
        case 'notR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'not')
                return false;
            if (!(0, util_1.containsKey)(R, (0, util_1.lkKey)(pf)))
                return false;
            const delta = (0, util_1.removeFirstByKey)(R, (0, util_1.lkKey)(pf));
            if (!(0, util_1.containsKey)(p.goal.left, (0, util_1.lkKey)(pf.arg)))
                return false;
            const gamma = (0, util_1.removeFirstByKey)(p.goal.left, (0, util_1.lkKey)(pf.arg));
            return sameMultiset(gamma, L) && sameMultiset(p.goal.right, delta);
        }
        case 'andL': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'and')
                return false;
            // conclusion: A∧B, Γ ⊢ Δ ; premisa: A, B, Γ ⊢ Δ
            if (!(0, util_1.containsKey)(L, (0, util_1.lkKey)(pf)))
                return false;
            const gamma = (0, util_1.removeFirstByKey)(L, (0, util_1.lkKey)(pf));
            const expectedP = [pf.left, pf.right, ...gamma];
            return sameMultiset(p.goal.left, expectedP) && sameMultiset(p.goal.right, R);
        }
        case 'andR': {
            if (premises.length !== 2)
                return false;
            const [p1, p2] = premises;
            if (!p1 || !p2)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'and')
                return false;
            // conclusion: Γ ⊢ A∧B, Δ ; premisas: Γ ⊢ A, Δ y Γ ⊢ B, Δ
            if (!(0, util_1.containsKey)(R, (0, util_1.lkKey)(pf)))
                return false;
            const delta = (0, util_1.removeFirstByKey)(R, (0, util_1.lkKey)(pf));
            const okL = sameMultiset(p1.goal.left, L) &&
                (0, util_1.containsKey)(p1.goal.right, (0, util_1.lkKey)(pf.left)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p1.goal.right, (0, util_1.lkKey)(pf.left)), delta);
            const okR = sameMultiset(p2.goal.left, L) &&
                (0, util_1.containsKey)(p2.goal.right, (0, util_1.lkKey)(pf.right)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p2.goal.right, (0, util_1.lkKey)(pf.right)), delta);
            return okL && okR;
        }
        case 'orL': {
            if (premises.length !== 2)
                return false;
            const [p1, p2] = premises;
            if (!p1 || !p2)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'or')
                return false;
            if (!(0, util_1.containsKey)(L, (0, util_1.lkKey)(pf)))
                return false;
            const gamma = (0, util_1.removeFirstByKey)(L, (0, util_1.lkKey)(pf));
            const okL = (0, util_1.containsKey)(p1.goal.left, (0, util_1.lkKey)(pf.left)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p1.goal.left, (0, util_1.lkKey)(pf.left)), gamma) &&
                sameMultiset(p1.goal.right, R);
            const okR = (0, util_1.containsKey)(p2.goal.left, (0, util_1.lkKey)(pf.right)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p2.goal.left, (0, util_1.lkKey)(pf.right)), gamma) &&
                sameMultiset(p2.goal.right, R);
            return okL && okR;
        }
        case 'orR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'or')
                return false;
            // conclusion: Γ ⊢ A∨B, Δ ; premisa: Γ ⊢ A, B, Δ
            if (!(0, util_1.containsKey)(R, (0, util_1.lkKey)(pf)))
                return false;
            const delta = (0, util_1.removeFirstByKey)(R, (0, util_1.lkKey)(pf));
            const expectedR = [pf.left, pf.right, ...delta];
            return sameMultiset(p.goal.left, L) && sameMultiset(p.goal.right, expectedR);
        }
        case 'impL': {
            if (premises.length !== 2)
                return false;
            const [p1, p2] = premises;
            if (!p1 || !p2)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'implies')
                return false;
            if (!(0, util_1.containsKey)(L, (0, util_1.lkKey)(pf)))
                return false;
            const gamma = (0, util_1.removeFirstByKey)(L, (0, util_1.lkKey)(pf));
            // p1: Γ ⊢ A, Δ
            const okL = sameMultiset(p1.goal.left, gamma) &&
                (0, util_1.containsKey)(p1.goal.right, (0, util_1.lkKey)(pf.left)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p1.goal.right, (0, util_1.lkKey)(pf.left)), R);
            // p2: B, Γ ⊢ Δ
            const okR = (0, util_1.containsKey)(p2.goal.left, (0, util_1.lkKey)(pf.right)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p2.goal.left, (0, util_1.lkKey)(pf.right)), gamma) &&
                sameMultiset(p2.goal.right, R);
            return okL && okR;
        }
        case 'impR': {
            if (premises.length !== 1)
                return false;
            const [p] = premises;
            if (!p)
                return false;
            const pf = proof.principalFormula;
            if (!pf || pf.kind !== 'implies')
                return false;
            // conclusion: Γ ⊢ A→B, Δ ; premisa: A, Γ ⊢ B, Δ
            if (!(0, util_1.containsKey)(R, (0, util_1.lkKey)(pf)))
                return false;
            const delta = (0, util_1.removeFirstByKey)(R, (0, util_1.lkKey)(pf));
            const okL = (0, util_1.containsKey)(p.goal.left, (0, util_1.lkKey)(pf.left)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p.goal.left, (0, util_1.lkKey)(pf.left)), L);
            const okR = (0, util_1.containsKey)(p.goal.right, (0, util_1.lkKey)(pf.right)) &&
                sameMultiset((0, util_1.removeFirstByKey)(p.goal.right, (0, util_1.lkKey)(pf.right)), delta);
            return okL && okR;
        }
    }
}
/** Cuenta si existe al menos un nodo `cut` en la derivacion. */
function hasCut(proof) {
    if (proof.rule === 'cut')
        return true;
    return proof.premises.some(hasCut);
}
//# sourceMappingURL=prover.js.map