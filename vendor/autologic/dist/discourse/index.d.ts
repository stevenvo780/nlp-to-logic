/**
 * Discourse — Analizador discursivo
 */
export { MARKERS_ES } from './markers-es';
export { MARKERS_EN } from './markers-en';
export { classifyClauses } from './role-classifier';
export { detectPatterns, buildArgumentStructure } from './pattern-detector';
import type { Sentence, Language, DiscourseAnalysis, MarkerDefinition } from '../types';
/**
 * Analiza discursivamente un conjunto de oraciones segmentadas.
 * Retorna análisis completo con roles, patrones y estructura argumental.
 */
export declare function analyzeDiscourse(sentences: Sentence[], language?: Language): DiscourseAnalysis;
/**
 * Registra un marcador personalizado (para extensibilidad).
 */
export declare function createCustomMarker(text: string, role: MarkerDefinition['role'], language: Language, priority?: number): MarkerDefinition;
//# sourceMappingURL=index.d.ts.map