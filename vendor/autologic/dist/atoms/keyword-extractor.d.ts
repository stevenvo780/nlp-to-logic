/**
 * Keyword Extractor — Extrae palabras clave de una cláusula
 *
 * Filtra stopwords, extrae 2-4 palabras clave por lema,
 * genera bags-of-words para coreferencia.
 */
import type { Language } from '../types';
export interface SemanticHint {
    subject?: string;
    predicate?: string;
    object?: string;
    polarity: 'positive' | 'negative';
    relationKind: 'copula' | 'action' | 'unknown';
    keywords: string[];
}
/**
 * Extrae las palabras clave principales de un texto.
 * Filtra stopwords y selecciona las más significativas.
 */
export declare function extractKeywords(text: string, language?: Language, maxWords?: number): string[];
/**
 * Obtiene los stems de las palabras de contenido para comparación.
 */
export declare function extractStems(text: string, language?: Language): string[];
/**
 * Calcula un bag-of-stems para comparación de similitud.
 */
export declare function bagOfStems(text: string, language?: Language): Set<string>;
/**
 * Extrae sujeto y predicado para lógica de primer orden.
 * Heurística: el primer sustantivo es el sujeto, el verbo + complemento es el predicado.
 */
export declare function extractSubjectPredicate(text: string, language?: Language): {
    subject: string;
    predicate: string;
} | null;
export declare function extractSemanticHint(text: string, language?: Language): SemanticHint;
//# sourceMappingURL=keyword-extractor.d.ts.map