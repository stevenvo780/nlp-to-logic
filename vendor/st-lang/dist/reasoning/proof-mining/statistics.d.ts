import type { MinedLemma, UsageStats } from './types';
/**
 * Computa las stats agregadas dado el corpus original y la lista
 * final de lemmas extraídos.
 */
export declare function computeStats(proofsAnalyzed: number, candidatesFound: number, lemmas: MinedLemma[]): UsageStats;
/**
 * Render textual de las stats (para logs / debugging).
 */
export declare function statsToString(s: UsageStats): string;
//# sourceMappingURL=statistics.d.ts.map