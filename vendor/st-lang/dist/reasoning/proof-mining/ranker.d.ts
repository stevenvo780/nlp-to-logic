import type { MinedLemma } from './types';
export interface RankingWeights {
    /** Peso del saving total. Default 0.5. */
    savings?: number;
    /** Peso del usage count (normalizado log). Default 0.3. */
    usage?: number;
    /** Peso del abstraction level. Default 0.2. */
    generality?: number;
}
/**
 * Score numérico de un lemma según los pesos. Mayor = mejor.
 *
 * Normalizaciones:
 *   - savings: log(1 + savings)
 *   - usage:   log(1 + usageCount)
 *   - generality: abstractionLevel (raw)
 */
export declare function scoreLemma(lemma: MinedLemma, weights?: RankingWeights): number;
/**
 * Ordena los lemmas de mayor a menor score. NO muta el array
 * original. En empates: usageCount desc, luego id asc para
 * determinismo.
 */
export declare function rankLemmas(lemmas: MinedLemma[], weights?: RankingWeights): MinedLemma[];
/**
 * Filtra los top-K lemmas por score.
 */
export declare function topK(lemmas: MinedLemma[], k: number, weights?: RankingWeights): MinedLemma[];
//# sourceMappingURL=ranker.d.ts.map