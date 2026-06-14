import type { MLTTTerm } from './types';
export type InferContext = Map<string, MLTTTerm>;
export type InferResult = MLTTTerm | {
    error: string;
};
export declare function isInferError(r: InferResult): r is {
    error: string;
};
/** Infiere el tipo de `term` o devuelve un error legible. */
export declare function inferType(term: MLTTTerm, ctx?: InferContext): InferResult;
/**
 * Chequea que `term` tenga el tipo `expected` (bajo αβ-equality).
 * Implementa el modo "check" donde para `pair` se conoce el Σ esperado
 * y se permite la dependencia del segundo componente.
 */
export declare function checkType(term: MLTTTerm, expected: MLTTTerm, ctx?: InferContext): boolean;
//# sourceMappingURL=infer.d.ts.map