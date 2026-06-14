type Clause = Int32Array;
/**
 * Result of preprocessing: simplified clauses and any forced assignments.
 */
export interface PreprocessResult {
    clauses: Clause[];
    forcedLiterals: number[];
    eliminated: boolean;
    trivialUnsat: boolean;
}
/**
 * Main preprocessing pipeline.
 * Applies simplifications in order of effectiveness.
 */
export declare function preprocess(clauses: Clause[], numVars: number): PreprocessResult;
export {};
//# sourceMappingURL=sat-preprocess.d.ts.map