"use strict";
// ============================================================
// Tactic DSL — entry point
// ============================================================
//
// Pequeño DSL al estilo Lean/Coq para construir pruebas hacia atrás
// (backwards) a partir de un goal. El motor:
//   - mantiene una lista de goals abiertos
//   - cada tactic transforma el goal frontal
//   - los combinators (seq/orElse/repeat_/tryAlt) componen tactics
//
// La meta-prueba se considera completa cuando no quedan goals.
// El estado lleva un `history` que registra invocaciones para que
// el caller pueda renderizar el proof script reproducible.
//
// Nombres: la API original (Coq/Lean) usa `then` para encadenar
// tactics. Por interop con vitest/ESM (un módulo ES con export
// `then` se trata como thenable y bloquea el import), el combinador
// se llama `seq` a nivel de export. Para mantener el lenguaje
// Coq-like, exportamos un namespace `T` con `T.then = seq`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.T = exports.tryAlt = exports.repeat_ = exports.orElse = exports.seq = exports.case_ = exports.right = exports.left = exports.simp = exports.unfold = exports.caseAnalysis = exports.induction = exports.destruct = exports.split = exports.trivial = exports.rfl = exports.rewrite = exports.apply = exports.assumption = exports.exact = exports.intro = exports.normalizeFormula = exports.formulaEq = exports.formulaToString = exports.parseFormula = exports.TacticError = void 0;
exports.startProof = startProof;
exports.runTactic = runTactic;
exports.isProven = isProven;
exports.summary = summary;
exports._resetCounters = _resetCounters;
const types_1 = require("./types");
const tactics_1 = require("./tactics");
Object.defineProperty(exports, "apply", { enumerable: true, get: function () { return tactics_1.apply; } });
Object.defineProperty(exports, "assumption", { enumerable: true, get: function () { return tactics_1.assumption; } });
Object.defineProperty(exports, "caseAnalysis", { enumerable: true, get: function () { return tactics_1.caseAnalysis; } });
Object.defineProperty(exports, "destruct", { enumerable: true, get: function () { return tactics_1.destruct; } });
Object.defineProperty(exports, "exact", { enumerable: true, get: function () { return tactics_1.exact; } });
Object.defineProperty(exports, "induction", { enumerable: true, get: function () { return tactics_1.induction; } });
Object.defineProperty(exports, "intro", { enumerable: true, get: function () { return tactics_1.intro; } });
Object.defineProperty(exports, "left", { enumerable: true, get: function () { return tactics_1.left; } });
Object.defineProperty(exports, "rewrite", { enumerable: true, get: function () { return tactics_1.rewrite; } });
Object.defineProperty(exports, "rfl", { enumerable: true, get: function () { return tactics_1.rfl; } });
Object.defineProperty(exports, "right", { enumerable: true, get: function () { return tactics_1.right; } });
Object.defineProperty(exports, "simp", { enumerable: true, get: function () { return tactics_1.simp; } });
Object.defineProperty(exports, "split", { enumerable: true, get: function () { return tactics_1.split; } });
Object.defineProperty(exports, "trivial", { enumerable: true, get: function () { return tactics_1.trivial; } });
Object.defineProperty(exports, "unfold", { enumerable: true, get: function () { return tactics_1.unfold; } });
const combinators_1 = require("./combinators");
Object.defineProperty(exports, "orElse", { enumerable: true, get: function () { return combinators_1.orElse; } });
Object.defineProperty(exports, "repeat_", { enumerable: true, get: function () { return combinators_1.repeat_; } });
Object.defineProperty(exports, "seq", { enumerable: true, get: function () { return combinators_1.seq; } });
Object.defineProperty(exports, "tryAlt", { enumerable: true, get: function () { return combinators_1.tryAlt; } });
var types_2 = require("./types");
Object.defineProperty(exports, "TacticError", { enumerable: true, get: function () { return types_2.TacticError; } });
Object.defineProperty(exports, "parseFormula", { enumerable: true, get: function () { return types_2.parseFormula; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return types_2.formulaToString; } });
Object.defineProperty(exports, "formulaEq", { enumerable: true, get: function () { return types_2.formulaEq; } });
Object.defineProperty(exports, "normalizeFormula", { enumerable: true, get: function () { return types_2.normalizeFormula; } });
// Alias `case_` para `caseAnalysis` (case es palabra reservada en JS).
exports.case_ = tactics_1.caseAnalysis;
// Namespace `T` con todos los tactics y combinators. Aquí sí podemos
// exponer `then` porque la propiedad vive sobre un objeto, no sobre
// el module namespace.
exports.T = {
    // tactics
    intro: tactics_1.intro,
    exact: tactics_1.exact,
    assumption: tactics_1.assumption,
    apply: tactics_1.apply,
    rewrite: tactics_1.rewrite,
    rfl: tactics_1.rfl,
    trivial: tactics_1.trivial,
    split: tactics_1.split,
    left: tactics_1.left,
    right: tactics_1.right,
    destruct: tactics_1.destruct,
    induction: tactics_1.induction,
    caseAnalysis: tactics_1.caseAnalysis,
    case_: tactics_1.caseAnalysis,
    unfold: tactics_1.unfold,
    simp: tactics_1.simp,
    // combinators
    seq: combinators_1.seq,
    then: combinators_1.seq, // alias Coq-style
    orElse: // alias Coq-style
    combinators_1.orElse,
    repeat_: combinators_1.repeat_,
    tryAlt: combinators_1.tryAlt,
};
let stateCounter = 0;
function startProof(goal, hyps = {}) {
    // sanity: el goal debe parsearse limpio.
    (0, types_1.parseFormula)(goal);
    stateCounter++;
    const normalizedHyps = {};
    for (const [n, t] of Object.entries(hyps)) {
        normalizedHyps[n] = (0, types_1.normalizeFormula)(t);
    }
    const g = {
        id: `g${stateCounter}`,
        hyps: normalizedHyps,
        concl: (0, types_1.normalizeFormula)(goal),
    };
    return {
        goals: [g],
        history: [],
        done: false,
    };
}
function runTactic(state, t) {
    return t(state);
}
function isProven(state) {
    return state.done && state.goals.length === 0;
}
function summary(state) {
    if (state.done && state.goals.length === 0) {
        const steps = state.history.map((h) => `  - ${h.tactic}(${formatArgs(h.args)})`);
        return `Proof complete.\nHistory (${state.history.length} steps):\n${steps.join('\n')}`;
    }
    const open = state.goals
        .map((g, idx) => {
        const hyps = Object.entries(g.hyps)
            .map(([n, t]) => `  ${n} : ${t}`)
            .join('\n');
        return `Goal ${idx + 1}/${state.goals.length} (${g.id}):\n${hyps}\n  ⊢ ${g.concl}`;
    })
        .join('\n\n');
    return open;
}
function formatArgs(args) {
    return args
        .map((a) => {
        if (a === null || a === undefined)
            return '';
        if (Array.isArray(a)) {
            const items = a;
            return `[${items.map((x) => formatScalar(x)).join(',')}]`;
        }
        return formatScalar(a);
    })
        .filter((s) => s.length > 0)
        .join(', ');
}
function formatScalar(x) {
    if (typeof x === 'string')
        return x;
    if (typeof x === 'number' || typeof x === 'boolean')
        return String(x);
    if (x === null || x === undefined)
        return '';
    // fallback seguro para evitar [object Object]
    try {
        return JSON.stringify(x);
    }
    catch {
        return '';
    }
}
// Test-only helper para resetear contadores y obtener determinismo.
function _resetCounters() {
    stateCounter = 0;
    (0, tactics_1._resetGoalCounter)();
}
//# sourceMappingURL=index.js.map