/**
 * Functions modelled as sets of Kuratowski ordered pairs (the graph), plus
 * an explicit domain and codomain. A graph is a valid function iff it is
 * functional: ⟨x, y₁⟩ ∈ f and ⟨x, y₂⟩ ∈ f implies y₁ = y₂.
 */
import { HFSet } from './hf-sets';
export interface HFFunction {
    readonly graph: HFSet;
    readonly domain: HFSet;
    readonly codomain: HFSet;
}
/**
 * The graph must be a subset of domain × codomain, every element must be
 * a Kuratowski pair, and the relation must be functional. We also require
 * the graph to be total on `domain` so that `apply` is well-defined for
 * every x in the declared domain.
 */
export declare function isValidFunction(f: HFFunction): boolean;
export declare function applyHF(f: HFFunction, x: HFSet): HFSet | null;
/**
 * (f ∘ g)(x) = f(g(x)). Returns null when the codomain of g is not the
 * domain of f, or either function is malformed.
 */
export declare function composeHF(f: HFFunction, g: HFFunction): HFFunction | null;
export declare function isInjective(f: HFFunction): boolean;
export declare function isSurjective(f: HFFunction): boolean;
export declare function isBijective(f: HFFunction): boolean;
/**
 * Constructor helper: builds an HFFunction from an explicit mapping. The
 * caller passes parallel arrays; we form the graph from Kuratowski pairs.
 * No validation here — call `isValidFunction` afterwards if you need it.
 */
export declare function makeFunction(domain: HFSet, codomain: HFSet, mapping: ReadonlyArray<readonly [HFSet, HFSet]>): HFFunction;
export declare const EMPTY_FUNCTION: HFFunction;
//# sourceMappingURL=hf-functions.d.ts.map