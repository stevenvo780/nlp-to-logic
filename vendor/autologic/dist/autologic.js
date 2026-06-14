"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autologic = void 0;
const formalize_1 = require("./formalize");
const segmenter_1 = require("./segmenter");
const discourse_1 = require("./discourse");
const markers_es_1 = require("./discourse/markers-es");
const markers_en_1 = require("./discourse/markers-en");
const validator_1 = require("./generator/validator");
/**
 * Clase principal con estado para sesiones de formalización.
 *
 * @example
 * ```ts
 * const al = new Autologic({ language: 'es', defaultProfile: 'classical.propositional' });
 * const r1 = al.formalize("Si llueve, la calle se moja.");
 * const analysis = al.analyze("Si P entonces Q, pero no Q, luego no P.");
 * ```
 */
class Autologic {
    config;
    customMarkers = [];
    history = [];
    constructor(config = {}) {
        this.config = {
            language: config.language || 'es',
            defaultProfile: config.defaultProfile || 'classical.propositional',
            defaultAtomStyle: config.defaultAtomStyle || 'keywords',
        };
    }
    /**
     * Formaliza texto natural a código ST.
     */
    formalize(text, options = {}) {
        const mergedOptions = {
            profile: options.profile || this.config.defaultProfile,
            language: options.language || this.config.language,
            atomStyle: options.atomStyle || this.config.defaultAtomStyle,
            includeComments: options.includeComments ?? true,
            validateOutput: options.validateOutput ?? true,
            maxClauseDepth: options.maxClauseDepth ?? 3,
        };
        const result = (0, formalize_1.formalize)(text, mergedOptions);
        this.history.push(result);
        return result;
    }
    /**
     * Solo analiza sin generar ST. Retorna el análisis discursivo.
     */
    analyze(text, language) {
        const lang = language || this.config.language;
        const sentences = (0, segmenter_1.segment)(text, lang);
        return (0, discourse_1.analyzeDiscourse)(sentences, lang);
    }
    /**
     * Valida código ST existente.
     */
    validate(stCode) {
        return (0, validator_1.validateST)(stCode);
    }
    /**
     * Agrega un marcador discursivo personalizado.
     */
    addMarker(marker) {
        const lang = marker.language || this.config.language;
        const custom = (0, discourse_1.createCustomMarker)(marker.text, marker.role, lang);
        this.customMarkers.push(custom);
        // Agregar al diccionario correspondiente
        if (lang === 'es') {
            markers_es_1.MARKERS_ES.push(custom);
        }
        else {
            markers_en_1.MARKERS_EN.push(custom);
        }
    }
    /**
     * Obtiene el historial de formalizaciones.
     */
    getHistory() {
        return [...this.history];
    }
    /**
     * Limpia el historial.
     */
    clearHistory() {
        this.history = [];
    }
    /**
     * Obtiene la configuración actual.
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Actualiza la configuración.
     */
    setConfig(config) {
        if (config.language)
            this.config.language = config.language;
        if (config.defaultProfile)
            this.config.defaultProfile = config.defaultProfile;
        if (config.defaultAtomStyle)
            this.config.defaultAtomStyle = config.defaultAtomStyle;
    }
}
exports.Autologic = Autologic;
//# sourceMappingURL=autologic.js.map