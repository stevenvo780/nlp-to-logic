"use strict";
// ============================================================
// lemma-rag — entrypoint público
//
// Sistema RAG semántico sobre la biblioteca de lemas ST.
// Stage 1: HashEmbedding determinístico R^256 (sin deps de red).
// Stage 2 (pendiente): ONNX transformers (MiniLM-L6).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.BENCHMARK_PAIRS = exports.formatBenchmarkResults = exports.runBenchmark = exports.resetGlobalRAG = exports.globalRAG = exports.queryLemmas = exports.LemmaRAG = exports.retrieveTopK = exports.hybridScore = exports.bm25Score = exports.cosineSimilarity = exports.IndexStore = exports.defaultProvider = exports.HashEmbeddingProvider = exports.normalizeEmbedding = exports.hashEmbed = exports.EMBEDDING_DIM = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "EMBEDDING_DIM", { enumerable: true, get: function () { return types_1.EMBEDDING_DIM; } });
var embedding_1 = require("./embedding");
Object.defineProperty(exports, "hashEmbed", { enumerable: true, get: function () { return embedding_1.hashEmbed; } });
Object.defineProperty(exports, "normalizeEmbedding", { enumerable: true, get: function () { return embedding_1.normalizeEmbedding; } });
Object.defineProperty(exports, "HashEmbeddingProvider", { enumerable: true, get: function () { return embedding_1.HashEmbeddingProvider; } });
Object.defineProperty(exports, "defaultProvider", { enumerable: true, get: function () { return embedding_1.defaultProvider; } });
var index_store_1 = require("./index-store");
Object.defineProperty(exports, "IndexStore", { enumerable: true, get: function () { return index_store_1.IndexStore; } });
var retrieval_1 = require("./retrieval");
Object.defineProperty(exports, "cosineSimilarity", { enumerable: true, get: function () { return retrieval_1.cosineSimilarity; } });
Object.defineProperty(exports, "bm25Score", { enumerable: true, get: function () { return retrieval_1.bm25Score; } });
Object.defineProperty(exports, "hybridScore", { enumerable: true, get: function () { return retrieval_1.hybridScore; } });
Object.defineProperty(exports, "retrieveTopK", { enumerable: true, get: function () { return retrieval_1.retrieveTopK; } });
var query_1 = require("./query");
Object.defineProperty(exports, "LemmaRAG", { enumerable: true, get: function () { return query_1.LemmaRAG; } });
Object.defineProperty(exports, "queryLemmas", { enumerable: true, get: function () { return query_1.queryLemmas; } });
Object.defineProperty(exports, "globalRAG", { enumerable: true, get: function () { return query_1.globalRAG; } });
Object.defineProperty(exports, "resetGlobalRAG", { enumerable: true, get: function () { return query_1.resetGlobalRAG; } });
var benchmarks_1 = require("./benchmarks");
Object.defineProperty(exports, "runBenchmark", { enumerable: true, get: function () { return benchmarks_1.runBenchmark; } });
Object.defineProperty(exports, "formatBenchmarkResults", { enumerable: true, get: function () { return benchmarks_1.formatBenchmarkResults; } });
Object.defineProperty(exports, "BENCHMARK_PAIRS", { enumerable: true, get: function () { return benchmarks_1.BENCHMARK_PAIRS; } });
//# sourceMappingURL=index.js.map