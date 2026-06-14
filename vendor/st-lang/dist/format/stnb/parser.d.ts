/**
 * Parser del formato .stnb — JSON → Notebook
 * Validación estructural sin dependencia de zod (no está en deps).
 */
import type { Notebook } from './types';
export declare class ParseError extends Error {
    constructor(message: string);
}
/**
 * Parsea un string JSON → Notebook validado.
 * Lanza ParseError si el formato es inválido.
 */
export declare function parseNotebook(source: string): Notebook;
//# sourceMappingURL=parser.d.ts.map