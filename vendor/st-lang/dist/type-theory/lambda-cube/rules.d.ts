import type { CubeSystem, Sort } from './types';
export interface FormationRule {
    from: Sort;
    to: Sort;
}
export interface CubeRules {
    formationRules: FormationRule[];
}
export declare const SYSTEMS: Record<CubeSystem, CubeRules>;
/** ¿El par (s1, s2) está en las reglas de formación de `system`? */
export declare function hasRule(system: CubeSystem, from: Sort, to: Sort): boolean;
/** Conjunto de pares de formación de un sistema, en orden canónico. */
export declare function rulesOf(system: CubeSystem): FormationRule[];
/**
 * Reglas de axioma. En el cubo Barendregt clásico el único axioma es
 *   * : ◻
 * (no hay jerarquía de universos: ◻ no tiene tipo propio, por eso los
 * términos del cubo no pueden anidar ◻ : ?). Si se intentara tipar ◻
 * directamente, el typechecker reportará error.
 */
export declare const AXIOMS: Array<{
    sort: Sort;
    type: Sort;
}>;
export declare function axiomFor(sort: Sort): Sort | undefined;
//# sourceMappingURL=rules.d.ts.map