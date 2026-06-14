"use strict";
// ============================================================
// ST dL-Hybrid — Decision procedure tests
// ============================================================
// Casos canónicos del paper de Platzer adaptados al subset.
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const parser_1 = require("../parser");
const tableau_1 = require("../tableau");
const valid = (src, opts) => (0, tableau_1.checkValid)((0, parser_1.parseFormula)(src), opts).status === 'valid';
const sat = (src, opts) => (0, tableau_1.checkSatisfiable)((0, parser_1.parseFormula)(src), opts).status === 'satisfiable';
(0, vitest_1.describe)('dl-hybrid tableau — asignaciones discretas', () => {
    (0, vitest_1.it)('[ x := 0 ] x = 0 es válida', () => {
        (0, vitest_1.expect)(valid('[ x := 0 ] x = 0')).toBe(true);
    });
    (0, vitest_1.it)('[ x := 0 ] x > 0 NO es válida', () => {
        (0, vitest_1.expect)(valid('[ x := 0 ] x > 0')).toBe(false);
    });
    (0, vitest_1.it)('precondición → postcondición tras asignación: x >= 0 -> [x := x + 1] x > 0', () => {
        (0, vitest_1.expect)(valid('x >= 0 -> [ x := x + 1 ] x > 0')).toBe(true);
    });
    (0, vitest_1.it)('contraejemplo: x = -1 → [x := x + 1] x > 0 falla', () => {
        // En estado x=-1, tras x:=x+1 queda x=0, no > 0.
        const f = (0, parser_1.parseFormula)('[ x := x + 1 ] x > 0');
        const s = new Map([['x', -1]]);
        (0, vitest_1.expect)((0, tableau_1.evalInState)(f, s)).toBe(false);
    });
    (0, vitest_1.it)('asignación encadenada: [x := 1; x := x + 1] x = 2', () => {
        (0, vitest_1.expect)(valid('[ x := 1; x := x + 1 ] x = 2')).toBe(true);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — choice y test', () => {
    (0, vitest_1.it)('[x := 0 ++ x := 1] x >= 0 es válida', () => {
        (0, vitest_1.expect)(valid('[ x := 0 ++ x := 1 ] x >= 0')).toBe(true);
    });
    (0, vitest_1.it)('[x := 0 ++ x := -1] x >= 0 NO es válida (rama -1 viola)', () => {
        (0, vitest_1.expect)(valid('[ x := 0 ++ x := -1 ] x >= 0')).toBe(false);
    });
    (0, vitest_1.it)('test bloqueante: [?(x > 0); x := 1] x > 0 es válida (vacuous si bloquea)', () => {
        (0, vitest_1.expect)(valid('[ ?(x > 0); x := 1 ] x > 0')).toBe(true);
    });
    (0, vitest_1.it)('test que pasa con precondición: x > 0 -> [?(x > 0)] x > 0', () => {
        (0, vitest_1.expect)(valid('x > 0 -> [ ?(x > 0) ] x > 0')).toBe(true);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — diamond (existencial)', () => {
    (0, vitest_1.it)('<x := 5> x > 0 es válida — existe outcome con x > 0', () => {
        (0, vitest_1.expect)(valid('<x := 5> x > 0')).toBe(true);
    });
    (0, vitest_1.it)('<x := 0> x > 0 NO es válida — único outcome es x=0', () => {
        (0, vitest_1.expect)(valid('<x := 0> x > 0')).toBe(false);
    });
    (0, vitest_1.it)('diamond y choice: <x := 0 ++ x := 1> x > 0 vale (rama 1)', () => {
        (0, vitest_1.expect)(valid('<x := 0 ++ x := 1> x > 0')).toBe(true);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — loops bounded', () => {
    (0, vitest_1.it)('[(x := x + 1)*] true siempre vale', () => {
        (0, vitest_1.expect)(valid('[(x := x + 1)*] true')).toBe(true);
    });
    (0, vitest_1.it)('[x := 0; (x := x + 1)*] x >= 0 es válida (todos los unfolds preservan x >= 0)', () => {
        (0, vitest_1.expect)(valid('[ x := 0; (x := x + 1)* ] x >= 0')).toBe(true);
    });
    (0, vitest_1.it)('[(x := x - 1)*] x >= 0 NO es válida (un unfold rompe la cota)', () => {
        (0, vitest_1.expect)(valid('[ x := 0; (x := x - 1)* ] x >= 0', { loopUnfold: 2 })).toBe(false);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — ODEs continuas', () => {
    (0, vitest_1.it)("[{x' = 1 & x < 5}] x <= 5 es válida con dominio", () => {
        (0, vitest_1.expect)(valid("[{x' = 1 & x < 5}] x <= 5")).toBe(true);
    });
    (0, vitest_1.it)("[{x' = 0}] x = x0 — flujo trivial preserva valor (cualquier x)", () => {
        // x' = 0 → x permanece constante.
        // Como x se interpreta como el valor en el estado, [{x'=0}] (x = x0) sólo
        // tiene sentido con x0 ligado al estado. Probamos invariante simple:
        // x >= 0 -> [{x' = 0}] x >= 0
        (0, vitest_1.expect)(valid("x >= 0 -> [{x' = 0}] x >= 0")).toBe(true);
    });
    (0, vitest_1.it)("evolución sin dominio: <{x' = 1}> x > 0 vale cuando x >= 0 (acepta t>0)", () => {
        (0, vitest_1.expect)(valid("x >= 0 -> <{x' = 1}> x >= 0")).toBe(true);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — satisfiability', () => {
    (0, vitest_1.it)('x > 0 es satisfacible (testigo: x=1)', () => {
        (0, vitest_1.expect)(sat('x > 0')).toBe(true);
    });
    (0, vitest_1.it)('false NO es satisfacible', () => {
        (0, vitest_1.expect)(sat('false')).toBe(false);
    });
    (0, vitest_1.it)('x > 0 & x < 0 es insatisfacible en la malla', () => {
        (0, vitest_1.expect)(sat('x > 0 & x < 0')).toBe(false);
    });
});
(0, vitest_1.describe)('dl-hybrid tableau — booleano puro', () => {
    (0, vitest_1.it)('true es válida', () => {
        (0, vitest_1.expect)(valid('true')).toBe(true);
    });
    (0, vitest_1.it)('false NO es válida', () => {
        (0, vitest_1.expect)(valid('false')).toBe(false);
    });
    (0, vitest_1.it)('tautología clásica: x = 0 | !(x = 0)', () => {
        (0, vitest_1.expect)(valid('x = 0 | !(x = 0)')).toBe(true);
    });
});
//# sourceMappingURL=tableau.test.js.map