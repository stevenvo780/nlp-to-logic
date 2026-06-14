import type { AtomEntry, ClauseModifier, LogicProfile } from '../types';
export declare function buildFallbackAtomId(clauseText: string): string;
export declare function resolveAtomId(clauseText: string, allAtoms: AtomEntry[], globalMap?: Map<string, string>): string;
export declare function applyLogicalModifiers(formula: string, modifiers: Array<ClauseModifier['type'] | string>, profile: LogicProfile): string;
export declare function pickLeadingSentenceModifiers(modifiers: ClauseModifier[], family: 'modal' | 'temporal'): ClauseModifier['type'][];
export declare function stripModifierFamily(modifiers: ClauseModifier[], family: 'modal' | 'temporal'): ClauseModifier['type'][];
export declare function onlyModifierFamily(modifiers: ClauseModifier[], family: 'modal' | 'temporal'): ClauseModifier['type'][];
//# sourceMappingURL=helpers.d.ts.map