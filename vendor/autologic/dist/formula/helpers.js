"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFallbackAtomId = buildFallbackAtomId;
exports.resolveAtomId = resolveAtomId;
exports.applyLogicalModifiers = applyLogicalModifiers;
exports.pickLeadingSentenceModifiers = pickLeadingSentenceModifiers;
exports.stripModifierFamily = stripModifierFamily;
exports.onlyModifierFamily = onlyModifierFamily;
const coreference_1 = require("../atoms/coreference");
const keyword_extractor_1 = require("../atoms/keyword-extractor");
const connectors_1 = require("./connectors");
const MODAL_MODIFIER_TYPES = new Set(['necessity', 'possibility']);
const TEMPORAL_MODIFIER_TYPES = new Set([
    'temporal_next',
    'temporal_until',
    'temporal_always',
    'temporal_eventually'
]);
const MODAL_PROFILES = new Set(['modal.k', 'deontic.standard', 'epistemic.s5']);
const TEMPORAL_PROFILES = new Set(['temporal.ltl']);
function normalizeText(value) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}
function buildFallbackAtomId(clauseText) {
    return clauseText
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toUpperCase()
        .slice(0, 30) || 'ATOM';
}
function resolveAtomId(clauseText, allAtoms, globalMap) {
    const fromMap = globalMap?.get(clauseText);
    if (fromMap)
        return fromMap;
    const normalizedClause = normalizeText(clauseText);
    if (globalMap) {
        for (const [text, id] of globalMap) {
            const normalizedText = normalizeText(text);
            if (clauseText.includes(text) ||
                text.includes(clauseText) ||
                normalizedClause === normalizedText ||
                normalizedClause.includes(normalizedText) ||
                normalizedText.includes(normalizedClause)) {
                return id;
            }
        }
    }
    const exact = allAtoms.find((atom) => atom.text === clauseText);
    if (exact)
        return exact.id;
    const normalizedExact = allAtoms.find((atom) => normalizeText(atom.text) === normalizedClause);
    if (normalizedExact)
        return normalizedExact.id;
    const inclusive = allAtoms.find((atom) => {
        const normalizedAtom = normalizeText(atom.text);
        return (atom.text.includes(clauseText) ||
            clauseText.includes(atom.text) ||
            normalizedAtom.includes(normalizedClause) ||
            normalizedClause.includes(normalizedAtom));
    });
    if (inclusive)
        return inclusive.id;
    const ranked = allAtoms
        .map((atom) => ({
        atom,
        similarity: (0, coreference_1.diceSimilarity)((0, keyword_extractor_1.bagOfStems)(atom.text, 'es'), (0, keyword_extractor_1.bagOfStems)(clauseText, 'es'))
    }))
        .sort((left, right) => right.similarity - left.similarity)[0];
    if (ranked && ranked.similarity >= 0.6) {
        return ranked.atom.id;
    }
    return buildFallbackAtomId(clauseText);
}
function getModalSyntax(profile) {
    switch (profile) {
        case 'epistemic.s5':
            return { necessity: 'K', possibility: 'B' };
        case 'deontic.standard':
            return { necessity: 'O', possibility: 'P' };
        default:
            return { necessity: connectors_1.ST_OPERATORS.necessity, possibility: connectors_1.ST_OPERATORS.possibility };
    }
}
function getTemporalSyntax(profile) {
    if (profile === 'temporal.ltl') {
        return {
            next: connectors_1.ST_OPERATORS.temporal_next,
            until: connectors_1.ST_OPERATORS.temporal_until,
            always: 'G',
            eventually: 'F'
        };
    }
    return {
        next: connectors_1.ST_OPERATORS.temporal_next,
        until: connectors_1.ST_OPERATORS.temporal_until,
        always: connectors_1.ST_OPERATORS.temporal_always,
        eventually: connectors_1.ST_OPERATORS.temporal_eventually
    };
}
function wrapUnary(operator, formula) {
    return `${operator}(${formula})`;
}
function applyLogicalModifiers(formula, modifiers, profile) {
    const modalSyntax = getModalSyntax(profile);
    const temporalSyntax = getTemporalSyntax(profile);
    let output = formula;
    for (const modifier of modifiers) {
        switch (modifier) {
            case 'negation':
                output = wrapUnary(connectors_1.ST_OPERATORS.negation, output);
                break;
            case 'necessity':
                if ((0, connectors_1.profileSupportsOperator)(profile, '<>')) {
                    output = wrapUnary(modalSyntax.necessity, output);
                }
                break;
            case 'possibility':
                if ((0, connectors_1.profileSupportsOperator)(profile, '<>')) {
                    output = wrapUnary(modalSyntax.possibility, output);
                }
                break;
            case 'temporal_next':
                if (TEMPORAL_PROFILES.has(profile)) {
                    output = `${temporalSyntax.next} ${output}`;
                }
                break;
            case 'temporal_until':
                if (TEMPORAL_PROFILES.has(profile)) {
                    output = `${temporalSyntax.until} ${output}`;
                }
                break;
            case 'temporal_always':
                if (TEMPORAL_PROFILES.has(profile)) {
                    output = wrapUnary(temporalSyntax.always, output);
                }
                break;
            case 'temporal_eventually':
                if (TEMPORAL_PROFILES.has(profile)) {
                    output = wrapUnary(temporalSyntax.eventually, output);
                }
                break;
        }
    }
    return output;
}
function pickLeadingSentenceModifiers(modifiers, family) {
    const allowed = family === 'modal' ? MODAL_MODIFIER_TYPES : TEMPORAL_MODIFIER_TYPES;
    return modifiers.filter((modifier) => allowed.has(modifier.type)).map((modifier) => modifier.type);
}
function stripModifierFamily(modifiers, family) {
    const blocked = family === 'modal' ? MODAL_MODIFIER_TYPES : TEMPORAL_MODIFIER_TYPES;
    return modifiers.filter((modifier) => !blocked.has(modifier.type)).map((modifier) => modifier.type);
}
function onlyModifierFamily(modifiers, family) {
    const allowed = family === 'modal' ? MODAL_MODIFIER_TYPES : TEMPORAL_MODIFIER_TYPES;
    return modifiers.filter((modifier) => allowed.has(modifier.type)).map((modifier) => modifier.type);
}
//# sourceMappingURL=helpers.js.map