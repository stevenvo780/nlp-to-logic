import type { DLFormula, DLTerm, HybridProgram } from './ast';
/** Parsea una fórmula dL desde una cadena. Lanza Error en sintaxis inválida. */
export declare function parseFormula(src: string): DLFormula;
/** Parsea un programa híbrido desde una cadena. */
export declare function parseProgram(src: string): HybridProgram;
/** Parsea un término aritmético dL. */
export declare function parseTerm(src: string): DLTerm;
//# sourceMappingURL=parser.d.ts.map