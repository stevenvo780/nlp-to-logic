"use strict";
// ============================================================
// ST Universal Algebra — álgebras, homomorfismos, congruencias,
// álgebras libres (term algebras), teorías ecuacionales y
// variedades (Birkhoff).
// ============================================================
//
// Una *signatura* Σ es un conjunto de símbolos de operación con
// aridad. Un Σ-álgebra A = (A, (f^A)_{f∈Σ}) interpreta cada símbolo
// como una operación total sobre el carrier finito A.
//
// Construcciones implementadas:
//
//   - Verificación estructural: signatura bien formada, álgebra
//     cerrada bajo sus operaciones.
//   - Homomorfismos h : A → B preservan todas las operaciones
//     (h(f^A(a₁,…,aₙ)) = f^B(h(a₁),…,h(aₙ))). Cómputo de imagen y
//     kernel (relación de equivalencia inducida).
//   - Congruencias θ ⊆ A×A: equivalencia + compatibilidad con cada
//     operación. Álgebra cociente A/θ.
//   - Álgebra de términos T_Σ(X): álgebra libre sobre generadores X.
//     Substitución y reducción módulo un conjunto de ecuaciones
//     (term rewriting confluente para casos sencillos).
//   - Ecuaciones t₁ = t₂. Comprobación finita de si A ⊨ eq por
//     muestreo o enumeración exhaustiva (carrier pequeño).
//   - Variedades: A ∈ V(E) sii A satisface todas las ecuaciones
//     de E. Birkhoff caracteriza variedades como clases cerradas
//     bajo H, S, P (homomorphic image, subalgebras, products) —
//     no implementamos el checker completo, sí el test ecuacional.
//   - Signaturas y ecuaciones estándar: grupos, anillos, retículos,
//     abelianos.
//
// Igualdad de elementos del carrier: por defecto se usa Object.is.
// Las álgebras pueden definir su propio `eq` para soportar
// elementos estructurales (tuplas, conjuntos, términos).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSignature = isValidSignature;
exports.isAlgebra = isAlgebra;
exports.isHomomorphism = isHomomorphism;
exports.image = image;
exports.kernel = kernel;
exports.isCongruence = isCongruence;
exports.equivalenceClasses = equivalenceClasses;
exports.quotientAlgebra = quotientAlgebra;
exports.isVarTerm = isVarTerm;
exports.isOpTerm = isOpTerm;
exports.termToString = termToString;
exports.termEquals = termEquals;
exports.termSubstitute = termSubstitute;
exports.termAlgebra = termAlgebra;
exports.termEqualsModulo = termEqualsModulo;
exports.freeVars = freeVars;
exports.evalTerm = evalTerm;
exports.modelsEquation = modelsEquation;
exports.variety = variety;
exports.groupSignature = groupSignature;
exports.ringSignature = ringSignature;
exports.latticeSignature = latticeSignature;
exports.groupEquations = groupEquations;
exports.abelianEquations = abelianEquations;
exports.ringEquations = ringEquations;
exports.latticeEquations = latticeEquations;
exports.cyclicGroupAlgebra = cyclicGroupAlgebra;
exports.cyclicRingAlgebra = cyclicRingAlgebra;
exports._enumerateTuples = enumerateTuples;
exports.carrierIndex = carrierIndex;
const defaultEq = (a, b) => Object.is(a, b);
const eqOf = (A) => A.eq ?? defaultEq;
const contains = (xs, x, eq) => {
    for (const y of xs)
        if (eq(x, y))
            return true;
    return false;
};
const indexOfEq = (xs, x, eq) => {
    for (let i = 0; i < xs.length; i++)
        if (eq(xs[i], x))
            return i;
    return -1;
};
/**
 * Verifica que la signatura no tenga símbolos duplicados ni aridades
 * negativas.
 */
function isValidSignature(sig) {
    const seen = new Set();
    for (const op of sig.operations) {
        if (op.arity < 0)
            return false;
        if (seen.has(op.name))
            return false;
        seen.add(op.name);
    }
    return true;
}
/**
 * Verifica que `A` interpreta cada símbolo de su signatura y que
 * las operaciones son totales y cerradas sobre el carrier.
 *
 * Para aridad n, se enumeran |A|^n tuplas — usar sólo con carriers
 * finitos pequeños (n·|A|^aridad <= ~10⁶).
 */
function isAlgebra(A) {
    if (!isValidSignature(A.signature))
        return false;
    const eq = eqOf(A);
    for (const op of A.signature.operations) {
        const f = A.operations.get(op.name);
        if (!f)
            return false;
        // Enumeración de aridad-tuplas
        const tuples = enumerateTuples(A.carrier, op.arity);
        for (const tuple of tuples) {
            let result;
            try {
                result = f(...tuple);
            }
            catch {
                return false;
            }
            if (!contains(A.carrier, result, eq))
                return false;
        }
    }
    return true;
}
function enumerateTuples(carrier, arity) {
    if (arity === 0)
        return [[]];
    if (carrier.length === 0)
        return [];
    const out = [];
    const indices = new Array(arity).fill(0);
    const n = carrier.length;
    // Iteración estilo odómetro: |carrier|^arity tuplas.
    outer: while (true) {
        const tup = new Array(arity);
        for (let i = 0; i < arity; i++)
            tup[i] = carrier[indices[i]];
        out.push(tup);
        // incrementar
        for (let i = arity - 1; i >= 0; i--) {
            const cur = indices[i];
            if (cur + 1 < n) {
                indices[i] = cur + 1;
                continue outer;
            }
            indices[i] = 0;
            if (i === 0)
                break outer;
        }
        break;
    }
    return out;
}
/**
 * Verifica que `h` preserva todas las operaciones:
 *   h(f^A(a₁,…,aₙ)) = f^B(h(a₁),…,h(aₙ)) para toda tupla y operación f.
 *
 * Requiere signaturas idénticas en source y target (mismos nombres y
 * aridades).
 */
function isHomomorphism(h) {
    const { source, target, map } = h;
    if (!signaturesMatch(source.signature, target.signature))
        return false;
    const eqB = eqOf(target);
    for (const op of source.signature.operations) {
        const fA = source.operations.get(op.name);
        const fB = target.operations.get(op.name);
        if (!fA || !fB)
            return false;
        const tuples = enumerateTuples(source.carrier, op.arity);
        for (const tup of tuples) {
            const lhs = map(fA(...tup));
            const rhs = fB(...tup.map(map));
            if (!eqB(lhs, rhs))
                return false;
            if (!contains(target.carrier, lhs, eqB))
                return false;
        }
    }
    return true;
}
function signaturesMatch(a, b) {
    if (a.operations.length !== b.operations.length)
        return false;
    const bMap = new Map(b.operations.map((o) => [o.name, o.arity]));
    for (const op of a.operations) {
        const ar = bMap.get(op.name);
        if (ar !== op.arity)
            return false;
    }
    return true;
}
/**
 * Imagen de un homomorfismo: { h(a) : a ∈ A }, deduplicada por igualdad
 * del target.
 */
function image(h) {
    const eqB = eqOf(h.target);
    const out = [];
    for (const a of h.source.carrier) {
        const y = h.map(a);
        if (!contains(out, y, eqB))
            out.push(y);
    }
    return out;
}
/**
 * Kernel: relación de equivalencia ker h = { (a,b) : h(a) = h(b) }.
 * Devuelve sólo pares (a,b) con a ≠ b (incluyendo (b,a)); los reflexivos
 * son implícitos.
 */
function kernel(h) {
    const eqA = eqOf(h.source);
    const eqB = eqOf(h.target);
    const out = [];
    const xs = h.source.carrier;
    for (let i = 0; i < xs.length; i++) {
        for (let j = 0; j < xs.length; j++) {
            if (i === j)
                continue;
            const a = xs[i];
            const b = xs[j];
            if (eqA(a, b))
                continue;
            if (eqB(h.map(a), h.map(b)))
                out.push([a, b]);
        }
    }
    return out;
}
/**
 * θ es congruencia sii es:
 *   1) reflexiva   : (a,a) ∈ θ para todo a ∈ A
 *   2) simétrica   : (a,b) ∈ θ ⇒ (b,a) ∈ θ
 *   3) transitiva  : (a,b),(b,c) ∈ θ ⇒ (a,c) ∈ θ
 *   4) compatible  : (aᵢ,bᵢ) ∈ θ ⇒ (f(a₁,…,aₙ), f(b₁,…,bₙ)) ∈ θ
 *
 * La relación puede entregarse minimamente (sólo pares relevantes); aquí
 * se verifica el cierre completo asumiendo la relación dada.
 */
function isCongruence(c) {
    const A = c.algebra;
    const eq = eqOf(A);
    const related = (a, b) => {
        if (eq(a, b))
            return true;
        return c.relation.some(([x, y]) => eq(x, a) && eq(y, b));
    };
    // Reflexividad
    for (const a of A.carrier)
        if (!related(a, a))
            return false;
    // Simetría
    for (const [a, b] of c.relation)
        if (!related(b, a))
            return false;
    // Transitividad
    for (const [a, b] of c.relation) {
        for (const [c2, d] of c.relation) {
            if (eq(b, c2)) {
                if (!related(a, d))
                    return false;
            }
        }
    }
    // Compatibilidad con cada operación
    for (const op of A.signature.operations) {
        const f = A.operations.get(op.name);
        if (!f)
            return false;
        const tuplesA = enumerateTuples(A.carrier, op.arity);
        for (const aTup of tuplesA) {
            const bTup = enumerateTuples(A.carrier, op.arity);
            for (const bT of bTup) {
                let allRelated = true;
                for (let i = 0; i < op.arity; i++) {
                    if (!related(aTup[i], bT[i])) {
                        allRelated = false;
                        break;
                    }
                }
                if (!allRelated)
                    continue;
                if (!related(f(...aTup), f(...bT)))
                    return false;
            }
        }
    }
    return true;
}
/**
 * Calcula las clases de equivalencia inducidas por una relación
 * (asumida ya transitiva-y-simétrica; el módulo `isCongruence` valida
 * el caso). Cada clase es un T[] (en el orden del carrier).
 */
function equivalenceClasses(c) {
    const A = c.algebra;
    const eq = eqOf(A);
    const related = (a, b) => {
        if (eq(a, b))
            return true;
        return c.relation.some(([x, y]) => eq(x, a) && eq(y, b));
    };
    // Closure transitivo on-the-fly
    const reachable = (a) => {
        const cls = [a];
        const queue = [a];
        let head = 0;
        while (head < queue.length) {
            const cur = queue[head];
            head++;
            for (const x of A.carrier) {
                if (contains(cls, x, eq))
                    continue;
                if (related(cur, x) || related(x, cur)) {
                    cls.push(x);
                    queue.push(x);
                }
            }
        }
        return cls;
    };
    const classes = [];
    const seen = [];
    for (const a of A.carrier) {
        if (contains(seen, a, eq))
            continue;
        const cls = reachable(a);
        for (const x of cls)
            seen.push(x);
        classes.push(cls);
    }
    return classes;
}
/**
 * Álgebra cociente A/θ. El carrier son las clases de equivalencia; cada
 * operación se eleva representando la clase por su primer elemento.
 *
 * No verifica que la relación sea congruencia; usar `isCongruence` antes.
 */
function quotientAlgebra(c) {
    const A = c.algebra;
    const eq = eqOf(A);
    const classes = equivalenceClasses(c);
    const classOf = (x) => {
        for (const cls of classes)
            if (contains(cls, x, eq))
                return cls;
        throw new Error('quotientAlgebra: elemento fuera del carrier');
    };
    const ops = new Map();
    for (const opSym of A.signature.operations) {
        const f = A.operations.get(opSym.name);
        if (!f)
            throw new Error(`quotientAlgebra: operación ${opSym.name} sin implementación`);
        ops.set(opSym.name, (...args) => {
            const reps = args.map((cls) => cls[0]);
            return classOf(f(...reps));
        });
    }
    return {
        signature: A.signature,
        carrier: classes,
        operations: ops,
        eq: (cls1, cls2) => {
            if (cls1.length !== cls2.length)
                return false;
            // Las clases son canónicas (el primer representante encontrado en
            // `carrier`), por lo que basta comparar el primer elemento.
            return eq(cls1[0], cls2[0]);
        },
    };
}
function isVarTerm(t) {
    return 'var' in t;
}
function isOpTerm(t) {
    return 'op' in t;
}
function termToString(t) {
    if (isVarTerm(t))
        return t.var;
    if (t.args.length === 0)
        return t.op;
    return `${t.op}(${t.args.map(termToString).join(',')})`;
}
function termEquals(t1, t2) {
    if (isVarTerm(t1) && isVarTerm(t2))
        return t1.var === t2.var;
    if (isOpTerm(t1) && isOpTerm(t2)) {
        if (t1.op !== t2.op)
            return false;
        if (t1.args.length !== t2.args.length)
            return false;
        for (let i = 0; i < t1.args.length; i++) {
            if (!termEquals(t1.args[i], t2.args[i]))
                return false;
        }
        return true;
    }
    return false;
}
/**
 * Substitución t[x ↦ σ(x)]: reemplaza cada variable por su término.
 * Variables fuera de `sub` quedan intactas.
 */
function termSubstitute(t, sub) {
    if (isVarTerm(t)) {
        return Object.prototype.hasOwnProperty.call(sub, t.var) ? sub[t.var] : t;
    }
    return { op: t.op, args: t.args.map((a) => termSubstitute(a, sub)) };
}
/**
 * Álgebra de términos T_Σ(X) hasta profundidad `maxDepth`. Útil para
 * generar muestras del álgebra libre — el carrier completo es infinito
 * cuando hay operaciones de aridad ≥ 1.
 *
 * Por defecto `maxDepth=2`: incluye constantes, variables y un nivel
 * de aplicación.
 */
function termAlgebra(signature, generators, maxDepth = 2) {
    if (!isValidSignature(signature))
        throw new Error('termAlgebra: signatura inválida');
    // BFS por profundidad
    const seen = [];
    const eqTerm = (a, b) => termEquals(a, b);
    const push = (t) => {
        if (!contains(seen, t, eqTerm))
            seen.push(t);
    };
    // Profundidad 0: variables y constantes (aridad 0).
    for (const v of generators)
        push({ var: v });
    for (const op of signature.operations)
        if (op.arity === 0)
            push({ op: op.name, args: [] });
    let curLayerEnd = seen.length;
    for (let depth = 1; depth <= maxDepth; depth++) {
        const layerStart = curLayerEnd;
        const available = seen.slice(0, curLayerEnd);
        for (const op of signature.operations) {
            if (op.arity === 0)
                continue;
            const tuples = enumerateTuples(available, op.arity);
            for (const tup of tuples) {
                push({ op: op.name, args: tup });
            }
        }
        curLayerEnd = seen.length;
        if (layerStart === curLayerEnd)
            break;
    }
    const ops = new Map();
    for (const op of signature.operations) {
        ops.set(op.name, (...args) => ({ op: op.name, args }));
    }
    return {
        signature,
        carrier: seen,
        operations: ops,
        eq: eqTerm,
    };
}
/**
 * Comprueba si t1 y t2 son iguales módulo el conjunto de ecuaciones
 * `eqs`, aplicando reescritura ingenua hasta profundidad limitada.
 *
 * NO es decidible en general; este checker es una heurística para
 * casos pequeños: aplica cada ecuación en ambas direcciones desde t1
 * y t2 hasta `maxSteps` pasos buscando una forma común.
 */
function termEqualsModulo(t1, t2, eqs, maxSteps = 50) {
    if (termEquals(t1, t2))
        return true;
    const seen1 = [t1];
    const seen2 = [t2];
    const frontier1 = [t1];
    const frontier2 = [t2];
    for (let step = 0; step < maxSteps; step++) {
        const next1 = [];
        for (const t of frontier1) {
            for (const rewrite of rewriteOneStep(t, eqs)) {
                if (!contains(seen1, rewrite, termEquals)) {
                    seen1.push(rewrite);
                    next1.push(rewrite);
                    if (contains(seen2, rewrite, termEquals))
                        return true;
                }
            }
        }
        const next2 = [];
        for (const t of frontier2) {
            for (const rewrite of rewriteOneStep(t, eqs)) {
                if (!contains(seen2, rewrite, termEquals)) {
                    seen2.push(rewrite);
                    next2.push(rewrite);
                    if (contains(seen1, rewrite, termEquals))
                        return true;
                }
            }
        }
        if (next1.length === 0 && next2.length === 0)
            return false;
        frontier1.length = 0;
        frontier2.length = 0;
        frontier1.push(...next1);
        frontier2.push(...next2);
    }
    return false;
}
/**
 * Devuelve todas las reescrituras de un paso de `t` usando `eqs` en
 * ambas direcciones, intentando match en la raíz y en cada subtérmino.
 */
function rewriteOneStep(t, eqs) {
    const out = [];
    for (const [l, r] of eqs) {
        const m1 = matchTerm(l, t);
        if (m1)
            out.push(termSubstitute(r, m1));
        const m2 = matchTerm(r, t);
        if (m2)
            out.push(termSubstitute(l, m2));
    }
    // Recurse en subtérminos
    if (isOpTerm(t)) {
        for (let i = 0; i < t.args.length; i++) {
            const sub = t.args[i];
            const subResults = rewriteOneStep(sub, eqs);
            for (const s of subResults) {
                const newArgs = t.args.slice();
                newArgs[i] = s;
                out.push({ op: t.op, args: newArgs });
            }
        }
    }
    return out;
}
/**
 * Match de patrón: ¿hay σ tal que pattern[σ] ≡ term? Las variables del
 * pattern son los `var`. Lineal-de-izquierda-a-derecha; no chequea
 * occurs-check (innecesario para matching, sí para unificación).
 */
function matchTerm(pattern, term) {
    const sub = {};
    const go = (p, t) => {
        if (isVarTerm(p)) {
            const existing = sub[p.var];
            if (existing)
                return termEquals(existing, t);
            sub[p.var] = t;
            return true;
        }
        if (!isOpTerm(t))
            return false;
        if (p.op !== t.op)
            return false;
        if (p.args.length !== t.args.length)
            return false;
        for (let i = 0; i < p.args.length; i++) {
            if (!go(p.args[i], t.args[i]))
                return false;
        }
        return true;
    };
    return go(pattern, term) ? sub : null;
}
/**
 * Variables libres de un término (orden de aparición, deduplicadas).
 */
function freeVars(t) {
    const out = [];
    const go = (s) => {
        if (isVarTerm(s)) {
            if (!out.includes(s.var))
                out.push(s.var);
        }
        else {
            for (const a of s.args)
                go(a);
        }
    };
    go(t);
    return out;
}
/**
 * Evalúa un término en un álgebra dado un assignment de variables.
 */
function evalTerm(A, t, env) {
    if (isVarTerm(t)) {
        if (!Object.prototype.hasOwnProperty.call(env, t.var)) {
            throw new Error(`evalTerm: variable libre ${t.var} sin asignación`);
        }
        return env[t.var];
    }
    const f = A.operations.get(t.op);
    if (!f)
        throw new Error(`evalTerm: operación ${t.op} no implementada en el álgebra`);
    const args = t.args.map((a) => evalTerm(A, a, env));
    return f(...args);
}
/**
 * A ⊨ (t₁ = t₂): para todo assignment de variables libres, evalTerm
 * coincide. Si `samples` es positivo, sólo se prueban `samples` tuplas
 * aleatorias; si es 0 o undefined, se enumeran todas (|A|^k).
 */
function modelsEquation(A, eq, samples = 0) {
    const eqT = eqOf(A);
    const vars = Array.from(new Set([...freeVars(eq.left), ...freeVars(eq.right)]));
    if (vars.length === 0) {
        // No vars: ecuación cerrada
        try {
            return eqT(evalTerm(A, eq.left, {}), evalTerm(A, eq.right, {}));
        }
        catch {
            return false;
        }
    }
    if (samples > 0) {
        for (let s = 0; s < samples; s++) {
            const env = {};
            for (const v of vars) {
                const idx = Math.floor(Math.random() * A.carrier.length);
                env[v] = A.carrier[idx];
            }
            try {
                if (!eqT(evalTerm(A, eq.left, env), evalTerm(A, eq.right, env)))
                    return false;
            }
            catch {
                return false;
            }
        }
        return true;
    }
    // Enumeración exhaustiva
    const tuples = enumerateTuples(A.carrier, vars.length);
    for (const tup of tuples) {
        const env = {};
        for (let i = 0; i < vars.length; i++)
            env[vars[i]] = tup[i];
        try {
            if (!eqT(evalTerm(A, eq.left, env), evalTerm(A, eq.right, env)))
                return false;
        }
        catch {
            return false;
        }
    }
    return true;
}
/**
 * A pertenece a la variedad V(E) sii A satisface toda ecuación de E.
 *
 * Es la dirección "fácil" de Birkhoff: una variedad puede definirse
 * por ecuaciones, y la pertenencia se verifica ecuación-por-ecuación.
 * El recíproco (clases HSP son ecuacionalmente definibles) es el
 * contenido fuerte del teorema y no se chequea aquí.
 */
function variety(equations, A) {
    for (const eq of equations) {
        if (!modelsEquation(A, eq))
            return false;
    }
    return true;
}
// ============================================================
// Standard signatures and equational theories
// ============================================================
/**
 * Signatura de grupos en notación multiplicativa: e (constante),
 * inv (unaria), mul (binaria).
 */
function groupSignature() {
    return {
        operations: [
            { name: 'e', arity: 0 },
            { name: 'inv', arity: 1 },
            { name: 'mul', arity: 2 },
        ],
    };
}
/**
 * Signatura de anillos: 0, 1 (constantes), neg (unaria), add y mul (binarias).
 */
function ringSignature() {
    return {
        operations: [
            { name: 'zero', arity: 0 },
            { name: 'one', arity: 0 },
            { name: 'neg', arity: 1 },
            { name: 'add', arity: 2 },
            { name: 'mul', arity: 2 },
        ],
    };
}
/**
 * Signatura de retículos: join y meet (binarias).
 */
function latticeSignature() {
    return {
        operations: [
            { name: 'join', arity: 2 },
            { name: 'meet', arity: 2 },
        ],
    };
}
const v = (name) => ({ var: name });
const op = (name, ...args) => ({ op: name, args });
/**
 * Ecuaciones de grupo (notación multiplicativa, signatura `groupSignature`):
 *   - asociatividad de mul
 *   - identidad por izquierda y derecha
 *   - inverso por izquierda y derecha
 */
function groupEquations() {
    const x = v('x');
    const y = v('y');
    const z = v('z');
    const e = op('e');
    return [
        // (x·y)·z = x·(y·z)
        { left: op('mul', op('mul', x, y), z), right: op('mul', x, op('mul', y, z)) },
        // e·x = x
        { left: op('mul', e, x), right: x },
        // x·e = x
        { left: op('mul', x, e), right: x },
        // inv(x)·x = e
        { left: op('mul', op('inv', x), x), right: e },
        // x·inv(x) = e
        { left: op('mul', x, op('inv', x)), right: e },
    ];
}
/**
 * Ecuaciones adicionales para grupos abelianos: conmutatividad de mul.
 */
function abelianEquations() {
    const x = v('x');
    const y = v('y');
    return [...groupEquations(), { left: op('mul', x, y), right: op('mul', y, x) }];
}
/**
 * Ecuaciones de anillo conmutativo con unidad sobre `ringSignature`:
 * grupo abeliano por +, monoide conmutativo por ·, distributividad
 * bilateral.
 */
function ringEquations() {
    const x = v('x');
    const y = v('y');
    const z = v('z');
    const zero = op('zero');
    const one = op('one');
    return [
        // (x+y)+z = x+(y+z)
        { left: op('add', op('add', x, y), z), right: op('add', x, op('add', y, z)) },
        // 0+x = x
        { left: op('add', zero, x), right: x },
        // x+0 = x
        { left: op('add', x, zero), right: x },
        // neg(x)+x = 0
        { left: op('add', op('neg', x), x), right: zero },
        // x+neg(x) = 0
        { left: op('add', x, op('neg', x)), right: zero },
        // x+y = y+x
        { left: op('add', x, y), right: op('add', y, x) },
        // (x·y)·z = x·(y·z)
        { left: op('mul', op('mul', x, y), z), right: op('mul', x, op('mul', y, z)) },
        // 1·x = x
        { left: op('mul', one, x), right: x },
        // x·1 = x
        { left: op('mul', x, one), right: x },
        // x·(y+z) = x·y + x·z
        {
            left: op('mul', x, op('add', y, z)),
            right: op('add', op('mul', x, y), op('mul', x, z)),
        },
        // (x+y)·z = x·z + y·z
        {
            left: op('mul', op('add', x, y), z),
            right: op('add', op('mul', x, z), op('mul', y, z)),
        },
    ];
}
/**
 * Ecuaciones de retículo sobre `latticeSignature`: idempotencia,
 * conmutatividad, asociatividad y absorción para join y meet.
 */
function latticeEquations() {
    const x = v('x');
    const y = v('y');
    const z = v('z');
    return [
        // idempotencia
        { left: op('join', x, x), right: x },
        { left: op('meet', x, x), right: x },
        // conmutatividad
        { left: op('join', x, y), right: op('join', y, x) },
        { left: op('meet', x, y), right: op('meet', y, x) },
        // asociatividad
        { left: op('join', op('join', x, y), z), right: op('join', x, op('join', y, z)) },
        { left: op('meet', op('meet', x, y), z), right: op('meet', x, op('meet', y, z)) },
        // absorción
        { left: op('join', x, op('meet', x, y)), right: x },
        { left: op('meet', x, op('join', x, y)), right: x },
    ];
}
// ============================================================
// Construcciones canónicas: Z/nZ como Σ-grupo
// ============================================================
/**
 * Construye el álgebra cíclica Z/nZ en la signatura de grupo
 * (`groupSignature`), con `mul` interpretado como suma módulo n.
 */
function cyclicGroupAlgebra(n) {
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error('cyclicGroupAlgebra: n debe ser un entero positivo');
    }
    const carrier = [];
    for (let i = 0; i < n; i++)
        carrier.push(i);
    const ops = new Map();
    ops.set('e', () => 0);
    ops.set('inv', (a) => (n - a) % n);
    ops.set('mul', (a, b) => (a + b) % n);
    return {
        signature: groupSignature(),
        carrier,
        operations: ops,
    };
}
/**
 * Construye Z/nZ como anillo conmutativo con unidad. Para n=1 colapsa
 * al anillo trivial (0=1).
 */
function cyclicRingAlgebra(n) {
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error('cyclicRingAlgebra: n debe ser un entero positivo');
    }
    const carrier = [];
    for (let i = 0; i < n; i++)
        carrier.push(i);
    const ops = new Map();
    ops.set('zero', () => 0);
    ops.set('one', () => 1 % n);
    ops.set('neg', (a) => (n - a) % n);
    ops.set('add', (a, b) => (a + b) % n);
    ops.set('mul', (a, b) => (a * b) % n);
    return {
        signature: ringSignature(),
        carrier,
        operations: ops,
    };
}
/**
 * Calcula el `index` de un elemento en el carrier por la igualdad del
 * álgebra (Object.is o `eq` provisto). Devuelve -1 si no aparece.
 */
function carrierIndex(A, x) {
    return indexOfEq(A.carrier, x, eqOf(A));
}
//# sourceMappingURL=index.js.map