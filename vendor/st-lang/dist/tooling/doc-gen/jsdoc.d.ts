import type { ParsedJSDoc } from './types';
/**
 * Quita los marcadores `/**`, `*\/` y el `*` líder de cada línea
 * para dejar el contenido textual del comentario.
 */
export declare function stripCommentMarkers(raw: string): string;
/**
 * Parsea un comentario JSDoc/TSDoc en `description` + `tags`.
 * Acepta tanto el raw con `/** ... *\/` como el contenido ya limpio.
 *
 * Cada tag se reconoce con la heurística clásica de TypeDoc/TSDoc:
 * una línea que empieza con `@<word>` abre un nuevo tag y consume
 * todas las líneas siguientes hasta el próximo `@<word>` o EOF.
 */
export declare function parseJSDoc(comment: string): ParsedJSDoc;
/**
 * `@param name description` → { name, description, optional }.
 *
 * También soporta el formato con tipo `@param {Type} name desc` aunque
 * los tipos reales los tomamos del compilador, no del JSDoc.
 */
export declare function parseParamTag(content: string): {
    name: string;
    description: string;
    optional: boolean;
} | null;
/**
 * `@returns description` → description string.
 */
export declare function parseReturnsTag(content: string): string;
//# sourceMappingURL=jsdoc.d.ts.map