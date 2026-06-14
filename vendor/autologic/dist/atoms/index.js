"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diceSimilarity = exports.resolveCoreferenceGroups = exports.areCoreferent = exports.generateVariableId = exports.generatePredicateId = exports.generateId = exports.extractSemanticHint = exports.extractSubjectPredicate = exports.bagOfStems = exports.extractStems = exports.extractKeywords = void 0;
exports.extractAtoms = extractAtoms;
/**
 * Atoms — Extractor de átomos proposicionales
 */
var keyword_extractor_1 = require("./keyword-extractor");
Object.defineProperty(exports, "extractKeywords", { enumerable: true, get: function () { return keyword_extractor_1.extractKeywords; } });
Object.defineProperty(exports, "extractStems", { enumerable: true, get: function () { return keyword_extractor_1.extractStems; } });
Object.defineProperty(exports, "bagOfStems", { enumerable: true, get: function () { return keyword_extractor_1.bagOfStems; } });
Object.defineProperty(exports, "extractSubjectPredicate", { enumerable: true, get: function () { return keyword_extractor_1.extractSubjectPredicate; } });
Object.defineProperty(exports, "extractSemanticHint", { enumerable: true, get: function () { return keyword_extractor_1.extractSemanticHint; } });
var identifier_gen_1 = require("./identifier-gen");
Object.defineProperty(exports, "generateId", { enumerable: true, get: function () { return identifier_gen_1.generateId; } });
Object.defineProperty(exports, "generatePredicateId", { enumerable: true, get: function () { return identifier_gen_1.generatePredicateId; } });
Object.defineProperty(exports, "generateVariableId", { enumerable: true, get: function () { return identifier_gen_1.generateVariableId; } });
var coreference_1 = require("./coreference");
Object.defineProperty(exports, "areCoreferent", { enumerable: true, get: function () { return coreference_1.areCoreferent; } });
Object.defineProperty(exports, "resolveCoreferenceGroups", { enumerable: true, get: function () { return coreference_1.resolveCoreferenceGroups; } });
Object.defineProperty(exports, "diceSimilarity", { enumerable: true, get: function () { return coreference_1.diceSimilarity; } });
const keyword_extractor_2 = require("./keyword-extractor");
const identifier_gen_2 = require("./identifier-gen");
const coreference_2 = require("./coreference");
/**
 * Extrae átomos proposicionales de oraciones analizadas.
 * Resuelve coreferencia y asigna IDs simbólicos.
 */
function extractAtoms(sentences, options = {}) {
    const language = options.language || 'es';
    const style = options.atomStyle || 'keywords';
    const profile = options.profile || 'classical.propositional';
    const buildSemanticFields = (text) => (0, keyword_extractor_2.extractSemanticHint)(text, language);
    const semanticCache = new Map();
    const getSemantic = (text) => {
        const cached = semanticCache.get(text);
        if (cached)
            return cached;
        const semantic = buildSemanticFields(text);
        semanticCache.set(text, semantic);
        return semantic;
    };
    // 1. Recopilar todos los textos de cláusulas
    const clauseTexts = [];
    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        for (let cIdx = 0; cIdx < sentences[sIdx].clauses.length; cIdx++) {
            const clause = sentences[sIdx].clauses[cIdx];
            clauseTexts.push({
                text: clause.text,
                sentIdx: sIdx,
                clauseIdx: cIdx,
                role: clause.role,
            });
        }
    }
    // 2. Resolver coreferencia
    const texts = clauseTexts.map(ct => ct.text);
    const corefGroups = (0, coreference_2.resolveCoreferenceGroups)(texts, language);
    // 2b. Separar conclusiones de la coreferencia:
    // Una cláusula con rol 'conclusion' no debe fusionarse con premisas/aserciones
    // porque representa una proposición derivada distinta.
    for (let i = 0; i < clauseTexts.length; i++) {
        const ct = clauseTexts[i];
        if (ct.role === 'conclusion') {
            const rep = corefGroups.get(i);
            // Si fue fusionada con otra cláusula que NO es conclusión, separarla
            if (rep !== undefined && rep !== i) {
                const repClause = clauseTexts[rep];
                if (repClause && repClause.role !== 'conclusion') {
                    corefGroups.set(i, i); // se convierte en su propio representante
                }
            }
        }
    }
    // 3. Generar átomos únicos
    const atoms = new Map();
    const entries = [];
    const representativeIds = new Map(); // groupIdx → atomId
    let atomCounter = 0;
    for (let i = 0; i < clauseTexts.length; i++) {
        const ct = clauseTexts[i];
        let representative = profile === 'probabilistic.basic'
            || profile === 'epistemic.s5'
            || profile === 'classical.first_order'
            || profile === 'aristotelian.syllogistic'
            ? i
            : (corefGroups.get(i) ?? i);
        if (representative !== i) {
            const repSemantic = getSemantic(clauseTexts[representative].text);
            const currentSemantic = getSemantic(ct.text);
            if (shouldKeepSeparate(repSemantic, currentSemantic)) {
                representative = i;
                corefGroups.set(i, i);
            }
        }
        if (representativeIds.has(representative)) {
            // Ya existe un átomo para este grupo de coreferencia
            const existingId = representativeIds.get(representative);
            const semantic = getSemantic(ct.text);
            entries.push({
                id: existingId,
                text: ct.text,
                sourceClause: i,
                role: ct.role,
                subject: semantic.subject,
                predicate: semantic.predicate,
                object: semantic.object,
                polarity: semantic.polarity,
                relationKind: semantic.relationKind,
                keywords: semantic.keywords,
            });
            continue;
        }
        // Crear nuevo átomo
        let atomId;
        const semantic = getSemantic(ct.text);
        if (profile === 'classical.first_order' || profile === 'aristotelian.syllogistic' || profile === 'arithmetic') {
            // Para primer orden: extraer predicado y términos
            const sp = (0, keyword_extractor_2.extractSubjectPredicate)(ct.text, language);
            if (sp) {
                const predicate = (0, identifier_gen_2.generatePredicateId)(sp.predicate.split('_'));
                const variable = (0, identifier_gen_2.generateVariableId)(sp.subject);
                atomId = `${predicate}(${variable})`;
                entries.push({
                    id: atomId,
                    text: ct.text,
                    sourceClause: i,
                    role: ct.role,
                    predicate,
                    terms: [variable],
                    subject: sp.subject,
                    object: undefined,
                    polarity: semantic.polarity,
                    relationKind: 'copula',
                    keywords: semantic.keywords,
                });
            }
            else {
                const keywords = (0, keyword_extractor_2.extractKeywords)(ct.text, language);
                atomId = (0, identifier_gen_2.generateId)(keywords, style, atomCounter);
                entries.push({
                    id: atomId,
                    text: ct.text,
                    sourceClause: i,
                    role: ct.role,
                    subject: semantic.subject,
                    predicate: semantic.predicate,
                    object: semantic.object,
                    polarity: semantic.polarity,
                    relationKind: semantic.relationKind,
                    keywords: semantic.keywords,
                });
            }
        }
        else {
            const keywords = (0, keyword_extractor_2.extractKeywords)(ct.text, language);
            atomId = (0, identifier_gen_2.generateId)(keywords, style, atomCounter);
            atomId = ensureUniqueAtomId(atomId, ct.text, atoms, profile, atomCounter);
            entries.push({
                id: atomId,
                text: ct.text,
                sourceClause: i,
                role: ct.role,
                subject: semantic.subject,
                predicate: semantic.predicate,
                object: semantic.object,
                polarity: semantic.polarity,
                relationKind: semantic.relationKind,
                keywords: semantic.keywords,
            });
        }
        atoms.set(atomId, ct.text);
        representativeIds.set(representative, atomId);
        atomCounter++;
    }
    return { atoms, entries };
}
function ensureUniqueAtomId(atomId, text, atoms, profile, atomCounter) {
    if (!atoms.has(atomId) || atoms.get(atomId) === text) {
        return atomId;
    }
    if (true) {
        return `${atomId}_${atomCounter}`;
    }
    return atomId;
}
function shouldKeepSeparate(representative, candidate) {
    if (representative.polarity !== candidate.polarity) {
        return true;
    }
    // Canonicalizamos las raíces antes de comparar para que variantes flexivas
    // (LLUEVE/LLOVIENDO, CALLE_MOJA/MOJADA_CALLE) no se consideren en conflicto
    // y la coreferencia previa no se deshaga aquí (BUG-C1).
    const canon = (s) => (s ? (0, coreference_2.canonicalStem)(s) : s);
    const repSubject = canon(representative.subject);
    const repPredicate = canon(representative.predicate);
    const repObject = canon(representative.object);
    const candSubject = canon(candidate.subject);
    const candPredicate = canon(candidate.predicate);
    const candObject = canon(candidate.object);
    const subjectConflict = repSubject && candSubject && repSubject !== candSubject;
    const predicateConflict = repPredicate && candPredicate && repPredicate !== candPredicate;
    const objectConflict = repObject && candObject && repObject !== candObject;
    const sharedKeywords = representative.keywords.filter(keyword => candidate.keywords.includes(keyword));
    if ((subjectConflict || predicateConflict || objectConflict) && sharedKeywords.length < 3) {
        return true;
    }
    return false;
}
//# sourceMappingURL=index.js.map