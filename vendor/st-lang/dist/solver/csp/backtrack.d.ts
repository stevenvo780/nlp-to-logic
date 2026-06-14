import type { CSP, CSPResult, BacktrackOptions } from './types';
/**
 * Backtracking search. Si `useAC3` está activo, también aplica AC-3
 * tras cada asignación (Maintaining Arc Consistency, MAC).
 *
 * Devuelve la primera solución encontrada o `null` si UNSAT. Para
 * enumerar todas las soluciones, ver `allSolutions`.
 */
export declare function backtrack<V, D>(csp: CSP<V, D>, opts?: BacktrackOptions): CSPResult<V, D>;
/**
 * Enumera hasta `maxSolutions` soluciones del CSP. Útil para contar
 * soluciones simétricas (e.g. n-queens completo, sudoku no-único).
 */
export declare function allSolutions<V, D>(csp: CSP<V, D>, maxSolutions?: number, opts?: BacktrackOptions): Array<Map<V, D>>;
//# sourceMappingURL=backtrack.d.ts.map