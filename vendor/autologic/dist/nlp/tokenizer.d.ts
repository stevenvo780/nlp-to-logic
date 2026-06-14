/**
 * Tokenizer — Tokenización básica basada en regex
 */
import type { Token, Language } from '../types';
/**
 * Tokeniza un texto en tokens con metadatos.
 */
export declare function tokenize(text: string, language?: Language): Token[];
/**
 * Extrae palabras de contenido (no stopwords) de un texto.
 */
export declare function contentWords(text: string, language?: Language): Token[];
//# sourceMappingURL=tokenizer.d.ts.map