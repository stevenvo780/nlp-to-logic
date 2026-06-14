import { IntuitFormula, NJProof } from './types';
/**
 * API pública.
 *
 * Devuelve un árbol NJ que demuestra `goal` a partir de las
 * `premises` dadas, o `null` si no encontró prueba dentro del
 * budget configurado.
 */
export declare function proveIntuitionistically(premises: IntuitFormula[], goal: IntuitFormula, options?: {
    budget?: number;
}): NJProof | null;
export declare function verifyProof(proof: NJProof, initialContext?: IntuitFormula[]): boolean;
//# sourceMappingURL=prover.d.ts.map