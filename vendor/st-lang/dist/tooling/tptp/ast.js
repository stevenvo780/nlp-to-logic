"use strict";
// ============================================================
// TPTP — AST
// ============================================================
//
// AST de fórmulas TPTP (Thousands of Problems for Theorem Provers).
// Soporta FOF (First-Order Form), CNF (Clause Normal Form) y
// TFF light (Typed First-order Form sin sistema de tipos completo).
//
// Convenciones léxicas TPTP:
//  - Predicados, funciones y constantes: identificador en `lower_case`
//    (empieza por minúscula, sigue alfanumérico/`_`).
//  - Variables: identificador en `Upper_Case` (empieza por mayúscula).
//  - Operadores: `~` (not), `&` (and), `|` (or), `=>` (implies),
//    `<=>` (iff), `<~>` (xor), `!` (forall), `?` (exists),
//    `=` (eq), `!=` (neq).
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPTP_LANGUAGES = exports.TPTP_ROLES = void 0;
exports.TPTP_ROLES = new Set([
    'axiom',
    'hypothesis',
    'conjecture',
    'negated_conjecture',
    'lemma',
    'theorem',
    'definition',
    'plain',
]);
exports.TPTP_LANGUAGES = new Set([
    'fof',
    'cnf',
    'tff',
    'thf',
]);
//# sourceMappingURL=ast.js.map