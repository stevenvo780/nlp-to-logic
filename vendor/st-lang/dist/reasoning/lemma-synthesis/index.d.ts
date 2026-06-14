/**
 * Algebraic signature for lemma synthesis: declares sorts, constants,
 * functions (with argument and result sorts) and predicates.
 * The synthesizer enumerates terms and conjectures equalities based on this.
 */
export interface Signature {
    sorts: string[];
    constants: Array<{
        name: string;
        sort: string;
    }>;
    functions: Array<{
        name: string;
        argSorts: string[];
        resultSort: string;
    }>;
    predicates: Array<{
        name: string;
        argSorts: string[];
    }>;
}
/**
 * Término interno. Lo mantenemos discriminado para podarlo
 * y serializarlo sin ambigüedad.
 */
export type Term = {
    kind: 'var';
    name: string;
    sort: string;
} | {
    kind: 'const';
    name: string;
    sort: string;
} | {
    kind: 'app';
    name: string;
    args: Term[];
    sort: string;
};
/**
 * A synthesized equality conjecture `∀vars. termLeft = termRight`.
 * `confidence = 1` means all random tests passed; smaller values indicate partial evidence.
 */
export interface Conjecture {
    variables: Array<{
        name: string;
        sort: string;
    }>;
    formula: string;
    confidence: number;
    termLeft?: Term;
    termRight?: Term;
}
/** Options controlling synthesis depth, test count, and randomness. */
export interface SynthesisOptions {
    /** Maximum term depth for enumeration (default 2). */
    maxDepth?: number;
    /** Number of random valuations to test each conjecture (default 100). */
    numTests?: number;
    /** Maximum number of conjectures to return (default 200). */
    maxConjectures?: number;
    /** Generador de valuaciones aleatorias por sort */
    randomValue?: (sort: string, rng: () => number) => unknown;
    /** Variables disponibles por sort (default: 2 por sort) */
    varsPerSort?: number;
    /** Semilla para PRNG determinístico */
    seed?: number;
}
/** Serializes a term to a human-readable string, using infix notation for binary operators. */
export declare function termToString(t: Term): string;
declare function termKey(t: Term): string;
/** Lista las variables que aparecen en un término, en orden de primera aparición */
export declare function freeVars(t: Term): Array<{
    name: string;
    sort: string;
}>;
declare function mulberry32(seed: number): () => number;
/**
 * Enumera todos los términos cerrados (sobre constantes + variables
 * declaradas) del sort dado, hasta `depth`. Profundidad 0 = solo
 * variables y constantes; cada nivel agrega aplicaciones cuyos
 * argumentos provienen de niveles inferiores.
 */
export declare function enumerateTerms(sig: Signature, sort: string, depth: number, variables?: Array<{
    name: string;
    sort: string;
}>): Term[];
/**
 * Evaluates a term under a variable environment.
 * Should throw when the term is ill-typed or outside the evaluator's domain;
 * the synthesizer will skip conjectures whose terms cannot be evaluated.
 */
export type Evaluator = (term: Term, env: Record<string, unknown>) => unknown;
/**
 * Sintetiza conjeturas de igualdad: para cada par de términos del
 * mismo sort, las evalúa sobre `numTests` valuaciones aleatorias.
 * Sobreviven las que pasan todas las pruebas.
 */
export declare function synthesizeEqualities(sig: Signature, evaluator: Evaluator, opts?: SynthesisOptions): Conjecture[];
declare function termSize(t: Term): number;
declare function serializeValue(v: unknown): string;
/**
 * Descarta conjeturas redundantes:
 *   • Reflexivas (t = t).
 *   • Simétricas duplicadas (t1 = t2 vs t2 = t1).
 *   • Instancias de otras conjeturas más generales (un lemma
 *     ya hallado subsume a uno con más estructura específica).
 */
export declare function pruneConsequences(conjectures: Conjecture[]): Conjecture[];
/**
 * Reescritura sintáctica simple: si `t` (o un subtérmino) matchea
 * `pattern` con substitución σ, reemplaza por `σ(replacement)`.
 * Solo intenta una sustitución de raíz para mantenerlo predecible.
 */
declare function rewriteOnce(t: Term, pattern: Term, replacement: Term): Term;
declare function match(pattern: Term, target: Term, subst: Map<string, Term>): Map<string, Term> | null;
declare function applySubst(t: Term, subst: Map<string, Term>): Term;
/**
 * An optional external prover that attempts to prove or disprove a conjecture.
 * Returns `{ proven: true }` on success, `{ proven: false, counter }` on refutation,
 * or `{ proven: false }` when the result is unknown.
 */
export type Prover = (conjecture: Conjecture) => {
    proven: boolean;
    counter?: unknown;
};
/** A conjecture annotated with its verification status after calling a {@link Prover}. */
export interface VerifiedConjecture extends Conjecture {
    status: 'verified' | 'counter' | 'unknown';
    counter?: unknown;
}
/**
 * Runs each conjecture through `prover`, annotating it with
 * `'verified'`, `'counter'` (with a counterexample), or `'unknown'`.
 * Prover exceptions are silently caught and treated as `'unknown'`.
 */
export declare function verifyConjectures(conjectures: Conjecture[], prover: Prover): VerifiedConjecture[];
/** Returns a {@link Signature} for the natural numbers (0, S, +, *). */
export declare function naturalNumbersSignature(): Signature;
/** Returns a {@link Signature} for booleans (T, F, ¬, ∧, ∨). */
export declare function booleansSignature(): Signature;
/** Returns a {@link Signature} for lists over Nat (nil, cons, ++, length). */
export declare function listsSignature(): Signature;
/** Sample {@link Evaluator} for the natural numbers signature. */
export declare const naturalsEvaluator: Evaluator;
/** Sample {@link Evaluator} for the booleans signature. */
export declare const booleansEvaluator: Evaluator;
/** Sample {@link Evaluator} for the lists-over-Nat signature. */
export declare const listsEvaluator: Evaluator;
export declare const __internals: {
    termKey: typeof termKey;
    termSize: typeof termSize;
    match: typeof match;
    rewriteOnce: typeof rewriteOnce;
    applySubst: typeof applySubst;
    mulberry32: typeof mulberry32;
    serializeValue: typeof serializeValue;
};
export {};
//# sourceMappingURL=index.d.ts.map