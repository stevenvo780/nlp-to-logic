/**
 * Argument Builder — Genera derivaciones cross-sentence
 *
 * Analiza la estructura argumental GLOBAL (multi-oración) para producir:
 * - derive por Modus Ponens:          A→B, A ⊢ B
 * - derive por Modus Tollens:         A→B, ¬B ⊢ ¬A
 * - derive por Silogismo Hipotético:  A→B, B→C ⊢ A→C
 * - derive por Silogismo Disyuntivo:  A∨B, ¬A ⊢ B
 * - derive por Conjunción Intro:      A, B ⊢ A∧B
 *
 * Se ejecuta DESPUÉS de los formula builders per-sentence.
 */
import type { FormulaEntry, AtomEntry, AnalyzedSentence } from '../types';
/**
 * Enriquece las fórmulas per-sentence con derivaciones cross-sentence.
 */
export declare function buildCrossSentenceDerivations(perSentenceFormulas: FormulaEntry[], sentences: AnalyzedSentence[], atomEntries: AtomEntry[], detectedPatterns: string[]): FormulaEntry[];
//# sourceMappingURL=argument-builder.d.ts.map