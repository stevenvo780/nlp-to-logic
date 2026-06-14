/**
 * @module cdcl-v2
 * Entry point público del solver CDCL v2.
 *
 * Uso: `solveCDCLv2(clauses, numVars, opts?)` donde `clauses` es un arreglo
 * de `Int32Array` en formato DIMACS (variables 1..numVars). Devuelve
 * {@link SatResult} o {@link UnsatResult}.
 */
export { solveCDCLv2 } from './solver';
export { NO_ANTECEDENT, NO_CONFLICT, litToIdx, idxToLit } from './state';
export type { Clause, Literal, SatResult, SolveResult, SolverOptions, SolverStatsV2, UnsatResult, VarValue, } from './state';
export { VSIDS } from './vsids';
export { LubyRestartPolicy, luby, lubySequence } from './luby';
export { PhaseSaver } from './phase-saving';
export { analyzeConflict1UIP, type AnalysisResult, type ConflictContext } from './clause-learning';
export { computeLBD, selectClausesToRemove, type LearnedMeta } from './lbd';
//# sourceMappingURL=index.d.ts.map