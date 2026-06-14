/**
 * Formula — Orquestador de construcción de fórmulas
 *
 * Pipeline:
 * 1. Construir fórmulas per-sentence (según perfil lógico)
 * 2. Enriquecer con derivaciones cross-sentence (argument-builder)
 */
export { buildPropositional } from './propositional';
export { buildFirstOrder } from './first-order';
export { buildModal } from './modal';
export { buildTemporal } from './temporal';
export { buildProbabilistic } from './probabilistic';
export { buildCrossSentenceDerivations } from './argument-builder';
export { roleToOperator, profileSupportsOperator, ST_OPERATORS } from './connectors';
import type { AnalyzedSentence, AtomEntry, FormulaEntry, LogicProfile } from '../types';
/**
 * Construye fórmulas ST según el perfil lógico seleccionado.
 * Delega al builder específico del perfil, luego enriquece
 * con derivaciones cross-sentence.
 */
export declare function buildFormulas(sentences: AnalyzedSentence[], atomEntries: AtomEntry[], profile: LogicProfile, detectedPatterns: string[]): FormulaEntry[];
//# sourceMappingURL=index.d.ts.map