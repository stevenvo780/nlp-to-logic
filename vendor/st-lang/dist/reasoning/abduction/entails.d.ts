import type { EntailmentOracle, Formula } from './types';
export interface DefaultEntailsOptions {
    /** Nombres tratados como variables. Default: `{x,y,z,u,v,w}`. */
    variableNames?: ReadonlySet<string>;
    /** Tope de iteraciones de forward-chaining. Default 1000. */
    maxIterations?: number;
}
/**
 * Oráculo de entailment por defecto. Forward-chaining sobre Horn-like.
 *
 * Devuelve `true` sii `target` (ground) es derivable de `premises`.
 * Si `target` contiene variables se reporta `false` (no soportamos
 * ∃-targets aquí; usar custom oracle).
 */
export declare function defaultEntails(opts?: DefaultEntailsOptions): EntailmentOracle;
/**
 * Oráculo de consistencia por defecto. Considera inconsistente sii
 * el forward-chaining deriva un par {p, ¬p}.
 */
export declare function defaultConsistent(opts?: DefaultEntailsOptions): (premises: ReadonlyArray<Formula>) => boolean;
//# sourceMappingURL=entails.d.ts.map