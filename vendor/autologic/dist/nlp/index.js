"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOPWORDS_EN = exports.STOPWORDS_ES = exports.isStopword = exports.stemEn = exports.stemEs = exports.tokenize = void 0;
/**
 * NLP — Utilidades de procesamiento de lenguaje natural
 */
var tokenizer_1 = require("./tokenizer");
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return tokenizer_1.tokenize; } });
var stemmer_es_1 = require("./stemmer-es");
Object.defineProperty(exports, "stemEs", { enumerable: true, get: function () { return stemmer_es_1.stemEs; } });
var stemmer_en_1 = require("./stemmer-en");
Object.defineProperty(exports, "stemEn", { enumerable: true, get: function () { return stemmer_en_1.stemEn; } });
var stopwords_1 = require("./stopwords");
Object.defineProperty(exports, "isStopword", { enumerable: true, get: function () { return stopwords_1.isStopword; } });
Object.defineProperty(exports, "STOPWORDS_ES", { enumerable: true, get: function () { return stopwords_1.STOPWORDS_ES; } });
Object.defineProperty(exports, "STOPWORDS_EN", { enumerable: true, get: function () { return stopwords_1.STOPWORDS_EN; } });
//# sourceMappingURL=index.js.map