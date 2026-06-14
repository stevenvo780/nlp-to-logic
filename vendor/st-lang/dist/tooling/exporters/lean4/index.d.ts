import { Formula, Proof } from '../../../types';
export interface Lean4ExportOptions {
    /** Default: 'STExport' */
    moduleName?: string;
    /** Explicit import list. When omitted, picks default depending on `useMathlib`. */
    imports?: string[];
    /** Default: true — when true and `imports` not set, uses Mathlib preset. */
    useMathlib?: boolean;
    /** Default: true — emits a `theorem stmt_proof : stmt := by ...` skeleton. */
    emitProof?: boolean;
}
export declare const COMMON_IMPORTS: Record<'standard' | 'mathlib' | 'minimal', string[]>;
/**
 * Maps ST/Unicode logical operators to their Lean 4 surface syntax.
 * Lean 4 happens to accept the same Unicode glyphs, but we keep the
 * map explicit so downstream tooling can introspect the mapping.
 */
export declare const LEAN4_OPS: Map<string, string>;
/**
 * Converts an ST Formula AST node into a Lean 4 Prop expression string.
 * Unsupported kinds emit `(/- unsupported: <kind> -/)` so dropped
 * sub-trees are visible to the reader.
 */
export declare function formulaToLeanTerm(formula: Formula): string;
/**
 * Translates a natural-deduction rule label into a Lean 4 tactic.
 * Used by callers that already know what rule they want to apply
 * outside the context of a full proof step.
 */
export declare function leanTacticForRule(rule: string): string;
/**
 * Exports a single ST Formula as a Lean 4 module containing a
 * `def stmt : Prop := ...` and an optional `theorem stmt_proof : stmt := by ...`.
 */
export declare function exportToLean4(formula: Formula, opts?: Lean4ExportOptions): string;
/**
 * Exports an ST Proof object as a Lean 4 module whose theorem body is
 * derived from the proof steps.
 */
export declare function exportProofToLean4(proof: Proof, opts?: Lean4ExportOptions): string;
/**
 * Exports a small theory (axioms + theorems) as a single Lean 4 module.
 * Axioms become `axiom ax_i : <prop>` declarations; theorems become
 * `theorem th_i : <prop> := by sorry` skeletons that the user fills in.
 */
export declare function exportTheoryToLean4(axioms: Formula[], theorems: Formula[], opts?: Lean4ExportOptions): string;
//# sourceMappingURL=index.d.ts.map