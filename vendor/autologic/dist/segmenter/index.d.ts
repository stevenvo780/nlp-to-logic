/**
 * Segmenter — Orquestador de segmentación
 */
export { splitSentences } from './sentence-splitter';
export { splitClauses } from './clause-splitter';
import type { Sentence, Language } from '../types';
/**
 * Segmenta un texto completo en oraciones con cláusulas.
 */
export declare function segment(text: string, language?: Language): Sentence[];
//# sourceMappingURL=index.d.ts.map