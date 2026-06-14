/**
 * Sistema de transiciones etiquetadas.
 *  - `states`      lista finita de identificadores de estado.
 *  - `transitions` triplas [from, action, to] que codifican →.
 *  - `labelling`   opcional: estado → conjunto de proposiciones atómicas que
 *                  se cumplen en él. Estados ausentes se tratan como ∅.
 */
export interface LTS {
    states: string[];
    transitions: Array<[string, string, string]>;
    labelling?: Record<string, Set<string>>;
}
/**
 * Resultado de un algoritmo de partition refinement.
 *  - `partition`  estado → índice de bloque.
 *  - `blocks`     bloques como listas de estados (índice consistente con partition).
 *  - `numBlocks`  cardinalidad de la partición final.
 *  - `iterations` número de iteraciones de refinamiento ejecutadas.
 */
export interface BisimulationResult {
    partition: Map<string, number>;
    blocks: string[][];
    numBlocks: number;
    iterations: number;
}
//# sourceMappingURL=types.d.ts.map