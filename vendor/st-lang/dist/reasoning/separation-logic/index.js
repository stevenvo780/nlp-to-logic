"use strict";
// ============================================================
// Separation Logic — Reynolds-style heap reasoning
// ============================================================
//
// Lógica de separación clásica (Reynolds / O'Hearn / Yang) para razonar
// sobre estructuras dinámicas (listas, árboles) y mutación con aliasing
// controlado.
//
// Núcleo:
//   - Heap finito (Map<number, SLValue>) con dominio explícito.
//   - Fórmulas: `emp`, `x ↦ v`, `P * Q`, `P -* Q`, `∃x. P`, conectivos
//     clásicos sobre el fragmento puro.
//   - Semántica `satisfies(P, h, valuation)` siguiendo el split de heap.
//   - Triplas de Hoare con axiomas locales (alloc, free, load, store).
//   - Predicados inductivos: `ls(x, y)` (list-segment) y `tree(x)`.
//
// El módulo es puro TypeScript, sin dependencias del resto del repo.
// Las estructuras Heap son inmutables hacia afuera: `write`, `delete` y
// `combine` devuelven instancias nuevas.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmd = exports.forallF = exports.existsF = exports.notF = exports.impliesF = exports.orF = exports.andF = exports.pure = exports.magicWand = exports.star = exports.pointsTo = exports.emp = void 0;
exports.intVal = intVal;
exports.addrVal = addrVal;
exports.nullVal = nullVal;
exports.valueEquals = valueEquals;
exports.valueKey = valueKey;
exports.asLoc = asLoc;
exports.newHeap = newHeap;
exports.fromMap = fromMap;
exports.disjoint = disjoint;
exports.combine = combine;
exports.heapEquals = heapEquals;
exports.splits = splits;
exports.formulaToString = formulaToString;
exports.valueToString = valueToString;
exports.bind = bind;
exports.satisfies = satisfies;
exports.executeCommand = executeCommand;
exports.checkTriple = checkTriple;
exports.isListSegment = isListSegment;
exports.listSegment = listSegment;
exports.satisfiesShape = satisfiesShape;
exports.tree = tree;
exports.isTree = isTree;
exports.frame = frame;
/** Constructor de valor entero del heap de separación. */
function intVal(value) {
    return { kind: 'int', value };
}
/** Constructor de valor dirección del heap de separación. */
function addrVal(loc) {
    return { kind: 'addr', loc };
}
/** Singleton null del heap de separación (puntero nulo). */
function nullVal() {
    return { kind: 'null' };
}
/** Igualdad estructural entre dos valores del heap de separación. */
function valueEquals(a, b) {
    if (a.kind !== b.kind)
        return false;
    if (a.kind === 'int' && b.kind === 'int')
        return a.value === b.value;
    if (a.kind === 'addr' && b.kind === 'addr')
        return a.loc === b.loc;
    return a.kind === 'null' && b.kind === 'null';
}
/** Convierte un SLValue a una clave string estable para Maps. */
function valueKey(v) {
    if (v.kind === 'int')
        return `i:${v.value}`;
    if (v.kind === 'addr')
        return `a:${v.loc}`;
    return 'null';
}
/** Devuelve la dirección de un SLValue si es addr, o null en cualquier
 * otro caso. La null-location no se direcciona. */
function asLoc(v) {
    return v.kind === 'addr' ? v.loc : null;
}
class HeapImpl {
    map;
    constructor(map) {
        this.map = map;
    }
    domain() {
        return [...this.map.keys()].sort((a, b) => a - b);
    }
    has(loc) {
        return this.map.has(loc);
    }
    read(loc) {
        return this.map.get(loc);
    }
    write(loc, val) {
        const next = new Map(this.map);
        next.set(loc, val);
        return new HeapImpl(next);
    }
    delete(loc) {
        if (!this.map.has(loc))
            return this;
        const next = new Map(this.map);
        next.delete(loc);
        return new HeapImpl(next);
    }
    size() {
        return this.map.size;
    }
    clone() {
        return new HeapImpl(new Map(this.map));
    }
}
/** Crea un heap vacío. */
function newHeap() {
    return new HeapImpl(new Map());
}
/** Crea un heap a partir de una lista de pares `[dirección, valor]`. */
function fromMap(entries) {
    return new HeapImpl(new Map(entries));
}
/** Dos heaps son disjuntos sii sus dominios no se intersectan. */
function disjoint(h1, h2) {
    if (h1.size() > h2.size())
        return disjoint(h2, h1);
    for (const loc of h1.domain()) {
        if (h2.has(loc))
            return false;
    }
    return true;
}
/** Unión disjunta `h1 ⊎ h2`. Devuelve null si los heaps comparten alguna
 * dirección — la unión disjunta sólo está definida cuando son disjoint. */
function combine(h1, h2) {
    if (!disjoint(h1, h2))
        return null;
    const merged = new Map(h1.map);
    for (const [loc, v] of h2.map)
        merged.set(loc, v);
    return new HeapImpl(merged);
}
/** Igualdad estructural de heaps. */
function heapEquals(h1, h2) {
    if (h1.size() !== h2.size())
        return false;
    for (const [loc, v] of h1.map) {
        const other = h2.read(loc);
        if (other === undefined)
            return false;
        if (!valueEquals(v, other))
            return false;
    }
    return true;
}
// ── Sub-heaps (para semántica de `*` y `-*`) ────────────────
/** Enumera todas las particiones del heap en `(h1, h2)` con `h1 ⊎ h2 = h`. */
function splits(h) {
    const dom = h.domain();
    const n = dom.length;
    const results = [];
    // 2^n splits — sólo se invoca sobre heaps pequeños (testing/semántica).
    const limit = 1 << n;
    for (let mask = 0; mask < limit; mask++) {
        const m1 = new Map();
        const m2 = new Map();
        for (let i = 0; i < n; i++) {
            const loc = dom[i];
            const v = h.read(loc);
            if ((mask >> i) & 1)
                m1.set(loc, v);
            else
                m2.set(loc, v);
        }
        results.push({ h1: new HeapImpl(m1), h2: new HeapImpl(m2) });
    }
    return results;
}
/** Heap vacío: `emp`. La fórmula que vale sobre el heap vacío. */
const emp = () => ({ kind: 'emp' });
exports.emp = emp;
/** `loc ↦ val` — `loc` apunta a `val` (heap de un solo celda). */
const pointsTo = (loc, val) => ({
    kind: 'pointsTo',
    loc,
    val,
});
exports.pointsTo = pointsTo;
/** Conjunción separante `P * Q`: `P` y `Q` valen sobre sub-heaps disjuntos cuya unión es el heap total. */
const star = (left, right) => ({
    kind: 'star',
    left,
    right,
});
exports.star = star;
/** Magic wand `P -* Q`: para cualquier heap disjunto que satisfaga `P`, la unión satisface `Q`. */
const magicWand = (left, right) => ({
    kind: 'magicWand',
    left,
    right,
});
exports.magicWand = magicWand;
/** Fórmula pura `[expr]`: condición sin acceso al heap, evaluada por `predicate`. */
const pure = (expression, predicate) => ({
    kind: 'pure',
    expression,
    predicate,
});
exports.pure = pure;
/** Conjunción clásica de dos fórmulas SL (no separante). */
const andF = (left, right) => ({
    kind: 'and',
    left,
    right,
});
exports.andF = andF;
/** Disyunción de dos fórmulas SL. */
const orF = (left, right) => ({
    kind: 'or',
    left,
    right,
});
exports.orF = orF;
/** Implicación clásica entre dos fórmulas SL. */
const impliesF = (left, right) => ({
    kind: 'implies',
    left,
    right,
});
exports.impliesF = impliesF;
/** Negación de una fórmula SL. */
const notF = (body) => ({ kind: 'not', body });
exports.notF = notF;
/** Cuantificador existencial sobre una variable de valuación. */
const existsF = (bind, body) => ({
    kind: 'exists',
    bind,
    body,
});
exports.existsF = existsF;
/** Cuantificador universal sobre una variable de valuación. */
const forallF = (bind, body) => ({
    kind: 'forall',
    bind,
    body,
});
exports.forallF = forallF;
// ── Pretty printer ───────────────────────────────────────────
/** Serializa una fórmula SL a su representación textual estándar. */
function formulaToString(f) {
    switch (f.kind) {
        case 'emp':
            return 'emp';
        case 'pointsTo':
            return `${valueToString(f.loc)} ↦ ${valueToString(f.val)}`;
        case 'star':
            return `(${formulaToString(f.left)} * ${formulaToString(f.right)})`;
        case 'magicWand':
            return `(${formulaToString(f.left)} -* ${formulaToString(f.right)})`;
        case 'pure':
            return `[${f.expression}]`;
        case 'and':
            return `(${formulaToString(f.left)} ∧ ${formulaToString(f.right)})`;
        case 'or':
            return `(${formulaToString(f.left)} ∨ ${formulaToString(f.right)})`;
        case 'implies':
            return `(${formulaToString(f.left)} → ${formulaToString(f.right)})`;
        case 'not':
            return `¬${formulaToString(f.body)}`;
        case 'exists':
            return `∃${f.bind}. ${formulaToString(f.body)}`;
        case 'forall':
            return `∀${f.bind}. ${formulaToString(f.body)}`;
    }
}
/** Serializa un valor SL (int, addr, null) a texto legible. */
function valueToString(v) {
    if (v.kind === 'int')
        return `${v.value}`;
    if (v.kind === 'addr')
        return `&${v.loc}`;
    return 'null';
}
/** Devuelve una copia del valuation con `name → v`. */
function bind(val, name, v) {
    return { ...val, [name]: v };
}
// ── Semántica ────────────────────────────────────────────────
/** `satisfies(P, h, ν)` — el modelo `(h, ν)` satisface la fórmula P. */
function satisfies(formula, heap, val) {
    switch (formula.kind) {
        case 'emp':
            return heap.size() === 0;
        case 'pointsTo': {
            const loc = asLoc(formula.loc);
            if (loc === null)
                return false;
            if (heap.size() !== 1)
                return false;
            const stored = heap.read(loc);
            if (stored === undefined)
                return false;
            return valueEquals(stored, formula.val);
        }
        case 'star': {
            for (const { h1, h2 } of splits(heap)) {
                if (satisfies(formula.left, h1, val) && satisfies(formula.right, h2, val)) {
                    return true;
                }
            }
            return false;
        }
        case 'magicWand': {
            // P -* Q : ∀ h'. (h ⊥ h' ∧ h' ⊨ P) → (h ⊎ h') ⊨ Q
            // Acotado a sub-heaps relevantes vía un universo de direcciones.
            const universe = collectAddresses(formula.left, heap, val);
            for (const candidate of enumerateHeapsOver(universe, heap, formula.left, val)) {
                if (!disjoint(heap, candidate))
                    continue;
                if (!satisfies(formula.left, candidate, val))
                    continue;
                const merged = combine(heap, candidate);
                if (merged === null)
                    continue;
                if (!satisfies(formula.right, merged, val))
                    return false;
            }
            return true;
        }
        case 'pure':
            return formula.predicate(val);
        case 'and':
            return satisfies(formula.left, heap, val) && satisfies(formula.right, heap, val);
        case 'or':
            return satisfies(formula.left, heap, val) || satisfies(formula.right, heap, val);
        case 'implies':
            return !satisfies(formula.left, heap, val) || satisfies(formula.right, heap, val);
        case 'not':
            return !satisfies(formula.body, heap, val);
        case 'exists': {
            // Acotado al universo de valores presentes en el heap y la valuación
            // más null. Para semántica computable necesitamos un dominio finito.
            for (const v of finiteValueDomain(heap, val)) {
                if (satisfies(formula.body, heap, bind(val, formula.bind, v)))
                    return true;
            }
            return false;
        }
        case 'forall': {
            for (const v of finiteValueDomain(heap, val)) {
                if (!satisfies(formula.body, heap, bind(val, formula.bind, v)))
                    return false;
            }
            return true;
        }
    }
}
/** Dominio finito de valores observables: direcciones del heap + valores
 * en la valuación + null. Permite cuantificar de forma computable. */
function finiteValueDomain(heap, val) {
    const seen = new Map();
    const push = (v) => {
        seen.set(valueKey(v), v);
    };
    push(nullVal());
    for (const loc of heap.domain()) {
        push(addrVal(loc));
        const stored = heap.read(loc);
        if (stored !== undefined)
            push(stored);
    }
    for (const name of Object.keys(val)) {
        const bound = val[name];
        if (bound !== undefined)
            push(bound);
    }
    return [...seen.values()];
}
/** Direcciones candidatas para extender el heap al evaluar `-*`. */
function collectAddresses(_left, heap, val) {
    const seen = new Set();
    for (const loc of heap.domain())
        seen.add(loc);
    for (const name of Object.keys(val)) {
        const bound = val[name];
        if (bound && bound.kind === 'addr')
            seen.add(bound.loc);
    }
    // Sembramos algunas direcciones frescas para que `-*` pueda probar con
    // un heap extensión no trivial sin explotar combinatoriamente.
    const maxLoc = Math.max(0, ...seen);
    for (let i = 1; i <= 2; i++)
        seen.add(maxLoc + i);
    return [...seen].sort((a, b) => a - b);
}
/** Enumera heaps pequeños sobre `universe` cuyas direcciones no estén ya
 * en `existing`. Usa los valores observables como contenido. Cota dura
 * para no estallar: máximo 3 ubicaciones nuevas. */
function* enumerateHeapsOver(universe, existing, leftFormula, val) {
    const candidates = universe.filter((loc) => !existing.has(loc));
    const maxExtra = Math.min(3, candidates.length);
    const values = finiteValueDomain(existing, val);
    // Recortar dominio: si la fórmula izquierda es `emp`, sólo importa el heap vacío.
    if (leftFormula.kind === 'emp') {
        yield newHeap();
        return;
    }
    // 0 .. maxExtra direcciones, cada una con cualquier valor.
    for (let size = 0; size <= maxExtra; size++) {
        yield* enumerateSubset(candidates, 0, size, [], values);
    }
}
function* enumerateSubset(pool, start, remaining, acc, values) {
    if (remaining === 0) {
        yield fromMap(acc);
        return;
    }
    for (let i = start; i <= pool.length - remaining; i++) {
        const loc = pool[i];
        for (const v of values) {
            acc.push([loc, v]);
            yield* enumerateSubset(pool, i + 1, remaining - 1, acc, values);
            acc.pop();
        }
    }
}
/** Ejecuta un único comando de forma small-step. */
function executeCommand(cmd, heap, val) {
    switch (cmd.kind) {
        case 'skip':
            return { ok: true, heap, val, fault: false };
        case 'assign': {
            if (cmd.variable === undefined || cmd.value === undefined) {
                return { ok: false, heap, val, fault: false, reason: 'assign sin variable/valor' };
            }
            return { ok: true, heap, val: bind(val, cmd.variable, cmd.value), fault: false };
        }
        case 'alloc': {
            if (cmd.variable === undefined) {
                return { ok: false, heap, val, fault: false, reason: 'alloc sin variable destino' };
            }
            const initial = cmd.value ?? intVal(0);
            const freshLoc = freshAddress(heap);
            const heap1 = heap.write(freshLoc, initial);
            const val1 = bind(val, cmd.variable, addrVal(freshLoc));
            return { ok: true, heap: heap1, val: val1, fault: false };
        }
        case 'free': {
            const target = cmd.location === undefined ? undefined : val[cmd.location];
            if (target === undefined) {
                return { ok: false, heap, val, fault: false, reason: 'free sobre variable no ligada' };
            }
            const loc = asLoc(target);
            if (loc === null || !heap.has(loc)) {
                return { ok: false, heap, val, fault: true, reason: 'free: memory fault' };
            }
            return { ok: true, heap: heap.delete(loc), val, fault: false };
        }
        case 'load': {
            if (cmd.variable === undefined || cmd.location === undefined) {
                return { ok: false, heap, val, fault: false, reason: 'load sin variable/location' };
            }
            const target = val[cmd.location];
            const loc = target === undefined ? null : asLoc(target);
            if (loc === null || !heap.has(loc)) {
                return { ok: false, heap, val, fault: true, reason: 'load: memory fault' };
            }
            const stored = heap.read(loc);
            return { ok: true, heap, val: bind(val, cmd.variable, stored), fault: false };
        }
        case 'store': {
            if (cmd.location === undefined || cmd.value === undefined) {
                return { ok: false, heap, val, fault: false, reason: 'store sin location/valor' };
            }
            const target = val[cmd.location];
            const loc = target === undefined ? null : asLoc(target);
            if (loc === null || !heap.has(loc)) {
                return { ok: false, heap, val, fault: true, reason: 'store: memory fault' };
            }
            return { ok: true, heap: heap.write(loc, cmd.value), val, fault: false };
        }
    }
}
/** Devuelve la primera dirección libre del heap (estrategia bumper). */
function freshAddress(heap) {
    let loc = 1;
    while (heap.has(loc))
        loc++;
    return loc;
}
/** Verifica una tripla `{P} c {Q}` por muestreo finito: enumera modelos
 * (heap, val) que satisfagan P, los ejecuta y comprueba Q sobre el
 * estado final. Devuelve `valid: false` con contraejemplo al primer
 * fallo. No es completo — es una verificación de testing/random. */
function checkTriple(triple, options = {}) {
    const samples = options.samples ?? 32;
    const seed = options.seed ?? 0xc0ffee;
    const rng = makeLcg(seed);
    const pool = [];
    if (options.candidates)
        pool.push(...options.candidates);
    for (let i = 0; i < samples; i++)
        pool.push(randomModel(rng));
    let checked = 0;
    for (const { heap, val } of pool) {
        if (!satisfies(triple.pre, heap, val))
            continue;
        checked++;
        const result = executeCommand(triple.cmd, heap, val);
        if (!result.ok) {
            return {
                valid: false,
                counterexample: {
                    heap,
                    val,
                    reason: `comando inválido: ${result.reason ?? 'unknown'}`,
                },
                modelsChecked: checked,
            };
        }
        if (result.fault) {
            return {
                valid: false,
                counterexample: { heap, val, reason: 'memory fault al ejecutar' },
                modelsChecked: checked,
            };
        }
        if (!satisfies(triple.post, result.heap, result.val)) {
            return {
                valid: false,
                counterexample: {
                    heap,
                    val,
                    reason: 'postcondición no satisfecha tras ejecución',
                },
                modelsChecked: checked,
            };
        }
    }
    return { valid: true, modelsChecked: checked };
}
function makeLcg(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}
function randomModel(rng) {
    const size = Math.floor(rng() * 4); // 0..3 celdas
    const entries = [];
    const used = new Set();
    for (let i = 0; i < size; i++) {
        let loc = 1 + Math.floor(rng() * 5);
        while (used.has(loc))
            loc++;
        used.add(loc);
        entries.push([loc, randomValue(rng)]);
    }
    const heap = fromMap(entries);
    const val = {};
    // x apunta al primer slot si hay alguno
    if (entries.length > 0) {
        const first = entries[0];
        if (first)
            val.x = addrVal(first[0]);
    }
    else {
        val.x = nullVal();
    }
    return { heap, val };
}
function randomValue(rng) {
    const choice = Math.floor(rng() * 3);
    if (choice === 0)
        return intVal(Math.floor(rng() * 10));
    if (choice === 1)
        return nullVal();
    return addrVal(1 + Math.floor(rng() * 5));
}
// ── Predicados inductivos ───────────────────────────────────
/** `ls(x, y)` — list-segment de x a y. Definido por:
 *   ls(x, y) ≡ (x = y ∧ emp) ∨ ∃z. (x ↦ z * ls(z, y))
 *
 * Para mantener semántica computable, se interpreta directamente sobre
 * el heap: existe una cadena de celdas desde `start` a `end` cuyos
 * contenidos son punteros, sin ciclos ni celdas extra. */
function isListSegment(start, end, heap) {
    if (valueEquals(start, end))
        return heap.size() === 0;
    if (start.kind !== 'addr')
        return false;
    const visited = new Set();
    const path = [];
    let cur = start;
    while (!valueEquals(cur, end)) {
        if (cur.kind !== 'addr')
            return false;
        if (visited.has(cur.loc))
            return false; // ciclo
        if (!heap.has(cur.loc))
            return false;
        visited.add(cur.loc);
        path.push(cur.loc);
        const next = heap.read(cur.loc);
        cur = next;
    }
    // El heap debe ser exactamente las celdas del path — nada más.
    if (heap.size() !== path.length)
        return false;
    return true;
}
/** Predicado SL para list-segment `ls(start, end)`. Se evalúa como
 * predicado puro sobre el heap (cumple `satisfies`). */
function listSegment(start, end) {
    // Encapsulamos la semántica inductiva en un `pure` que internamente
    // mira el heap mediante closure. Para ello expandimos a una fórmula
    // compuesta con un truco: usamos una macro que, al evaluarse, hace la
    // verificación directa. Construimos un nodo `pure` con expresión
    // descriptiva pero la verdad real la calcula la función externa via
    // `isListSegment` — exponemos por separado `satisfiesShape`.
    // Para participar de la semántica `satisfies` declaramos un nodo
    // estructural: ls(start, end).
    return {
        kind: 'pure',
        expression: `ls(${valueToString(start)}, ${valueToString(end)})`,
        predicate: () => {
            // El predicado puro no conoce el heap. La forma correcta de usar
            // `ls` es vía `satisfiesShape` o vía la combinación predicado +
            // helper externo. Devolvemos true como placeholder para que
            // `pure` no rechace por sí solo.
            return true;
        },
    };
}
/** Evalúa una fórmula con soporte de predicados inductivos sobre forma de
 * heap (ls, tree). Se usa cuando la fórmula contiene `listSegment` o
 * `tree` — `satisfies` solo no basta porque su rama `pure` ignora el heap. */
function satisfiesShape(formula, heap, val) {
    if (formula.kind === 'pure') {
        const lsMatch = formula.expression.match(/^ls\((.+),\s*(.+)\)$/);
        if (lsMatch) {
            const start = parseValueLit(lsMatch[1], val);
            const end = parseValueLit(lsMatch[2], val);
            if (start === null || end === null)
                return false;
            return isListSegment(start, end, heap);
        }
        const treeMatch = formula.expression.match(/^tree\((.+)\)$/);
        if (treeMatch) {
            const root = parseValueLit(treeMatch[1], val);
            if (root === null)
                return false;
            return isTree(root, heap);
        }
        return formula.predicate(val);
    }
    if (formula.kind === 'star') {
        for (const { h1, h2 } of splits(heap)) {
            if (satisfiesShape(formula.left, h1, val) && satisfiesShape(formula.right, h2, val)) {
                return true;
            }
        }
        return false;
    }
    if (formula.kind === 'and') {
        return satisfiesShape(formula.left, heap, val) && satisfiesShape(formula.right, heap, val);
    }
    if (formula.kind === 'or') {
        return satisfiesShape(formula.left, heap, val) || satisfiesShape(formula.right, heap, val);
    }
    if (formula.kind === 'not') {
        return !satisfiesShape(formula.body, heap, val);
    }
    return satisfies(formula, heap, val);
}
function parseValueLit(s, val) {
    const trimmed = s.trim();
    if (trimmed === 'null')
        return nullVal();
    if (trimmed.startsWith('&')) {
        const n = Number.parseInt(trimmed.slice(1), 10);
        if (Number.isNaN(n))
            return null;
        return addrVal(n);
    }
    if (val[trimmed] !== undefined) {
        return val[trimmed];
    }
    const asInt = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(asInt))
        return intVal(asInt);
    return null;
}
/** `tree(root)` — el heap representa un árbol binario con raíz `root`.
 *   tree(x) ≡ (x = null ∧ emp) ∨ ∃l, r. (x ↦ l * x.next ↦ r * tree(l) * tree(r))
 *
 * Modelo simplificado: cada nodo ocupa 2 celdas consecutivas
 * (loc, loc+1) con los punteros izquierdo y derecho.
 */
function tree(root) {
    return {
        kind: 'pure',
        expression: `tree(${valueToString(root)})`,
        predicate: () => true,
    };
}
/** Comprueba si `heap` representa un árbol binario con raíz `root` (nodos de 2 celdas contiguas). */
function isTree(root, heap) {
    if (root.kind === 'null')
        return heap.size() === 0;
    if (root.kind !== 'addr')
        return false;
    const visited = new Set();
    function walk(node) {
        if (node.kind === 'null')
            return { ok: true, locs: [] };
        if (node.kind !== 'addr')
            return { ok: false, locs: [] };
        if (visited.has(node.loc))
            return { ok: false, locs: [] };
        if (!heap.has(node.loc) || !heap.has(node.loc + 1)) {
            return { ok: false, locs: [] };
        }
        visited.add(node.loc);
        visited.add(node.loc + 1);
        const left = heap.read(node.loc);
        const right = heap.read(node.loc + 1);
        const lr = walk(left);
        if (!lr.ok)
            return { ok: false, locs: [] };
        const rr = walk(right);
        if (!rr.ok)
            return { ok: false, locs: [] };
        return { ok: true, locs: [node.loc, node.loc + 1, ...lr.locs, ...rr.locs] };
    }
    const result = walk(root);
    if (!result.ok)
        return false;
    return result.locs.length === heap.size();
}
// ── Frame rule (helper) ──────────────────────────────────────
/** Frame rule: si `{P} c {Q}` y `c` no modifica las variables libres de
 * `R`, entonces `{P * R} c {Q * R}`. Esta función construye la tripla
 * compuesta — la validación queda a cargo de `checkTriple`. */
function frame(triple, frameFormula) {
    return {
        pre: (0, exports.star)(triple.pre, frameFormula),
        cmd: triple.cmd,
        post: (0, exports.star)(triple.post, frameFormula),
    };
}
// ── Re-exports y constructores convenientes ─────────────────
/** Constructores convenientes para `SLCommand` (skip, assign, alloc, free, load, store). */
exports.Cmd = {
    skip: () => ({ kind: 'skip' }),
    assign: (variable, value) => ({
        kind: 'assign',
        variable,
        value,
    }),
    alloc: (variable, value) => ({
        kind: 'alloc',
        variable,
        ...(value !== undefined ? { value } : {}),
    }),
    free: (location) => ({ kind: 'free', location }),
    load: (variable, location) => ({
        kind: 'load',
        variable,
        location,
    }),
    store: (location, value) => ({
        kind: 'store',
        location,
        value,
    }),
};
//# sourceMappingURL=index.js.map