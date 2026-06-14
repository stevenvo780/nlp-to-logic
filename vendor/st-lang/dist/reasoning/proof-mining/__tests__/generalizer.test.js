"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generalizer_1 = require("../generalizer");
(0, vitest_1.describe)('generalizeFormulas', () => {
    (0, vitest_1.it)('para 0 instancias devuelve string vacío', () => {
        (0, vitest_1.expect)((0, generalizer_1.generalizeFormulas)([])).toEqual({
            statement: '',
            abstractionLevel: 0,
            nonTrivial: false,
        });
    });
    (0, vitest_1.it)('para 1 instancia devuelve el original sin abstracción', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P -> P']);
        (0, vitest_1.expect)(r.statement).toBe('P -> P');
        (0, vitest_1.expect)(r.abstractionLevel).toBe(0);
        (0, vitest_1.expect)(r.nonTrivial).toBe(false);
    });
    (0, vitest_1.it)('P->P y Q->Q producen ?0 -> ?0', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P -> P', 'Q -> Q']);
        (0, vitest_1.expect)(r.abstractionLevel).toBe(1);
        (0, vitest_1.expect)(r.nonTrivial).toBe(true);
        (0, vitest_1.expect)(r.statement).toContain('->');
        // Debería contener el mismo placeholder dos veces (reflexividad).
        const matches = r.statement.match(/\?0/g);
        (0, vitest_1.expect)(matches?.length).toBe(2);
    });
    (0, vitest_1.it)('P->Q y R->S producen ?0 -> ?1', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P -> Q', 'R -> S']);
        (0, vitest_1.expect)(r.abstractionLevel).toBe(2);
        (0, vitest_1.expect)(r.nonTrivial).toBe(true);
        (0, vitest_1.expect)(r.statement).toMatch(/\?0/);
        (0, vitest_1.expect)(r.statement).toMatch(/\?1/);
    });
    (0, vitest_1.it)('instancias idénticas no introducen abstracción', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P -> P', 'P -> P']);
        (0, vitest_1.expect)(r.abstractionLevel).toBe(0);
        (0, vitest_1.expect)(r.nonTrivial).toBe(false);
    });
    (0, vitest_1.it)('desacuerdos en operadores no son generalizables (fallback al literal)', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P and Q', 'P or Q']);
        (0, vitest_1.expect)(r.nonTrivial).toBe(false);
        (0, vitest_1.expect)(r.statement).toBe('P and Q');
    });
    (0, vitest_1.it)('arrays de tokens de distinta longitud caen al primer literal', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P', 'P -> P']);
        (0, vitest_1.expect)(r.nonTrivial).toBe(false);
        (0, vitest_1.expect)(r.statement).toBe('P');
    });
    (0, vitest_1.it)('mantiene operadores como tokens literales en el patrón', () => {
        const r = (0, generalizer_1.generalizeFormulas)(['P -> Q', 'A -> B']);
        (0, vitest_1.expect)(r.statement).toContain('->');
    });
});
(0, vitest_1.describe)('generalizeLemma', () => {
    (0, vitest_1.it)('respeta maxAbstractionLevel', () => {
        const r = (0, generalizer_1.generalizeLemma)(['f(a, b, c)', 'f(x, y, z)'], { maxAbstractionLevel: 2 });
        // Necesitaríamos 3 fresh vars; con cap = 2 cae al literal.
        (0, vitest_1.expect)(r.abstractionLevel).toBe(0);
        (0, vitest_1.expect)(r.statement).toBe('f(a, b, c)');
    });
    (0, vitest_1.it)('preserveSemantic = true no rechaza generalizaciones válidas', () => {
        const r = (0, generalizer_1.generalizeLemma)(['P -> P', 'Q -> Q'], {
            preserveSemantic: true,
            maxAbstractionLevel: 5,
        });
        (0, vitest_1.expect)(r.nonTrivial).toBe(true);
    });
    (0, vitest_1.it)('opciones por defecto producen abstracción si es no-trivial', () => {
        const r = (0, generalizer_1.generalizeLemma)(['P -> P', 'Q -> Q']);
        (0, vitest_1.expect)(r.abstractionLevel).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('generalizeTerms', () => {
    (0, vitest_1.it)('para 0 terms devuelve vacío', () => {
        (0, vitest_1.expect)((0, generalizer_1.generalizeTerms)([])).toEqual({
            statement: '',
            abstractionLevel: 0,
            nonTrivial: false,
        });
    });
    (0, vitest_1.it)('para 1 term devuelve el original sin abstracción', () => {
        const t = { kind: 'const', name: 'a' };
        const r = (0, generalizer_1.generalizeTerms)([t]);
        (0, vitest_1.expect)(r.statement).toBe('a');
        (0, vitest_1.expect)(r.abstractionLevel).toBe(0);
    });
    (0, vitest_1.it)('lgg de p(a) y p(b) introduce variable fresca', () => {
        const t1 = { kind: 'func', name: 'p', args: [{ kind: 'const', name: 'a' }] };
        const t2 = { kind: 'func', name: 'p', args: [{ kind: 'const', name: 'b' }] };
        const r = (0, generalizer_1.generalizeTerms)([t1, t2]);
        (0, vitest_1.expect)(r.abstractionLevel).toBe(1);
        (0, vitest_1.expect)(r.statement).toMatch(/^p\(/);
    });
    (0, vitest_1.it)('lgg de términos idénticos no introduce abstracción', () => {
        const t1 = { kind: 'const', name: 'a' };
        const t2 = { kind: 'const', name: 'a' };
        const r = (0, generalizer_1.generalizeTerms)([t1, t2]);
        (0, vitest_1.expect)(r.abstractionLevel).toBe(0);
    });
    (0, vitest_1.it)('lgg de p(a,a) y p(b,b) reusa la misma fresh var', () => {
        const t1 = {
            kind: 'func',
            name: 'p',
            args: [
                { kind: 'const', name: 'a' },
                { kind: 'const', name: 'a' },
            ],
        };
        const t2 = {
            kind: 'func',
            name: 'p',
            args: [
                { kind: 'const', name: 'b' },
                { kind: 'const', name: 'b' },
            ],
        };
        const r = (0, generalizer_1.generalizeTerms)([t1, t2]);
        // Idealmente abstractionLevel = 1 (una sola fresh var reusada).
        (0, vitest_1.expect)(r.abstractionLevel).toBe(1);
    });
});
//# sourceMappingURL=generalizer.test.js.map