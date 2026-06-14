import { type SolverOptions, type SolveResult } from './state';
/**
 * Resuelve un conjunto de cláusulas CNF y retorna SAT (con modelo) o UNSAT
 * (con core de variables involucradas en cláusulas vacías derivadas).
 *
 * Convención DIMACS: variables 1..numVars, literal positivo = variable
 * asignada a true, negativo = false. Cláusula vacía ⇒ UNSAT inmediato.
 */
export declare function solveCDCLv2(inputClauses: ReadonlyArray<Int32Array>, numVars: number, opts?: SolverOptions): SolveResult;
//# sourceMappingURL=solver.d.ts.map