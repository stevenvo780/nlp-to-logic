import type { ProofStep, ProofTrace } from './types';
/**
 * Un sub-tree candidato extraído de un proof, antes de pasar a
 * generalización/ranking.
 */
export interface SubtreeCandidate {
    /** ID del proof origen. */
    proofId: string;
    /** Posición del paso raíz en `steps`. */
    rootIndex: number;
    /** Pasos que componen el sub-tree (en orden top-down). */
    steps: ProofStep[];
    /** Conclusión del sub-tree (= output del paso raíz). */
    conclusion: string;
    /** Profile del proof origen. */
    profile: string;
    /** Cost asignado (igual al cost del proof original prorrateado). */
    cost: number;
}
/**
 * Agrupación de sub-trees estructuralmente equivalentes.
 */
export interface SubtreeGroup {
    /** Hash α-canónico común. */
    key: string;
    /** Conclusión canónica representativa. */
    canonicalConclusion: string;
    /** Sub-trees miembros del grupo. */
    members: SubtreeCandidate[];
}
/**
 * Descompone un proof en sub-trees a partir de cada paso. El
 * sub-tree con raíz en `i` incluye `steps[i]` y todos los
 * descendientes consecutivos (depth > steps[i].depth) hasta que
 * vuelve a aparecer un paso de depth ≤ steps[i].depth.
 *
 * Para steps[i] con depth d_i, el sub-tree es:
 *   steps[i], steps[i+1], …, steps[j-1]
 * donde j es el menor índice > i con steps[j].depth ≤ d_i (o
 * length si no existe).
 */
export declare function extractSubtrees(proof: ProofTrace, proofId: string): SubtreeCandidate[];
/**
 * Clave estructural canónica de un sub-tree.
 *
 * Combina: secuencia de reglas (por orden top-down) + diferencias
 * relativas de depth (para reconstruir forma del árbol) + outputs
 * normalizados α-canónicamente.
 *
 * El canónico depende del orden de aparición de los identificadores
 * de cada output, lo que da un hash estable módulo renombrado de
 * variables.
 */
export declare function subtreeKey(sub: SubtreeCandidate): string;
/**
 * Agrupa sub-trees por clave estructural canónica.
 */
export declare function groupSubtrees(candidates: SubtreeCandidate[]): SubtreeGroup[];
/**
 * Identifica sub-pruebas auxiliares en el corpus. Recibe un array
 * de proofs, devuelve los grupos de sub-trees estructuralmente
 * equivalentes que pasan los filtros (minReuseThreshold y
 * minSubtreeSize).
 *
 * Esta función NO genera lemmas todavía — solo identifica los
 * candidatos. `mineLemmas` los procesa, genera el statement y los
 * persiste.
 */
export declare function extractAuxiliaryLemmas(corpus: ProofTrace[], options?: {
    minReuseThreshold?: number;
    minSubtreeSize?: number;
}): SubtreeGroup[];
//# sourceMappingURL=extractor.d.ts.map