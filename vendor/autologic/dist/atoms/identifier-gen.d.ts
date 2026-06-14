/**
 * Identifier Generator — Genera IDs simbólicos ST válidos
 *
 * Convierte palabras clave en identificadores válidos para ST:
 * - Keywords → KEYWORDS_JOINED (e.g., LLUEVE, CALLE_MOJA)
 * - Letters → P, Q, R, S, ...
 * - Numbered → A1, A2, A3, ...
 */
import type { AtomStyle } from '../types';
/**
 * Genera un identificador ST válido a partir de palabras clave.
 */
export declare function generateId(keywords: string[], style?: AtomStyle, index?: number): string;
/**
 * Genera un identificador para predicados (primer orden).
 * Formato: NombrePredicado (CamelCase)
 */
export declare function generatePredicateId(words: string[]): string;
/**
 * Genera un identificador de variable (minúscula).
 */
export declare function generateVariableId(name: string): string;
//# sourceMappingURL=identifier-gen.d.ts.map