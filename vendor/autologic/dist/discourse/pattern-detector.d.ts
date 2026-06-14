/**
 * Pattern Detector — Detecta patrones argumentales conocidos
 *
 * Analiza la estructura argumental global para identificar
 * Modus Ponens, Modus Tollens, silogismos, etc.
 */
import type { AnalyzedSentence, ArgumentPattern, ArgumentStructure } from '../types';
/**
 * Detecta patrones argumentales en un conjunto de oraciones analizadas.
 */
export declare function detectPatterns(sentences: AnalyzedSentence[]): ArgumentPattern[];
/**
 * Construye la estructura argumental a partir de oraciones analizadas.
 */
export declare function buildArgumentStructure(sentences: AnalyzedSentence[]): ArgumentStructure;
//# sourceMappingURL=pattern-detector.d.ts.map