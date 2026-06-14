"use strict";
// ============================================================
// ST Description Logic — Negation Normal Form & hashing
// ============================================================
// Empuja ¬ hasta los átomos. Tras NNF:
//   - kind 'not' SOLO envuelve 'atomic'.
//   - 'top' / 'bottom' nunca aparecen bajo 'not' (se simplifican).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNNF = toNNF;
exports.conceptHash = conceptHash;
exports.conceptEqual = conceptEqual;
exports.conceptToString = conceptToString;
const types_1 = require("./types");
function toNNF(c) {
    switch (c.kind) {
        case 'top':
        case 'bottom':
            return c;
        case 'atomic':
            return c;
        case 'and':
            return (0, types_1.and)(...(c.args || []).map(toNNF));
        case 'or':
            return (0, types_1.or)(...(c.args || []).map(toNNF));
        case 'exists':
            if (!c.role || !c.arg)
                throw new Error('exists sin rol o argumento');
            return (0, types_1.exists)(c.role, toNNF(c.arg));
        case 'forall':
            if (!c.role || !c.arg)
                throw new Error('forall sin rol o argumento');
            return (0, types_1.forall)(c.role, toNNF(c.arg));
        case 'not':
            return pushNot(c.arg);
    }
}
function pushNot(inner) {
    if (!inner)
        throw new Error('not sin argumento');
    switch (inner.kind) {
        case 'top':
            return types_1.BOTTOM;
        case 'bottom':
            return types_1.TOP;
        case 'atomic':
            return (0, types_1.not)(inner);
        case 'not':
            // doble negación
            return toNNF(inner.arg);
        case 'and':
            // ¬(C ⊓ D) = ¬C ⊔ ¬D
            return (0, types_1.or)(...(inner.args || []).map((a) => pushNot(a)));
        case 'or':
            // ¬(C ⊔ D) = ¬C ⊓ ¬D
            return (0, types_1.and)(...(inner.args || []).map((a) => pushNot(a)));
        case 'exists':
            // ¬∃R.C = ∀R.¬C
            if (!inner.role)
                throw new Error('exists sin rol');
            return (0, types_1.forall)(inner.role, pushNot(inner.arg));
        case 'forall':
            // ¬∀R.C = ∃R.¬C
            if (!inner.role)
                throw new Error('forall sin rol');
            return (0, types_1.exists)(inner.role, pushNot(inner.arg));
    }
}
/**
 * Hash canónico de un concepto. Dos conceptos sintácticamente iguales
 * (módulo orden de hijos en and/or) producen el mismo hash.
 */
function conceptHash(c) {
    switch (c.kind) {
        case 'top':
            return 'T';
        case 'bottom':
            return 'F';
        case 'atomic':
            return `A:${c.name || '?'}`;
        case 'not':
            return `!(${conceptHash(c.arg)})`;
        case 'and': {
            const parts = (c.args || []).map(conceptHash).sort();
            return `&(${parts.join(',')})`;
        }
        case 'or': {
            const parts = (c.args || []).map(conceptHash).sort();
            return `|(${parts.join(',')})`;
        }
        case 'exists':
            return `E:${c.role || '?'}(${conceptHash(c.arg)})`;
        case 'forall':
            return `V:${c.role || '?'}(${conceptHash(c.arg)})`;
    }
}
function conceptEqual(a, b) {
    return conceptHash(a) === conceptHash(b);
}
/**
 * Render legible para tracing / mensajes.
 */
function conceptToString(c) {
    switch (c.kind) {
        case 'top':
            return '⊤';
        case 'bottom':
            return '⊥';
        case 'atomic':
            return c.name || '?';
        case 'not':
            return `¬${conceptToString(c.arg)}`;
        case 'and':
            return `(${(c.args || []).map(conceptToString).join(' ⊓ ')})`;
        case 'or':
            return `(${(c.args || []).map(conceptToString).join(' ⊔ ')})`;
        case 'exists':
            return `∃${c.role || '?'}.${conceptToString(c.arg)}`;
        case 'forall':
            return `∀${c.role || '?'}.${conceptToString(c.arg)}`;
    }
}
//# sourceMappingURL=nnf.js.map