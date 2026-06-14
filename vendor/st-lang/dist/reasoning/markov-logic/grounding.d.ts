import { type FOLNode } from './parser';
import type { GroundedFormula, MLNFormula, MLNTheory, MLNWorld } from './types';
interface PredicateMap {
    [name: string]: string[];
}
/** Canonical key para un ground atom: "Pred(a1,a2,...)". */
export declare function atomKey(predicate: string, args: string[]): string;
/** Evalúa un nodo ya groundeado contra un mundo. */
export declare function evaluateGround(node: FOLNode, world: MLNWorld): boolean;
/** Renderiza un nodo groundeado a string canónico. */
export declare function renderGround(node: FOLNode): string;
/** Groundea una sola fórmula. */
export declare function groundFormula(formula: MLNFormula, predMap: PredicateMap, constants: Record<string, string[]>): GroundedFormula[];
/** Groundea TODAS las fórmulas de la teoría. */
export declare function ground(theory: MLNTheory): GroundedFormula[];
/** Enumera TODOS los ground atoms de la teoría (Herbrand base). */
export declare function allGroundAtoms(theory: MLNTheory): string[];
export {};
//# sourceMappingURL=grounding.d.ts.map