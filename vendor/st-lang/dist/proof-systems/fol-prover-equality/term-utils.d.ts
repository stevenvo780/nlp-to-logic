import type { FOLClause, FOLLiteral, FOLTerm } from '../fol-prover/types';
/** Returns `true` when `lit` is an equality literal (predicate `=` with exactly 2 args). */
export declare function isEqualityLiteral(lit: FOLLiteral): boolean;
/**
 * Produces a canonical string key for a term, suitable for equality checks and
 * set membership. Variables are prefixed with `?`, constants with `#`,
 * functions use `name(arg,arg,...)`.
 */
export declare function termKey(t: FOLTerm): string;
/**
 * Produces a canonical string key for a literal.
 * Negated literals are prefixed with `!`.
 */
export declare function literalKey(lit: FOLLiteral): string;
/**
 * Produces a canonical string key for a clause by sorting its literal keys.
 * Suitable for deduplication of resolved clauses.
 */
export declare function clauseKey(c: FOLClause): string;
/** Returns `true` when two terms are structurally equal (via their canonical keys). */
export declare function termsEqual(a: FOLTerm, b: FOLTerm): boolean;
/** Returns a deep copy of a term. */
export declare function cloneTerm(t: FOLTerm): FOLTerm;
/** Returns a deep copy of a literal, cloning all argument terms. */
export declare function cloneLiteral(lit: FOLLiteral): FOLLiteral;
/** Returns a deep copy of a clause (array of literals). */
export declare function cloneClause(c: FOLClause): FOLClause;
/**
 * Counts the number of nodes in the term tree (variables and constants count as 1,
 * function nodes add 1 plus the size of each argument).
 */
export declare function termSize(t: FOLTerm): number;
/**
 * Accumulates all variable names reachable from `t` into `out`.
 * @param t - The term to inspect.
 * @param out - Set that receives variable names (mutated in place).
 */
export declare function collectVars(t: FOLTerm, out: Set<string>): void;
/** Returns the set of variable names that appear anywhere in `t`. */
export declare function termVars(t: FOLTerm): Set<string>;
/**
 * Returns the subterm of `t` at the given position. Position [] returns t itself;
 * position [i, j, ...] descends into args[i], then args[j], etc.
 */
export declare function termAt(t: FOLTerm, pos: number[]): FOLTerm | null;
/**
 * Returns a new term equal to `t` but with the subterm at `pos` replaced by `replacement`.
 * If pos is invalid returns `t` unchanged.
 */
export declare function replaceAt(t: FOLTerm, pos: number[], replacement: FOLTerm): FOLTerm;
/**
 * Enumerate every (non-empty) position inside the term tree, including the root.
 * Variables and constants only yield their own position; functions also yield children.
 */
export declare function allPositions(t: FOLTerm): number[][];
/**
 * Enumerate positions for a literal as (argIndex, ...termPath). Useful for paramodulation
 * targets that point inside a literal's args.
 */
export declare function allLiteralPositions(lit: FOLLiteral): number[][];
/**
 * Returns the subterm of `lit` addressed by `pos`, where `pos[0]` selects the
 * argument index and the remaining path descends into that term.
 * Returns `null` if the position is out of range or empty.
 */
export declare function getLiteralSubterm(lit: FOLLiteral, pos: number[]): FOLTerm | null;
/**
 * Returns a new literal with the subterm at `pos` replaced by `replacement`.
 * `pos[0]` selects the argument; remaining path is forwarded to `replaceAt`.
 * Returns a clone of `lit` unchanged if `pos` is empty or invalid.
 */
export declare function replaceLiteralSubterm(lit: FOLLiteral, pos: number[], replacement: FOLTerm): FOLLiteral;
/**
 * Lexicographic path ordering–ish comparison used for orienting equations and
 * for selecting which side rewrites the other in demodulation. Strictly compares
 * (size, then key) so that the "bigger" term is rewritten into the "smaller" one.
 */
export declare function compareTerms(a: FOLTerm, b: FOLTerm): number;
/**
 * Returns a copy of `c` with every variable renamed to a globally unique name,
 * preventing variable-capture during paramodulation/resolution with other clauses.
 */
export declare function freshenClause(c: FOLClause): FOLClause;
/**
 * Converts a substitution Map to a plain Record, deep-cloning each term.
 * Useful for serialization and interop with result types that expect plain objects.
 */
export declare function substToRecordTerm(s: Map<string, FOLTerm>): Record<string, FOLTerm>;
//# sourceMappingURL=term-utils.d.ts.map