"use strict";
// ============================================================
// ST Categorical — FinSet
// ============================================================
// Categoría de conjuntos finitos (representados como objetos
// nombrados con su carrier explícito) y funciones totales entre
// ellos. Los morfismos llevan un mapa `fn: Map<string,string>`
// para que la igualdad e identidad sean computables.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkFinSetMor = mkFinSetMor;
exports.FinSet = FinSet;
/**
 * Construye un morfismo en FinSet validando que `fn` cubra
 * todos los elementos del dominio y que sus imágenes vivan en el
 * codominio. Lanza si el cliente intenta crear una función parcial
 * o con valores fuera de tgt.
 */
function mkFinSetMor(name, src, tgt, table) {
    const fn = new Map();
    const tgtSet = new Set(tgt.elements);
    const tableMap = table instanceof Map
        ? table
        : new Map(Object.entries(table));
    for (const x of src.elements) {
        const y = tableMap.get(x);
        if (y === undefined) {
            throw new Error(`FinSet morphism ${name}: missing image for ${x} ∈ ${src.name}`);
        }
        if (!tgtSet.has(y)) {
            throw new Error(`FinSet morphism ${name}: image ${y} of ${x} not in target ${tgt.name}`);
        }
        fn.set(x, y);
    }
    return {
        id: `${src.name}→${tgt.name}:${name}`,
        src: src.name,
        tgt: tgt.name,
        fn,
    };
}
/**
 * Construye FinSet sobre un conjunto explícito de objetos y morfismos.
 * Cierra automáticamente bajo identidades y composiciones (transitive
 * closure) para que `verifyAssociativity` no falle por morfismos
 * intermedios faltantes.
 *
 * `maxClosureSteps` limita la expansión por seguridad cuando la
 * categoría tiene ciclos densos; default 4 es suficiente para
 * todos los tests del módulo.
 */
function FinSet(objs, generators = [], maxClosureSteps = 4) {
    const objsByName = new Map(objs.map((o) => [o.name, o]));
    const morphisms = new Map();
    const objectsSet = new Set(objs);
    function getObj(name) {
        const o = objsByName.get(name);
        if (!o)
            throw new Error(`FinSet: unknown object ${name}`);
        return o;
    }
    function addMor(m) {
        const existing = morphisms.get(m.id);
        if (existing)
            return existing;
        morphisms.set(m.id, m);
        return m;
    }
    // identidades
    for (const o of objs) {
        const fn = new Map();
        for (const x of o.elements)
            fn.set(x, x);
        addMor({ id: `${o.name}→${o.name}:id`, src: o.name, tgt: o.name, fn });
    }
    for (const g of generators)
        addMor(g);
    // composición concreta (no necesita la categoría)
    function rawCompose(g, f) {
        if (f.tgt !== g.src) {
            throw new Error(`FinSet compose: dom mismatch ${f.id} ; ${g.id}`);
        }
        const src = getObj(f.src);
        const tgt = getObj(g.tgt);
        const fn = new Map();
        for (const x of src.elements) {
            const fx = f.fn.get(x);
            if (fx === undefined)
                throw new Error(`FinSet compose: missing image for ${x} under ${f.id}`);
            const gfx = g.fn.get(fx);
            if (gfx === undefined)
                throw new Error(`FinSet compose: missing image for ${fx} under ${g.id}`);
            fn.set(x, gfx);
        }
        // El nombre canónico de la composición es g∘f. Si ese morfismo
        // ya está registrado con otro nombre y misma tabla, lo reusamos
        // para que la igualdad sea robusta.
        const candidate = {
            id: `${src.name}→${tgt.name}:${g.id.split(':').pop()}∘${f.id.split(':').pop()}`,
            src: src.name,
            tgt: tgt.name,
            fn,
        };
        // ¿Ya existe un morfismo con misma tabla? -> reutilizar id
        for (const existing of morphisms.values()) {
            if (existing.src === candidate.src &&
                existing.tgt === candidate.tgt &&
                tablesEqual(existing.fn, fn)) {
                return existing;
            }
        }
        morphisms.set(candidate.id, candidate);
        return candidate;
    }
    // Cierre por composición acotado
    for (let step = 0; step < maxClosureSteps; step++) {
        const snapshot = Array.from(morphisms.values());
        let added = false;
        for (const f of snapshot) {
            for (const g of snapshot) {
                if (f.tgt !== g.src)
                    continue;
                const before = morphisms.size;
                rawCompose(g, f);
                if (morphisms.size > before)
                    added = true;
            }
        }
        if (!added)
            break;
    }
    function identity(obj) {
        const idMor = morphisms.get(`${obj.name}→${obj.name}:id`);
        if (idMor === undefined)
            throw new Error(`FinSet: missing identity for ${obj.name}`);
        return idMor;
    }
    function compose(g, f) {
        return rawCompose(g, f);
    }
    function source(m) {
        return getObj(m.src);
    }
    function target(m) {
        return getObj(m.tgt);
    }
    function eqMor(a, b) {
        if (a.src !== b.src || a.tgt !== b.tgt)
            return false;
        return tablesEqual(a.fn, b.fn);
    }
    function eqObj(a, b) {
        return a.name === b.name;
    }
    function hom(a, b) {
        const out = [];
        for (const m of morphisms.values()) {
            if (m.src === a.name && m.tgt === b.name)
                out.push(m);
        }
        return out;
    }
    function verifyAssociativity(sample = 50) {
        const ms = Array.from(morphisms.values());
        let checked = 0;
        for (const f of ms) {
            for (const g of ms) {
                if (g.src !== f.tgt)
                    continue;
                for (const h of ms) {
                    if (h.src !== g.tgt)
                        continue;
                    // (h∘g)∘f === h∘(g∘f)
                    const left = compose(compose(h, g), f);
                    const right = compose(h, compose(g, f));
                    if (!eqMor(left, right))
                        return false;
                    if (++checked >= sample)
                        return true;
                }
            }
        }
        return true;
    }
    function verifyIdentity(sample = 50) {
        const ms = Array.from(morphisms.values());
        let checked = 0;
        for (const f of ms) {
            const idSrc = identity(getObj(f.src));
            const idTgt = identity(getObj(f.tgt));
            if (!eqMor(compose(f, idSrc), f))
                return false;
            if (!eqMor(compose(idTgt, f), f))
                return false;
            if (++checked >= sample)
                return true;
        }
        return true;
    }
    return {
        name: 'FinSet',
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
function tablesEqual(a, b) {
    if (a.size !== b.size)
        return false;
    for (const [k, v] of a) {
        if (b.get(k) !== v)
            return false;
    }
    return true;
}
//# sourceMappingURL=fin-set.js.map