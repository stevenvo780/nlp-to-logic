"use strict";
// ============================================================
// ST dL-Hybrid Reasoning — Invariant search tests
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const invariant_search_1 = require("../invariant-search");
const dl_hybrid_1 = require("../../../logic/profiles/dl-hybrid");
const dl_hybrid_2 = require("../../../logic/profiles/dl-hybrid");
function ode(src) {
    const p = (0, dl_hybrid_1.parseProgram)(src);
    if (p.kind !== 'ode')
        throw new Error('Esperaba ODE');
    return p.system;
}
(0, vitest_1.describe)('dl-hybrid reasoning — checkDifferentialInvariant', () => {
    (0, vitest_1.it)("x es invariante con L_f exacto 0 para x' = 0", () => {
        // L_f(x) = 0  → exacto.
        const v = (0, invariant_search_1.checkDifferentialInvariant)((0, dl_hybrid_2.variable)('x'), ode("{x' = 0}"));
        (0, vitest_1.expect)(v.kind).toBe('invariant');
        if (v.kind === 'invariant')
            (0, vitest_1.expect)(v.reason).toBe('exact');
    });
    (0, vitest_1.it)("x es invariante para x' = 1 (L_f = 1 ≥ 0)", () => {
        const v = (0, invariant_search_1.checkDifferentialInvariant)((0, dl_hybrid_2.variable)('x'), ode("{x' = 1}"));
        (0, vitest_1.expect)(v.kind).toBe('invariant');
    });
    (0, vitest_1.it)("x NO es invariante para x' = -1 (L_f = -1 < 0)", () => {
        const v = (0, invariant_search_1.checkDifferentialInvariant)((0, dl_hybrid_2.variable)('x'), ode("{x' = -1}"));
        (0, vitest_1.expect)(v.kind).toBe('not-invariant');
    });
    (0, vitest_1.it)("x² + y² es invariante para rotación (x' = -y, y' = x)", () => {
        const sys = {
            equations: [
                { varName: 'x', rhs: { kind: 'neg', arg: (0, dl_hybrid_2.variable)('y') } },
                { varName: 'y', rhs: (0, dl_hybrid_2.variable)('x') },
            ],
        };
        const p = (0, dl_hybrid_2.plus)((0, dl_hybrid_2.power)((0, dl_hybrid_2.variable)('x'), 2), (0, dl_hybrid_2.power)((0, dl_hybrid_2.variable)('y'), 2));
        const v = (0, invariant_search_1.checkDifferentialInvariant)(p, sys);
        (0, vitest_1.expect)(v.kind).toBe('invariant');
        // El simplificador no necesariamente reduce 2x(-y)+2yx a const 0,
        // pero numéricamente la malla evidencia el invariante.
        if (v.kind === 'invariant') {
            (0, vitest_1.expect)(['exact', 'lie-nonnegative']).toContain(v.reason);
        }
    });
    (0, vitest_1.it)("x NO es invariante para x' = x*y (refutable con muestra x=-1, y=2)", () => {
        // Sistema acoplado: chequeamos numéricamente, no por solubilidad cerrada.
        const sys = ode("{x' = x * y}");
        const v = (0, invariant_search_1.checkDifferentialInvariant)((0, dl_hybrid_2.variable)('x'), sys);
        (0, vitest_1.expect)(v.kind).toBe('not-invariant');
    });
});
(0, vitest_1.describe)('dl-hybrid reasoning — suggestInvariants', () => {
    (0, vitest_1.it)("encuentra al menos un invariante para x' = 1 (x ≥ -1 o ≥ 0)", () => {
        const sys = ode("{x' = 1}");
        const found = (0, invariant_search_1.suggestInvariants)(sys);
        (0, vitest_1.expect)(found.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('describeVerdict produce string informativo', () => {
        const sys = ode("{x' = 1}");
        const found = (0, invariant_search_1.suggestInvariants)(sys);
        (0, vitest_1.expect)(found.length).toBeGreaterThan(0);
        const first = found[0];
        (0, vitest_1.expect)(first).toBeDefined();
        if (first) {
            const desc = (0, invariant_search_1.describeVerdict)(first);
            (0, vitest_1.expect)(typeof desc).toBe('string');
            (0, vitest_1.expect)(desc.length).toBeGreaterThan(0);
        }
    });
});
//# sourceMappingURL=invariant.test.js.map