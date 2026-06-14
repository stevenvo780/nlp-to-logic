import { TheoremCache } from '../../runtime/theorem-cache';
import type { RankingWeights } from './ranker';
import type { MinedLemma, MiningOptions, MiningResult, ProofTrace, UsageStats } from './types';
export type { MinedLemma, MiningOptions, MiningResult, ProofStep, ProofTrace, UsageStats, } from './types';
export type { SubtreeCandidate, SubtreeGroup } from './extractor';
export type { GeneralizationResult } from './generalizer';
export type { RankingWeights } from './ranker';
export { extractSubtrees, groupSubtrees, subtreeKey, extractAuxiliaryLemmas, } from './extractor';
export { generalizeLemma, generalizeFormulas, generalizeTerms, } from './generalizer';
export { rankLemmas, scoreLemma, topK } from './ranker';
export { persistLemmas, recoverLemmas, recoverLemmaFromCache, MINED_LEMMA_PROVER, } from './persistence';
export { computeStats, statsToString } from './statistics';
/**
 * Mina lemmas del corpus de proofs. Devuelve los lemmas ordenados
 * por score descendente + stats agregadas.
 *
 * Esta es la entrada principal del módulo. No persiste por defecto;
 * para meter al cache, pasar `cache` o usar `ProofMiner`.
 */
export declare function mineLemmas(corpus: ProofTrace[], options?: MiningOptions & {
    weights?: RankingWeights;
    cache?: TheoremCache;
}): MiningResult;
/**
 * `ProofMiner` es una clase fachada con estado interno: acumula
 * lemmas a través de múltiples corpus, los persiste en un cache
 * común, y expone consultas.
 */
export declare class ProofMiner {
    private readonly cache;
    private readonly options;
    private readonly weights;
    private readonly seen;
    private totalProofsAnalyzed;
    private totalCandidatesFound;
    constructor(opts?: MiningOptions & {
        weights?: RankingWeights;
        cache?: TheoremCache;
    });
    /**
     * Procesa un corpus de proofs y acumula los lemmas en estado.
     * Lemmas con el mismo `id` se mergean: usageCount += new, savings
     * += new, sourceProofs se unifican.
     */
    mine(corpus: ProofTrace[]): MiningResult;
    /**
     * Devuelve los lemmas acumulados, rankeados.
     */
    all(): MinedLemma[];
    /**
     * Top-k del catálogo acumulado.
     */
    top(k: number): MinedLemma[];
    /**
     * Stats agregadas.
     */
    stats(): UsageStats;
    /** Cache subyacente (lectura). */
    getCache(): TheoremCache;
    clear(): void;
}
//# sourceMappingURL=index.d.ts.map