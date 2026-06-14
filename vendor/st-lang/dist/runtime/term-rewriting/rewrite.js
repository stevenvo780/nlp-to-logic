"use strict";
// ============================================================
// ST Term Rewriting — Reescritura y normalización
// ============================================================
//
// Aplicación de reglas l → r sobre un término t.
//
// Estrategia: leftmost-outermost. Se recorre t en pre-order;
// para cada subtérmino se intenta match contra el LHS de alguna
// regla. El primer match gana. Esto es suficiente para sistemas
// confluentes (todas las estrategias llegan a la misma FN), y
// para los terminantes garantiza progreso.
//
// `normalize` itera `rewriteStep` hasta punto fijo o hasta
// `maxSteps` (default 10_000) — la cota evita ciclos cuando el
// sistema no es terminante.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteStep = rewriteStep;
exports.normalize = normalize;
exports.allPositions = allPositions;
exports.subtermAt = subtermAt;
exports.replaceAt = replaceAt;
const term_utils_1 = require("./term-utils");
/**
 * Cota de tamaño máximo del término durante normalización.
 *
 * Si el sistema no es terminante, el término puede crecer sin parar
 * y aún antes de agotar `maxSteps` puede agotar la pila al recorrer.
 * Esta cota corta el bucle cuando el término supera un tamaño "absurdo"
 * (rara vez un término legítimo de KB supera ~10k nodos en teorías
 * pequeñas).
 */
const MAX_TERM_SIZE = 5000;
/**
 * Intenta aplicar exactamente un paso de reescritura.
 *
 * Devuelve el término reducido o null si no hay redex.
 *
 * Política de selección:
 *   - Recorre t en pre-order (raíz primero, luego argumentos).
 *   - Para cada nodo prueba las reglas en orden.
 *   - El primer match aplica.
 */
function rewriteStep(t, rules) {
    // Iterativo: busca el redex outermost-leftmost recorriendo el
    // árbol en pre-order con stack explícito. Cuando encuentra un
    // redex, replaceAt reconstruye el árbol con la sustitución.
    const found = findRedex(t, rules);
    if (found === null)
        return null;
    return replaceAt(t, found.position, found.replacement);
}
/**
 * Búsqueda del primer redex en pre-order (outermost-leftmost).
 * Iterativo para soportar términos profundos.
 */
function findRedex(t, rules) {
    // Stack de (node, position) en orden de DFS pre-order.
    const stack = [{ node: t, pos: [] }];
    while (stack.length > 0) {
        const frame = stack.pop();
        if (frame === undefined)
            break;
        const { node, pos } = frame;
        // Intentar reglas en este nodo.
        for (const rule of rules) {
            const subst = (0, term_utils_1.match)(rule.lhs, node);
            if (subst !== null) {
                return { position: pos, replacement: (0, term_utils_1.applySubst)(rule.rhs, subst) };
            }
        }
        // Si no hay match, push children en orden inverso para que el
        // leftmost (índice 0) se procese primero al pop.
        if (node.kind === 'func') {
            for (let i = node.args.length - 1; i >= 0; i--) {
                const child = node.args[i];
                if (child === undefined)
                    continue;
                stack.push({ node: child, pos: [...pos, i] });
            }
        }
    }
    return null;
}
/**
 * Normaliza t aplicando reglas hasta punto fijo.
 *
 * @param maxSteps  Cota de seguridad para sistemas no terminantes.
 *                  Si se excede, devuelve el último estado alcanzado.
 *
 * Nota: la confluencia se asume responsabilidad del caller — si el
 * TRS no es confluente, distintas estrategias pueden dar distintas
 * FN. Acá fijamos leftmost-outermost.
 */
function normalize(t, rules, maxSteps = 10000) {
    let current = t;
    for (let i = 0; i < maxSteps; i++) {
        // Guard contra divergencia: si el término supera MAX_TERM_SIZE
        // asumimos que el sistema no es terminante en esta dirección
        // y devolvemos el último estado.
        if ((0, term_utils_1.termSize)(current) > MAX_TERM_SIZE)
            return current;
        const next = rewriteStep(current, rules);
        if (next === null)
            return current;
        current = next;
    }
    return current;
}
/**
 * Lista todas las posiciones (caminos) en t. Una posición es un
 * array de índices: [] = raíz, [0] = primer argumento, [0, 1] =
 * segundo argumento del primer argumento, etc.
 *
 * Útil para enumerar redexes y para calcular critical pairs.
 */
function allPositions(t, prefix = []) {
    // Iterativo, BFS por orden estable (raíz, luego hijos en orden 0..n).
    const out = [];
    const queue = [{ node: t, pos: prefix.slice() }];
    while (queue.length > 0) {
        const head = queue.shift();
        if (head === undefined)
            break;
        out.push(head.pos);
        if (head.node.kind === 'func') {
            for (let i = 0; i < head.node.args.length; i++) {
                const a = head.node.args[i];
                if (a === undefined)
                    continue;
                queue.push({ node: a, pos: [...head.pos, i] });
            }
        }
    }
    return out;
}
/**
 * Obtiene el subtérmino en la posición indicada.
 * Devuelve null si la posición no existe.
 */
function subtermAt(t, pos) {
    let cur = t;
    for (const idx of pos) {
        if (cur.kind !== 'func')
            return null;
        const next = cur.args[idx];
        if (next === undefined)
            return null;
        cur = next;
    }
    return cur;
}
/**
 * Reemplaza el subtérmino en la posición indicada por `replacement`.
 *
 * Devuelve un término nuevo (sin mutar t). Si la posición no existe,
 * devuelve t sin cambios.
 */
function replaceAt(t, pos, replacement) {
    if (pos.length === 0)
        return replacement;
    // Caminamos hasta el nodo padre del target, luego reconstruimos
    // de vuelta. Iterativo.
    const path = [t];
    let cur = t;
    for (let i = 0; i < pos.length; i++) {
        if (cur.kind !== 'func')
            return t; // posición inválida
        const idx = pos[i];
        const child = cur.args[idx];
        if (child === undefined)
            return t;
        cur = child;
        path.push(cur);
    }
    // path[i] = nodo en profundidad i; path[len-1] = target a reemplazar.
    // Reconstruimos desde la hoja.
    let acc = replacement;
    for (let i = pos.length - 1; i >= 0; i--) {
        const parent = path[i];
        if (parent === undefined || parent.kind !== 'func')
            return t;
        const newArgs = parent.args.slice();
        newArgs[pos[i]] = acc;
        acc = { kind: 'func', name: parent.name, args: newArgs };
    }
    return acc;
}
//# sourceMappingURL=rewrite.js.map