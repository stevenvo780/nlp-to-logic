import type { Expr } from './types';
import { v as makeVar } from './constructors';
/**
 * Diferenciación simbólica respecto a `varName`.
 *
 * Reglas:
 * - Linealidad: d/dx(f+g) = f' + g'
 * - Producto: d/dx(f*g) = f'*g + f*g'  (generalizado a N factores)
 * - Cociente: d/dx(f/g) = (f'*g - f*g') / g^2
 * - Cadena: d/dx(f(g(x))) = f'(g(x)) * g'(x)
 * - Potencia general: d/dx(f^g) = f^g * (g'*ln(f) + g*f'/f)
 *   (caso especial: exponente constante → g*f^(g-1)*f')
 *
 * El resultado se simplifica antes de devolverse.
 */
export declare function differentiate(expr: Expr, varName: string): Expr;
/**
 * Gradiente: lista de derivadas parciales por variable.
 */
export declare function gradient(expr: Expr, vars: string[]): Expr[];
export declare const variable: typeof makeVar;
//# sourceMappingURL=differentiate.d.ts.map