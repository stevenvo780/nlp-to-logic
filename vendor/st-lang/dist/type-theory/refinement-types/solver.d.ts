export interface SolverOpts {
    /** Cota inclusiva para enteros: dominio [-intBound, +intBound]. */
    intBound?: number;
    /** Cota total de intentos para abortar enumeración excesiva. */
    maxAttempts?: number;
}
export interface CheckResult {
    satisfiable: boolean;
    counter?: Record<string, number | boolean>;
}
/**
 * checkVC — devuelve si la conjunción de predicados es satisfacible.
 * Si lo es, incluye un testigo `counter` con la asignación encontrada.
 * El nombre "counter" se conserva por compatibilidad con la firma
 * típica de verificadores que buscan contraejemplos de implicaciones.
 */
export declare function checkVC(predicates: string[], opts?: SolverOpts): CheckResult;
/**
 * implies — chequea si `premises ⇒ conclusion` es válido en el dominio
 * acotado. Implementado como búsqueda de contraejemplo a
 * `premises ∧ ¬conclusion`.
 */
export declare function implies(premises: string[], conclusion: string, opts?: SolverOpts): boolean;
//# sourceMappingURL=solver.d.ts.map