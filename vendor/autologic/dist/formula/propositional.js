"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPropositional = buildPropositional;
const connectors_1 = require("./connectors");
const helpers_1 = require("./helpers");
/**
 * Aplica reglas cuantitativas a un átomo base según el perfil lógico.
 * Útil para extraer `Pr(X) = Y` o ecuaciones aritméticas desde el texto original.
 */
function applyQuantitativeExtraction(text, baseAtomStr, profile) {
    if (profile === 'probabilistic.basic') {
        const probMatch = text.match(/0\.\d+/);
        const isPercentage = text.match(/(\d+(?:\.\d+)?)%/);
        let pValue = probMatch ? probMatch[0] : null;
        if (!pValue && isPercentage) {
            pValue = (parseFloat(isPercentage[1]) / 100).toString();
        }
        if (pValue) {
            return `(Pr(${baseAtomStr}) = ${pValue})`;
        }
    }
    if (profile === 'arithmetic') {
        // Busca patrones como "a + b = c" o "mod" y los pasa explícitamente a ST-lang en vez de usar átomos textuales
        const mathMatch = text.match(/(\w+)\s*([\+\-\*\/]|mod)\s*(\w+)\s*=\s*(\w+)/);
        if (mathMatch) {
            return text; // Return the raw text equation!
        }
    }
    return baseAtomStr;
}
/**
 * Construye fórmulas proposicionales para un conjunto de oraciones.
 * Cada oración se procesa según su tipo detectado.
 */
function buildPropositional(sentences, atomEntries, detectedPatterns, profile = 'classical.propositional') {
    const formulas = [];
    let labelCounter = 1;
    // Construir mapa global de cláusula-texto → atomId
    const globalClauseAtomMap = buildGlobalAtomMap(sentences, atomEntries);
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        const sentence = sentences[sIdx];
        const builtFormulas = buildSentenceFormulas(sentence, atomEntries, globalClauseAtomMap, sIdx, labelCounter, detectedPatterns, profile);
        formulas.push(...builtFormulas);
        labelCounter += builtFormulas.length;
    }
    return formulas;
}
/**
 * Construye un mapa global de texto-cláusula → atomId.
 */
function buildGlobalAtomMap(sentences, atomEntries) {
    const map = new Map();
    // Recopilar todas las cláusulas con su índice global
    let globalIdx = 0;
    for (const sentence of sentences) {
        for (const clause of sentence.clauses) {
            // Buscar átomo por texto exacto
            const exactMatch = atomEntries.find(a => a.text === clause.text);
            if (exactMatch) {
                map.set(clause.text, exactMatch.id);
            }
            else {
                // Buscar por inclusión
                const partialMatch = atomEntries.find(a => a.text.includes(clause.text) || clause.text.includes(a.text));
                if (partialMatch) {
                    map.set(clause.text, partialMatch.id);
                }
                else {
                    // Buscar por índice de cláusula fuente
                    const bySource = atomEntries.find(a => a.sourceClause === globalIdx);
                    if (bySource) {
                        map.set(clause.text, bySource.id);
                    }
                }
            }
            globalIdx++;
        }
    }
    return map;
}
/**
 * Construye fórmulas para una oración individual.
 */
function buildSentenceFormulas(sentence, allAtoms, globalMap, sentenceIdx, labelStart, patterns, profile) {
    const clauses = sentence.clauses;
    if (clauses.length === 0)
        return [];
    const getStr = (clause) => {
        let modTypes = clause?.modifiers ? clause.modifiers.map((m) => m.type) : [];
        if (Array.isArray(clause) && typeof clause[0] === 'string')
            modTypes = clause;
        const text = typeof clause === 'string' ? clause : clause.text;
        const isExplicitNeg = Array.isArray(clause);
        const atomId = (0, helpers_1.resolveAtomId)(text, allAtoms, globalMap);
        const modStr = (0, helpers_1.applyLogicalModifiers)(atomId, isExplicitNeg ? clause : modTypes, profile);
        return applyQuantitativeExtraction(text, modStr, profile);
    };
    const formulas = [];
    let label = labelStart;
    switch (sentence.type) {
        case 'conditional': {
            let conditionClauses = clauses.filter(c => c.role === 'condition');
            let consequentClauses = clauses.filter(c => c.role === 'consequent' || c.role === 'conclusion' || c.role === 'assertion');
            if (conditionClauses.length === 0 && clauses.length >= 2) {
                const nonConsequent = clauses.filter(c => c.role !== 'consequent' && c.role !== 'conclusion');
                if (nonConsequent.length > 0) {
                    conditionClauses = [nonConsequent[0]];
                    consequentClauses = clauses.filter(c => c !== nonConsequent[0]);
                }
            }
            if (conditionClauses.length > 0 && consequentClauses.length === 0) {
                const nonConditions = clauses.filter(c => c.role !== 'condition');
                if (nonConditions.length > 0) {
                    consequentClauses = nonConditions;
                }
            }
            if (conditionClauses.length > 0 && consequentClauses.length > 0) {
                const antStr = getStr(conditionClauses[0]);
                const consStr = getStr(consequentClauses[0]);
                formulas.push({
                    formula: `${antStr} ${connectors_1.ST_OPERATORS.implication} ${consStr}`,
                    stType: 'axiom',
                    label: `regla_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Condicional: "${sentence.original}"`,
                });
                const supplementalClauses = clauses.filter(clause => clause !== conditionClauses[0] && clause !== consequentClauses[0]);
                for (const clause of supplementalClauses) {
                    formulas.push({
                        formula: getStr(clause),
                        stType: clause.role === 'conclusion' ? 'derive' : 'axiom',
                        label: `hecho_${++label}`,
                        sourceText: clause.text,
                        sourceSentence: sentenceIdx,
                        comment: `Subcláusula condicional: "${clause.text}"`,
                    });
                }
            }
            break;
        }
        case 'biconditional': {
            if (clauses.length >= 2) {
                formulas.push({
                    formula: `${getStr(clauses[0])} ${connectors_1.ST_OPERATORS.biconditional} ${getStr(clauses[1])}`,
                    stType: 'axiom',
                    label: `bicond_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Bicondicional: "${sentence.original}"`,
                });
            }
            break;
        }
        case 'conjunction': {
            const atoms = clauses.map(c => getStr(c));
            if (atoms.length >= 2) {
                formulas.push({
                    formula: atoms.join(` ${connectors_1.ST_OPERATORS.conjunction} `),
                    stType: 'axiom',
                    label: `conj_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Conjunción: "${sentence.original}"`,
                });
            }
            else if (atoms.length === 1) {
                formulas.push({
                    formula: atoms[0],
                    stType: 'axiom',
                    label: `hecho_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Hecho: "${sentence.original}"`,
                });
            }
            break;
        }
        case 'disjunction': {
            const atoms = clauses.map(c => getStr(c));
            if (atoms.length >= 2) {
                formulas.push({
                    formula: atoms.join(` ${connectors_1.ST_OPERATORS.disjunction} `),
                    stType: 'axiom',
                    label: `disj_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Disyunción: "${sentence.original}"`,
                });
            }
            break;
        }
        case 'negation': {
            if (clauses.length > 0) {
                const atomId = (0, helpers_1.resolveAtomId)(clauses[0].text, allAtoms, globalMap);
                const modStr = (0, helpers_1.applyLogicalModifiers)(atomId, ['negation'], profile);
                formulas.push({
                    formula: applyQuantitativeExtraction(clauses[0].text, modStr, profile),
                    stType: 'axiom',
                    label: `neg_${label}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Negación: "${sentence.original}"`,
                });
            }
            break;
        }
        case 'complex': {
            const premiseClauses = clauses.filter(c => c.role === 'premise');
            const conclusionClauses = clauses.filter(c => c.role === 'conclusion');
            if (premiseClauses.length > 0 && conclusionClauses.length > 0) {
                const premiseAtoms = premiseClauses.map(pc => getStr(pc));
                const conclusionStr = getStr(conclusionClauses[0]);
                const antecedent = premiseAtoms.length === 1 ? premiseAtoms[0] : `(${premiseAtoms.join(` ${connectors_1.ST_OPERATORS.conjunction} `)})`;
                formulas.push({
                    formula: `${antecedent} ${connectors_1.ST_OPERATORS.implication} ${conclusionStr}`,
                    stType: 'axiom',
                    label: `regla_${label++}`,
                    sourceText: sentence.original,
                    sourceSentence: sentenceIdx,
                    comment: `Causal: "${sentence.original}"`,
                });
                for (const pClause of premiseClauses) {
                    formulas.push({
                        formula: getStr(pClause),
                        stType: 'axiom',
                        label: `premisa_${label++}`,
                        sourceText: pClause.text,
                        sourceSentence: sentenceIdx,
                        comment: `Premisa: "${pClause.text}"`,
                    });
                }
                for (const cClause of conclusionClauses) {
                    formulas.push({
                        formula: getStr(cClause),
                        stType: 'derive',
                        label: `conclusion_${label++}`,
                        sourceText: cClause.text,
                        sourceSentence: sentenceIdx,
                        comment: `Conclusión: "${cClause.text}"`,
                    });
                }
            }
            else {
                for (const pClause of premiseClauses) {
                    formulas.push({
                        formula: getStr(pClause),
                        stType: 'axiom',
                        label: `premisa_${label++}`,
                        sourceText: pClause.text,
                        sourceSentence: sentenceIdx,
                        comment: `Premisa: "${pClause.text}"`,
                    });
                }
            }
            break;
        }
        default: {
            for (const clause of clauses) {
                const isConclusion = clause.role === 'conclusion';
                formulas.push({
                    formula: getStr(clause),
                    stType: isConclusion ? 'derive' : 'axiom',
                    label: isConclusion ? `conclusion_${label}` : `hecho_${label}`,
                    sourceText: clause.text,
                    sourceSentence: sentenceIdx,
                    comment: isConclusion ? `Conclusión: "${clause.text}"` : `Hecho: "${clause.text}"`,
                });
                label++;
            }
            break;
        }
    }
    return formulas;
}
//# sourceMappingURL=propositional.js.map