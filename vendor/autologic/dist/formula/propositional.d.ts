/**
 * Propositional Formula Builder
 *
 * Construye fórmulas de lógica proposicional a partir de átomos con roles.
 * Genera fórmulas reales con conectivos: →, ∧, ∨, ¬, ↔
 */
import type { AnalyzedSentence, AtomEntry, FormulaEntry, LogicProfile } from '../types';
/**
 * Construye fórmulas proposicionales para un conjunto de oraciones.
 * Cada oración se procesa según su tipo detectado.
 */
export declare function buildPropositional(sentences: AnalyzedSentence[], atomEntries: AtomEntry[], detectedPatterns: string[], profile?: LogicProfile): FormulaEntry[];
//# sourceMappingURL=propositional.d.ts.map