import type { Expr } from './types';
/**
 * Simplificación algebraica: constant folding + identidades básicas
 * (x+0=x, x*1=x, x*0=0, x^0=1, x^1=x, neg(neg(x))=x).
 *
 * No intenta factorización ni canonicalización total (eso sería CAS).
 * Aplica recursivamente hasta punto fijo (máx 10 pases).
 */
export declare function simplify(expr: Expr): Expr;
export declare function exprEquals(a: Expr, b: Expr): boolean;
//# sourceMappingURL=simplify.d.ts.map