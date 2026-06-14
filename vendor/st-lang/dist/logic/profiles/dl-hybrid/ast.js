"use strict";
// ============================================================
// ST dL-Hybrid — AST de Differential Dynamic Logic (subset)
// ============================================================
// Tipos AST para Differential Dynamic Logic (Platzer 2008/2010),
// subset suficiente para verificación de sistemas híbridos: estados
// continuos modelados por ODEs polinomiales y discretos por
// asignaciones / saltos no deterministas.
//
// El AST separa cuatro estratos:
//   • Term      — expresiones aritméticas reales sobre variables.
//   • Comparison— átomos del tipo t₁ ⋈ t₂ con ⋈ ∈ {=,≠,<,≤,>,≥}.
//   • DLFormula — fórmulas dL: booleanos + modalidades [α]φ y ⟨α⟩φ.
//   • HybridProgram — programas híbridos (asignación, ODE, secuencia,
//     choice no determinista, test, loop *).
//
// El loop α* está limitado a un horizonte finito en la implementación
// (decidible). Se documenta la limitación abajo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ode = exports.loop = exports.choice = exports.seq = exports.test = exports.nondet = exports.assign = exports.diamond = exports.box = exports.iff = exports.implies = exports.orF = exports.andF = exports.notF = exports.falseF = exports.trueF = exports.comp = exports.power = exports.negTerm = exports.divide = exports.times = exports.minus = exports.plus = exports.variable = exports.num = void 0;
exports.cloneState = cloneState;
exports.termVars = termVars;
exports.formulaVars = formulaVars;
exports.programVars = programVars;
exports.termToString = termToString;
exports.programToString = programToString;
exports.formulaToString = formulaToString;
// --- constructores cómodos ---
const num = (value) => ({ kind: 'num', value });
exports.num = num;
const variable = (name) => ({ kind: 'var', name });
exports.variable = variable;
const plus = (left, right) => ({ kind: 'plus', left, right });
exports.plus = plus;
const minus = (left, right) => ({ kind: 'minus', left, right });
exports.minus = minus;
const times = (left, right) => ({ kind: 'times', left, right });
exports.times = times;
const divide = (left, right) => ({ kind: 'div', left, right });
exports.divide = divide;
const negTerm = (arg) => ({ kind: 'neg', arg });
exports.negTerm = negTerm;
const power = (base, exp) => ({ kind: 'pow', base, exp });
exports.power = power;
const comp = (op, left, right) => ({
    kind: 'comp',
    op,
    left,
    right,
});
exports.comp = comp;
exports.trueF = { kind: 'true' };
exports.falseF = { kind: 'false' };
const notF = (arg) => ({ kind: 'not', arg });
exports.notF = notF;
const andF = (left, right) => ({
    kind: 'and',
    left,
    right,
});
exports.andF = andF;
const orF = (left, right) => ({ kind: 'or', left, right });
exports.orF = orF;
const implies = (left, right) => ({
    kind: 'implies',
    left,
    right,
});
exports.implies = implies;
const iff = (left, right) => ({ kind: 'iff', left, right });
exports.iff = iff;
const box = (program, post) => ({
    kind: 'box',
    program,
    post,
});
exports.box = box;
const diamond = (program, post) => ({
    kind: 'diamond',
    program,
    post,
});
exports.diamond = diamond;
const assign = (varName, rhs) => ({
    kind: 'assign',
    varName,
    rhs,
});
exports.assign = assign;
const nondet = (varName) => ({ kind: 'nondet', varName });
exports.nondet = nondet;
const test = (cond) => ({ kind: 'test', cond });
exports.test = test;
const seq = (left, right) => ({
    kind: 'seq',
    left,
    right,
});
exports.seq = seq;
const choice = (left, right) => ({
    kind: 'choice',
    left,
    right,
});
exports.choice = choice;
const loop = (body) => ({ kind: 'loop', body });
exports.loop = loop;
const ode = (system) => ({ kind: 'ode', system });
exports.ode = ode;
/** Clona un estado para uso inmutable durante traversal. */
function cloneState(s) {
    return new Map(s);
}
/** Recoge las variables libres en un término. */
function termVars(t, acc = new Set()) {
    switch (t.kind) {
        case 'num':
            return acc;
        case 'var':
            acc.add(t.name);
            return acc;
        case 'plus':
        case 'minus':
        case 'times':
        case 'div':
            termVars(t.left, acc);
            termVars(t.right, acc);
            return acc;
        case 'neg':
        case 'pow':
            termVars(t.kind === 'neg' ? t.arg : t.base, acc);
            return acc;
    }
}
/** Recoge las variables que aparecen en una fórmula. */
function formulaVars(f, acc = new Set()) {
    switch (f.kind) {
        case 'true':
        case 'false':
            return acc;
        case 'comp':
            termVars(f.left, acc);
            termVars(f.right, acc);
            return acc;
        case 'not':
            return formulaVars(f.arg, acc);
        case 'and':
        case 'or':
        case 'implies':
        case 'iff':
            formulaVars(f.left, acc);
            formulaVars(f.right, acc);
            return acc;
        case 'box':
        case 'diamond':
            programVars(f.program, acc);
            formulaVars(f.post, acc);
            return acc;
    }
}
/** Recoge variables modificadas/leídas por un programa. */
function programVars(p, acc = new Set()) {
    switch (p.kind) {
        case 'assign':
            acc.add(p.varName);
            termVars(p.rhs, acc);
            return acc;
        case 'nondet':
            acc.add(p.varName);
            return acc;
        case 'test':
            return formulaVars(p.cond, acc);
        case 'seq':
        case 'choice':
            programVars(p.left, acc);
            programVars(p.right, acc);
            return acc;
        case 'loop':
            return programVars(p.body, acc);
        case 'ode':
            for (const eq of p.system.equations) {
                acc.add(eq.varName);
                termVars(eq.rhs, acc);
            }
            if (p.system.domain)
                formulaVars(p.system.domain, acc);
            return acc;
    }
}
/** Render legible de un término dL. */
function termToString(t) {
    switch (t.kind) {
        case 'num':
            return String(t.value);
        case 'var':
            return t.name;
        case 'plus':
            return `(${termToString(t.left)} + ${termToString(t.right)})`;
        case 'minus':
            return `(${termToString(t.left)} - ${termToString(t.right)})`;
        case 'times':
            return `(${termToString(t.left)} * ${termToString(t.right)})`;
        case 'div':
            return `(${termToString(t.left)} / ${termToString(t.right)})`;
        case 'neg':
            return `-${termToString(t.arg)}`;
        case 'pow':
            return `${termToString(t.base)}^${t.exp}`;
    }
}
/** Render legible de un programa híbrido. */
function programToString(p) {
    switch (p.kind) {
        case 'assign':
            return `${p.varName} := ${termToString(p.rhs)}`;
        case 'nondet':
            return `${p.varName} := *`;
        case 'test':
            return `?(${formulaToString(p.cond)})`;
        case 'seq':
            return `${programToString(p.left)}; ${programToString(p.right)}`;
        case 'choice':
            return `(${programToString(p.left)} ∪ ${programToString(p.right)})`;
        case 'loop':
            return `(${programToString(p.body)})*`;
        case 'ode': {
            const eqs = p.system.equations
                .map((e) => `${e.varName}' = ${termToString(e.rhs)}`)
                .join(', ');
            const dom = p.system.domain ? ` & ${formulaToString(p.system.domain)}` : '';
            return `{${eqs}${dom}}`;
        }
    }
}
/** Render legible de una fórmula dL. */
function formulaToString(f) {
    switch (f.kind) {
        case 'true':
            return 'true';
        case 'false':
            return 'false';
        case 'comp':
            return `${termToString(f.left)} ${f.op} ${termToString(f.right)}`;
        case 'not':
            return `¬${formulaToString(f.arg)}`;
        case 'and':
            return `(${formulaToString(f.left)} ∧ ${formulaToString(f.right)})`;
        case 'or':
            return `(${formulaToString(f.left)} ∨ ${formulaToString(f.right)})`;
        case 'implies':
            return `(${formulaToString(f.left)} → ${formulaToString(f.right)})`;
        case 'iff':
            return `(${formulaToString(f.left)} ↔ ${formulaToString(f.right)})`;
        case 'box':
            return `[${programToString(f.program)}] ${formulaToString(f.post)}`;
        case 'diamond':
            return `<${programToString(f.program)}> ${formulaToString(f.post)}`;
    }
}
//# sourceMappingURL=ast.js.map