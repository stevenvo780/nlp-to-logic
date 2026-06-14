import type { SemanticSearchHit, TfIdfIndex } from './types';
import type { LemmaLibrary } from './library';
export declare function buildIndex(library: LemmaLibrary): TfIdfIndex;
export declare function semanticSearch(index: TfIdfIndex, query: string, k?: number): SemanticSearchHit[];
//# sourceMappingURL=tfidf.d.ts.map