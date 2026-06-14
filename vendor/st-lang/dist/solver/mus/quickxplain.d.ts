import type { SATOracle } from './types';
/**
 * Ejecuta QuickXplain sobre el conjunto de cláusulas indexadas y
 * devuelve los índices del MUS hallado más el conteo de llamadas SAT.
 */
export declare function quickxplain(clauses: number[][], oracle: SATOracle, maxIterations: number): {
    mus: number[];
    satCalls: number;
};
//# sourceMappingURL=quickxplain.d.ts.map