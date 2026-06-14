"use strict";
// ============================================================
// ST Types — Todos los tipos base del lenguaje
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormula = isFormula;
const FORMULA_KIND_SET = new Set([
    'atom',
    'list',
    'not',
    'and',
    'or',
    'implies',
    'biconditional',
    'forall',
    'exists',
    'predicate',
    'equals',
    'modal_necessity',
    'modal_possibility',
    'temporal_next',
    'temporal_until',
    'nand',
    'nor',
    'xor',
    'true',
    'false',
    'number',
    'add',
    'subtract',
    'multiply',
    'divide',
    'modulo',
    'less',
    'greater',
    'less_eq',
    'greater_eq',
    'fn_call',
]);
function isFormula(value) {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    if (typeof candidate.kind !== 'string')
        return false;
    return FORMULA_KIND_SET.has(candidate.kind);
}
//# sourceMappingURL=index.js.map