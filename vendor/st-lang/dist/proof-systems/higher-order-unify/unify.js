"use strict";
// ============================================================
// Higher-order unification — Algoritmo de unificación Miller
// ============================================================
//
// Implementa el fragmento de patrón de la unificación de orden superior.
// Referencia: Dale Miller, "A Logic Programming Language with Lambda
// Abstraction, Function Variables, and Simple Unification", 1991.
//
// Garantías del fragmento de patrón:
//   - Decidible (siempre termina).
//   - Unicidad: si existe unificador, existe un único MGU (most general
//     unifier) módulo α-equivalencia.
//
// Manejo de terms no-patrón:
//   Los pares que involucran meta-variables aplicadas a no-variables o
//   variables repetidas/libres se rechazan (retornan null) para mantener
//   la decidibilidad. Ver `isPattern` en pattern.ts.
Object.defineProperty(exports, "__esModule", { value: true });
exports.unifyPattern = unifyPattern;
exports.buildLambdaBinding = buildLambdaBinding;
exports.unifyMetaApp = unifyMetaApp;
const normalize_1 = require("./normalize");
const pattern_1 = require("./pattern");
// Unifica dos HOTerms usando el algoritmo de patrón Miller.
// Devuelve la sustitución de meta-variables (MGU) o null si no unifican.
function unifyPattern(t1, t2) {
    const subst = {};
    const ok = unify((0, normalize_1.normalize)(t1), (0, normalize_1.normalize)(t2), subst, new Map(), new Map());
    return ok ? subst : null;
}
// Función recursiva de unificación.
// `envL` / `envR` mapean nombres de variables ligadas a índices de De Bruijn
// para comparación α-invariante de variables ligadas.
function unify(t1, t2, subst, envL, envR) {
    // Expandir meta-variables si ya tienen binding
    const s1 = deref(t1, subst);
    const s2 = deref(t2, subst);
    // Ambas son meta iguales sin binding → trivialmente iguales
    if (s1.kind === 'meta' && s2.kind === 'meta' && s1.name === s2.name)
        return true;
    // Meta del lado izquierdo
    if (s1.kind === 'meta') {
        return bindMeta(s1.name, s2, subst, envR);
    }
    // Meta del lado derecho
    if (s2.kind === 'meta') {
        return bindMeta(s2.name, s1, subst, envL);
    }
    // Variables libres/ligadas
    if (s1.kind === 'var' && s2.kind === 'var') {
        const i1 = envL.get(s1.name);
        const i2 = envR.get(s2.name);
        if (i1 !== undefined && i2 !== undefined)
            return i1 === i2; // ambas ligadas
        if (i1 === undefined && i2 === undefined)
            return s1.name === s2.name; // ambas libres
        return false; // una ligada, una libre
    }
    // Abstracciones: introducir binder fresco para comparación
    if (s1.kind === 'abs' && s2.kind === 'abs') {
        const idx = envL.size; // índice único para este nivel de ligado
        const newEnvL = new Map(envL);
        newEnvL.set(s1.param, idx);
        const newEnvR = new Map(envR);
        newEnvR.set(s2.param, idx);
        return unify(s1.body, s2.body, subst, newEnvL, newEnvR);
    }
    // Aplicaciones: detectar el caso Miller (meta aplicada a vars ligadas)
    if (s1.kind === 'app' || s2.kind === 'app') {
        const f1 = s1.kind === 'app' ? flatHead(s1) : { fn: s1, args: [] };
        const f2 = s2.kind === 'app' ? flatHead(s2) : { fn: s2, args: [] };
        // Caso Miller: meta en cabeza de una app
        // Verificamos la condición de patrón: args deben ser variables ligadas distintas
        if (f1.fn.kind === 'meta' && f1.fn !== f2.fn) {
            if (!isMetaPatternApp(f1.args, envL))
                return false;
            return bindMetaApp(f1.fn.name, f1.args, s2, subst, envL, envR);
        }
        if (f2.fn.kind === 'meta' && f2.fn !== f1.fn) {
            if (!isMetaPatternApp(f2.args, envR))
                return false;
            return bindMetaApp(f2.fn.name, f2.args, s1, subst, envR, envL);
        }
        // Caso rigid-rigid: ambas cabezas son constructores concretos
        if (s1.kind === 'app' && s2.kind === 'app') {
            if (!unify(f1.fn, f2.fn, subst, envL, envR))
                return false;
            if (f1.args.length !== f2.args.length)
                return false;
            for (let i = 0; i < f1.args.length; i++) {
                if (!unify(f1.args[i], f2.args[i], subst, envL, envR))
                    return false;
            }
            return true;
        }
    }
    return false; // kinds distintos, no se unifican
}
// Verifica que los args de una app con cabeza meta son todas variables
// ligadas y distintas (condición de patrón Miller).
function isMetaPatternApp(args, env) {
    const seen = new Set();
    for (const a of args) {
        if (a.kind !== 'var')
            return false;
        const idx = env.get(a.name);
        if (idx === undefined)
            return false; // variable libre, no ligada
        if (seen.has(idx))
            return false; // repetida
        seen.add(idx);
    }
    return true;
}
// Resuelve el caso Miller: metaName aplicado a [y₁…yₙ] (vars ligadas distintas)
// debe unificar con `rhs`. Construye M ↦ λy₁…yₙ. rhs' donde rhs' es rhs
// expresado en términos de los parámetros formales.
// envMeta es el entorno del lado donde vive la meta; envRhs es el del rhs.
function bindMetaApp(metaName, metaArgs, rhs, subst, envMeta, envRhs) {
    // Los parámetros formales de la lambda que vamos a construir son
    // los nombres reales de las vars ligadas (de izquierda a derecha).
    const params = metaArgs.map((a) => a.name);
    // Para construir el binding correcto de M, necesitamos reescribir `rhs`
    // sustituyendo las variables del envRhs que corresponden a los params
    // de envMeta por los mismos nombres que usaremos en la lambda.
    // En el caso más simple (mismo conjunto de binders) es la identidad.
    // Construimos: M ↦ λp₁…pₙ. rhs_reescrito
    const lambda = buildLambdaForMeta(params, rhs, envMeta, envRhs);
    if (lambda === null)
        return false;
    // Occurs check
    if (metaOccurs(metaName, lambda, subst))
        return false;
    subst[metaName] = lambda;
    return true;
}
// Construye λp₁…pₙ. body donde body es `rhs` con las variables ligadas
// de envRhs que tienen el mismo índice que los params en envMeta
// renombradas a p₁…pₙ.
function buildLambdaForMeta(params, rhs, envMeta, envRhs) {
    // Mapeamos índices de De Bruijn del meta → nombre de param formal
    const idxToParam = new Map();
    for (const p of params) {
        const idx = envMeta.get(p);
        if (idx === undefined)
            return null;
        idxToParam.set(idx, p);
    }
    // Renombramos en rhs las variables ligadas cuyos índices correspondan
    // a los parámetros de la meta.
    const body = renameByIndex(rhs, envRhs, idxToParam);
    if (body === null)
        return null;
    // Construir λp₁. λp₂. … body
    let result = body;
    for (let i = params.length - 1; i >= 0; i--) {
        result = { kind: 'abs', param: params[i], body: result };
    }
    return result;
}
// Renombra las variables libres de `t` (en el sentido de `env`) que tienen
// un índice en `idxToParam` con el nombre param correspondiente.
// Devuelve null si alguna variable ligada del scope local no está en
// idxToParam (implicaría que rhs menciona una variable local que no es
// argumento del meta → escapa de scope).
function renameByIndex(t, env, idxToParam) {
    switch (t.kind) {
        case 'meta':
            return t;
        case 'var': {
            const idx = env.get(t.name);
            if (idx === undefined)
                return t; // variable libre del objeto-lenguaje: OK
            const param = idxToParam.get(idx);
            if (param === undefined)
                return null; // ligada local no en scope del meta: escapa
            return { kind: 'var', name: param };
        }
        case 'abs': {
            // El param del abs introduce un índice nuevo; no lo incluimos en env
            // (o usamos un índice negativo para "más interno")
            const newEnv = new Map(env);
            // Damos un índice fresco negativo para indicar "ligada más internamente"
            // que todas las del contexto actual → nunca está en idxToParam.
            const innerIdx = -(newEnv.size + 1);
            newEnv.set(t.param, innerIdx);
            const b = renameByIndex(t.body, newEnv, idxToParam);
            if (b === null)
                return null;
            return { kind: 'abs', param: t.param, body: b };
        }
        case 'app': {
            const fn = renameByIndex(t.fn, env, idxToParam);
            if (fn === null)
                return null;
            const args = [];
            for (const a of t.args) {
                const a2 = renameByIndex(a, env, idxToParam);
                if (a2 === null)
                    return null;
                args.push(a2);
            }
            return { kind: 'app', fn, args };
        }
    }
}
// Aplana app anidadas para facilitar comparación cabeza-argumentos.
function flatHead(t) {
    if (t.kind !== 'app')
        return { fn: t, args: [] };
    const inner = flatHead(t.fn);
    return { fn: inner.fn, args: [...inner.args, ...t.args] };
}
// Expande una meta-variable si tiene binding en subst.
function deref(t, subst) {
    if (t.kind === 'meta') {
        const binding = subst[t.name];
        if (binding !== undefined)
            return deref((0, normalize_1.normalize)((0, normalize_1.applyHOSubst)(binding, subst)), subst);
    }
    return t;
}
// Intenta ligar la meta-variable `metaName` al término `value`.
// `env` es el entorno de variables ligadas del lado donde vive `value`.
function bindMeta(metaName, value, subst, env) {
    // Occurs check: la meta no puede aparecer en su propio binding
    if (metaOccurs(metaName, value, subst))
        return false;
    // Verificar que el valor es un pattern en el contexto dado
    // (necesitamos reconstruir el scope de variables ligadas desde `env`)
    const boundScope = new Set(env.keys());
    if (!(0, pattern_1.isPattern)(value, boundScope))
        return false;
    // El binding debe ser cerrado: las variables libres del valor deben
    // estar disponibles en el scope del meta (conservador: aceptamos si
    // las FV son todas libres en el objeto-lenguaje, no ligadas locales
    // que no estarán en scope del meta).
    // Para el fragmento de patrón el check de scope es:
    //   FV(value) ∩ bound_vars_local = ∅ (variables ligadas localmente
    //   no pueden escapar a través del meta).
    // En nuestro caso `env` contiene exactamente las variables ligadas del
    // lado donde nace `value`; las FV del value que NO están en `env` son
    // variables libres del objeto-lenguaje, que sí pueden aparecer en el
    // binding del meta.
    const fv = (0, normalize_1.freeVarsHO)(value);
    for (const v of fv) {
        if (env.has(v))
            return false; // variable ligada local escapa → rechazar
    }
    subst[metaName] = value;
    return true;
}
// ¿La meta `name` aparece (directa o transitivamente) en `t`?
function metaOccurs(name, t, subst) {
    switch (t.kind) {
        case 'var':
            return false;
        case 'meta': {
            if (t.name === name)
                return true;
            const binding = subst[t.name];
            return binding !== undefined ? metaOccurs(name, binding, subst) : false;
        }
        case 'abs':
            return metaOccurs(name, t.body, subst);
        case 'app':
            if (metaOccurs(name, t.fn, subst))
                return true;
            for (const a of t.args) {
                if (metaOccurs(name, a, subst))
                    return true;
            }
            return false;
    }
}
// ---- Utilidad: proyección inversa para meta aplicada a variables ----
//
// Cuando se une M[y₁…yₙ] ≈ body (pattern case), el MGU es
//   M ↦ λy₁…yₙ. body
// Esta función construye ese lambda dado el binding encontrado.
function buildLambdaBinding(params, body, avoidNames) {
    // Usamos los params tal cual; si hay conflictos de nombres en body,
    // la sustitución capture-avoiding de applyHOSubst se encarga.
    let result = body;
    for (let i = params.length - 1; i >= 0; i--) {
        const p = params[i];
        result = { kind: 'abs', param: p, body: result };
    }
    void avoidNames; // reservado para extensión
    return result;
}
// Unifica M aplicada a variables ligadas con un cuerpo.
// Caso central del fragmento Miller: (M y₁ … yₙ) ≈ body
// donde yᵢ son variables ligadas distintas.
// Retorna HOSubst con M ↦ λy₁…yₙ. body, o null si no es patrón.
function unifyMetaApp(metaName, boundVars, body) {
    // Verificar que boundVars son distintos
    if (new Set(boundVars).size !== boundVars.length)
        return null;
    // Construir la abstracción
    const avoid = (0, normalize_1.allNamesHO)(body);
    const lambda = buildLambdaBinding(boundVars, body, avoid);
    return { [metaName]: lambda };
}
//# sourceMappingURL=unify.js.map