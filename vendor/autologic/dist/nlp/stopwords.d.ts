/**
 * Stopwords — Listas curadas de palabras vacías en español e inglés
 */
import type { Language } from '../types';
export declare const STOPWORDS_ES: Set<string>;
export declare const STOPWORDS_EN: Set<string>;
/**
 * Comprueba si una palabra es stopword en el idioma dado.
 */
export declare function isStopword(word: string, language?: Language): boolean;
//# sourceMappingURL=stopwords.d.ts.map