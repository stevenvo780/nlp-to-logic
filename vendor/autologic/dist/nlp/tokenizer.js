"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
exports.contentWords = contentWords;
const stopwords_1 = require("./stopwords");
const stemmer_es_1 = require("./stemmer-es");
const stemmer_en_1 = require("./stemmer-en");
/**
 * Tokeniza un texto en tokens con metadatos.
 */
function tokenize(text, language = 'es') {
    const stemFn = language === 'es' ? stemmer_es_1.stemEs : stemmer_en_1.stemEn;
    const words = text.match(/[\p{L}\p{N}]+/gu) || [];
    const tokens = [];
    let searchPos = 0;
    for (const word of words) {
        const pos = text.indexOf(word, searchPos);
        const normalized = word.toLowerCase();
        tokens.push({
            text: word,
            normalized,
            stem: stemFn(normalized),
            isStopword: (0, stopwords_1.isStopword)(normalized, language),
            position: pos,
        });
        searchPos = pos + word.length;
    }
    return tokens;
}
/**
 * Extrae palabras de contenido (no stopwords) de un texto.
 */
function contentWords(text, language = 'es') {
    return tokenize(text, language).filter(t => !t.isStopword);
}
//# sourceMappingURL=tokenizer.js.map