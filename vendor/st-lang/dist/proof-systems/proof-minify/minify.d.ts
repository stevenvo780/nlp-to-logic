import type { GenericProofNode, MinifyOptions, MinifyResult } from './types';
/** Cuenta los nodos de un árbol (raíz incluida). */
export declare function countNodes(n: GenericProofNode): number;
/** Profundidad máxima (raíz = 0). */
export declare function depthOf(n: GenericProofNode): number;
export declare function compactModusPonensChain(proof: GenericProofNode): GenericProofNode;
export declare function removeUnusedSubproofs(proof: GenericProofNode): GenericProofNode;
/**
 * Minifica un árbol de pruebas iterando las reglas hasta punto fijo
 * o agotar `maxIterations`.
 */
export declare function minifyProof(proof: GenericProofNode, opts?: MinifyOptions): MinifyResult;
//# sourceMappingURL=minify.d.ts.map