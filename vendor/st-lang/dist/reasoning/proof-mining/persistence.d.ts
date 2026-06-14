import { TheoremCache, type CachedTheorem } from '../../runtime/theorem-cache';
import type { MinedLemma } from './types';
/**
 * Marca metadata.provedBy que identifica un lemma como minado.
 */
export declare const MINED_LEMMA_PROVER = "proof-mining";
/**
 * Guarda una lista de lemmas minados en el cache. Devuelve los ids
 * (post-hash del cache, que puede diferir si el cache normaliza la
 * fórmula de forma distinta).
 *
 * `now` es inyectable para tests deterministas (default `Date.now()`).
 */
export declare function persistLemmas(lemmas: MinedLemma[], cache: TheoremCache, now?: () => number): string[];
/**
 * Reconstruye un MinedLemma desde una entry cacheada (best-effort).
 * Si la entry no fue persistida vía `persistLemmas`, devuelve
 * `undefined`.
 */
export declare function recoverLemmaFromCache(theorem: CachedTheorem): MinedLemma | undefined;
/**
 * Recupera lemmas minados desde el cache a partir de una lista de
 * statements canónicos esperados. Para cada `(statement, profile)`
 * que efectivamente esté cacheado por `persistLemmas`, devuelve el
 * MinedLemma reconstruido.
 *
 * Esta API existe porque `TheoremCache` no expone iteración total
 * por design (LRU + persistencia). El caller que persistió los
 * lemmas conoce sus statements; los pasa aquí para recuperarlos.
 */
export declare function recoverLemmas(cache: TheoremCache, entries: Array<{
    statement: string;
    profile: string;
}>): MinedLemma[];
//# sourceMappingURL=persistence.d.ts.map