"use strict";
// ============================================================
// ST Hybrid Logic — Tipos del fragmento H(@, ↓, ∃)
// ============================================================
// Hybrid logic extiende la modal estándar con:
//   - nominales i, j, k ... — proposiciones que denotan UN único
//     mundo del frame.
//   - @i φ — "φ se satisface en el mundo nombrado por i".
//   - ↓i. φ — bind el mundo actual como nominal i en φ.
//   - ∃i. φ — existe un mundo i tal que φ se satisface allí.
//
// Referencias: Blackburn, Areces & ten Cate (2007), "Hybrid Logic".
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = atom;
exports.nominal = nominal;
exports.not = not;
exports.and = and;
exports.or = or;
exports.implies = implies;
exports.box = box;
exports.diamond = diamond;
exports.at = at;
exports.down = down;
exports.existsWorld = existsWorld;
exports.formulaToString = formulaToString;
// ── Constructores de conveniencia ──────────────────────────
/** Crea un átomo proposicional híbrido. */
function atom(name) {
    return { kind: 'atom', name };
}
/** Crea un nominal (proposición que denota un único mundo). */
function nominal(name) {
    return { kind: 'nominal', name };
}
/** Negación: ¬φ. */
function not(arg) {
    return { kind: 'not', arg };
}
/**
 * Conjunción n-aria: φ₁ ∧ … ∧ φₙ.
 * @throws si se llama sin argumentos.
 */
function and(...args) {
    if (args.length === 0)
        throw new Error('and: aridad >= 1 requerida');
    if (args.length === 1)
        return args[0];
    return { kind: 'and', args };
}
/**
 * Disyunción n-aria: φ₁ ∨ … ∨ φₙ.
 * @throws si se llama sin argumentos.
 */
function or(...args) {
    if (args.length === 0)
        throw new Error('or: aridad >= 1 requerida');
    if (args.length === 1)
        return args[0];
    return { kind: 'or', args };
}
/** Implicación: left → right. */
function implies(left, right) {
    return { kind: 'implies', left, right };
}
/** Operador □ (necesidad modal). */
function box(arg) {
    return { kind: 'box', arg };
}
/** Operador ◇ (posibilidad modal). */
function diamond(arg) {
    return { kind: 'diamond', arg };
}
/** Operador de satisfacción: @i φ ("φ en el mundo i"). */
function at(nominalName, arg) {
    return { kind: 'at', nominal: nominalName, arg };
}
/** Operador de ligadura: ↓bind. φ (bind el mundo actual). */
function down(bind, arg) {
    return { kind: 'down', bind, arg };
}
/** Cuantificador de mundo: ∃bind. φ (existe un mundo bind donde φ). */
function existsWorld(bind, arg) {
    return { kind: 'exists-world', bind, arg };
}
/** Renderiza una fórmula híbrida en notación textual estándar. */
function formulaToString(phi) {
    switch (phi.kind) {
        case 'atom':
            return phi.name;
        case 'nominal':
            return phi.name;
        case 'not':
            return `¬${wrap(phi.arg)}`;
        case 'and':
            return `(${phi.args.map(formulaToString).join(' ∧ ')})`;
        case 'or':
            return `(${phi.args.map(formulaToString).join(' ∨ ')})`;
        case 'implies':
            return `(${formulaToString(phi.left)} → ${formulaToString(phi.right)})`;
        case 'box':
            return `□${wrap(phi.arg)}`;
        case 'diamond':
            return `◇${wrap(phi.arg)}`;
        case 'at':
            return `@${phi.nominal} ${wrap(phi.arg)}`;
        case 'down':
            return `↓${phi.bind}. ${wrap(phi.arg)}`;
        case 'exists-world':
            return `∃${phi.bind}. ${wrap(phi.arg)}`;
    }
}
function wrap(phi) {
    if (phi.kind === 'atom' ||
        phi.kind === 'nominal' ||
        phi.kind === 'not' ||
        phi.kind === 'box' ||
        phi.kind === 'diamond' ||
        phi.kind === 'at') {
        return formulaToString(phi);
    }
    return `(${formulaToString(phi)})`;
}
//# sourceMappingURL=types.js.map