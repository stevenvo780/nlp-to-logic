import { NKFormula, NKProof } from './types';
/**
 * API pública: prueba clásica.
 *
 * Devuelve un árbol NK que demuestra `goal` a partir de las
 * `premises` dadas, o `null` si no encontró prueba.
 */
export declare function proveClassically(premises: NKFormula[], goal: NKFormula, options?: {
    budget?: number;
}): NKProof | null;
/**
 * Variante restringida: intenta probar usando sólo reglas
 * intuicionistas (NJ). Útil internamente para `nkToNJ`.
 */
export declare function proveIntuitOnly(premises: NKFormula[], goal: NKFormula, options?: {
    budget?: number;
}): NKProof | null;
/**
 * Verifica recursivamente el árbol NK. Comprueba cada regla
 * localmente contra su conclusión y contexto.
 */
export declare function verifyProof(proof: NKProof, initialContext?: NKFormula[]): boolean;
/**
 * Devuelve una prueba NK de la ley de Peirce: ((P→Q)→P)→P.
 */
export declare function provedPeirce(): NKProof;
/**
 * Devuelve una prueba NK de la eliminación de doble negación: ¬¬P → P.
 */
export declare function provedDNE(): NKProof;
/**
 * Devuelve una prueba NK del tercero excluido: P ∨ ¬P.
 */
export declare function provedLEM(): NKProof;
/**
 * Indica si una prueba NK puede traducirse a NJ sin pérdida.
 * Si contiene alguna regla puramente clásica, la traducción
 * falla con `reason`. Si es puramente intuicionista, se
 * devuelve la prueba intacta (cast estructural a NJProof).
 *
 * No intentamos la traducción de Glivenko ni doble-negación
 * uniforme aquí: el objetivo es detectar si la prueba ya está
 * en el fragmento intuicionista.
 */
export declare function nkToNJ(proof: NKProof): {
    converted?: NKProof;
    reason?: string;
};
//# sourceMappingURL=prover.d.ts.map