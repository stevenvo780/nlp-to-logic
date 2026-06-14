import { ExerciseKind, ExerciseLevel, ProfileName } from './types';
import { SeededRng } from './rng';
export interface TemplateContext {
    vars: string[];
    rng: SeededRng;
}
export interface BuildResult {
    formula?: string;
    premises?: string[];
    goal?: string;
    expectedStatus: 'valid' | 'invalid' | 'satisfiable' | 'unsatisfiable' | 'provable' | 'refutable';
    prompt: string;
    hints: string[];
    explanation: string;
    canonicalFormula?: string;
    countermodelHint?: Record<string, boolean>;
}
export interface ExerciseTemplate {
    id: string;
    level: ExerciseLevel;
    kind: ExerciseKind;
    profiles: ProfileName[];
    minVars: number;
    build(ctx: TemplateContext): BuildResult;
}
export declare function pickVars(rng: SeededRng, count: number): string[];
export declare function listTemplates(): ExerciseTemplate[];
export declare function findTemplatesFor(level: ExerciseLevel, profile: ProfileName, kind: ExerciseKind): ExerciseTemplate[];
export declare function findTemplateById(id: string): ExerciseTemplate | undefined;
//# sourceMappingURL=templates.d.ts.map