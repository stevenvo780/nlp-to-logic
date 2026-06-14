import type { FormalContext } from './types';
/**
 * Devuelve `true` si en `ctx` la implicación `premise → conclusion` es
 * válida: todo objeto que satisface todos los atributos de `premise`
 * satisface también todos los de `conclusion`.
 *
 * Equivalencia formal:  premise → conclusion  ⇔  conclusion ⊆ premise''.
 */
export declare function impliesAll(ctx: FormalContext, premise: Set<string>, conclusion: Set<string>): boolean;
//# sourceMappingURL=implications.d.ts.map