"use strict";
// ============================================================
// BAN Logic — Saturación de estado + análisis de protocolos
// ============================================================
//
// `saturate(state)` aplica las reglas R1-R10 en forward-chaining
// hasta punto fijo (o cota de iteraciones). Devuelve la lista de
// fórmulas inferidas en orden de derivación (trace).
//
// `analyzeProtocol(p)` toma un Protocol con assumptions, steps y goals;
// idealiza los mensajes (cada step produce `P ◁ msg` para el receptor),
// satura, y reporta cuáles goals quedaron satisfechos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.saturate = saturate;
exports.idealize = idealize;
exports.analyzeProtocol = analyzeProtocol;
const rules_1 = require("./rules");
const terms_1 = require("./terms");
const STATE_RULES = [
    { name: 'message-meaning-shared', apply: rules_1.applyMessageMeaningShared },
    { name: 'message-meaning-public', apply: rules_1.applyMessageMeaningPublic },
    { name: 'message-meaning-secret', apply: rules_1.applyMessageMeaningSecret },
    { name: 'nonce-verification', apply: rules_1.applyNonceVerification },
    { name: 'jurisdiction', apply: rules_1.applyJurisdiction },
    { name: 'seeing-encrypted', apply: rules_1.applySeeingEncrypted },
    { name: 'sees-compound', apply: rules_1.applySeesCompound },
    { name: 'freshness-propagation', apply: rules_1.applyFreshnessPropagation },
];
const FOCUS_ONLY_RULES = [
    { name: 'belief-conj-left', apply: rules_1.applyBeliefConjunction },
    { name: 'belief-conj-right', apply: rules_1.applyBeliefConjunctionRight },
    { name: 'said-conj', apply: rules_1.applySaidConjunction },
];
/**
 * Aplica las reglas BAN al estado hasta punto fijo. Devuelve el estado
 * saturado y la lista de derivaciones nuevas (no incluye las iniciales).
 */
function saturate(initial, opts) {
    const maxIter = opts?.maxIterations ?? 200;
    const maxDeriv = opts?.maxDerivations ?? 1024;
    const state = [];
    const trace = [];
    const tryAdd = (f) => {
        if (state.some((g) => (0, terms_1.formulaEquals)(g, f)))
            return false;
        state.push(f);
        return true;
    };
    for (const f of initial)
        tryAdd(f);
    let iter = 0;
    let changed = true;
    while (changed && iter < maxIter && trace.length < maxDeriv) {
        changed = false;
        iter++;
        // Snapshot del estado para iterar de forma estable.
        const snapshot = state.slice();
        for (const focus of snapshot) {
            // Reglas state+focus.
            for (const rule of STATE_RULES) {
                const out = rule.apply(snapshot, focus);
                if (out && tryAdd(out)) {
                    trace.push(out);
                    changed = true;
                    if (trace.length >= maxDeriv)
                        return { state, trace };
                }
            }
            // Reglas focus-only.
            for (const rule of FOCUS_ONLY_RULES) {
                const out = rule.apply(focus);
                if (out && tryAdd(out)) {
                    trace.push(out);
                    changed = true;
                    if (trace.length >= maxDeriv)
                        return { state, trace };
                }
            }
        }
    }
    return { state, trace };
}
/**
 * Idealización mínima: cada step `from → to: msg` produce la
 * fórmula `to ◁ msg`. Asumimos que el receptor literalmente ve el
 * mensaje que se le envía.
 *
 * (BAN tradicional pide idealización manual para descartar texto
 * inseguro como nombres en claro; aquí preservamos todos los
 * subtérminos, que es la lectura conservadora.)
 */
function idealize(p) {
    return p.steps.map((s) => (0, terms_1.sees)((0, terms_1.principal)(s.to), s.message));
}
/**
 * Analiza un protocolo: parte de las assumptions + idealización,
 * satura, y verifica goals.
 */
function analyzeProtocol(p, opts) {
    const idealized = idealize(p);
    const initial = [...p.initialAssumptions, ...idealized];
    const { state, trace } = saturate(initial, opts);
    const satisfied = [];
    const unsatisfied = [];
    for (const g of p.goals) {
        if ((0, terms_1.hasFormula)(state, g))
            satisfied.push(g);
        else
            unsatisfied.push(g);
    }
    return { satisfied, unsatisfied, trace };
}
//# sourceMappingURL=analyze.js.map