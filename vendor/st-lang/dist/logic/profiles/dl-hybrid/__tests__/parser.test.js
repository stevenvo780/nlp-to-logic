"use strict";
// ============================================================
// ST dL-Hybrid — Parser tests
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parser_1 = require("../parser");
const ast_1 = require("../ast");
(0, vitest_1.describe)('dl-hybrid parser — términos', () => {
    (0, vitest_1.it)('parsea números enteros y reales', () => {
        (0, vitest_1.expect)((0, parser_1.parseTerm)('42')).toEqual({ kind: 'num', value: 42 });
        (0, vitest_1.expect)((0, parser_1.parseTerm)('3.14')).toEqual({ kind: 'num', value: 3.14 });
    });
    (0, vitest_1.it)('parsea variables', () => {
        (0, vitest_1.expect)((0, parser_1.parseTerm)('x')).toEqual({ kind: 'var', name: 'x' });
    });
    (0, vitest_1.it)('parsea aritmética con precedencia correcta', () => {
        // x + 2 * y debe parsear como x + (2 * y)
        const t = (0, parser_1.parseTerm)('x + 2 * y');
        (0, vitest_1.expect)(t).toEqual({
            kind: 'plus',
            left: { kind: 'var', name: 'x' },
            right: {
                kind: 'times',
                left: { kind: 'num', value: 2 },
                right: { kind: 'var', name: 'y' },
            },
        });
    });
    (0, vitest_1.it)('parsea potencias con exponente entero', () => {
        (0, vitest_1.expect)((0, parser_1.parseTerm)('x^2')).toEqual({
            kind: 'pow',
            base: { kind: 'var', name: 'x' },
            exp: 2,
        });
    });
    (0, vitest_1.it)('soporta negación unaria', () => {
        (0, vitest_1.expect)((0, parser_1.parseTerm)('-x')).toEqual({ kind: 'neg', arg: { kind: 'var', name: 'x' } });
    });
});
(0, vitest_1.describe)('dl-hybrid parser — fórmulas', () => {
    (0, vitest_1.it)('parsea comparaciones básicas', () => {
        const f = (0, parser_1.parseFormula)('x > 0');
        (0, vitest_1.expect)(f).toEqual({
            kind: 'comp',
            op: '>',
            left: { kind: 'var', name: 'x' },
            right: { kind: 'num', value: 0 },
        });
    });
    (0, vitest_1.it)('parsea cada operador relacional', () => {
        (0, vitest_1.expect)((0, parser_1.parseFormula)('x = 1').kind).toBe('comp');
        (0, vitest_1.expect)((0, parser_1.parseFormula)('x != 1').kind).toBe('comp');
        (0, vitest_1.expect)((0, parser_1.parseFormula)('x <= 1').kind).toBe('comp');
        (0, vitest_1.expect)((0, parser_1.parseFormula)('x >= 1').kind).toBe('comp');
    });
    (0, vitest_1.it)('parsea conjunción y disyunción con precedencia', () => {
        // x > 0 & y > 0 | z > 0  →  (x>0 & y>0) | z>0
        const f = (0, parser_1.parseFormula)('x > 0 & y > 0 | z > 0');
        (0, vitest_1.expect)(f.kind).toBe('or');
    });
    (0, vitest_1.it)('parsea implicación con asociatividad derecha', () => {
        const f = (0, parser_1.parseFormula)('x = 0 -> y = 1 -> z = 2');
        (0, vitest_1.expect)(f.kind).toBe('implies');
    });
    (0, vitest_1.it)('parsea booleanos true/false', () => {
        (0, vitest_1.expect)((0, parser_1.parseFormula)('true')).toEqual({ kind: 'true' });
        (0, vitest_1.expect)((0, parser_1.parseFormula)('false')).toEqual({ kind: 'false' });
    });
    (0, vitest_1.it)('parsea negación', () => {
        (0, vitest_1.expect)((0, parser_1.parseFormula)('!(x = 0)').kind).toBe('not');
    });
    (0, vitest_1.it)('parsea modalidad [α]φ con asignación', () => {
        const f = (0, parser_1.parseFormula)('[ x := 0 ] x = 0');
        (0, vitest_1.expect)(f.kind).toBe('box');
        if (f.kind === 'box') {
            (0, vitest_1.expect)(f.program.kind).toBe('assign');
            (0, vitest_1.expect)(f.post.kind).toBe('comp');
        }
    });
    (0, vitest_1.it)('parsea modalidad ⟨α⟩φ con asignación', () => {
        const f = (0, parser_1.parseFormula)('<x := 1> x > 0');
        (0, vitest_1.expect)(f.kind).toBe('diamond');
    });
});
(0, vitest_1.describe)('dl-hybrid parser — programas híbridos', () => {
    (0, vitest_1.it)('parsea asignación simple', () => {
        const p = (0, parser_1.parseProgram)('x := x + 1');
        (0, vitest_1.expect)(p.kind).toBe('assign');
    });
    (0, vitest_1.it)('parsea asignación no determinista', () => {
        const p = (0, parser_1.parseProgram)('x := *');
        (0, vitest_1.expect)(p.kind).toBe('nondet');
    });
    (0, vitest_1.it)('parsea test bloqueante', () => {
        const p = (0, parser_1.parseProgram)('?(x > 0)');
        (0, vitest_1.expect)(p.kind).toBe('test');
    });
    (0, vitest_1.it)('parsea secuencia', () => {
        const p = (0, parser_1.parseProgram)('x := 0; x := x + 1');
        (0, vitest_1.expect)(p.kind).toBe('seq');
    });
    (0, vitest_1.it)('parsea choice con ++', () => {
        const p = (0, parser_1.parseProgram)('x := 0 ++ x := 1');
        (0, vitest_1.expect)(p.kind).toBe('choice');
    });
    (0, vitest_1.it)('parsea loop con *', () => {
        const p = (0, parser_1.parseProgram)('(x := x + 1)*');
        (0, vitest_1.expect)(p.kind).toBe('loop');
    });
    (0, vitest_1.it)('parsea ODE con dominio', () => {
        const p = (0, parser_1.parseProgram)("{x' = 1 & x < 10}");
        (0, vitest_1.expect)(p.kind).toBe('ode');
        if (p.kind === 'ode') {
            (0, vitest_1.expect)(p.system.equations).toHaveLength(1);
            (0, vitest_1.expect)(p.system.equations[0]?.varName).toBe('x');
            (0, vitest_1.expect)(p.system.domain).toBeDefined();
        }
    });
    (0, vitest_1.it)('parsea ODE multi-variable', () => {
        const p = (0, parser_1.parseProgram)("{x' = 1, y' = 2}");
        (0, vitest_1.expect)(p.kind).toBe('ode');
        if (p.kind === 'ode') {
            (0, vitest_1.expect)(p.system.equations).toHaveLength(2);
        }
    });
    (0, vitest_1.it)('round-trip: programToString invertible para casos simples', () => {
        const p = (0, parser_1.parseProgram)('x := x + 1');
        const s = (0, ast_1.programToString)(p);
        const p2 = (0, parser_1.parseProgram)(s);
        (0, vitest_1.expect)(p2.kind).toBe(p.kind);
    });
    (0, vitest_1.it)('round-trip: formulaToString preserva estructura', () => {
        const f = (0, parser_1.parseFormula)('x > 0');
        (0, vitest_1.expect)((0, ast_1.formulaToString)(f)).toBe('x > 0');
    });
    (0, vitest_1.it)('round-trip: termToString recoge variables', () => {
        const t = (0, parser_1.parseTerm)('x + 1');
        (0, vitest_1.expect)((0, ast_1.termToString)(t)).toContain('x');
        (0, vitest_1.expect)((0, ast_1.termToString)(t)).toContain('1');
    });
    (0, vitest_1.it)('rechaza tokens sobrantes', () => {
        (0, vitest_1.expect)(() => (0, parser_1.parseFormula)('x = 0 xxx')).toThrow();
    });
    (0, vitest_1.it)('rechaza paréntesis no balanceados', () => {
        (0, vitest_1.expect)(() => (0, parser_1.parseFormula)('(x = 0')).toThrow();
    });
});
//# sourceMappingURL=parser.test.js.map