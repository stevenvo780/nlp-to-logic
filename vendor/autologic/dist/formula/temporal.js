"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTemporal = buildTemporal;
const connectors_1 = require("./connectors");
const helpers_1 = require("./helpers");
/**
 * Construye fórmulas temporales LTL.
 */
function buildTemporal(sentences, atomEntries) {
    const formulas = [];
    let labelCounter = 1;
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        const sentence = sentences[sIdx];
        const built = buildTemporalSentence(sentence, atomEntries, sIdx, labelCounter);
        formulas.push(...built);
        labelCounter += built.length;
    }
    return formulas;
}
function buildTemporalSentence(sentence, allAtoms, sentenceIdx, labelStart) {
    const formulas = [];
    const clauses = sentence.clauses;
    let label = labelStart;
    // Detectar operadores temporales en cláusulas
    const hasNext = clauses.some(c => c.modifiers.some(m => m.type === 'temporal_next'));
    const hasUntil = clauses.some(c => c.modifiers.some(m => m.type === 'temporal_until'));
    const hasAlways = clauses.some(c => c.modifiers.some(m => m.type === 'temporal_always'));
    const hasEventually = clauses.some(c => c.modifiers.some(m => m.type === 'temporal_eventually'));
    if (sentence.type === 'conditional') {
        // Temporal condicional general: preservar wrappers sobre la implicación completa.
        let condClauses = clauses.filter(c => c.role === 'condition' || c.role === 'premise');
        let consClauses = clauses.filter(c => c.role === 'consequent' || c.role === 'conclusion' || c.role === 'assertion');
        if (condClauses.length === 0 && clauses.length >= 2) {
            condClauses = [clauses[0]];
            consClauses = [clauses[1]];
        }
        if (condClauses.length > 0 && consClauses.length > 0) {
            const ant = (0, helpers_1.resolveAtomId)(condClauses[0].text, allAtoms);
            const cons = (0, helpers_1.resolveAtomId)(consClauses[0].text, allAtoms);
            const implication = `${(0, helpers_1.applyLogicalModifiers)(ant, (0, helpers_1.stripModifierFamily)(condClauses[0].modifiers, 'temporal'), 'temporal.ltl')} -> ${(0, helpers_1.applyLogicalModifiers)(cons, consClauses[0].modifiers.map((modifier) => modifier.type), 'temporal.ltl')}`;
            formulas.push({
                formula: (0, helpers_1.applyLogicalModifiers)(implication, (0, helpers_1.pickLeadingSentenceModifiers)(clauses[0].modifiers, 'temporal'), 'temporal.ltl'),
                stType: 'axiom',
                label: `a${label++}`,
                sourceText: sentence.original,
                sourceSentence: sentenceIdx,
                comment: `Temporal: "${sentence.original}"`,
            });
            const supplementalClauses = clauses.filter(clause => clause !== condClauses[0] && clause !== consClauses[0]);
            for (const clause of supplementalClauses) {
                const atom = (0, helpers_1.resolveAtomId)(clause.text, allAtoms);
                formulas.push({
                    formula: (0, helpers_1.applyLogicalModifiers)(atom, sanitizeStandaloneTemporalModifiers(clause.modifiers.map((modifier) => modifier.type)), 'temporal.ltl'),
                    stType: clause.role === 'conclusion' ? 'derive' : 'axiom',
                    label: `a${label++}`,
                    sourceText: clause.text,
                    sourceSentence: sentenceIdx,
                    comment: `Subcláusula temporal: "${clause.text}"`,
                });
            }
        }
    }
    else if (hasUntil && clauses.length >= 2) {
        // "A hasta que B" → A until B
        const atomsList = clauses.map(c => (0, helpers_1.resolveAtomId)(c.text, allAtoms));
        if (atomsList.length >= 2) {
            formulas.push({
                formula: `${(0, helpers_1.applyLogicalModifiers)(atomsList[0], (0, helpers_1.stripModifierFamily)(clauses[0].modifiers, 'temporal'), 'temporal.ltl')} ${connectors_1.ST_OPERATORS.temporal_until} ${(0, helpers_1.applyLogicalModifiers)(atomsList[1], (0, helpers_1.stripModifierFamily)(clauses[1].modifiers, 'temporal'), 'temporal.ltl')}`,
                stType: 'axiom',
                label: `a${label++}`,
                sourceText: sentence.original,
                sourceSentence: sentenceIdx,
                comment: `Temporal until: "${sentence.original}"`,
            });
            for (let clauseIndex = 2; clauseIndex < clauses.length; clauseIndex++) {
                const clause = clauses[clauseIndex];
                const atom = (0, helpers_1.resolveAtomId)(clause.text, allAtoms);
                formulas.push({
                    formula: (0, helpers_1.applyLogicalModifiers)(atom, sanitizeStandaloneTemporalModifiers(clause.modifiers.map((modifier) => modifier.type)), 'temporal.ltl'),
                    stType: clause.role === 'conclusion' ? 'derive' : 'axiom',
                    label: `a${label++}`,
                    sourceText: clause.text,
                    sourceSentence: sentenceIdx,
                    comment: `Subcláusula temporal: "${clause.text}"`,
                });
            }
        }
    }
    else if (hasAlways) {
        // "Siempre A" → G(A)
        for (const clause of clauses) {
            const atom = (0, helpers_1.resolveAtomId)(clause.text, allAtoms);
            formulas.push({
                formula: (0, helpers_1.applyLogicalModifiers)(atom, clause.modifiers.map((modifier) => modifier.type), 'temporal.ltl'),
                stType: 'axiom',
                label: `a${label++}`,
                sourceText: clause.text,
                sourceSentence: sentenceIdx,
                comment: `Temporal always: "${clause.text}"`,
            });
        }
    }
    else if (hasEventually) {
        // "Eventualmente A" → F(A)
        for (const clause of clauses) {
            const atom = (0, helpers_1.resolveAtomId)(clause.text, allAtoms);
            formulas.push({
                formula: (0, helpers_1.applyLogicalModifiers)(atom, clause.modifiers.map((modifier) => modifier.type), 'temporal.ltl'),
                stType: 'axiom',
                label: `a${label++}`,
                sourceText: clause.text,
                sourceSentence: sentenceIdx,
                comment: `Temporal eventually: "${clause.text}"`,
            });
        }
    }
    else {
        // Temporal genérico: tratar como condicional con next
        if (clauses.length >= 2) {
            let condClauses = clauses.filter(c => c.role === 'condition' || c.role === 'premise');
            let restClauses = clauses.filter(c => c.role !== 'condition' && c.role !== 'premise');
            if (condClauses.length === 0) {
                condClauses = [clauses[0]];
                restClauses = clauses.slice(1);
            }
            if (condClauses.length > 0 && restClauses.length > 0) {
                const ant = (0, helpers_1.resolveAtomId)(condClauses[0].text, allAtoms);
                const cons = (0, helpers_1.resolveAtomId)(restClauses[0].text, allAtoms);
                const implication = `${(0, helpers_1.applyLogicalModifiers)(ant, (0, helpers_1.stripModifierFamily)(condClauses[0].modifiers, 'temporal'), 'temporal.ltl')} -> ${(0, helpers_1.applyLogicalModifiers)(cons, ['temporal_next', ...restClauses[0].modifiers.map((modifier) => modifier.type)], 'temporal.ltl')}`;
                formulas.push({
                    formula: (0, helpers_1.applyLogicalModifiers)(implication, (0, helpers_1.pickLeadingSentenceModifiers)(clauses[0].modifiers, 'temporal'), 'temporal.ltl'),
                    stType: 'axiom',
                    label: `a${label++}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Temporal: "${sentence.original}"`,
                });
            }
        }
        else {
            // Aserción temporal simple
            for (const clause of clauses) {
                const atom = (0, helpers_1.resolveAtomId)(clause.text, allAtoms);
                formulas.push({
                    formula: (0, helpers_1.applyLogicalModifiers)(atom, clause.modifiers.map((modifier) => modifier.type), 'temporal.ltl'),
                    stType: 'axiom',
                    label: `a${label++}`,
                    sourceText: clause.text,
                    sourceSentence: sentenceIdx,
                });
            }
        }
    }
    return formulas;
}
function sanitizeStandaloneTemporalModifiers(modifiers) {
    return modifiers.filter((modifier) => modifier !== 'temporal_until');
}
//# sourceMappingURL=temporal.js.map