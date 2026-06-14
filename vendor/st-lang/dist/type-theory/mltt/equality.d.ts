import type { MLTTTerm } from './types';
/** α-equivalencia estructural sobre términos (no normaliza). */
export declare function alphaEq(a: MLTTTerm, b: MLTTTerm): boolean;
/**
 * Igualdad αβ (definicional): normaliza ambos y luego compara α.
 * `ctx` reservado para implementaciones futuras (η, definitional unfolding).
 */
export declare function alphaBetaEq(a: MLTTTerm, b: MLTTTerm, _ctx?: Map<string, MLTTTerm>): boolean;
//# sourceMappingURL=equality.d.ts.map