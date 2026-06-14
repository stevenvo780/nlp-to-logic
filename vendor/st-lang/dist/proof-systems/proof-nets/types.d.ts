/** Polarity of an MLL atom: `'pos'` for A, `'neg'` for A⊥. */
export type Polarity = 'pos' | 'neg';
/**
 * A formula in Multiplicative Linear Logic (MLL).
 * Atoms carry explicit polarity; duality is involutive (A⊥)⊥ = A and
 * distributes De Morgan: (A⊗B)⊥ = A⊥ ⅋ B⊥, (A⅋B)⊥ = A⊥ ⊗ B⊥.
 */
export type MLLFormula = {
    kind: 'atom';
    name: string;
    polarity: Polarity;
} | {
    kind: 'tensor';
    left: MLLFormula;
    right: MLLFormula;
} | {
    kind: 'par';
    left: MLLFormula;
    right: MLLFormula;
};
/** The four link types in a Girard proof net (axiom, cut, tensor, par). */
export type LinkKind = 'axiom' | 'cut' | 'tensor' | 'par';
export interface ProofNetLink {
    kind: LinkKind;
    ports: number[];
}
/** A single formula occurrence in a proof net, identified by a numeric id. */
export interface ProofNetNode {
    id: number;
    formula: MLLFormula;
}
/**
 * A Girard proof net for MLL.
 * `conclusions` holds the ids of border nodes (not premise of any tensor/par, not in a cut).
 */
export interface ProofNet {
    nodes: ProofNetNode[];
    links: ProofNetLink[];
    conclusions: number[];
}
/** Creates a positive atom `A` (polarity `'pos'`). */
export declare const atomPos: (name: string) => MLLFormula;
/** Creates a negative atom `A⊥` (polarity `'neg'`). */
export declare const atomNeg: (name: string) => MLLFormula;
/** Creates a tensor formula `A ⊗ B`. */
export declare const tensor: (left: MLLFormula, right: MLLFormula) => MLLFormula;
/** Creates a par formula `A ⅋ B`. */
export declare const par: (left: MLLFormula, right: MLLFormula) => MLLFormula;
export declare function dual(f: MLLFormula): MLLFormula;
/** Returns `true` when two MLL formulas are structurally equal. */
export declare function formulaEquals(a: MLLFormula, b: MLLFormula): boolean;
/** Renders an MLL formula as a human-readable string using ⊗, ⅋, and ⊥ notation. */
export declare function formulaToString(f: MLLFormula): string;
//# sourceMappingURL=types.d.ts.map