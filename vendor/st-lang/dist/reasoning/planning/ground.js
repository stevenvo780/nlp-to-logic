"use strict";
// ============================================================
// ST Planning — Grounding y aplicación de acciones
// ============================================================
//
// "Grounding" = instanciar un action schema lifted (con ?vars) a
// una acción concreta sobre objetos del dominio.
//
// Ejemplo:
//   schema:   move(?from, ?to) pre: at(?from)  add: at(?to)  del: at(?from)
//   binding:  { '?from': 'a', '?to': 'b' }
//   ground:   pre: at(a)  add: at(b)  del: at(a)
//
// La sustitución es textual: reemplazamos ?from → a en cada string
// del schema. Usamos boundary `(?[A-Za-z_][A-Za-z0-9_]*)` para no
// pisar variables que comparten prefijo (`?x` vs `?xy`).
Object.defineProperty(exports, "__esModule", { value: true });
exports.substituteVars = substituteVars;
exports.ground = ground;
exports.applyAction = applyAction;
exports.preconditionsSatisfied = preconditionsSatisfied;
exports.goalSatisfied = goalSatisfied;
exports.groundAll = groundAll;
/**
 * Sustituye variables `?var` por sus valores ligados en una cadena.
 * Si la variable no está en bindings, se deja como está (permite
 * grounding parcial / debugging).
 */
function substituteVars(text, bindings) {
    // Match ?<ident> donde ident es [A-Za-z_][A-Za-z0-9_-]*.
    return text.replace(/\?([A-Za-z_][A-Za-z0-9_-]*)/g, (match, name) => {
        const key = `?${name}`;
        if (Object.prototype.hasOwnProperty.call(bindings, key)) {
            return bindings[key];
        }
        return match;
    });
}
/**
 * Aplica un binding a un schema y devuelve una acción ground.
 *
 * No valida que el binding cubra todos los parámetros: lo que falte
 * queda con `?var` en el string (caller's responsibility validar).
 */
function ground(action, bindings) {
    const pre = new Set();
    const add = new Set();
    const del = new Set();
    for (const p of action.preconditions)
        pre.add(substituteVars(p, bindings));
    for (const a of action.addList)
        add.add(substituteVars(a, bindings));
    for (const d of action.delList)
        del.add(substituteVars(d, bindings));
    return { preconditions: pre, addList: add, delList: del };
}
/**
 * Aplica una acción ground a un estado, devolviendo un nuevo estado.
 *
 * Convención STRIPS estándar: primero se borran los hechos en delList,
 * luego se añaden los de addList. Si un hecho está en ambos, el
 * resultado neto es "añadido" (delete antes que add).
 *
 * NO valida preconditions — esa verificación se hace en el planner
 * antes de invocar applyAction. (Permite usarlo para forward search
 * sin redundancia.)
 */
function applyAction(state, grounded) {
    const next = new Set(state);
    for (const d of grounded.delList)
        next.delete(d);
    for (const a of grounded.addList)
        next.add(a);
    return next;
}
/**
 * Chequea si un estado satisface las preconditions de una acción
 * ground (todas presentes).
 */
function preconditionsSatisfied(state, preconditions) {
    for (const p of preconditions) {
        if (!state.has(p))
            return false;
    }
    return true;
}
/**
 * Chequea si un estado satisface el goal (goal ⊆ state).
 */
function goalSatisfied(state, goal) {
    for (const g of goal) {
        if (!state.has(g))
            return false;
    }
    return true;
}
/**
 * Enumera el producto cartesiano de objetos para los parámetros de
 * una acción y devuelve TODAS las acciones ground posibles.
 *
 * Si el dominio tiene tipos en `objects`, por simplicidad enumeramos
 * sobre `flatObjects = union(values of objects)`. Quien necesite
 * tipos más finos puede pre-filtrar las acciones ground devueltas.
 *
 * Para |params|=2 con |objs|=10 → 100 acciones ground por schema. Es
 * fácil que esto explote, así que el planner aplica `preconditionsSatisfied`
 * como filtro early y typically la mayoría se podan.
 */
function groundAll(action, objects) {
    // Universo plano de objetos disponibles.
    const allObjects = [];
    const seen = new Set();
    for (const vals of Object.values(objects)) {
        for (const v of vals) {
            if (!seen.has(v)) {
                seen.add(v);
                allObjects.push(v);
            }
        }
    }
    if (action.parameters.length === 0) {
        return [{ bindings: {}, grounded: ground(action, {}) }];
    }
    // Producto cartesiano iterativo.
    const results = [];
    const indices = Array.from({ length: action.parameters.length }, () => 0);
    const total = allObjects.length;
    if (total === 0)
        return [];
    while (true) {
        const bindings = {};
        for (let i = 0; i < action.parameters.length; i++) {
            const param = action.parameters[i];
            const idx = indices[i];
            bindings[param] = allObjects[idx];
        }
        results.push({ bindings, grounded: ground(action, bindings) });
        // Avanzar al siguiente combo (ripple).
        let k = action.parameters.length - 1;
        while (k >= 0) {
            const cur = indices[k] + 1;
            if (cur < total) {
                indices[k] = cur;
                break;
            }
            indices[k] = 0;
            k--;
        }
        if (k < 0)
            break;
    }
    return results;
}
//# sourceMappingURL=ground.js.map