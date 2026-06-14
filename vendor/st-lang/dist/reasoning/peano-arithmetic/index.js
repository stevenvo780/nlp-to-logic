"use strict";
// ============================================================
// ST Peano Arithmetic — Axiomas, inducción y verificación
// ============================================================
//
// Formalización mínima de la aritmética de Peano de primer orden
// (PA, signatura {0, succ, +, ·}). Cubre los seis axiomas no-
// inductivos clásicos, el esquema (paramétrico) de inducción,
// algunos teoremas elementales (commutativa, asociativa,
// distributiva) y un verificador de teoremas por muestreo
// numérico — equivalente a refutación finita en el modelo
// estándar ℕ.
//
// El sistema NO pretende ser un demostrador de PA: ni siquiera
// existe un procedimiento de decisión (PA es indecidible). El
// objetivo es:
//   1. Tener una sintaxis sólida para términos y fórmulas de PA.
//   2. Evaluar fórmulas en el modelo estándar.
//   3. Refutar conjeturas por contraejemplo cuando son falsas en ℕ.
//   4. Ofrecer una codificación de Gödel (numeración por pares
//      de Cantor recursivos) para que el caller pueda manipular
//      fórmulas como números.
//
// El esquema de inducción se construye como una `PeanoFormula`
// real (no como un truco de TS): dado un predicado P sobre un
// término, devuelve `P(0) ∧ ∀x.(P(x) → P(succ(x))) → ∀x.P(x)`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PEANO_AXIOMS = exports.AXIOM_P6 = exports.AXIOM_P5 = exports.AXIOM_P4 = exports.AXIOM_P3 = exports.AXIOM_P2 = exports.AXIOM_P1 = exports.exists = exports.forall = exports.implies = exports.orF = exports.andF = exports.notF = exports.le = exports.lt = exports.eq = exports.mul = exports.add = exports.vt = exports.succ = exports.zero = void 0;
exports.numeral = numeral;
exports.inductionSchema = inductionSchema;
exports.evalNat = evalNat;
exports.freeVars = freeVars;
exports.evalFormula = evalFormula;
exports.theoremAddCommutative = theoremAddCommutative;
exports.theoremAddAssociative = theoremAddAssociative;
exports.theoremMulCommutative = theoremMulCommutative;
exports.theoremMulDistOverAdd = theoremMulDistOverAdd;
exports.verifyTheoremBySampling = verifyTheoremBySampling;
exports.godelNumber = godelNumber;
exports.fromGodel = fromGodel;
// ── Constructores de conveniencia ────────────────────────────
/** Constante 0 de la aritmética de Peano. */
exports.zero = { kind: 'zero' };
/** Constructor sucesor: `succ(t)` representa t+1. */
const succ = (arg) => ({ kind: 'succ', arg });
exports.succ = succ;
/** Variable de término de Peano referenciada por nombre. */
const vt = (name) => ({ kind: 'var', name });
exports.vt = vt;
/** Constructor de suma de términos de Peano. */
const add = (left, right) => ({
    kind: 'add',
    left,
    right,
});
exports.add = add;
/** Constructor de multiplicación de términos de Peano. */
const mul = (left, right) => ({
    kind: 'mul',
    left,
    right,
});
exports.mul = mul;
/** Constructor de la fórmula de igualdad: `left = right`. */
const eq = (left, right) => ({
    kind: 'eq',
    left,
    right,
});
exports.eq = eq;
/** Constructor de la fórmula de orden estricto: `left < right`. */
const lt = (left, right) => ({
    kind: 'lt',
    left,
    right,
});
exports.lt = lt;
/** Constructor de la fórmula de orden no estricto: `left ≤ right`. */
const le = (left, right) => ({
    kind: 'le',
    left,
    right,
});
exports.le = le;
/** Constructor de la negación de una fórmula de Peano. */
const notF = (arg) => ({ kind: 'not', arg });
exports.notF = notF;
/** Constructor de conjunción (n-aria) de fórmulas de Peano. */
const andF = (...args) => ({
    kind: 'and',
    args,
});
exports.andF = andF;
/** Constructor de disyunción (n-aria) de fórmulas de Peano. */
const orF = (...args) => ({ kind: 'or', args });
exports.orF = orF;
/** Constructor de implicación: `left → right`. */
const implies = (left, right) => ({
    kind: 'implies',
    left,
    right,
});
exports.implies = implies;
/** Constructor del cuantificador universal: `∀bind. body`. */
const forall = (bind, body) => ({
    kind: 'forall',
    bind,
    body,
});
exports.forall = forall;
/** Constructor del cuantificador existencial: `∃bind. body`. */
const exists = (bind, body) => ({
    kind: 'exists',
    bind,
    body,
});
exports.exists = exists;
// Construye un numeral cerrado succ^n(0).
function numeral(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError(`numeral expects a non-negative integer, got ${n}`);
    }
    let t = exports.zero;
    for (let i = 0; i < n; i += 1) {
        t = (0, exports.succ)(t);
    }
    return t;
}
// ── Axiomas de Peano (sin el esquema de inducción) ──────────
// P1: ∀x. ¬(succ(x) = 0)
/** P1: ∀x. ¬(succ(x) = 0) — el cero no es sucesor de ningún número. */
exports.AXIOM_P1 = (0, exports.forall)('x', (0, exports.notF)((0, exports.eq)((0, exports.succ)((0, exports.vt)('x')), exports.zero)));
// P2: ∀x,y. succ(x) = succ(y) → x = y
/** P2: ∀x,y. succ(x) = succ(y) → x = y — inyectividad del sucesor. */
exports.AXIOM_P2 = (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.implies)((0, exports.eq)((0, exports.succ)((0, exports.vt)('x')), (0, exports.succ)((0, exports.vt)('y'))), (0, exports.eq)((0, exports.vt)('x'), (0, exports.vt)('y')))));
// P3: ∀x. x + 0 = x
/** P3: ∀x. x + 0 = x — neutro derecho de la suma. */
exports.AXIOM_P3 = (0, exports.forall)('x', (0, exports.eq)((0, exports.add)((0, exports.vt)('x'), exports.zero), (0, exports.vt)('x')));
// P4: ∀x,y. x + succ(y) = succ(x + y)
/** P4: ∀x,y. x + succ(y) = succ(x + y) — recursión de la suma. */
exports.AXIOM_P4 = (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.eq)((0, exports.add)((0, exports.vt)('x'), (0, exports.succ)((0, exports.vt)('y'))), (0, exports.succ)((0, exports.add)((0, exports.vt)('x'), (0, exports.vt)('y'))))));
// P5: ∀x. x · 0 = 0
/** P5: ∀x. x · 0 = 0 — absorción del cero en la multiplicación. */
exports.AXIOM_P5 = (0, exports.forall)('x', (0, exports.eq)((0, exports.mul)((0, exports.vt)('x'), exports.zero), exports.zero));
// P6: ∀x,y. x · succ(y) = (x · y) + x
/** P6: ∀x,y. x · succ(y) = (x · y) + x — recursión de la multiplicación. */
exports.AXIOM_P6 = (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.eq)((0, exports.mul)((0, exports.vt)('x'), (0, exports.succ)((0, exports.vt)('y'))), (0, exports.add)((0, exports.mul)((0, exports.vt)('x'), (0, exports.vt)('y')), (0, exports.vt)('x')))));
/** Los seis axiomas no-inductivos de la aritmética de Peano (P1–P6). */
exports.PEANO_AXIOMS = [
    exports.AXIOM_P1,
    exports.AXIOM_P2,
    exports.AXIOM_P3,
    exports.AXIOM_P4,
    exports.AXIOM_P5,
    exports.AXIOM_P6,
];
// ── Esquema de inducción ─────────────────────────────────────
//
//   (P(0) ∧ ∀x.(P(x) → P(succ(x))))  →  ∀x.P(x)
//
// El caller pasa un constructor `P(n) ↦ formula(n)`. La variable
// `x` introducida es fresca (ix-XXX) para evitar colisiones con
// variables libres del cuerpo.
let inductionVarCounter = 0;
function freshVar() {
    inductionVarCounter += 1;
    return `ix_${inductionVarCounter}`;
}
/** Genera el esquema de inducción para un predicado P: (P(0) ∧ ∀x.(P(x) → P(succ(x)))) → ∀x.P(x). */
function inductionSchema(P) {
    const x = freshVar();
    const base = P(exports.zero);
    const step = (0, exports.forall)(x, (0, exports.implies)(P((0, exports.vt)(x)), P((0, exports.succ)((0, exports.vt)(x)))));
    const concl = (0, exports.forall)(x, P((0, exports.vt)(x)));
    return (0, exports.implies)((0, exports.andF)(base, step), concl);
}
// ── Evaluación en el modelo estándar ℕ ──────────────────────
//
// Devuelve `null` si el término menciona una variable libre que
// no está en el entorno. Las operaciones se ejecutan en number
// regular; si el caller espera valores muy grandes debería usar
// `numeralFromBigInt` + un evaluador BigInt (no incluido aquí).
/** Evalúa un término de Peano en el modelo estándar ℕ con el entorno dado. Devuelve `null` si hay variables libres sin valor. */
function evalNat(term, env = {}) {
    switch (term.kind) {
        case 'zero':
            return 0;
        case 'succ': {
            const a = evalNat(term.arg, env);
            return a === null ? null : a + 1;
        }
        case 'var': {
            const v = env[term.name];
            return v === undefined ? null : v;
        }
        case 'add': {
            const l = evalNat(term.left, env);
            const r = evalNat(term.right, env);
            if (l === null || r === null)
                return null;
            return l + r;
        }
        case 'mul': {
            const l = evalNat(term.left, env);
            const r = evalNat(term.right, env);
            if (l === null || r === null)
                return null;
            return l * r;
        }
    }
}
// Devuelve las variables libres de una fórmula (excluye las
// ligadas por forall/exists).
function freeVars(formula) {
    const out = new Set();
    collectFreeFormula(formula, new Set(), out);
    return out;
}
function collectFreeTerm(t, bound, out) {
    switch (t.kind) {
        case 'zero':
            return;
        case 'succ':
            collectFreeTerm(t.arg, bound, out);
            return;
        case 'var':
            if (!bound.has(t.name))
                out.add(t.name);
            return;
        case 'add':
        case 'mul':
            collectFreeTerm(t.left, bound, out);
            collectFreeTerm(t.right, bound, out);
            return;
    }
}
function collectFreeFormula(f, bound, out) {
    switch (f.kind) {
        case 'eq':
        case 'lt':
        case 'le':
            collectFreeTerm(f.left, bound, out);
            collectFreeTerm(f.right, bound, out);
            return;
        case 'not':
            collectFreeFormula(f.arg, bound, out);
            return;
        case 'and':
        case 'or':
            for (const a of f.args)
                collectFreeFormula(a, bound, out);
            return;
        case 'implies':
            collectFreeFormula(f.left, bound, out);
            collectFreeFormula(f.right, bound, out);
            return;
        case 'forall':
        case 'exists': {
            const inner = new Set(bound);
            inner.add(f.bind);
            collectFreeFormula(f.body, inner, out);
            return;
        }
    }
}
// Evaluación de fórmulas en ℕ con cuantificadores acotados.
// `maxN` (default 8) limita el rango de los cuantificadores.
// Devuelve `null` cuando hay variables libres no en el entorno
// fuera de los cuantificadores.
function evalFormula(formula, env = {}, maxN = 8) {
    switch (formula.kind) {
        case 'eq': {
            const l = evalNat(formula.left, env);
            const r = evalNat(formula.right, env);
            if (l === null || r === null)
                return null;
            return l === r;
        }
        case 'lt': {
            const l = evalNat(formula.left, env);
            const r = evalNat(formula.right, env);
            if (l === null || r === null)
                return null;
            return l < r;
        }
        case 'le': {
            const l = evalNat(formula.left, env);
            const r = evalNat(formula.right, env);
            if (l === null || r === null)
                return null;
            return l <= r;
        }
        case 'not': {
            const v = evalFormula(formula.arg, env, maxN);
            return v === null ? null : !v;
        }
        case 'and': {
            for (const a of formula.args) {
                const v = evalFormula(a, env, maxN);
                if (v === null)
                    return null;
                if (!v)
                    return false;
            }
            return true;
        }
        case 'or': {
            for (const a of formula.args) {
                const v = evalFormula(a, env, maxN);
                if (v === null)
                    return null;
                if (v)
                    return true;
            }
            return false;
        }
        case 'implies': {
            const l = evalFormula(formula.left, env, maxN);
            if (l === null)
                return null;
            if (!l)
                return true;
            const r = evalFormula(formula.right, env, maxN);
            return r;
        }
        case 'forall': {
            for (let n = 0; n <= maxN; n += 1) {
                const inner = { ...env, [formula.bind]: n };
                const v = evalFormula(formula.body, inner, maxN);
                if (v === null)
                    return null;
                if (!v)
                    return false;
            }
            return true;
        }
        case 'exists': {
            for (let n = 0; n <= maxN; n += 1) {
                const inner = { ...env, [formula.bind]: n };
                const v = evalFormula(formula.body, inner, maxN);
                if (v === null)
                    return null;
                if (v)
                    return true;
            }
            return false;
        }
    }
}
// ── Teoremas estándar ────────────────────────────────────────
//
// Todos son demostrables en PA (con el esquema de inducción
// adecuado) y deben sostenerse en cualquier modelo de PA, por
// supuesto incluido ℕ.
function theoremAddCommutative() {
    return (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.eq)((0, exports.add)((0, exports.vt)('x'), (0, exports.vt)('y')), (0, exports.add)((0, exports.vt)('y'), (0, exports.vt)('x')))));
}
function theoremAddAssociative() {
    return (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.forall)('z', (0, exports.eq)((0, exports.add)((0, exports.add)((0, exports.vt)('x'), (0, exports.vt)('y')), (0, exports.vt)('z')), (0, exports.add)((0, exports.vt)('x'), (0, exports.add)((0, exports.vt)('y'), (0, exports.vt)('z')))))));
}
function theoremMulCommutative() {
    return (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.eq)((0, exports.mul)((0, exports.vt)('x'), (0, exports.vt)('y')), (0, exports.mul)((0, exports.vt)('y'), (0, exports.vt)('x')))));
}
// x · (y + z) = (x · y) + (x · z)
function theoremMulDistOverAdd() {
    return (0, exports.forall)('x', (0, exports.forall)('y', (0, exports.forall)('z', (0, exports.eq)((0, exports.mul)((0, exports.vt)('x'), (0, exports.add)((0, exports.vt)('y'), (0, exports.vt)('z'))), (0, exports.add)((0, exports.mul)((0, exports.vt)('x'), (0, exports.vt)('y')), (0, exports.mul)((0, exports.vt)('x'), (0, exports.vt)('z')))))));
}
function verifyTheoremBySampling(thm, maxN = 6) {
    const free = Array.from(freeVars(thm));
    if (free.length === 0) {
        const v = evalFormula(thm, {}, maxN);
        if (v === null)
            return { valid: false };
        return v ? { valid: true } : { valid: false, counterexample: {} };
    }
    // Producto cartesiano [0..maxN]^free.length.
    const idxs = new Array(free.length).fill(0);
    while (true) {
        const env = {};
        for (let i = 0; i < free.length; i += 1) {
            env[free[i]] = idxs[i];
        }
        const v = evalFormula(thm, env, maxN);
        if (v === null)
            return { valid: false, counterexample: { ...env } };
        if (!v)
            return { valid: false, counterexample: { ...env } };
        // Incrementar índice.
        let pos = 0;
        while (pos < idxs.length) {
            idxs[pos] = (idxs[pos] ?? 0) + 1;
            if ((idxs[pos] ?? 0) <= maxN)
                break;
            idxs[pos] = 0;
            pos += 1;
        }
        if (pos === idxs.length)
            break;
    }
    return { valid: true };
}
// ── Codificación de Gödel ────────────────────────────────────
//
// Codificación inyectiva fórmula ↔ BigInt usando una función de
// emparejamiento de Cantor sobre BigInt: pair(a, b) = ((a+b)²+
// 3a+b)/2 (variante estándar). Las constantes del lenguaje se
// distinguen por un tag entero y luego se anidan recursivamente.
// La decodificación es la inversa exacta (round-trip).
//
// Tags (term):  zero=0, succ=1, var=2, add=3, mul=4
// Tags (form):  eq=5, lt=6, le=7, not=8, and=9, or=10,
//               implies=11, forall=12, exists=13
//
// Para nombres de variables usamos un diccionario ordenado por
// orden de aparición (asignación 0..N) y lo serializamos al
// final como una lista de longitudes. Esto basta para nuestro
// uso (las variables tienen nombres alfanuméricos cortos en
// ASCII imprimible).
const TAG = {
    zero: 0n,
    succ: 1n,
    vart: 2n,
    add: 3n,
    mul: 4n,
    eq: 5n,
    lt: 6n,
    le: 7n,
    not: 8n,
    and: 9n,
    or: 10n,
    implies: 11n,
    forall: 12n,
    exists: 13n,
};
function pair(a, b) {
    // Función de emparejamiento de Cantor sobre BigInt.
    const sum = a + b;
    return (sum * (sum + 1n)) / 2n + b;
}
function isqrt(n) {
    // Newton: O(log log n) iteraciones. Para n grande es lineal en
    // el número de dígitos, no en el valor. Búsqueda binaria sobre
    // [0..n] era O(log n) bits pero con multiplicaciones de
    // tamaño-full → cuadrático en dígitos.
    if (n < 0n)
        throw new RangeError('isqrt of negative');
    if (n < 2n)
        return n;
    // Seed inicial: 2^ceil(bitlen(n)/2).
    let bits = 0;
    let m = n;
    while (m > 0n) {
        m >>= 1n;
        bits += 1;
    }
    let x = 1n << BigInt(Math.ceil(bits / 2) + 1);
    while (true) {
        const y = (x + n / x) >> 1n;
        if (y >= x)
            return x;
        x = y;
    }
}
function unpair(z) {
    // w = floor((sqrt(8z+1) - 1)/2). Usamos isqrt (Newton sobre
    // BigInt) en lugar de Math.sqrt para no perder precisión.
    const t = 8n * z + 1n;
    const s = isqrt(t);
    const w = (s - 1n) / 2n;
    const triangular = (w * (w + 1n)) / 2n;
    const b = z - triangular;
    const a = w - b;
    return [a, b];
}
function tagged(tag, payload) {
    return pair(tag, payload);
}
function encodeString(s) {
    // Codifica el string como base-256 (cada char un byte UTF-16
    // LSB; los nombres en uso son ASCII). Prefijo de longitud para
    // permitir decodificación.
    const len = BigInt(s.length);
    let body = 0n;
    for (let i = 0; i < s.length; i += 1) {
        body = body * 256n + BigInt(s.charCodeAt(i) & 0xff);
    }
    return pair(len, body);
}
function decodeString(n) {
    const [len, body] = unpair(n);
    const chars = [];
    let rest = body;
    const length = Number(len);
    for (let i = 0; i < length; i += 1) {
        const code = Number(rest % 256n);
        chars.push(String.fromCharCode(code));
        rest = rest / 256n;
    }
    return chars.reverse().join('');
}
function encodeTerm(t) {
    switch (t.kind) {
        case 'zero':
            return tagged(TAG.zero, 0n);
        case 'succ':
            return tagged(TAG.succ, encodeTerm(t.arg));
        case 'var':
            return tagged(TAG.vart, encodeString(t.name));
        case 'add':
            return tagged(TAG.add, pair(encodeTerm(t.left), encodeTerm(t.right)));
        case 'mul':
            return tagged(TAG.mul, pair(encodeTerm(t.left), encodeTerm(t.right)));
    }
}
function encodeList(items) {
    // Lista codificada como (len, fold derecha de pair).
    let acc = 0n;
    for (let i = items.length - 1; i >= 0; i -= 1) {
        acc = pair(items[i], acc);
    }
    return pair(BigInt(items.length), acc);
}
function decodeList(n) {
    const [len, body] = unpair(n);
    const out = [];
    let rest = body;
    const length = Number(len);
    for (let i = 0; i < length; i += 1) {
        const [head, tail] = unpair(rest);
        out.push(head);
        rest = tail;
    }
    return out;
}
function encodeFormula(f) {
    switch (f.kind) {
        case 'eq':
            return tagged(TAG.eq, pair(encodeTerm(f.left), encodeTerm(f.right)));
        case 'lt':
            return tagged(TAG.lt, pair(encodeTerm(f.left), encodeTerm(f.right)));
        case 'le':
            return tagged(TAG.le, pair(encodeTerm(f.left), encodeTerm(f.right)));
        case 'not':
            return tagged(TAG.not, encodeFormula(f.arg));
        case 'and':
            return tagged(TAG.and, encodeList(f.args.map(encodeFormula)));
        case 'or':
            return tagged(TAG.or, encodeList(f.args.map(encodeFormula)));
        case 'implies':
            return tagged(TAG.implies, pair(encodeFormula(f.left), encodeFormula(f.right)));
        case 'forall':
            return tagged(TAG.forall, pair(encodeString(f.bind), encodeFormula(f.body)));
        case 'exists':
            return tagged(TAG.exists, pair(encodeString(f.bind), encodeFormula(f.body)));
    }
}
function godelNumber(formula) {
    return encodeFormula(formula);
}
function decodeTerm(n) {
    const [tag, payload] = unpair(n);
    if (tag === TAG.zero)
        return exports.zero;
    if (tag === TAG.succ) {
        const inner = decodeTerm(payload);
        return inner === null ? null : (0, exports.succ)(inner);
    }
    if (tag === TAG.vart) {
        return (0, exports.vt)(decodeString(payload));
    }
    if (tag === TAG.add) {
        const [l, r] = unpair(payload);
        const lt = decodeTerm(l);
        const rt = decodeTerm(r);
        if (lt === null || rt === null)
            return null;
        return (0, exports.add)(lt, rt);
    }
    if (tag === TAG.mul) {
        const [l, r] = unpair(payload);
        const lt = decodeTerm(l);
        const rt = decodeTerm(r);
        if (lt === null || rt === null)
            return null;
        return (0, exports.mul)(lt, rt);
    }
    return null;
}
function decodeFormula(n) {
    const [tag, payload] = unpair(n);
    if (tag === TAG.eq || tag === TAG.lt || tag === TAG.le) {
        const [l, r] = unpair(payload);
        const lt = decodeTerm(l);
        const rt = decodeTerm(r);
        if (lt === null || rt === null)
            return null;
        if (tag === TAG.eq)
            return (0, exports.eq)(lt, rt);
        if (tag === TAG.lt)
            return lt2lt(lt, rt);
        return (0, exports.le)(lt, rt);
    }
    if (tag === TAG.not) {
        const inner = decodeFormula(payload);
        return inner === null ? null : (0, exports.notF)(inner);
    }
    if (tag === TAG.and || tag === TAG.or) {
        const items = decodeList(payload);
        const args = [];
        for (const it of items) {
            const f = decodeFormula(it);
            if (f === null)
                return null;
            args.push(f);
        }
        return tag === TAG.and ? (0, exports.andF)(...args) : (0, exports.orF)(...args);
    }
    if (tag === TAG.implies) {
        const [l, r] = unpair(payload);
        const lf = decodeFormula(l);
        const rf = decodeFormula(r);
        if (lf === null || rf === null)
            return null;
        return (0, exports.implies)(lf, rf);
    }
    if (tag === TAG.forall || tag === TAG.exists) {
        const [bindN, bodyN] = unpair(payload);
        const bind = decodeString(bindN);
        const body = decodeFormula(bodyN);
        if (body === null)
            return null;
        return tag === TAG.forall ? (0, exports.forall)(bind, body) : (0, exports.exists)(bind, body);
    }
    return null;
}
// Helper: lt() del export está sombreado en este scope local.
function lt2lt(l, r) {
    return { kind: 'lt', left: l, right: r };
}
function fromGodel(n) {
    if (n < 0n)
        return null;
    try {
        return decodeFormula(n);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=index.js.map