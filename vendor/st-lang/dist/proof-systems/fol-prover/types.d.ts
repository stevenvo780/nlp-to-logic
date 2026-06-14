/**
 * A first-order term: variable, constant, or function application.
 * `args` is present (and may be empty) only when `kind === 'func'`.
 */
export interface FOLTerm {
    kind: 'var' | 'const' | 'func';
    name: string;
    args?: FOLTerm[];
}
/** A first-order literal: a (possibly negated) predicate applied to terms. */
export interface FOLLiteral {
    negated: boolean;
    predicate: string;
    args: FOLTerm[];
}
/** A clause in CNF: a disjunction of literals. Empty clause represents ⊥. */
export type FOLClause = FOLLiteral[];
/** Records one resolution step: which two clauses were resolved and the result. */
export interface FOLResolutionStep {
    from: [number, number];
    resolvent: FOLClause;
    substitution: Record<string, string>;
}
/** Result returned by the FOL resolution prover. */
export interface FOLProveResult {
    proven: boolean;
    steps: FOLResolutionStep[];
    timeoutHit?: boolean;
    reason?: string;
}
/** Options controlling the FOL prover's search budget. */
export interface FOLProveOptions {
    timeoutMs?: number;
    maxSteps?: number;
}
/** Creates a variable term. */
export declare function mkVar(name: string): FOLTerm;
/** Creates a constant term. */
export declare function mkConst(name: string): FOLTerm;
/** Creates a function application term. */
export declare function mkFunc(name: string, args: FOLTerm[]): FOLTerm;
/** Creates a literal from its negation flag, predicate name, and argument terms. */
export declare function mkLit(negated: boolean, predicate: string, args: FOLTerm[]): FOLLiteral;
/** Renders a term as `name` (var/const) or `name(arg,...)` (func). */
export declare function termToString(t: FOLTerm): string;
/** Renders a literal as `P(args)` or `¬P(args)`. */
export declare function literalToString(lit: FOLLiteral): string;
/** Renders a clause as a disjunction of literals, or `⊥` for the empty clause. */
export declare function clauseToString(c: FOLClause): string;
//# sourceMappingURL=types.d.ts.map