import type { Category, MorId } from './types';
/** Morfismo del poset: par origen/destino. Único entre dos objetos. */
export interface PosetMor {
    readonly id: MorId;
    readonly src: string;
    readonly tgt: string;
}
/**
 * Construye la categoría poset. `elements` define los objetos y
 * `leq` los pares a≤b explícitos. La clausura reflexivo-transitiva
 * se calcula y se realiza como morfismos del Category resultante.
 */
export declare function Poset(elements: ReadonlyArray<string>, leq: ReadonlyArray<readonly [string, string]>): Category<string, PosetMor>;
//# sourceMappingURL=poset.d.ts.map