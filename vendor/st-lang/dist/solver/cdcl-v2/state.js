"use strict";
// Estado compartido del solver CDCL v2.
// Una "Clause" es un Int32Array de literales DIMACS (var positiva = true, negativa = false).
// Var IDs son 1-indexados. Literal `l` se mapea a índice de watch list mediante
// litToIdx(l, numVars).
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_ANTECEDENT = exports.NO_CONFLICT = void 0;
exports.litToIdx = litToIdx;
exports.idxToLit = idxToLit;
/** Resultado de propagar: -1 si todo OK, o índice de cláusula en conflicto. */
exports.NO_CONFLICT = -1;
/** Sentinela de "sin antecedente" (variable decidida o forzada por preprocessing). */
exports.NO_ANTECEDENT = -1;
/** Convierte literal DIMACS a índice de watch list (rango 0..2*numVars-1). */
function litToIdx(lit, numVars) {
    return lit > 0 ? lit - 1 : numVars + -lit - 1;
}
/** Inversa de litToIdx — útil sólo para debugging. */
function idxToLit(idx, numVars) {
    return idx < numVars ? idx + 1 : -(idx - numVars + 1);
}
//# sourceMappingURL=state.js.map