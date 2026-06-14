import type { MUSOptions, MUSResult, SATOracle, AssumptionSolver } from './types';
/**
 * Extrae un MUS (Minimal Unsatisfiable Subset) del conjunto unsat
 * `clauses` usando el oráculo SAT provisto.
 *
 * Convenciones:
 *   - Las cláusulas son arrays de literales enteros estilo DIMACS
 *     (positivo / negativo). El motor no inspecciona la semántica;
 *     todo lo delega al `satOracle`.
 *   - El conjunto retornado en `mus` son índices sobre `clauses`.
 *   - Si `clauses` ES satisfacible, devolvemos `mus = []` (no hay
 *     MUS posible).
 *   - Determinismo: orden numérico ascendente en todos los recorridos.
 */
export declare function extractMUS(clauses: number[][], satOracle: SATOracle, opts?: MUSOptions): MUSResult;
/**
 * Variante para SAT solvers incrementales con assumptions.
 *
 * El patrón típico es:
 *   - Por cada cláusula original `C_i`, añadir un selector literal
 *     `s_i` y convertirla en `C_i ∨ ¬s_i` (la cláusula está "off"
 *     cuando `s_i = false`).
 *   - Para "activar" un subset, pasar las correspondientes `s_i` como
 *     assumptions positivas.
 *   - Cuando el problema es unsat, el solver devuelve
 *     `failedAssumptions ⊆ assumptions` — el unsat core proyectado
 *     sobre los selectors.
 *
 * Esta función toma el `failedAssumptions` como punto de partida y
 * lo minimiza con un pase deletion-based usando el mismo solver para
 * garantizar minimalidad por inclusión.
 */
export declare function extractMUSWithSelectors(clauses: number[][], selectors: number[], solver: AssumptionSolver, opts?: MUSOptions): MUSResult;
//# sourceMappingURL=extract.d.ts.map