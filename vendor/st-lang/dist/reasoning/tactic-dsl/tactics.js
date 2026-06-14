"use strict";
// ============================================================
// Tactic DSL — tactics built-in
// ============================================================
//
// Cada tactic recibe un ProofState y devuelve un ProofState nuevo
// (inmutable). Si la tactic no aplica al goal actual, lanza
// TacticError. Eso permite que `orElse` capture la falla y pruebe
// otra alternativa.
//
// Convención: el goal "activo" es siempre `state.goals[0]`. Las
// reglas que generan sub-goals (split, induction, destruct, …) los
// insertan al frente para que se trabajen en orden.
Object.defineProperty(exports, "__esModule", { value: true });
exports._resetGoalCounter = _resetGoalCounter;
exports.intro = intro;
exports.exact = exact;
exports.assumption = assumption;
exports.apply = apply;
exports.rewrite = rewrite;
exports.rfl = rfl;
exports.trivial = trivial;
exports.split = split;
exports.left = left;
exports.right = right;
exports.destruct = destruct;
exports.induction = induction;
exports.caseAnalysis = caseAnalysis;
exports.unfold = unfold;
exports.simp = simp;
const types_1 = require("./types");
let goalCounter = 0;
function freshGoalId(prefix = 'g') {
    goalCounter++;
    return `${prefix}${goalCounter}`;
}
// Reset para tests deterministas (no exportado en el API público).
/** Resets the internal goal ID counter to 0. Intended for deterministic tests only. */
function _resetGoalCounter() {
    goalCounter = 0;
}
function activeGoal(state, tactic) {
    if (state.done || state.goals.length === 0) {
        throw new types_1.TacticError(tactic, 'no hay goals activos');
    }
    const g = state.goals[0];
    if (!g) {
        throw new types_1.TacticError(tactic, 'goal frontal indefinido');
    }
    return g;
}
function withNewGoals(state, replace) {
    const rest = state.goals.slice(1);
    const next = [...replace, ...rest];
    return {
        goals: next,
        history: state.history,
        done: next.length === 0,
    };
}
function recordHistory(before, after, tactic, args) {
    const invocation = { tactic, args, before, after };
    return {
        ...after,
        history: [...before.history, invocation],
    };
}
// ---------- intro ----------
/**
 * `intro(name?)` — For a goal of the form `P → Q`, moves the antecedent `P`
 * into the hypothesis context under `name` (auto-generated when omitted) and
 * leaves `Q` as the new goal. Also handles `¬P` (≡ `P → False`).
 * @throws {@link TacticError} When the goal is not an implication or negation.
 */
function intro(name) {
    return (state) => {
        const goal = activeGoal(state, 'intro');
        const f = (0, types_1.parseFormula)(goal.concl);
        let hypType;
        let newConcl;
        if (f.kind === 'imp') {
            hypType = f.left;
            newConcl = f.right;
        }
        else if (f.kind === 'not') {
            hypType = f.body;
            newConcl = { kind: 'false' };
        }
        else {
            throw new types_1.TacticError('intro', `goal no es una implicación: ${goal.concl}`);
        }
        const hypName = name ?? autoFreshHypName(goal.hyps);
        if (goal.hyps[hypName] !== undefined) {
            throw new types_1.TacticError('intro', `nombre de hipótesis '${hypName}' ya existe`);
        }
        const newGoal = {
            id: goal.id,
            hyps: { ...goal.hyps, [hypName]: (0, types_1.formulaToString)(hypType) },
            concl: (0, types_1.formulaToString)(newConcl),
        };
        const after = withNewGoals(state, [newGoal]);
        return recordHistory(state, after, 'intro', [name ?? null]);
    };
}
function autoFreshHypName(hyps) {
    let i = 1;
    while (hyps[`H${i}`] !== undefined)
        i++;
    return `H${i}`;
}
// ---------- exact ----------
/**
 * `exact(term)` — Closes the current goal when `term` is either the name of
 * a hypothesis whose type matches the conclusion, or a string syntactically
 * equal to the conclusion.
 * @throws {@link TacticError} When `term` does not match the goal.
 */
function exact(term) {
    return (state) => {
        const goal = activeGoal(state, 'exact');
        const hypType = goal.hyps[term];
        if (hypType !== undefined && (0, types_1.formulaEq)(hypType, goal.concl)) {
            const after = withNewGoals(state, []);
            return recordHistory(state, after, 'exact', [term]);
        }
        if ((0, types_1.formulaEq)(term, goal.concl)) {
            const after = withNewGoals(state, []);
            return recordHistory(state, after, 'exact', [term]);
        }
        throw new types_1.TacticError('exact', `'${term}' no coincide con goal '${goal.concl}' (hyps: ${Object.keys(goal.hyps).join(', ')})`);
    };
}
// ---------- assumption ----------
/**
 * Closes the goal by finding a hypothesis whose type is syntactically equal
 * to the conclusion. Equivalent to `exact` over the full hypothesis map.
 * @throws {@link TacticError} When no hypothesis matches the conclusion.
 */
function assumption() {
    return (state) => {
        const goal = activeGoal(state, 'assumption');
        for (const [name, ty] of Object.entries(goal.hyps)) {
            if ((0, types_1.formulaEq)(ty, goal.concl)) {
                const after = withNewGoals(state, []);
                return recordHistory(state, after, 'assumption', [name]);
            }
        }
        throw new types_1.TacticError('assumption', `ninguna hipótesis prueba '${goal.concl}' (tenía: ${formatHypList(goal.hyps)})`);
    };
}
function formatHypList(hyps) {
    const entries = Object.entries(hyps);
    if (entries.length === 0)
        return '∅';
    return entries.map(([n, t]) => `${n}:${t}`).join(', ');
}
// ---------- apply ----------
/**
 * `apply(thm, args?)` — Backward chaining on hypothesis `thm`.
 * If `thm : A → B` and the goal is `B`, leaves sub-goal `A`.
 * Multi-premise: `thm : A → B → C` with goal `C` leaves goals `A` and `B`.
 * `args` allows immediately discharging leading premises with matching hypotheses.
 * @throws {@link TacticError} When `thm` is not in scope, its conclusion does not unify with the goal, or args are mismatched.
 */
function apply(thm, args) {
    return (state) => {
        const goal = activeGoal(state, 'apply');
        const thmType = goal.hyps[thm];
        if (thmType === undefined) {
            throw new types_1.TacticError('apply', `'${thm}' no está en hipótesis`);
        }
        // Aplanar la flecha en (premisas[], conclusión).
        const f = (0, types_1.parseFormula)(thmType);
        const premises = [];
        let cur = f;
        while (cur.kind === 'imp') {
            premises.push(cur.left);
            cur = cur.right;
        }
        if (!(0, types_1.formulaEq)((0, types_1.formulaToString)(cur), goal.concl)) {
            throw new types_1.TacticError('apply', `conclusión de '${thm}' (${(0, types_1.formulaToString)(cur)}) no unifica con goal '${goal.concl}'`);
        }
        // Descontar argumentos ya provistos: cada arg debe ser una hipótesis
        // cuyo tipo case con la siguiente premisa.
        let remaining = premises;
        if (args && args.length > 0) {
            if (args.length > premises.length) {
                throw new types_1.TacticError('apply', `demasiados args (${args.length} > ${premises.length})`);
            }
            for (let i = 0; i < args.length; i++) {
                const argName = args[i];
                const argType = goal.hyps[argName];
                const expected = premises[i];
                if (argType === undefined || expected === undefined) {
                    throw new types_1.TacticError('apply', `arg '${argName}' no es hipótesis válida`);
                }
                if (!(0, types_1.formulaEq)(argType, (0, types_1.formulaToString)(expected))) {
                    throw new types_1.TacticError('apply', `arg '${argName}:${argType}' no encaja con premisa ${i + 1} (${(0, types_1.formulaToString)(expected)})`);
                }
            }
            remaining = premises.slice(args.length);
        }
        const subGoals = remaining.map((p) => ({
            id: freshGoalId(goal.id + '_'),
            hyps: { ...goal.hyps },
            concl: (0, types_1.formulaToString)(p),
        }));
        const after = withNewGoals(state, subGoals);
        return recordHistory(state, after, 'apply', [thm, args ?? []]);
    };
}
// ---------- rewrite ----------
/**
 * `rewrite(eq, dir?)` — Uses hypothesis `eq : lhs = rhs` to replace
 * occurrences of `lhs` with `rhs` in the conclusion (left-to-right by default),
 * or `rhs` with `lhs` when `dir = 'right-to-left'`.
 * @throws {@link TacticError} When `eq` is not an equality or the pattern is absent from the conclusion.
 */
function rewrite(eq, dir = 'left-to-right') {
    return (state) => {
        const goal = activeGoal(state, 'rewrite');
        const eqType = goal.hyps[eq];
        if (eqType === undefined) {
            throw new types_1.TacticError('rewrite', `'${eq}' no está en hipótesis`);
        }
        const f = (0, types_1.parseFormula)(eqType);
        if (f.kind !== 'eq') {
            throw new types_1.TacticError('rewrite', `'${eq}:${eqType}' no es una igualdad`);
        }
        const lhsStr = (0, types_1.formulaToString)(f.left);
        const rhsStr = (0, types_1.formulaToString)(f.right);
        const from = dir === 'left-to-right' ? lhsStr : rhsStr;
        const to = dir === 'left-to-right' ? rhsStr : lhsStr;
        const newConcl = (0, types_1.substitute)(goal.concl, from, to);
        if (newConcl === goal.concl) {
            throw new types_1.TacticError('rewrite', `no se encontró '${from}' en la conclusión '${goal.concl}'`);
        }
        const newGoal = {
            id: goal.id,
            hyps: { ...goal.hyps },
            concl: (0, types_1.normalizeFormula)(newConcl),
        };
        const after = withNewGoals(state, [newGoal]);
        return recordHistory(state, after, 'rewrite', [eq, dir]);
    };
}
// ---------- rfl ----------
/**
 * Closes goals of the form `a = a` (syntactic reflexivity after normalization).
 * @throws {@link TacticError} When the goal is not an equality or the two sides differ.
 */
function rfl() {
    return (state) => {
        const goal = activeGoal(state, 'rfl');
        const f = (0, types_1.parseFormula)(goal.concl);
        if (f.kind !== 'eq') {
            throw new types_1.TacticError('rfl', `goal no es una igualdad: ${goal.concl}`);
        }
        if ((0, types_1.formulaToString)(f.left) !== (0, types_1.formulaToString)(f.right)) {
            throw new types_1.TacticError('rfl', `no es reflexiva: ${goal.concl}`);
        }
        const after = withNewGoals(state, []);
        return recordHistory(state, after, 'rfl', []);
    };
}
// ---------- trivial ----------
/**
 * Closes trivially true goals: `True`, or any goal when `False` is in the hypotheses
 * (ex falso quodlibet).
 * @throws {@link TacticError} When the goal is not trivially provable.
 */
function trivial() {
    return (state) => {
        const goal = activeGoal(state, 'trivial');
        const f = (0, types_1.parseFormula)(goal.concl);
        if (f.kind === 'true') {
            const after = withNewGoals(state, []);
            return recordHistory(state, after, 'trivial', []);
        }
        // True ∈ hyps no cierra ningún goal, pero si hay False en hyps, ex falso:
        for (const ty of Object.values(goal.hyps)) {
            const hf = (0, types_1.parseFormula)(ty);
            if (hf.kind === 'false') {
                const after = withNewGoals(state, []);
                return recordHistory(state, after, 'trivial', ['ex_falso']);
            }
        }
        throw new types_1.TacticError('trivial', `goal '${goal.concl}' no es trivialmente cierto`);
    };
}
// ---------- split ----------
/**
 * ∧-introduction: splits a conjunction goal `P ∧ Q` into two sub-goals `P` and `Q`.
 * @throws {@link TacticError} When the goal is not a conjunction.
 */
function split() {
    return (state) => {
        const goal = activeGoal(state, 'split');
        const f = (0, types_1.parseFormula)(goal.concl);
        if (f.kind !== 'and') {
            throw new types_1.TacticError('split', `goal no es conjunción: ${goal.concl}`);
        }
        const subs = [
            { id: freshGoalId(goal.id + '_L'), hyps: { ...goal.hyps }, concl: (0, types_1.formulaToString)(f.left) },
            { id: freshGoalId(goal.id + '_R'), hyps: { ...goal.hyps }, concl: (0, types_1.formulaToString)(f.right) },
        ];
        const after = withNewGoals(state, subs);
        return recordHistory(state, after, 'split', []);
    };
}
// ---------- left / right ----------
/**
 * ∨-introduction (left): for a disjunction goal `P ∨ Q`, reduces to proving `P`.
 * @throws {@link TacticError} When the goal is not a disjunction.
 */
function left() {
    return (state) => {
        const goal = activeGoal(state, 'left');
        const f = (0, types_1.parseFormula)(goal.concl);
        if (f.kind !== 'or') {
            throw new types_1.TacticError('left', `goal no es disyunción: ${goal.concl}`);
        }
        const sub = { id: goal.id, hyps: { ...goal.hyps }, concl: (0, types_1.formulaToString)(f.left) };
        const after = withNewGoals(state, [sub]);
        return recordHistory(state, after, 'left', []);
    };
}
/**
 * ∨-introduction (right): for a disjunction goal `P ∨ Q`, reduces to proving `Q`.
 * @throws {@link TacticError} When the goal is not a disjunction.
 */
function right() {
    return (state) => {
        const goal = activeGoal(state, 'right');
        const f = (0, types_1.parseFormula)(goal.concl);
        if (f.kind !== 'or') {
            throw new types_1.TacticError('right', `goal no es disyunción: ${goal.concl}`);
        }
        const sub = { id: goal.id, hyps: { ...goal.hyps }, concl: (0, types_1.formulaToString)(f.right) };
        const after = withNewGoals(state, [sub]);
        return recordHistory(state, after, 'right', []);
    };
}
// ---------- destruct ----------
/**
 * Case analysis on hypothesis `name`.
 * - `H: P ∧ Q` → splits into hypotheses `H_L: P` and `H_R: Q` in the same goal.
 * - `H: P ∨ Q` → produces two sub-goals, each with the respective disjunct.
 * - `H: ⊥` → closes the goal (ex falso).
 * @throws {@link TacticError} When `name` is not in scope or its type cannot be destructured.
 */
function destruct(name) {
    return (state) => {
        const goal = activeGoal(state, 'destruct');
        const hypType = goal.hyps[name];
        if (hypType === undefined) {
            throw new types_1.TacticError('destruct', `'${name}' no está en hipótesis`);
        }
        const f = (0, types_1.parseFormula)(hypType);
        if (f.kind === 'and') {
            const next = { ...goal.hyps };
            delete next[name];
            next[`${name}_L`] = (0, types_1.formulaToString)(f.left);
            next[`${name}_R`] = (0, types_1.formulaToString)(f.right);
            const newGoal = { id: goal.id, hyps: next, concl: goal.concl };
            const after = withNewGoals(state, [newGoal]);
            return recordHistory(state, after, 'destruct', [name]);
        }
        if (f.kind === 'or') {
            const baseHyps = { ...goal.hyps };
            delete baseHyps[name];
            const left = {
                id: freshGoalId(goal.id + '_L'),
                hyps: { ...baseHyps, [`${name}_L`]: (0, types_1.formulaToString)(f.left) },
                concl: goal.concl,
            };
            const right = {
                id: freshGoalId(goal.id + '_R'),
                hyps: { ...baseHyps, [`${name}_R`]: (0, types_1.formulaToString)(f.right) },
                concl: goal.concl,
            };
            const after = withNewGoals(state, [left, right]);
            return recordHistory(state, after, 'destruct', [name]);
        }
        if (f.kind === 'false') {
            const after = withNewGoals(state, []);
            return recordHistory(state, after, 'destruct', [name, 'ex_falso']);
        }
        throw new types_1.TacticError('destruct', `'${name}:${hypType}' no es ∧, ∨, ni ⊥ — no se puede destructurar`);
    };
}
// ---------- induction ----------
/**
 * Structural induction on hypothesis `name: Nat`.
 * Produces two sub-goals:
 * - **zero case**: conclusion with `name` substituted by `zero`.
 * - **succ case**: adds `IH: P(k)` and `k: Nat`; conclusion is `P(succ(k))`.
 *
 * Only Nat induction is supported in this base implementation.
 * @throws {@link TacticError} When `name` is not a `Nat` hypothesis.
 */
function induction(name) {
    return (state) => {
        const goal = activeGoal(state, 'induction');
        const hypType = goal.hyps[name];
        if (hypType === undefined) {
            throw new types_1.TacticError('induction', `'${name}' no está en hipótesis`);
        }
        if (hypType !== 'Nat' && hypType !== 'nat' && hypType !== 'ℕ') {
            throw new types_1.TacticError('induction', `inducción soportada solo sobre Nat (recibió '${name}:${hypType}')`);
        }
        // hipótesis sin el nombre del inductor.
        const baseHyps = { ...goal.hyps };
        delete baseHyps[name];
        // Reusamos `name` como el binder del caso sucesor cuando es posible
        // (queda libre tras retirar la hipótesis del inductor). Esto da goals
        // legibles tipo `P(succ(n))` en vez de `P(succ(n1))`.
        const zeroConcl = (0, types_1.substitute)(goal.concl, name, 'zero');
        const succVar = pickFreshVar(baseHyps, name);
        const succConcl = (0, types_1.substitute)(goal.concl, name, `succ(${succVar})`);
        const ihConcl = (0, types_1.substitute)(goal.concl, name, succVar);
        const zeroGoal = {
            id: freshGoalId(goal.id + '_zero'),
            hyps: { ...baseHyps },
            concl: (0, types_1.normalizeFormula)(zeroConcl),
        };
        const succGoal = {
            id: freshGoalId(goal.id + '_succ'),
            hyps: { ...baseHyps, [succVar]: 'Nat', IH: (0, types_1.normalizeFormula)(ihConcl) },
            concl: (0, types_1.normalizeFormula)(succConcl),
        };
        const after = withNewGoals(state, [zeroGoal, succGoal]);
        return recordHistory(state, after, 'induction', [name]);
    };
}
function pickFreshVar(hyps, hint) {
    if (hyps[hint] === undefined)
        return hint;
    let i = 1;
    while (hyps[`${hint}${i}`] !== undefined)
        i++;
    return `${hint}${i}`;
}
// ---------- case ----------
/**
 * Alias of {@link destruct} with the semantics of "case analysis".
 * Exported as `case` from `index.ts` via re-export alias (JS keyword conflict).
 */
function caseAnalysis(name) {
    return destruct(name);
}
/**
 * `unfold(def, dict)` — Replaces the identifier `def` by its body from `dict`
 * in the current conclusion. The definition dictionary is caller-supplied;
 * no global state is maintained.
 * @throws {@link TacticError} When `def` is not in `dict` or does not appear in the goal.
 */
function unfold(def, dict = {}) {
    return (state) => {
        const goal = activeGoal(state, 'unfold');
        const body = dict[def];
        if (body === undefined) {
            throw new types_1.TacticError('unfold', `definición '${def}' no registrada`);
        }
        const newConcl = (0, types_1.substitute)(goal.concl, def, body);
        if (newConcl === goal.concl) {
            throw new types_1.TacticError('unfold', `'${def}' no aparece en goal`);
        }
        const newGoal = {
            id: goal.id,
            hyps: { ...goal.hyps },
            concl: (0, types_1.normalizeFormula)(newConcl),
        };
        const after = withNewGoals(state, [newGoal]);
        return recordHistory(state, after, 'unfold', [def]);
    };
}
// ---------- simp ----------
/**
 * Applies the following rewrite rules recursively to a fixed point:
 * - `True ∧ X → X`, `X ∧ True → X`, `False ∧ X → False`
 * - `False ∨ X → X`, `X ∨ False → X`, `True ∨ X → True`
 * - `True → X → X`, `X → True → True`, `False → X → True`
 * - `¬¬X → X`
 * @throws {@link TacticError} When the goal is unchanged after all rules.
 */
function simp() {
    return (state) => {
        const goal = activeGoal(state, 'simp');
        const original = (0, types_1.normalizeFormula)(goal.concl);
        let cur = (0, types_1.parseFormula)(goal.concl);
        let changed = true;
        let safety = 0;
        while (changed) {
            changed = false;
            safety++;
            if (safety > 100)
                break;
            const before = (0, types_1.formulaToString)(cur);
            cur = simpStep(cur, () => {
                changed = true;
            });
            if ((0, types_1.formulaToString)(cur) !== before)
                changed = true;
        }
        const next = (0, types_1.formulaToString)(cur);
        if (next === original) {
            throw new types_1.TacticError('simp', `nada que simplificar en '${goal.concl}'`);
        }
        const newGoal = { id: goal.id, hyps: { ...goal.hyps }, concl: next };
        const after = withNewGoals(state, [newGoal]);
        return recordHistory(state, after, 'simp', []);
    };
}
function simpStep(f, mark) {
    switch (f.kind) {
        case 'atom':
        case 'true':
        case 'false':
            return f;
        case 'not': {
            const inner = simpStep(f.body, mark);
            if (inner.kind === 'not') {
                mark();
                return inner.body;
            }
            return { kind: 'not', body: inner };
        }
        case 'and': {
            const L = simpStep(f.left, mark);
            const R = simpStep(f.right, mark);
            if (L.kind === 'true') {
                mark();
                return R;
            }
            if (R.kind === 'true') {
                mark();
                return L;
            }
            if (L.kind === 'false' || R.kind === 'false') {
                mark();
                return { kind: 'false' };
            }
            return { kind: 'and', left: L, right: R };
        }
        case 'or': {
            const L = simpStep(f.left, mark);
            const R = simpStep(f.right, mark);
            if (L.kind === 'false') {
                mark();
                return R;
            }
            if (R.kind === 'false') {
                mark();
                return L;
            }
            if (L.kind === 'true' || R.kind === 'true') {
                mark();
                return { kind: 'true' };
            }
            return { kind: 'or', left: L, right: R };
        }
        case 'imp': {
            const L = simpStep(f.left, mark);
            const R = simpStep(f.right, mark);
            if (L.kind === 'true') {
                mark();
                return R;
            }
            if (R.kind === 'true') {
                mark();
                return { kind: 'true' };
            }
            if (L.kind === 'false') {
                mark();
                return { kind: 'true' };
            }
            return { kind: 'imp', left: L, right: R };
        }
        case 'eq': {
            // intentionally leave equality untouched: it requires semantic info.
            return f;
        }
    }
}
//# sourceMappingURL=tactics.js.map