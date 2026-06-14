/**
 * Atoms — Extractor de átomos proposicionales
 */
export { extractKeywords, extractStems, bagOfStems, extractSubjectPredicate, extractSemanticHint } from './keyword-extractor';
export { generateId, generatePredicateId, generateVariableId } from './identifier-gen';
export { areCoreferent, resolveCoreferenceGroups, diceSimilarity } from './coreference';
import type { AtomEntry, AtomStyle, Language, AnalyzedSentence, LogicProfile } from '../types';
/**
 * Extrae átomos proposicionales de oraciones analizadas.
 * Resuelve coreferencia y asigna IDs simbólicos.
 */
export declare function extractAtoms(sentences: AnalyzedSentence[], options?: {
    language?: Language;
    atomStyle?: AtomStyle;
    profile?: LogicProfile;
}): {
    atoms: Map<string, string>;
    entries: AtomEntry[];
};
//# sourceMappingURL=index.d.ts.map