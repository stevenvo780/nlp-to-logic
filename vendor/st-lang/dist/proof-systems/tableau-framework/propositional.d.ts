import { TableauProver } from './TableauProver';
/**
 * Minimal formula shape used by the propositional prover.
 * More fields (args, name, etc.) are allowed via the index signature.
 */
export type PropFormula = {
    kind: string;
    [k: string]: unknown;
};
export declare function createPropositionalProver(): TableauProver<PropFormula>;
//# sourceMappingURL=propositional.d.ts.map