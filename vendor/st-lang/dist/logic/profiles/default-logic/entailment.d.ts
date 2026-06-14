import { DefaultTheory, Extension, ComputeOptions } from './types';
/** Comprueba si el literal está en la extensión dada. */
export declare function isInExtension(formula: string, ext: Extension): boolean;
/**
 * Entailment escéptico: el literal está en TODAS las extensiones.
 * Si la teoría no tiene extensiones, devuelve false (entailment vacuo
 * tampoco — la convención usual es no afirmar nada sin testigos).
 */
export declare function isSkepticallyEntailed(formula: string, T: DefaultTheory, options?: ComputeOptions): boolean;
/**
 * Entailment crédulo: el literal está en AL MENOS una extensión.
 */
export declare function isCredulouslyEntailed(formula: string, T: DefaultTheory, options?: ComputeOptions): boolean;
//# sourceMappingURL=entailment.d.ts.map