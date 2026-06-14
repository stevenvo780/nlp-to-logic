import type { PropFormula } from './types';
/**
 * Parsea una fórmula propositional a su AST interno.
 * Lanza Error con mensaje legible si el input no es válido.
 */
export declare function parsePropFormula(input: string): PropFormula;
/**
 * Recolecta los nombres de átomos que aparecen en una fórmula.
 */
export declare function collectAtoms(f: PropFormula, into?: Set<string>): Set<string>;
/**
 * Serializa una fórmula a su forma canónica (con paréntesis explícitos).
 * Útil para hashing y comparaciones estructurales.
 */
export declare function formulaToString(f: PropFormula): string;
//# sourceMappingURL=parser.d.ts.map