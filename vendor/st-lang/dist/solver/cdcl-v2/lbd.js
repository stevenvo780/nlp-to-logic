"use strict";
// LBD (Literal Block Distance) — Audemard & Simon (2009) "Predicting Learnt
// Clauses Quality in Modern SAT Solvers" (Glucose). El LBD de una cláusula
// es la cantidad de niveles de decisión distintos representados por sus
// literales. Cláusulas con LBD bajo (especialmente LBD <= 2, "glue clauses")
// son los aprendizajes más útiles y nunca se descartan.
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeLBD = computeLBD;
exports.selectClausesToRemove = selectClausesToRemove;
/**
 * Calcula el LBD de una cláusula dado el nivel de decisión actual de cada
 * variable. Usa un buffer compartido `seenLevels` (reseteado internamente
 * cada llamada) para evitar allocaciones repetidas.
 *
 * Si una variable no está asignada (level = -1), no se cuenta.
 */
function computeLBD(clause, varLevel, seenBuffer) {
    // Buffer indexed by level + 1 (para tolerar -1).
    // El caller garantiza seenBuffer.length >= max nivel + 2.
    // Reseteamos sólo las posiciones que tocamos para mantener O(|clause|).
    const touched = [];
    let lbd = 0;
    for (let i = 0; i < clause.length; i++) {
        const v = Math.abs(clause[i] ?? 0);
        if (v === 0)
            continue;
        const lvl = varLevel[v];
        if (lvl < 0)
            continue;
        if (!seenBuffer[lvl]) {
            seenBuffer[lvl] = 1;
            touched.push(lvl);
            lbd++;
        }
    }
    for (const lvl of touched)
        seenBuffer[lvl] = 0;
    return lbd;
}
/**
 * Selecciona cláusulas a eliminar de un conjunto de aprendidas.
 *
 * Política: preservar siempre las "glue clauses" (LBD <= 2). Del resto,
 * ordenar por (lbd desc, activity asc, length desc) y eliminar la mitad
 * con menor utilidad. Cláusulas locked nunca se eliminan.
 *
 * Retorna los `index` (relativos a `metas`) a eliminar.
 */
function selectClausesToRemove(metas, lbdProtectThreshold = 2) {
    const candidates = [];
    for (const m of metas) {
        if (m.locked)
            continue;
        if (m.lbd <= lbdProtectThreshold)
            continue;
        if (m.length <= 2)
            continue;
        candidates.push(m);
    }
    if (candidates.length === 0)
        return [];
    candidates.sort((a, b) => {
        if (a.lbd !== b.lbd)
            return b.lbd - a.lbd;
        if (a.activity !== b.activity)
            return a.activity - b.activity;
        return b.length - a.length;
    });
    const half = Math.floor(candidates.length / 2);
    return candidates.slice(0, half).map((m) => m.index);
}
//# sourceMappingURL=lbd.js.map