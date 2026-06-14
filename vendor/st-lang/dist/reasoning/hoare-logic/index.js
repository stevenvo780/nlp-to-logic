"use strict";
// ============================================================
// ST Hoare Logic — Verificación de programas imperativos
// ============================================================
//
// Lógica de Hoare para un lenguaje IMP minimal (asignación, skip,
// secuencia, condicional, bucle). El motor calcula precondiciones
// más débiles (weakest precondition, wp) y postcondiciones más
// fuertes (strongest postcondition, sp), genera condiciones de
// verificación (VCs) y las refuta por búsqueda aleatoria sobre el
// universo entero acotado.
//
// Tripleta de Hoare:
//   {P} c {Q}  ≡  ejecutar c desde un estado que cumple P deja un
//                estado que cumple Q (corrección parcial).
//
// Reglas (Hoare):
//   skip      :  {P} skip {P}
//   assign    :  {P[E/x]} x := E {P}
//   seq       :  {P} c1 {R}, {R} c2 {Q}  ⊢  {P} c1; c2 {Q}
//   if        :  {P ∧ B} c1 {Q}, {P ∧ ¬B} c2 {Q}  ⊢  {P} if B then c1 else c2 {Q}
//   while     :  {I ∧ B} c {I}  ⊢  {I} while B do c {I ∧ ¬B}
//   weakening :  P → P', {P'} c {Q'}, Q' → Q  ⊢  {P} c {Q}
//
// Para `while` exigimos invariant explícito (campo `invariant`) o
// el VC pasa a ser trivial-falso (no podemos probar terminación
// parcial sin invariant). Las VCs se evalúan por muestreo aleatorio
// + estados sintéticos extraídos del programa: si alguna falla,
// devolvemos un contramodelo.
Object.defineProperty(exports, "__esModule", { value: true });
exports.whileS = exports.ifS = exports.assign = exports.skip = exports.le = exports.lt = exports.eq = exports.or = exports.and = exports.not = exports.binop = exports.v = exports.bool = exports.num = void 0;
exports.seq = seq;
exports.substitute = substitute;
exports.freeVars = freeVars;
exports.stmtVars = stmtVars;
exports.evalExpr = evalExpr;
exports.execStmt = execStmt;
exports.wp = wp;
exports.spExtension = spExtension;
exports.generateVCs = generateVCs;
exports.verifyTriple = verifyTriple;
exports.programSwap = programSwap;
exports.programFactorial = programFactorial;
exports.programGCD = programGCD;
exports.programLinearSearch = programLinearSearch;
exports.factorial = factorial;
exports.gcd = gcd;
// ── Constructores de conveniencia ────────────────────────────
/** Constructor de literal numérico IMP. */
const num = (n) => ({ kind: 'const', value: n });
exports.num = num;
/** Constructor de literal booleano IMP. */
const bool = (b) => ({ kind: 'bool', value: b });
exports.bool = bool;
/** Constructor de referencia a variable IMP por nombre. */
const v = (name) => ({ kind: 'var', name });
exports.v = v;
/** Constructor de operación binaria IMP. */
const binop = (op, left, right) => ({
    kind: 'binop',
    op,
    left,
    right,
});
exports.binop = binop;
/** Constructor de negación de expresión IMP. */
const not = (arg) => ({ kind: 'not', arg });
exports.not = not;
/** Constructor de conjunción lógica IMP: `left && right`. */
const and = (left, right) => (0, exports.binop)('&&', left, right);
exports.and = and;
/** Constructor de disyunción lógica IMP: `left || right`. */
const or = (left, right) => (0, exports.binop)('||', left, right);
exports.or = or;
/** Constructor de igualdad IMP: `left == right`. */
const eq = (left, right) => (0, exports.binop)('==', left, right);
exports.eq = eq;
/** Constructor de menor estricto IMP: `left < right`. */
const lt = (left, right) => (0, exports.binop)('<', left, right);
exports.lt = lt;
/** Constructor de menor o igual IMP: `left <= right`. */
const le = (left, right) => (0, exports.binop)('<=', left, right);
exports.le = le;
/** Instrucción `skip` (no-op). */
const skip = () => ({ kind: 'skip' });
exports.skip = skip;
/** Instrucción de asignación: `varName := expr`. */
const assign = (varName, expr) => ({
    kind: 'assign',
    var: varName,
    expr,
});
exports.assign = assign;
/** Secuencia de instrucciones (asociativa a la derecha). Con 0 args devuelve `skip`. */
function seq(...stmts) {
    if (stmts.length === 0)
        return (0, exports.skip)();
    if (stmts.length === 1)
        return stmts[0];
    // Foldr para mantener asociatividad derecha estable.
    let acc = stmts[stmts.length - 1];
    for (let i = stmts.length - 2; i >= 0; i--) {
        acc = { kind: 'seq', first: stmts[i], second: acc };
    }
    return acc;
}
/** Instrucción condicional `if cond then then_ else else_`. */
const ifS = (cond, then_, else_) => ({
    kind: 'if',
    cond,
    then: then_,
    else: else_,
});
exports.ifS = ifS;
/** Instrucción `while cond body` con invariante opcional para verificación. */
const whileS = (cond, body, invariant) => ({
    kind: 'while',
    cond,
    invariant,
    body,
});
exports.whileS = whileS;
// ── Sustitución sintáctica P[E/x] ────────────────────────────
/** Sustitución sintáctica `expr[replacement/varName]` en expresiones IMP. */
function substitute(expr, varName, replacement) {
    switch (expr.kind) {
        case 'const':
        case 'bool':
            return expr;
        case 'var':
            return expr.name === varName ? replacement : expr;
        case 'binop':
            return {
                kind: 'binop',
                op: expr.op,
                left: substitute(expr.left, varName, replacement),
                right: substitute(expr.right, varName, replacement),
            };
        case 'not':
            return { kind: 'not', arg: substitute(expr.arg, varName, replacement) };
    }
}
// ── Recolección de variables libres ──────────────────────────
/** Variables libres en la expresión IMP `expr`. Acumula en `acc` (o devuelve un nuevo Set). */
function freeVars(expr, acc = new Set()) {
    switch (expr.kind) {
        case 'const':
        case 'bool':
            return acc;
        case 'var':
            acc.add(expr.name);
            return acc;
        case 'binop':
            freeVars(expr.left, acc);
            freeVars(expr.right, acc);
            return acc;
        case 'not':
            freeVars(expr.arg, acc);
            return acc;
    }
}
/** Variables mencionadas en la instrucción IMP `stmt` (asignadas y/o leídas). */
function stmtVars(stmt, acc = new Set()) {
    switch (stmt.kind) {
        case 'skip':
            return acc;
        case 'assign':
            acc.add(stmt.var);
            freeVars(stmt.expr, acc);
            return acc;
        case 'seq':
            stmtVars(stmt.first, acc);
            stmtVars(stmt.second, acc);
            return acc;
        case 'if':
            freeVars(stmt.cond, acc);
            stmtVars(stmt.then, acc);
            stmtVars(stmt.else, acc);
            return acc;
        case 'while':
            freeVars(stmt.cond, acc);
            if (stmt.invariant)
                freeVars(stmt.invariant, acc);
            stmtVars(stmt.body, acc);
            return acc;
    }
}
/** Evalúa la expresión IMP `expr` en el estado `state`. Devuelve un número o booleano. */
function evalExpr(expr, state) {
    switch (expr.kind) {
        case 'const':
            return expr.value;
        case 'bool':
            return expr.value;
        case 'var': {
            const value = state[expr.name];
            // Variables no definidas valen 0 (estado total). Esto simplifica
            // el muestreo aleatorio y los VCs sobre programas pequeños.
            return value === undefined ? 0 : value;
        }
        case 'not': {
            const a = evalExpr(expr.arg, state);
            return !toBool(a);
        }
        case 'binop': {
            const l = evalExpr(expr.left, state);
            const r = evalExpr(expr.right, state);
            switch (expr.op) {
                case '+':
                    return toNum(l) + toNum(r);
                case '-':
                    return toNum(l) - toNum(r);
                case '*':
                    return toNum(l) * toNum(r);
                case '/': {
                    const rn = toNum(r);
                    if (rn === 0)
                        return 0; // división por cero → 0 (estado total)
                    return Math.trunc(toNum(l) / rn);
                }
                case '%': {
                    const rn = toNum(r);
                    if (rn === 0)
                        return 0;
                    return toNum(l) % rn;
                }
                case '<':
                    return toNum(l) < toNum(r);
                case '<=':
                    return toNum(l) <= toNum(r);
                case '>':
                    return toNum(l) > toNum(r);
                case '>=':
                    return toNum(l) >= toNum(r);
                case '==':
                    return toNum(l) === toNum(r);
                case '!=':
                    return toNum(l) !== toNum(r);
                case '&&':
                    return toBool(l) && toBool(r);
                case '||':
                    return toBool(l) || toBool(r);
            }
        }
    }
}
function toNum(v) {
    return typeof v === 'boolean' ? (v ? 1 : 0) : v;
}
function toBool(v) {
    return typeof v === 'boolean' ? v : v !== 0;
}
/** Ejecuta `stmt` sobre `state` con un límite de `maxSteps` pasos. Devuelve el estado final o un error. */
function execStmt(stmt, state, maxSteps = 10_000) {
    const counter = { steps: 0, limit: maxSteps };
    try {
        return execInternal(stmt, { ...state }, counter);
    }
    catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
    }
}
function execInternal(stmt, state, counter) {
    if (counter.steps++ > counter.limit) {
        throw new Error(`execStmt: límite de pasos excedido (${counter.limit})`);
    }
    switch (stmt.kind) {
        case 'skip':
            return state;
        case 'assign': {
            const value = evalExpr(stmt.expr, state);
            state[stmt.var] = toNum(value);
            return state;
        }
        case 'seq': {
            execInternal(stmt.first, state, counter);
            execInternal(stmt.second, state, counter);
            return state;
        }
        case 'if': {
            const cond = evalExpr(stmt.cond, state);
            if (toBool(cond)) {
                execInternal(stmt.then, state, counter);
            }
            else {
                execInternal(stmt.else, state, counter);
            }
            return state;
        }
        case 'while': {
            while (toBool(evalExpr(stmt.cond, state))) {
                if (counter.steps++ > counter.limit) {
                    throw new Error(`execStmt: límite de pasos excedido en while (${counter.limit})`);
                }
                execInternal(stmt.body, state, counter);
            }
            return state;
        }
    }
}
// ── Weakest precondition (wp) ────────────────────────────────
/** Precondición más débil `wp(stmt, post)`. Para while requiere invariant anotado; sin él devuelve `false`. */
function wp(stmt, post) {
    switch (stmt.kind) {
        case 'skip':
            return post;
        case 'assign':
            return substitute(post, stmt.var, stmt.expr);
        case 'seq': {
            const after = wp(stmt.second, post);
            return wp(stmt.first, after);
        }
        case 'if': {
            const wpThen = wp(stmt.then, post);
            const wpElse = wp(stmt.else, post);
            // (cond → wpThen) ∧ (¬cond → wpElse)
            return (0, exports.and)((0, exports.or)((0, exports.not)(stmt.cond), wpThen), (0, exports.or)(stmt.cond, wpElse));
        }
        case 'while': {
            // Sin invariant no podemos calcular wp exacto en general.
            // Devolvemos `false` para forzar fallo de VC explícito.
            if (!stmt.invariant)
                return (0, exports.bool)(false);
            // Con invariant I la wp es simplemente I; las verificaciones
            // adicionales (mantenimiento, salida) se generan como VCs.
            return stmt.invariant;
        }
    }
}
// ── Strongest postcondition (sp), versión sintáctica ─────────
//
// Implementación pragmática: para statements sin loops devolvemos
// una fórmula que describe el estado tras ejecutar `stmt`. Para
// loops sin invariant cae a `true` (no informativo).
/** Postcondición más fuerte aproximada `sp(stmt, pre)`. Para x := E cuando E no menciona x; sino devuelve `true`. */
function spExtension(stmt, pre) {
    switch (stmt.kind) {
        case 'skip':
            return pre;
        case 'assign': {
            // Introducimos una variable fresca para el valor previo de stmt.var:
            //   sp(P, x := E) = ∃x'. P[x'/x] ∧ x = E[x'/x]
            // Como no soportamos cuantificadores, aproximamos por la
            // post-substitución del valor nuevo cuando E no menciona x.
            // Si E menciona x, devolvemos `true` (no informativo).
            const eVars = freeVars(stmt.expr);
            if (!eVars.has(stmt.var)) {
                return (0, exports.and)(pre, (0, exports.eq)((0, exports.v)(stmt.var), stmt.expr));
            }
            return (0, exports.bool)(true);
        }
        case 'seq':
            return spExtension(stmt.second, spExtension(stmt.first, pre));
        case 'if': {
            const spThen = spExtension(stmt.then, (0, exports.and)(pre, stmt.cond));
            const spElse = spExtension(stmt.else, (0, exports.and)(pre, (0, exports.not)(stmt.cond)));
            return (0, exports.or)(spThen, spElse);
        }
        case 'while':
            // Saliendo de un while, vale (I ∧ ¬cond) si hay invariant.
            if (stmt.invariant)
                return (0, exports.and)(stmt.invariant, (0, exports.not)(stmt.cond));
            return (0, exports.bool)(true);
    }
}
// ── Generación de condiciones de verificación (VCs) ──────────
/** Genera las condiciones de verificación (VCs) para la tripla de Hoare: pre, wp global y VCs de loops. */
function generateVCs(triple) {
    const vcs = [];
    // VC global: pre → wp(stmt, post)
    vcs.push(implies(triple.pre, wp(triple.stmt, triple.post)));
    collectLoopVCs(triple.stmt, triple.post, vcs);
    return vcs;
}
function implies(p, q) {
    return (0, exports.or)((0, exports.not)(p), q);
}
function collectLoopVCs(stmt, post, out) {
    switch (stmt.kind) {
        case 'skip':
        case 'assign':
            return;
        case 'seq':
            collectLoopVCs(stmt.first, wp(stmt.second, post), out);
            collectLoopVCs(stmt.second, post, out);
            return;
        case 'if':
            collectLoopVCs(stmt.then, post, out);
            collectLoopVCs(stmt.else, post, out);
            return;
        case 'while': {
            if (!stmt.invariant) {
                // VC trivialmente falso: no hay invariant.
                out.push((0, exports.bool)(false));
                return;
            }
            const I = stmt.invariant;
            // Mantenimiento: (I ∧ cond) → wp(body, I)
            out.push(implies((0, exports.and)(I, stmt.cond), wp(stmt.body, I)));
            // Salida: (I ∧ ¬cond) → post (sólo si este while es el último
            // step antes de la post). Para keep it simple, lo generamos
            // siempre — es una condición necesaria local en el contexto del
            // VC global, no redundante.
            out.push(implies((0, exports.and)(I, (0, exports.not)(stmt.cond)), post));
            // Recurse sobre el body por loops anidados.
            collectLoopVCs(stmt.body, I, out);
            return;
        }
    }
}
/** Verifica la tripla `{pre} stmt {post}` por muestreo aleatorio de estados. */
function verifyTriple(triple, opts = {}) {
    const samples = opts.samples ?? 200;
    const range = opts.range ?? [-5, 10];
    const vcs = generateVCs(triple);
    const vars = new Set();
    freeVars(triple.pre, vars);
    freeVars(triple.post, vars);
    stmtVars(triple.stmt, vars);
    const varNames = [...vars];
    const rand = makeRandom(opts.seed);
    const failures = [];
    // Determinismo: incluimos estados "corner": todos 0, todos 1, todos -1.
    const cornerStates = [];
    for (const c of [0, 1, -1, range[0], range[1]]) {
        const st = {};
        for (const name of varNames)
            st[name] = c;
        cornerStates.push(st);
    }
    const allSeed = [...cornerStates, ...(opts.seedStates ?? [])];
    for (const vc of vcs) {
        let counterexample;
        // VCs literalmente `false` se reportan como fallo sintáctico sin
        // necesidad de muestrear.
        if (vc.kind === 'bool' && vc.value === false) {
            failures.push({ vc });
            continue;
        }
        // 1) corner + seed states
        for (const st of allSeed) {
            if (!evalVC(vc, st)) {
                counterexample = st;
                break;
            }
        }
        // 2) random sampling
        if (counterexample === undefined) {
            for (let i = 0; i < samples; i++) {
                const st = {};
                for (const name of varNames) {
                    st[name] = randIntInRange(rand, range[0], range[1]);
                }
                if (!evalVC(vc, st)) {
                    counterexample = st;
                    break;
                }
            }
        }
        if (counterexample !== undefined) {
            failures.push({ vc, state: counterexample });
        }
    }
    return { valid: failures.length === 0, vcs, failures };
}
function evalVC(vc, state) {
    return toBool(evalExpr(vc, state));
}
function makeRandom(seed) {
    if (seed === undefined)
        return Math.random;
    // Mulberry32 — pequeño PRNG determinista.
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function randIntInRange(rand, lo, hi) {
    return Math.floor(rand() * (hi - lo + 1)) + lo;
}
// ── Programas estándar de la literatura ──────────────────────
/**
 * Swap x ↔ y vía variable temporal `t`.
 *   t := x; x := y; y := t
 * Tripleta canónica: {x = a ∧ y = b} swap {x = b ∧ y = a}
 */
function programSwap() {
    return seq((0, exports.assign)('t', (0, exports.v)('x')), (0, exports.assign)('x', (0, exports.v)('y')), (0, exports.assign)('y', (0, exports.v)('t')));
}
/**
 * Factorial:  r := 1; k := 0; while k < n do { k := k+1; r := r * k }
 * Tripleta:   {n = N ∧ N ≥ 0} fact {r = N!}
 * Invariant:  k ≤ n ∧ r = k!  (codificable como r = k!, k entre 0 y n)
 *
 * Como la lógica de Hoare aquí no tiene factorial nativo, exponemos el
 * código y el invariant en forma `r > 0 ∧ k ≤ n` (suficiente para
 * los tests de mantenimiento sintácticos con muestreo: el ejecutor
 * confirma corrección concreta para n pequeños).
 */
function programFactorial() {
    const body = seq((0, exports.assign)('k', (0, exports.binop)('+', (0, exports.v)('k'), (0, exports.num)(1))), (0, exports.assign)('r', (0, exports.binop)('*', (0, exports.v)('r'), (0, exports.v)('k'))));
    const invariant = (0, exports.and)((0, exports.le)((0, exports.v)('k'), (0, exports.v)('n')), (0, exports.binop)('>=', (0, exports.v)('r'), (0, exports.num)(1)));
    return seq((0, exports.assign)('r', (0, exports.num)(1)), (0, exports.assign)('k', (0, exports.num)(0)), (0, exports.whileS)((0, exports.binop)('<', (0, exports.v)('k'), (0, exports.v)('n')), body, invariant));
}
/**
 * GCD por algoritmo de Euclides con restas:
 *   while x != y do { if x > y then x := x - y else y := y - x }
 * Invariant: gcd(x, y) = gcd(a, b). Como no tenemos gcd nativo,
 * usamos como invariant `x ≥ 1 ∧ y ≥ 1` (mantenido por restas
 * positivas cuando x ≠ y y ambos positivos al entrar).
 */
function programGCD() {
    const body = (0, exports.ifS)((0, exports.binop)('>', (0, exports.v)('x'), (0, exports.v)('y')), (0, exports.assign)('x', (0, exports.binop)('-', (0, exports.v)('x'), (0, exports.v)('y'))), (0, exports.assign)('y', (0, exports.binop)('-', (0, exports.v)('y'), (0, exports.v)('x'))));
    const invariant = (0, exports.and)((0, exports.binop)('>=', (0, exports.v)('x'), (0, exports.num)(1)), (0, exports.binop)('>=', (0, exports.v)('y'), (0, exports.num)(1)));
    return (0, exports.whileS)((0, exports.binop)('!=', (0, exports.v)('x'), (0, exports.v)('y')), body, invariant);
}
/**
 * Búsqueda lineal:
 *   i := 0; found := 0;
 *   while i < n && found == 0 do {
 *     if a == target then found := 1 else skip;
 *     i := i + 1
 *   }
 * Modelo simplificado: `a` representa el elemento actual (no un array;
 * el AST de IMP no tiene arrays). Sirve como esqueleto pedagógico
 * para discutir el invariant `i ≤ n` y la post `found == 1 ∨ i == n`.
 */
function programLinearSearch() {
    const body = seq((0, exports.ifS)((0, exports.eq)((0, exports.v)('a'), (0, exports.v)('target')), (0, exports.assign)('found', (0, exports.num)(1)), (0, exports.skip)()), (0, exports.assign)('i', (0, exports.binop)('+', (0, exports.v)('i'), (0, exports.num)(1))));
    const invariant = (0, exports.and)((0, exports.le)((0, exports.v)('i'), (0, exports.v)('n')), (0, exports.or)((0, exports.eq)((0, exports.v)('found'), (0, exports.num)(0)), (0, exports.eq)((0, exports.v)('found'), (0, exports.num)(1))));
    return seq((0, exports.assign)('i', (0, exports.num)(0)), (0, exports.assign)('found', (0, exports.num)(0)), (0, exports.whileS)((0, exports.and)((0, exports.binop)('<', (0, exports.v)('i'), (0, exports.v)('n')), (0, exports.eq)((0, exports.v)('found'), (0, exports.num)(0))), body, invariant));
}
// ── Helper: cómputo factorial concreto (para los tests) ──────
/** Calcula el factorial de `n` en enteros (JavaScript). Solo para tests. */
function factorial(n) {
    let r = 1;
    for (let k = 1; k <= n; k++)
        r *= k;
    return r;
}
/** Máximo común divisor de `a` y `b` (Euclides). Solo para tests. */
function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    if (x === 0)
        return y;
    if (y === 0)
        return x;
    while (x !== y) {
        if (x > y)
            x -= y;
        else
            y -= x;
    }
    return x;
}
//# sourceMappingURL=index.js.map