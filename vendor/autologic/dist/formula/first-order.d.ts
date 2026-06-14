/**
 * First-Order Formula Builder
 *
 * Construye fórmulas de lógica de primer orden con cuantificadores y predicados.
 */
import type { AnalyzedSentence, AtomEntry, FormulaEntry } from '../types';
/**
 * Construye fórmulas de primer orden para oraciones con cuantificadores.
 */
export declare function buildFirstOrder(sentences: AnalyzedSentence[], atomEntries: AtomEntry[], detectedPatterns: string[]): FormulaEntry[];
//# sourceMappingURL=first-order.d.ts.map