"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProbabilistic = buildProbabilistic;
const helpers_1 = require("./helpers");
function buildProbabilistic(sentences, atomEntries) {
    const formulas = [];
    let labelCounter = 1;
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        const sentence = sentences[sIdx];
        for (const clause of sentence.clauses) {
            const text = clause.text;
            // Buscar patrones comunes: "probabilidad ... de ... es X" o "0.XX"
            const probMatch = text.match(/0\.\d+/);
            const isPercentage = text.match(/(\d+(?:\.\d+)?)%/);
            let pValue = probMatch ? probMatch[0] : null;
            if (!pValue && isPercentage) {
                pValue = (parseFloat(isPercentage[1]) / 100).toString();
            }
            const atomId = (0, helpers_1.resolveAtomId)(text, atomEntries);
            let formula = (0, helpers_1.applyLogicalModifiers)(atomId, clause.modifiers.map(m => m.type), 'probabilistic.basic');
            if (pValue && clause.role !== 'conclusion') {
                // Axiom
                formulas.push({
                    formula: `Pr(${formula}) = ${pValue}`,
                    stType: 'axiom',
                    label: `a${labelCounter++}`,
                    sourceText: text,
                    sourceSentence: sIdx
                });
            }
            else if (pValue && clause.role === 'conclusion') {
                // Conclusion check
                formulas.push({
                    formula: `Pr(${formula}) = ${pValue}`,
                    stType: 'derive',
                    label: `conclusion_${labelCounter++}`,
                    sourceText: text,
                    sourceSentence: sIdx
                });
            }
            else {
                // Fallback
                formulas.push({
                    formula: (0, helpers_1.applyLogicalModifiers)(atomId, clause.modifiers.map(m => m.type), 'probabilistic.basic'),
                    stType: clause.role === 'conclusion' ? 'derive' : 'axiom',
                    label: clause.role === 'conclusion' ? `conclusion_${labelCounter++}` : `a${labelCounter++}`,
                    sourceText: text,
                    sourceSentence: sIdx
                });
            }
        }
    }
    return formulas;
}
//# sourceMappingURL=probabilistic.js.map