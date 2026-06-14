"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildArgumentStructure = exports.detectPatterns = exports.classifyClauses = exports.MARKERS_EN = exports.MARKERS_ES = void 0;
exports.analyzeDiscourse = analyzeDiscourse;
exports.createCustomMarker = createCustomMarker;
/**
 * Discourse — Analizador discursivo
 */
var markers_es_1 = require("./markers-es");
Object.defineProperty(exports, "MARKERS_ES", { enumerable: true, get: function () { return markers_es_1.MARKERS_ES; } });
var markers_en_1 = require("./markers-en");
Object.defineProperty(exports, "MARKERS_EN", { enumerable: true, get: function () { return markers_en_1.MARKERS_EN; } });
var role_classifier_1 = require("./role-classifier");
Object.defineProperty(exports, "classifyClauses", { enumerable: true, get: function () { return role_classifier_1.classifyClauses; } });
var pattern_detector_1 = require("./pattern-detector");
Object.defineProperty(exports, "detectPatterns", { enumerable: true, get: function () { return pattern_detector_1.detectPatterns; } });
Object.defineProperty(exports, "buildArgumentStructure", { enumerable: true, get: function () { return pattern_detector_1.buildArgumentStructure; } });
const role_classifier_2 = require("./role-classifier");
const pattern_detector_2 = require("./pattern-detector");
/**
 * Analiza discursivamente un conjunto de oraciones segmentadas.
 * Retorna análisis completo con roles, patrones y estructura argumental.
 */
function analyzeDiscourse(sentences, language = 'es') {
    // 1. Clasificar cláusulas de cada oración
    const analyzedSentences = sentences.map(sentence => (0, role_classifier_2.classifyClauses)(sentence.clauses, language));
    // 2. Detectar patrones argumentales
    const detectedPatterns = (0, pattern_detector_2.detectPatterns)(analyzedSentences);
    // 3. Construir estructura argumental
    const argumentStructure = (0, pattern_detector_2.buildArgumentStructure)(analyzedSentences);
    return {
        sentences: analyzedSentences,
        argumentStructure,
        detectedPatterns,
    };
}
/**
 * Registra un marcador personalizado (para extensibilidad).
 */
function createCustomMarker(text, role, language, priority = 5) {
    return { text: text.toLowerCase(), role, language, priority };
}
//# sourceMappingURL=index.js.map