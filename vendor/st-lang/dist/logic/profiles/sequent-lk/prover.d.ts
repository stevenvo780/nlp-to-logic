import { LKFormula, LKProof, LKSequent } from './types';
/**
 * Demuestra el secuente `seq` en LK clasico (sin cortes).
 * Devuelve `null` si no encuentra derivacion dentro del budget.
 */
export declare function proveLK(seq: LKSequent, options?: {
    budget?: number;
}): LKProof | null;
/** Atajo: ⊢ φ. */
export declare function proveLKFormula(formula: LKFormula, options?: {
    budget?: number;
}): LKProof | null;
/**
 * Verifica que `proof` sea una derivacion LK valida segun la regla
 * declarada en cada nodo. La validacion es estructural — comprueba
 * que las premisas y la conclusion encajen con el patron de la regla.
 *
 * Es deliberadamente flexible respecto al orden (multisets) y permite
 * contraccion implicita en las reglas logicas (la formula principal
 * puede aparecer en las premisas, como en presentaciones modernas).
 */
export declare function isValid(proof: LKProof): boolean;
/** Cuenta si existe al menos un nodo `cut` en la derivacion. */
export declare function hasCut(proof: LKProof): boolean;
//# sourceMappingURL=prover.d.ts.map