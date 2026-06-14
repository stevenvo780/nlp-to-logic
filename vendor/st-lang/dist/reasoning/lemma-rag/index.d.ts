export type { Embedding, EmbeddedLemma, QueryResult, RAGOptions, EmbeddingProvider, RecallResult } from './types';
export { EMBEDDING_DIM } from './types';
export { hashEmbed, normalizeEmbedding, HashEmbeddingProvider, defaultProvider } from './embedding';
export { IndexStore } from './index-store';
export { cosineSimilarity, bm25Score, hybridScore, retrieveTopK } from './retrieval';
export { LemmaRAG, queryLemmas, globalRAG, resetGlobalRAG } from './query';
export { runBenchmark, formatBenchmarkResults, BENCHMARK_PAIRS, } from './benchmarks';
export type { BenchmarkPair } from './benchmarks';
//# sourceMappingURL=index.d.ts.map