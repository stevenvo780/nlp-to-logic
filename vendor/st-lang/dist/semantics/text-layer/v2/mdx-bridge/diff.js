"use strict";
/**
 * MDX diff — detecta qué claims cambiaron entre dos versiones de un MDX.
 *
 * Algoritmo:
 *   1. Parsear ambas versiones a Claim[] (ignorando bloques malformados).
 *   2. Indexar por id.
 *   3. added   = ids en `after` que no estaban en `before`.
 *      removed = ids en `before` que ya no están en `after`.
 *      modified = ids en ambos cuyos campos lógicos difieren.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffMDX = void 0;
const parser_1 = require("./parser");
const sortedDeps = (deps) => [...deps].sort();
/**
 * Compara dos Claim por igualdad lógica (id, formula, profile, dependencies
 * como conjunto). Ignora `source` y campos extra.
 */
const claimsEqual = (a, b) => {
    if (a.id !== b.id)
        return false;
    if (a.formula !== b.formula)
        return false;
    if (a.profile !== b.profile)
        return false;
    const da = sortedDeps(a.dependencies);
    const db = sortedDeps(b.dependencies);
    if (da.length !== db.length)
        return false;
    for (let i = 0; i < da.length; i++) {
        if (da[i] !== db[i])
            return false;
    }
    return true;
};
const diffMDX = (before, after) => {
    const beforeClaims = (0, parser_1.mdxToClaims)(before).map(parser_1.stripMDXMetadata);
    const afterClaims = (0, parser_1.mdxToClaims)(after).map(parser_1.stripMDXMetadata);
    const beforeById = new Map();
    for (const c of beforeClaims)
        beforeById.set(c.id, c);
    const afterById = new Map();
    for (const c of afterClaims)
        afterById.set(c.id, c);
    const added = [];
    const removed = [];
    const modified = [];
    for (const [id, afterC] of afterById) {
        const beforeC = beforeById.get(id);
        if (!beforeC) {
            added.push(afterC);
        }
        else if (!claimsEqual(beforeC, afterC)) {
            modified.push({ id, before: beforeC, after: afterC });
        }
    }
    for (const id of beforeById.keys()) {
        if (!afterById.has(id))
            removed.push(id);
    }
    // Determinismo por id.
    added.sort((a, b) => a.id.localeCompare(b.id));
    removed.sort();
    modified.sort((a, b) => a.id.localeCompare(b.id));
    return { added, removed, modified };
};
exports.diffMDX = diffMDX;
//# sourceMappingURL=diff.js.map