import type { ApplyTactic, ProofState, RankingModel, SearchOptions, SearchResult } from './types';
/**
 * Beam search guiado por el modelo. `applyTactic` define la semántica
 * de cada táctica — el módulo no asume nada sobre la lógica de fondo.
 */
export declare function guidedSearch(initialState: ProofState, applyTactic: ApplyTactic, model: RankingModel, candidates: string[], opts?: SearchOptions): SearchResult;
//# sourceMappingURL=search.d.ts.map