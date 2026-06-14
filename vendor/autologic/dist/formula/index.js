"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ST_OPERATORS = exports.profileSupportsOperator = exports.roleToOperator = exports.buildCrossSentenceDerivations = exports.buildProbabilistic = exports.buildTemporal = exports.buildModal = exports.buildFirstOrder = exports.buildPropositional = void 0;
exports.buildFormulas = buildFormulas;
/**
 * Formula — Orquestador de construcción de fórmulas
 *
 * Pipeline:
 * 1. Construir fórmulas per-sentence (según perfil lógico)
 * 2. Enriquecer con derivaciones cross-sentence (argument-builder)
 */
var propositional_1 = require("./propositional");
Object.defineProperty(exports, "buildPropositional", { enumerable: true, get: function () { return propositional_1.buildPropositional; } });
var first_order_1 = require("./first-order");
Object.defineProperty(exports, "buildFirstOrder", { enumerable: true, get: function () { return first_order_1.buildFirstOrder; } });
var modal_1 = require("./modal");
Object.defineProperty(exports, "buildModal", { enumerable: true, get: function () { return modal_1.buildModal; } });
var temporal_1 = require("./temporal");
Object.defineProperty(exports, "buildTemporal", { enumerable: true, get: function () { return temporal_1.buildTemporal; } });
var probabilistic_1 = require("./probabilistic");
Object.defineProperty(exports, "buildProbabilistic", { enumerable: true, get: function () { return probabilistic_1.buildProbabilistic; } });
var argument_builder_1 = require("./argument-builder");
Object.defineProperty(exports, "buildCrossSentenceDerivations", { enumerable: true, get: function () { return argument_builder_1.buildCrossSentenceDerivations; } });
var connectors_1 = require("./connectors");
Object.defineProperty(exports, "roleToOperator", { enumerable: true, get: function () { return connectors_1.roleToOperator; } });
Object.defineProperty(exports, "profileSupportsOperator", { enumerable: true, get: function () { return connectors_1.profileSupportsOperator; } });
Object.defineProperty(exports, "ST_OPERATORS", { enumerable: true, get: function () { return connectors_1.ST_OPERATORS; } });
const propositional_2 = require("./propositional");
const first_order_2 = require("./first-order");
const modal_2 = require("./modal");
const temporal_2 = require("./temporal");
const argument_builder_2 = require("./argument-builder");
/**
 * Construye fórmulas ST según el perfil lógico seleccionado.
 * Delega al builder específico del perfil, luego enriquece
 * con derivaciones cross-sentence.
 */
function buildFormulas(sentences, atomEntries, profile, detectedPatterns) {
    // ── Paso 1: fórmulas per-sentence ─────────────
    let perSentence;
    switch (profile) {
        case 'classical.propositional':
        case 'intuitionistic.propositional':
        case 'paraconsistent.belnap':
        case 'probabilistic.basic':
            perSentence = (0, propositional_2.buildPropositional)(sentences, atomEntries, detectedPatterns, profile);
            break;
        case 'classical.first_order':
        case 'aristotelian.syllogistic':
        case 'arithmetic':
            perSentence = (0, first_order_2.buildFirstOrder)(sentences, atomEntries, detectedPatterns);
            break;
        case 'modal.k':
        case 'epistemic.s5':
        case 'deontic.standard':
            perSentence = (0, modal_2.buildModal)(sentences, atomEntries, profile);
            break;
        case 'temporal.ltl':
            perSentence = (0, temporal_2.buildTemporal)(sentences, atomEntries);
            break;
        default:
            perSentence = (0, propositional_2.buildPropositional)(sentences, atomEntries, detectedPatterns);
            break;
    }
    // ── Paso 2: derivaciones cross-sentence ───────
    const crossDerives = (0, argument_builder_2.buildCrossSentenceDerivations)(perSentence, sentences, atomEntries, detectedPatterns);
    return [...perSentence, ...crossDerives];
}
//# sourceMappingURL=index.js.map