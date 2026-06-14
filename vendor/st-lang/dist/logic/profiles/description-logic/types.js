"use strict";
// ============================================================
// ST Description Logic — ALC types
// ============================================================
// ALC: el fragmento base de OWL/DL.
// Conceptos C, roles R (binarios), individuos a.
//   ⊤ ⊥   top / bottom
//   ¬C    complemento
//   C ⊓ D intersección
//   C ⊔ D unión
//   ∃R.C  restricción existencial
//   ∀R.C  restricción de valor
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOTTOM = exports.TOP = void 0;
exports.atomic = atomic;
exports.not = not;
exports.and = and;
exports.or = or;
exports.exists = exists;
exports.forall = forall;
exports.subsumes = subsumes;
exports.equivalent = equivalent;
exports.instance = instance;
exports.roleInstance = roleInstance;
exports.emptyKB = emptyKB;
// ── Constructores de conveniencia ──────────────────────────
/** Concepto universal ⊤ (todo individuo lo satisface). */
exports.TOP = { kind: 'top' };
/** Concepto vacío ⊥ (ningún individuo lo satisface). */
exports.BOTTOM = { kind: 'bottom' };
/** Crea un concepto atómico con el nombre dado. */
function atomic(name) {
    return { kind: 'atomic', name };
}
/** Negación de un concepto: ¬C. */
function not(c) {
    return { kind: 'not', arg: c };
}
/** Intersección de conceptos: C ⊓ D. Sin argumentos devuelve ⊤. */
function and(...args) {
    if (args.length === 0)
        return exports.TOP;
    if (args.length === 1)
        return args[0];
    return { kind: 'and', args };
}
/** Unión de conceptos: C ⊔ D. Sin argumentos devuelve ⊥. */
function or(...args) {
    if (args.length === 0)
        return exports.BOTTOM;
    if (args.length === 1)
        return args[0];
    return { kind: 'or', args };
}
/** Restricción existencial: ∃role.C. */
function exists(role, c) {
    return { kind: 'exists', role, arg: c };
}
/** Restricción de valor: ∀role.C. */
function forall(role, c) {
    return { kind: 'forall', role, arg: c };
}
/** Axioma TBox de subsunción: left ⊑ right. */
function subsumes(left, right) {
    return { kind: 'subsumes', left, right };
}
/** Axioma TBox de equivalencia: left ≡ right. */
function equivalent(left, right) {
    return { kind: 'equivalent', left, right };
}
/** Aserción ABox: `individual` pertenece a `concept`. */
function instance(individual, concept) {
    return { kind: 'instance', left: individual, right: concept };
}
/** Aserción de rol ABox: (from, to) ∈ role. */
function roleInstance(from, role, to) {
    return { kind: 'role-instance', left: from, right: to, role };
}
/** Devuelve una base de conocimiento vacía (TBox y ABox vacíos). */
function emptyKB() {
    return { tbox: [], abox: [] };
}
//# sourceMappingURL=types.js.map