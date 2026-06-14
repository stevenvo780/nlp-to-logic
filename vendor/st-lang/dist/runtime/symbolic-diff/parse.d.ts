import type { Expr } from './types';
/**
 * Parser de expresiones algebraicas/trascendentales.
 *
 * Gramática (precedencia ascendente):
 *   expr    := term (('+' | '-') term)*
 *   term    := factor (('*' | '/') factor)*
 *   factor  := unary ('^' factor)?     // ^ right-assoc
 *   unary   := '-' unary | atom
 *   atom    := number | ident '(' expr ')' | ident | '(' expr ')'
 *
 * Soporta funciones: sin, cos, tan, log, exp.
 * Implícito *: NO se soporta (escribir `2*x`, no `2x`).
 */
export declare function parse(input: string): Expr;
//# sourceMappingURL=parse.d.ts.map