import { Formula, Proof } from '../../../types';
export interface CoqExportOptions {
    /** Default: 'STExport' */
    moduleName?: string;
    /** Default: true — emits `Require Import Classical.` header */
    includeImports?: boolean;
    /** Default: true — emits a Theorem + Proof skeleton (Admitted. if not derivable) */
    emitProof?: boolean;
}
/**
 * Converts an ST Formula AST node into a Coq Prop expression string.
 * Only classical connectives and quantifiers are handled; other kinds
 * produce a `(* unsupported: <kind> *)` placeholder so callers can
 * inspect what was dropped.
 */
export declare function formulaToCoqTerm(formula: Formula): string;
/**
 * Exports a single ST Formula as a Coq module with a `Definition`
 * and an optional `Theorem` skeleton.
 *
 * @param formula - The ST Formula AST node.
 * @param opts    - Export options (moduleName, includeImports, emitProof).
 * @returns       Valid Coq source code as a string.
 */
export declare function exportToCoq(formula: Formula, opts?: CoqExportOptions): string;
/**
 * Exports an ST Proof object as a Coq module with a `Definition`
 * and a `Theorem` block whose body is derived from the proof steps.
 *
 * @param proof - The ST Proof object.
 * @param opts  - Export options.
 * @returns     Valid Coq source code as a string.
 */
export declare function exportProofToCoq(proof: Proof, opts?: CoqExportOptions): string;
//# sourceMappingURL=index.d.ts.map