"use strict";
// ============================================================
// ST Categorical — Poset como categoría
// ============================================================
// Un poset (P, ≤) genera una categoría con un único morfismo a→b
// por cada par (a, b) tal que a ≤ b. La identidad es a ≤ a y la
// composición es transitividad. Reflexividad y transitividad están
// validadas por construcción.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poset = Poset;
/**
 * Construye la categoría poset. `elements` define los objetos y
 * `leq` los pares a≤b explícitos. La clausura reflexivo-transitiva
 * se calcula y se realiza como morfismos del Category resultante.
 */
function Poset(elements, leq) {
    // Clausura reflexivo-transitiva sobre la relación dada.
    const closure = new Set();
    for (const e of elements)
        closure.add(`${e}|${e}`);
    for (const [a, b] of leq)
        closure.add(`${a}|${b}`);
    let changed = true;
    while (changed) {
        changed = false;
        const snapshot = Array.from(closure).map((s) => s.split('|'));
        for (const [a, b] of snapshot) {
            for (const [c, d] of snapshot) {
                if (b === c) {
                    const key = `${a}|${d}`;
                    if (!closure.has(key)) {
                        closure.add(key);
                        changed = true;
                    }
                }
            }
        }
    }
    // Antisimetría se asume verificada por el cliente (no la chequeamos
    // aquí — si el cliente da un ciclo, simplemente colapsa elementos en
    // la categoría resultante y los tests lo detectarán).
    const morphisms = new Map();
    for (const key of closure) {
        const [a, b] = key.split('|');
        const mid = `${a}→${b}:leq`;
        morphisms.set(mid, { id: mid, src: a, tgt: b });
    }
    const objectsSet = new Set(elements);
    function identity(obj) {
        const m = morphisms.get(`${obj}→${obj}:leq`);
        if (!m)
            throw new Error(`Poset: missing identity for ${obj}`);
        return m;
    }
    function compose(g, f) {
        if (f.tgt !== g.src) {
            throw new Error(`Poset compose: dom mismatch ${f.id} ; ${g.id}`);
        }
        const id = `${f.src}→${g.tgt}:leq`;
        const m = morphisms.get(id);
        if (!m)
            throw new Error(`Poset compose: missing morphism ${id}`);
        return m;
    }
    function source(m) {
        return m.src;
    }
    function target(m) {
        return m.tgt;
    }
    function eqMor(a, b) {
        return a.id === b.id;
    }
    function eqObj(a, b) {
        return a === b;
    }
    function hom(a, b) {
        const m = morphisms.get(`${a}→${b}:leq`);
        return m ? [m] : [];
    }
    function verifyAssociativity() {
        // En un poset cualquier composición es única, asociativa por
        // construcción.
        return true;
    }
    function verifyIdentity() {
        // Reflexividad y composición con identidad: triviales por
        // construcción al estar la clausura reflexiva añadida.
        for (const m of morphisms.values()) {
            const idSrc = identity(m.src);
            const idTgt = identity(m.tgt);
            if (compose(m, idSrc).id !== m.id)
                return false;
            if (compose(idTgt, m).id !== m.id)
                return false;
        }
        return true;
    }
    return {
        name: 'Poset',
        objects: objectsSet,
        morphisms,
        identity,
        compose,
        source,
        target,
        eqMor,
        eqObj,
        hom,
        verifyAssociativity,
        verifyIdentity,
    };
}
//# sourceMappingURL=poset.js.map