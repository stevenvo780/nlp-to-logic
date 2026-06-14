"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitClauses = exports.splitSentences = void 0;
exports.segment = segment;
/**
 * Segmenter — Orquestador de segmentación
 */
var sentence_splitter_1 = require("./sentence-splitter");
Object.defineProperty(exports, "splitSentences", { enumerable: true, get: function () { return sentence_splitter_1.splitSentences; } });
var clause_splitter_1 = require("./clause-splitter");
Object.defineProperty(exports, "splitClauses", { enumerable: true, get: function () { return clause_splitter_1.splitClauses; } });
const sentence_splitter_2 = require("./sentence-splitter");
const clause_splitter_2 = require("./clause-splitter");
/**
 * Segmenta un texto completo en oraciones con cláusulas.
 */
function segment(text, language = 'es') {
    const rawSentences = (0, sentence_splitter_2.splitSentences)(text);
    return rawSentences.map((raw, index) => ({
        original: raw,
        index,
        clauses: (0, clause_splitter_2.splitClauses)(raw, language),
    }));
}
//# sourceMappingURL=index.js.map