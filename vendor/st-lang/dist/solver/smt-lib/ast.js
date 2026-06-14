"use strict";
// ============================================================
// SMT-LIB v2 — AST de sorts, términos y comandos
// ============================================================
//
// Cubre el grueso del estándar SMT-LIB v2.6:
//   - sorts atómicos y aplicados (e.g. (Array Int Int), (_ BitVec 32))
//   - términos: constantes especiales, símbolos, aplicaciones, let,
//     forall/exists, match, annotated terms (`!`)
//   - comandos: set-logic / set-option / set-info, declare-* / define-*,
//     assert, check-sat / check-sat-assuming, get-*, push/pop, reset*, exit, echo
//
// Estos tipos son intencionalmente conservadores: cualquier expresión que el
// parser no entienda como construcción privilegiada cae a `{ kind: 'app' }`
// con la cabeza preservada como string, así no perdemos información.
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_NAMES = exports.KNOWN_LOGICS = void 0;
/** Lógicas estándar reconocidas (no exhaustivo). */
exports.KNOWN_LOGICS = new Set([
    'QF_UF',
    'QF_LIA',
    'QF_LRA',
    'QF_LIRA',
    'QF_NIA',
    'QF_NRA',
    'QF_NIRA',
    'QF_BV',
    'QF_AX',
    'QF_ABV',
    'QF_AUFBV',
    'QF_AUFLIA',
    'QF_UFLIA',
    'QF_UFLRA',
    'QF_UFNRA',
    'QF_UFBV',
    'AUFLIA',
    'AUFLIRA',
    'AUFNIA',
    'AUFNIRA',
    'LIA',
    'LRA',
    'NIA',
    'NRA',
    'BV',
    'UF',
    'ALL',
]);
/** Identifica si una cabeza de comando es nombre estándar del estándar. */
exports.COMMAND_NAMES = new Set([
    'set-logic',
    'set-option',
    'set-info',
    'declare-sort',
    'define-sort',
    'declare-fun',
    'define-fun',
    'declare-const',
    'assert',
    'check-sat',
    'check-sat-assuming',
    'get-assertions',
    'get-model',
    'get-proof',
    'get-unsat-core',
    'get-value',
    'push',
    'pop',
    'reset',
    'reset-assertions',
    'exit',
    'echo',
]);
//# sourceMappingURL=ast.js.map