"use strict";
// ============================================================
// ST LTL-SAT — Tipos para el procedimiento de decisión de LTL
// ============================================================
// AST nativo de LTL para el decisor por tableau:
//   atom, not, and, or, X (next), F (eventually), G (globally),
//   U (until), R (release).
//
// La operación derivada W (weak until) se traduce a R en la
// normalización: φ W ψ ≡ ψ R (φ ∨ ψ) ≡ (G φ) ∨ (φ U ψ).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.implies = exports.weakUntil = exports.release = exports.until = exports.globally = exports.eventually = exports.next = exports.or = exports.and = exports.not = exports.atom = void 0;
exports.formulaToString = formulaToString;
exports.formulaKey = formulaKey;
// Constructores ergonómicos.
const atom = (name) => ({ kind: 'atom', name });
exports.atom = atom;
const not = (arg) => ({ kind: 'not', arg });
exports.not = not;
const and = (...args) => ({ kind: 'and', args });
exports.and = and;
const or = (...args) => ({ kind: 'or', args });
exports.or = or;
const next = (arg) => ({ kind: 'X', arg });
exports.next = next;
const eventually = (arg) => ({ kind: 'F', arg });
exports.eventually = eventually;
const globally = (arg) => ({ kind: 'G', arg });
exports.globally = globally;
const until = (left, right) => ({
    kind: 'U',
    left,
    right,
});
exports.until = until;
const release = (left, right) => ({
    kind: 'R',
    left,
    right,
});
exports.release = release;
// Weak until: φ W ψ ≡ (φ U ψ) ∨ G φ
const weakUntil = (left, right) => (0, exports.or)((0, exports.until)(left, right), (0, exports.globally)(left));
exports.weakUntil = weakUntil;
// Implicación derivada: φ → ψ ≡ ¬φ ∨ ψ
const implies = (left, right) => (0, exports.or)((0, exports.not)(left), right);
exports.implies = implies;
/** Renderiza una fórmula LTL en notación textual estándar. */
function formulaToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name;
        case 'not':
            return `¬${parenthesize(f.arg)}`;
        case 'and':
            return f.args.map(parenthesize).join(' ∧ ');
        case 'or':
            return f.args.map(parenthesize).join(' ∨ ');
        case 'X':
            return `X ${parenthesize(f.arg)}`;
        case 'F':
            return `F ${parenthesize(f.arg)}`;
        case 'G':
            return `G ${parenthesize(f.arg)}`;
        case 'U':
            return `(${formulaToString(f.left)} U ${formulaToString(f.right)})`;
        case 'R':
            return `(${formulaToString(f.left)} R ${formulaToString(f.right)})`;
    }
}
function parenthesize(f) {
    if (f.kind === 'atom')
        return f.name;
    if (f.kind === 'not')
        return formulaToString(f);
    return `(${formulaToString(f)})`;
}
/** Clave canónica determinista de una fórmula LTL, usada para hashing en sets/maps. */
function formulaKey(f) {
    switch (f.kind) {
        case 'atom':
            return `a:${f.name}`;
        case 'not':
            return `n:${formulaKey(f.arg)}`;
        case 'and':
            return `&:${f.args.map(formulaKey).sort().join(',')}`;
        case 'or':
            return `|:${f.args.map(formulaKey).sort().join(',')}`;
        case 'X':
            return `X:${formulaKey(f.arg)}`;
        case 'F':
            return `F:${formulaKey(f.arg)}`;
        case 'G':
            return `G:${formulaKey(f.arg)}`;
        case 'U':
            return `U:${formulaKey(f.left)};${formulaKey(f.right)}`;
        case 'R':
            return `R:${formulaKey(f.left)};${formulaKey(f.right)}`;
    }
}
//# sourceMappingURL=types.js.map