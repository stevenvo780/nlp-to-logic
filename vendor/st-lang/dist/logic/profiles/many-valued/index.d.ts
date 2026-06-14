export type FuzzyOperator = 'lukasiewicz' | 'godel' | 'product';
export interface FuzzyFormula {
    kind: 'atom' | 'not' | 'and' | 'or' | 'implies';
    name?: string;
    arg?: FuzzyFormula;
    left?: FuzzyFormula;
    right?: FuzzyFormula;
}
export declare function atom(name: string): FuzzyFormula;
export declare function not(arg: FuzzyFormula): FuzzyFormula;
export declare function and(left: FuzzyFormula, right: FuzzyFormula): FuzzyFormula;
export declare function or(left: FuzzyFormula, right: FuzzyFormula): FuzzyFormula;
export declare function implies(left: FuzzyFormula, right: FuzzyFormula): FuzzyFormula;
export declare function collectFuzzyAtoms(formula: FuzzyFormula): string[];
/**
 * Evalúa una fórmula borrosa bajo un environment que asigna
 * un valor en [0,1] a cada átomo (átomos sin asignar valen 0).
 */
export declare function evaluate(formula: FuzzyFormula, env: Record<string, number>, system: FuzzyOperator): number;
/**
 * Devuelve true si la fórmula evalúa a 1 (módulo EPSILON) en
 * todos los puntos de la rejilla [0,1]^n con `resolution` puntos
 * por átomo. Default: 11 puntos (0, 0.1, ..., 1).
 *
 * Aviso: es una aproximación por sampling. Algunas tautologías
 * "casi" (verdaderas excepto en un conjunto de medida cero)
 * pueden seguir clasificándose correctamente, pero contraejemplos
 * sutiles requieren resolución mayor.
 */
export declare function isTautology(formula: FuzzyFormula, system: FuzzyOperator, resolution?: number): boolean;
/** Verdadera si la fórmula evalúa a 0 en toda la rejilla. */
export declare function isContradiction(formula: FuzzyFormula, system: FuzzyOperator, resolution?: number): boolean;
/**
 * Busca una valuación (en la rejilla con `resolution` puntos por
 * átomo) tal que `|evaluate(formula) - target| <= tolerance`.
 * Devuelve null si no encuentra ninguna.
 */
export declare function findValuation(formula: FuzzyFormula, system: FuzzyOperator, target: number, tolerance?: number, resolution?: number): Record<string, number> | null;
//# sourceMappingURL=index.d.ts.map