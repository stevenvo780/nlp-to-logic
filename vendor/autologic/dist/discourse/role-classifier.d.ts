/**
 * Role Classifier — Asigna roles lógicos a cláusulas
 *
 * Usa marcadores discursivos y posición contextual para determinar
 * si una cláusula es premisa, conclusión, condición, etc.
 */
import type { Clause, Language, AnalyzedSentence } from '../types';
/**
 * Clasifica las cláusulas de una oración segmentada, asignando roles y modificadores.
 */
export declare function classifyClauses(clauses: Clause[], language?: Language): AnalyzedSentence;
//# sourceMappingURL=role-classifier.d.ts.map