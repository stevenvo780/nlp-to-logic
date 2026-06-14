/**
 * A first-order hyperreal number `standard + infinitesimal · ε`,
 * where ε is a formal infinitesimal (ε² ≈ 0).
 */
export interface Hyperreal {
    readonly standard: number;
    readonly infinitesimal: number;
}
/**
 * Constructs a {@link Hyperreal} from its standard and optional infinitesimal parts.
 * `hr(x)` produces the standard real `x + 0ε`.
 */
export declare function hr(standard: number, infinitesimal?: number): Hyperreal;
/** The hyperreal zero: 0 + 0ε. */
export declare const HR_ZERO: Hyperreal;
/** The hyperreal one: 1 + 0ε. */
export declare const HR_ONE: Hyperreal;
/** The formal infinitesimal ε: 0 + 1ε. */
export declare const HR_EPSILON: Hyperreal;
/** Returns `a + b` (component-wise addition). */
export declare function add(a: Hyperreal, b: Hyperreal): Hyperreal;
/** Returns `a - b` (component-wise subtraction). */
export declare function sub(a: Hyperreal, b: Hyperreal): Hyperreal;
/**
 * Returns `a * b`, discarding O(ε²) terms:
 * `(a.s + a.i ε)(b.s + b.i ε) = a.s·b.s + (a.s·b.i + a.i·b.s)·ε`.
 */
export declare function mul(a: Hyperreal, b: Hyperreal): Hyperreal;
/**
 * Compara dos hiperreales lexicográficamente: primero la parte estándar,
 * luego la infinitesimal. Devuelve -1, 0 o 1.
 *
 * Usa una tolerancia ínfima sobre las componentes para absorber el ruido
 * de coma flotante; los infinitesimales formales no se ven afectados
 * porque su magnitud es de orden O(1) en el coeficiente.
 */
export declare function compare(a: Hyperreal, b: Hyperreal): -1 | 0 | 1;
/** Returns `true` when `a` and `b` are equal under the lexicographic order. */
export declare function eq(a: Hyperreal, b: Hyperreal): boolean;
/** Returns `true` when `a < b` in the hyperreal order. */
export declare function lt(a: Hyperreal, b: Hyperreal): boolean;
/** Returns `true` when `a > b` in the hyperreal order. */
export declare function gt(a: Hyperreal, b: Hyperreal): boolean;
/** Probabilistic AND: `p ∧ q = p · q`. */
export declare function hrAnd(p: Hyperreal, q: Hyperreal): Hyperreal;
/** Probabilistic OR (inclusion-exclusion): `p ∨ q = p + q − p·q`. */
export declare function hrOr(p: Hyperreal, q: Hyperreal): Hyperreal;
/** Probabilistic NOT: `¬p = 1 − p`. */
export declare function hrNot(p: Hyperreal): Hyperreal;
/** Probabilistic implication: `p → q = ¬p ∨ q`. */
export declare function hrImplies(p: Hyperreal, q: Hyperreal): Hyperreal;
/** A closed interval `[lower, upper]` of hyperreal probabilities. */
export interface UncertaintyBound {
    readonly lower: Hyperreal;
    readonly upper: Hyperreal;
}
/**
 * Constructs a validated {@link UncertaintyBound}.
 * @throws When `lower > upper` in the hyperreal order.
 */
export declare function bound(lower: Hyperreal, upper: Hyperreal): UncertaintyBound;
/**
 * Propaga una operación lógica sobre cotas de incertidumbre.
 *
 * - `and`/`or` requieren `other`; ambas operaciones son monótonas en
 *   sus dos argumentos, por lo que la cota se obtiene aplicando la
 *   operación a (lower, lower) y (upper, upper) respectivamente.
 * - `not` invierte la cota: ¬[a, b] = [1 − b, 1 − a].
 * - `implies` requiere `other`. p → q es decreciente en p y creciente
 *   en q ⇒ lower = (upper_p → lower_q), upper = (lower_p → upper_q).
 */
export declare function propagate(b: UncertaintyBound, op: 'and' | 'or' | 'not' | 'implies', other?: UncertaintyBound): UncertaintyBound;
/** Returns a human-readable string like `"0.9 + 3ε"` or `"1"` (when infinitesimal is 0). */
export declare function hrToString(x: Hyperreal): string;
//# sourceMappingURL=index.d.ts.map