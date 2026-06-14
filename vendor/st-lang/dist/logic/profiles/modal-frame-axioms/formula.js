"use strict";
// ============================================================
// Helpers de fórmulas modales
// ============================================================
//
// La estructura {@link ModalFormula} admite tanto campos
// específicos (`arg`, `left`, `right`) como un `args` n-ario para
// flexibilidad. Aquí se normaliza el acceso: las funciones de
// extracción aceptan ambos formatos y los constructores producen
// la forma canónica con campos específicos (+ `args` espejo).
Object.defineProperty(exports, "__esModule", { value: true });
exports.subRight = exports.subLeft = exports.subUnary = exports.diamond = exports.box = exports.implies = exports.or = exports.and = exports.not = exports.atom = void 0;
exports.formulaKey = formulaKey;
exports.formulaEquals = formulaEquals;
exports.formulaToString = formulaToString;
exports.collectAtoms = collectAtoms;
// ------------------------------------------------------------
// Acceso normalizado a subfórmulas
// ------------------------------------------------------------
function unary(f) {
    if (f.arg)
        return f.arg;
    if (f.args && f.args[0])
        return f.args[0];
    throw new Error(`ModalFormula ${f.kind} sin subfórmula`);
}
function binLeft(f) {
    if (f.left)
        return f.left;
    if (f.args && f.args[0])
        return f.args[0];
    throw new Error(`ModalFormula ${f.kind} sin lado izquierdo`);
}
function binRight(f) {
    if (f.right)
        return f.right;
    if (f.args && f.args[1])
        return f.args[1];
    throw new Error(`ModalFormula ${f.kind} sin lado derecho`);
}
// ------------------------------------------------------------
// Constructores ergonómicos
// ------------------------------------------------------------
/** Crea un átomo proposicional modal. */
const atom = (name) => ({ kind: 'atom', name });
exports.atom = atom;
/** Negación: ¬φ. */
const not = (arg) => ({ kind: 'not', arg, args: [arg] });
exports.not = not;
/** Conjunción: φ ∧ ψ. */
const and = (left, right) => ({
    kind: 'and',
    left,
    right,
    args: [left, right],
});
exports.and = and;
/** Disyunción: φ ∨ ψ. */
const or = (left, right) => ({
    kind: 'or',
    left,
    right,
    args: [left, right],
});
exports.or = or;
/** Implicación: φ → ψ. */
const implies = (left, right) => ({
    kind: 'implies',
    left,
    right,
    args: [left, right],
});
exports.implies = implies;
/** Operador □ (necesidad / box): □φ. */
const box = (arg) => ({ kind: 'box', arg, args: [arg] });
exports.box = box;
/** Operador ◇ (posibilidad / diamond): ◇φ. */
const diamond = (arg) => ({
    kind: 'diamond',
    arg,
    args: [arg],
});
exports.diamond = diamond;
// ------------------------------------------------------------
// Clave / igualdad / representación
// ------------------------------------------------------------
/**
 * Clave sintáctica determinista para deduplicación.
 */
function formulaKey(f) {
    switch (f.kind) {
        case 'atom':
            return `A(${f.name ?? '?'})`;
        case 'not':
            return `N(${formulaKey(unary(f))})`;
        case 'box':
            return `B(${formulaKey(unary(f))})`;
        case 'diamond':
            return `D(${formulaKey(unary(f))})`;
        case 'and':
            return `&(${formulaKey(binLeft(f))},${formulaKey(binRight(f))})`;
        case 'or':
            return `|(${formulaKey(binLeft(f))},${formulaKey(binRight(f))})`;
        case 'implies':
            return `>(${formulaKey(binLeft(f))},${formulaKey(binRight(f))})`;
    }
}
/** Igualdad sintáctica entre dos fórmulas modales. */
function formulaEquals(a, b) {
    return formulaKey(a) === formulaKey(b);
}
/** Renderiza una fórmula modal en notación textual (¬, ∧, ∨, →, □, ◇). */
function formulaToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name ?? '?';
        case 'not': {
            const inner = unary(f);
            if (inner.kind === 'atom')
                return `¬${formulaToString(inner)}`;
            return `¬(${formulaToString(inner)})`;
        }
        case 'box':
            return `□${parens(unary(f))}`;
        case 'diamond':
            return `◇${parens(unary(f))}`;
        case 'and':
            return `(${formulaToString(binLeft(f))} ∧ ${formulaToString(binRight(f))})`;
        case 'or':
            return `(${formulaToString(binLeft(f))} ∨ ${formulaToString(binRight(f))})`;
        case 'implies':
            return `(${formulaToString(binLeft(f))} → ${formulaToString(binRight(f))})`;
    }
}
function parens(f) {
    if (f.kind === 'atom')
        return formulaToString(f);
    if (f.kind === 'box' || f.kind === 'diamond')
        return formulaToString(f);
    return `(${formulaToString(f)})`;
}
// ------------------------------------------------------------
// Átomos
// ------------------------------------------------------------
/** Recolecta todos los nombres de átomos proposicionales que aparecen en `f`. */
function collectAtoms(f, out = new Set()) {
    switch (f.kind) {
        case 'atom':
            if (f.name)
                out.add(f.name);
            return out;
        case 'not':
        case 'box':
        case 'diamond':
            return collectAtoms(unary(f), out);
        case 'and':
        case 'or':
        case 'implies':
            collectAtoms(binLeft(f), out);
            return collectAtoms(binRight(f), out);
    }
}
// Acceso público a las extracciones normalizadas (útil para
// el motor de tableau y tests).
exports.subUnary = unary;
exports.subLeft = binLeft;
exports.subRight = binRight;
//# sourceMappingURL=formula.js.map