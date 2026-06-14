"use strict";
// ============================================================
// ST dL-Hybrid — Tests para resolución de ODEs y derivada de Lie
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const differential_1 = require("../differential");
const parser_1 = require("../parser");
const ast_1 = require("../ast");
function ode(src) {
    const p = (0, parser_1.parseProgram)(src);
    if (p.kind !== 'ode')
        throw new Error('Esperaba ODE');
    return p.system;
}
(0, vitest_1.describe)('dl-hybrid differential — clasificación', () => {
    (0, vitest_1.it)("detecta x' = 1 como constante", () => {
        const sys = ode("{x' = 1}");
        const k = (0, differential_1.classifyOde)(sys);
        (0, vitest_1.expect)(k.kind).toBe('constant');
        if (k.kind === 'constant') {
            (0, vitest_1.expect)(k.rates.get('x')).toBe(1);
        }
    });
    (0, vitest_1.it)("detecta x' = 2 * x como lineal con a=2 b=0", () => {
        const sys = ode("{x' = 2 * x}");
        const k = (0, differential_1.classifyOde)(sys);
        (0, vitest_1.expect)(k.kind).toBe('linear');
        if (k.kind === 'linear') {
            const c = k.coeffs.get('x');
            (0, vitest_1.expect)(c?.a).toBe(2);
            (0, vitest_1.expect)(c?.b).toBe(0);
        }
    });
    (0, vitest_1.it)("detecta x' = 3 * x + 5 como lineal con a=3 b=5", () => {
        const sys = ode("{x' = 3 * x + 5}");
        const k = (0, differential_1.classifyOde)(sys);
        (0, vitest_1.expect)(k.kind).toBe('linear');
        if (k.kind === 'linear') {
            const c = k.coeffs.get('x');
            (0, vitest_1.expect)(c?.a).toBe(3);
            (0, vitest_1.expect)(c?.b).toBe(5);
        }
    });
    (0, vitest_1.it)("rechaza x' = x * y como acoplada (unsupported)", () => {
        const sys = ode("{x' = x * y}");
        const k = (0, differential_1.classifyOde)(sys);
        (0, vitest_1.expect)(k.kind).toBe('unsupported');
    });
});
(0, vitest_1.describe)('dl-hybrid differential — flow analítico', () => {
    (0, vitest_1.it)("x' = 2 desde x0=1, t=3 → x=7", () => {
        const sys = ode("{x' = 2}");
        const s0 = new Map([['x', 1]]);
        const sT = (0, differential_1.flow)(sys, s0, 3);
        (0, vitest_1.expect)(sT.get('x')).toBeCloseTo(7, 9);
    });
    (0, vitest_1.it)("x' = -1 desde x0=10, t=4 → x=6", () => {
        const sys = ode("{x' = -1}");
        const s0 = new Map([['x', 10]]);
        const sT = (0, differential_1.flow)(sys, s0, 4);
        (0, vitest_1.expect)(sT.get('x')).toBeCloseTo(6, 9);
    });
    (0, vitest_1.it)("x' = x desde x0=1, t=1 → x≈e", () => {
        const sys = ode("{x' = x}");
        const s0 = new Map([['x', 1]]);
        const sT = (0, differential_1.flow)(sys, s0, 1);
        (0, vitest_1.expect)(sT.get('x')).toBeCloseTo(Math.E, 6);
    });
    (0, vitest_1.it)("x' = 2*x desde x0=1, t=ln(2)/2 → x=2", () => {
        // x(t) = x₀ · e^{2t} = 1 · e^{ln 2} = 2
        const sys = ode("{x' = 2 * x}");
        const s0 = new Map([['x', 1]]);
        const t = Math.log(2) / 2;
        const sT = (0, differential_1.flow)(sys, s0, t);
        (0, vitest_1.expect)(sT.get('x')).toBeCloseTo(2, 6);
    });
});
(0, vitest_1.describe)('dl-hybrid differential — derivada de Lie', () => {
    (0, vitest_1.it)("L_f(x) para x' = 1 da 1 (la propia f)", () => {
        const sys = ode("{x' = 1}");
        const lie = (0, differential_1.lieDerivative)((0, ast_1.variable)('x'), sys);
        // Debe simplificarse a const 1.
        (0, vitest_1.expect)(lie.kind).toBe('const');
        if (lie.kind === 'const')
            (0, vitest_1.expect)(lie.value).toBe(1);
    });
    (0, vitest_1.it)("L_f(x) para x' = 2x da 2x", () => {
        const sys = ode("{x' = 2 * x}");
        const lie = (0, differential_1.lieDerivative)((0, ast_1.variable)('x'), sys);
        // Evaluamos en x=3 → 2*3 = 6
        const v = (0, differential_1.evalSym)(lie, new Map([['x', 3]]));
        (0, vitest_1.expect)(v).toBeCloseTo(6, 9);
    });
    (0, vitest_1.it)("L_f(x²) para x' = 1 da 2x", () => {
        const sys = ode("{x' = 1}");
        // candidate p = x²
        const p = (0, parser_1.parseTerm)('x^2');
        const lie = (0, differential_1.lieDerivative)(p, sys);
        // En x=5 da 2*5 = 10
        const v = (0, differential_1.evalSym)(lie, new Map([['x', 5]]));
        (0, vitest_1.expect)(v).toBeCloseTo(10, 9);
    });
    (0, vitest_1.it)("L_f(x² + y²) para x' = -y, y' = x (rotación) da 0 (invariante exacto)", () => {
        const sys = {
            equations: [
                { varName: 'x', rhs: { kind: 'neg', arg: (0, ast_1.variable)('y') } },
                { varName: 'y', rhs: (0, ast_1.variable)('x') },
            ],
        };
        // L_f(x²+y²) = 2x*(-y) + 2y*x = 0
        const p = (0, ast_1.plus)({ kind: 'pow', base: (0, ast_1.variable)('x'), exp: 2 }, {
            kind: 'pow',
            base: (0, ast_1.variable)('y'),
            exp: 2,
        });
        const lie = (0, differential_1.lieDerivative)(p, sys);
        const v = (0, differential_1.evalSym)(lie, new Map([['x', 1], ['y', 2]]));
        (0, vitest_1.expect)(v).toBeCloseTo(0, 6);
    });
});
(0, vitest_1.describe)('dl-hybrid differential — auxiliares', () => {
    (0, vitest_1.it)('termIsConstant detecta enteros y resultados simplificados', () => {
        (0, vitest_1.expect)((0, differential_1.termIsConstant)((0, ast_1.num)(5))).toBe(5);
        (0, vitest_1.expect)((0, differential_1.termIsConstant)((0, ast_1.plus)((0, ast_1.num)(2), (0, ast_1.num)(3)))).toBe(5);
        (0, vitest_1.expect)((0, differential_1.termIsConstant)((0, ast_1.variable)('x'))).toBeNull();
    });
    (0, vitest_1.it)('termIsLinearIn extrae a, b correctamente para 2*x + 3', () => {
        const lin = (0, differential_1.termIsLinearIn)((0, ast_1.plus)((0, ast_1.times)((0, ast_1.num)(2), (0, ast_1.variable)('x')), (0, ast_1.num)(3)), 'x');
        (0, vitest_1.expect)(lin).toEqual({ a: 2, b: 3 });
    });
    (0, vitest_1.it)('termIsLinearIn devuelve null si hay otras variables', () => {
        (0, vitest_1.expect)((0, differential_1.termIsLinearIn)((0, ast_1.plus)((0, ast_1.variable)('x'), (0, ast_1.variable)('y')), 'x')).toBeNull();
    });
    (0, vitest_1.it)('termToExpr no falla sobre términos parseados', () => {
        const t = (0, parser_1.parseTerm)('x + 2 * y');
        const e = (0, differential_1.termToExpr)(t);
        (0, vitest_1.expect)(e.kind).toBe('add');
    });
});
//# sourceMappingURL=differential.test.js.map