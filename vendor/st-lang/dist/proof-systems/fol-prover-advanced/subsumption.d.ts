import type { FOLClause } from './types';
/**
 * Subsumption clásico: c1 subsume c2 si existe una sustitución σ tal que
 * cada literal de c1·σ aparece en c2.
 *
 * Estrategia: backtracking sobre el matching de cada literal de c1 contra c2.
 * Costoso en el caso general, pero acotado: cláusulas en pruebas reales
 * tienen pocas literales.
 */
export declare function subsumes(c1: FOLClause, c2: FOLClause): boolean;
/**
 * Filtra cláusulas dejando sólo las no-subsumidas por otras del mismo set.
 * Conserva orden de la primera aparición.
 */
export declare function removeSubsumed(clauses: FOLClause[]): FOLClause[];
/**
 * Igualdad sintáctica módulo orden de literales y renombre de variables
 * (alpha-equivalencia simple). Suficiente para detectar duplicados producidos
 * por resolución sobre instancias renombradas.
 */
export declare function clausesAlphaEqual(a: FOLClause, b: FOLClause): boolean;
/**
 * Reordena cláusulas para que las unitarias (1 literal) vayan primero.
 * Patrón "unit preference" — reduce drásticamente el espacio de búsqueda en
 * problemas tipo modus-ponens encadenado.
 */
export declare function unitPreference(clauses: FOLClause[]): FOLClause[];
//# sourceMappingURL=subsumption.d.ts.map