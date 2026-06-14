/**
 * Algoritmos disponibles para extracción de MUS.
 *
 * - `deletion`: por cada cláusula c, prueba si C \ {c} sigue unsat;
 *   si sí, descarta c definitivamente. O(n) llamadas al oráculo SAT.
 *   Sencillo, robusto, fácil de auditar.
 *
 * - `insertion`: empieza con conjunto vacío W, agrega cláusulas una
 *   por una. Cuando W se vuelve unsat, la última cláusula añadida es
 *   "necesaria" (la fija en el MUS y vacía W). Repite hasta cubrir
 *   todo. Útil cuando el MUS es pequeño respecto al total.
 *
 * - `qx`: QuickXplain (Junker 2004). Algoritmo divide-y-vencerás que
 *   resuelve "minimum conflict explanation" con O(2k · log(n/k))
 *   llamadas SAT, donde k es el tamaño del MUS. En la práctica mucho
 *   más rápido que deletion para MUS grandes embebidos en problemas
 *   inmensos.
 */
export type MUSAlgorithm = 'deletion' | 'insertion' | 'qx';
export interface MUSOptions {
    /** Algoritmo a usar. Default: `deletion`. */
    algorithm?: MUSAlgorithm;
    /** Tope superior de llamadas al oráculo SAT. Default: 100_000. */
    maxIterations?: number;
}
export interface MUSResult {
    /** Índices (sobre el array original `clauses`) que conforman el MUS. */
    mus: number[];
    /** Iteraciones de bucle externo (rondas del algoritmo). */
    iterations: number;
    /** Llamadas totales al oráculo SAT. */
    satCalls: number;
}
/**
 * Oráculo SAT: dado un conjunto de cláusulas (cada cláusula es una
 * lista de literales enteros — convención DIMACS: positivo es literal
 * positivo, negativo es negado), devuelve `true` sii el conjunto
 * tiene un modelo, `false` si es unsat.
 */
export type SATOracle = (subset: number[][]) => boolean;
/**
 * Solver incremental con assumptions (estilo MiniSat / SAT4J):
 * dadas N cláusulas hard y una lista de literales-asumidos, devuelve
 * `{ sat: false, failedAssumptions: [...] }` cuando el problema es
 * unsat — el array `failedAssumptions` contiene un subconjunto de las
 * assumptions suficientes para que el problema sea unsat (el unsat
 * core proyectado sobre assumptions).
 *
 * En la práctica `failedAssumptions` ya es un MUS (sobre la
 * codificación por selectors) o un superset cercano; corremos un pase
 * adicional de minimización para garantizar minimalidad.
 */
export interface AssumptionSolver {
    solveWithAssumptions: (assumptions: number[]) => {
        sat: boolean;
        failedAssumptions?: number[];
    };
}
//# sourceMappingURL=types.d.ts.map