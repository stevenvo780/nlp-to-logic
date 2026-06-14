import { Formula } from '../types';
/** Convierte una fórmula AST a notación Unicode legible (estilo libro de texto). */
export declare function formulaToUnicode(f: Formula): string;
/** Convierte una fórmula AST a notación LaTeX. */
export declare function formulaToLaTeX(f: Formula): string;
/**
 * Convierte una prueba paso a paso a formato LaTeX usando `bussproofs`.
 * Asume entorno `prooftree`.
 */
export declare function proofToLaTeX(proof: import('../types').Proof): string;
//# sourceMappingURL=format.d.ts.map