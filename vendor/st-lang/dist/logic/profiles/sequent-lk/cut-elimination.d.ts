import { LKProof } from './types';
/**
 * Elimina todos los cortes de la derivacion. Devuelve una derivacion
 * estructuralmente equivalente al mismo secuente sin nodos `cut`.
 *
 * Implementacion: eliminamos primero los cortes interiores (de las
 * hojas hacia la raiz) y luego reducimos el cut de la raiz aplicando
 * la regla principal correspondiente.
 */
export declare function eliminateCut(proof: LKProof): LKProof;
//# sourceMappingURL=cut-elimination.d.ts.map