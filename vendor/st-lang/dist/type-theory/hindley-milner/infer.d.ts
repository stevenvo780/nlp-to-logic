import type { Expr, Type, TypeScheme } from './types';
import { TypeEnv } from './types';
import type { Substitution } from './substitution';
export interface InferResult {
    type: Type;
    subst: Substitution;
}
export type InferOutcome = InferResult | {
    error: string;
};
export declare function isInferError(r: InferOutcome): r is {
    error: string;
};
export declare function initialEnv(): TypeEnv;
export declare function algorithmW(expr: Expr, env: TypeEnv): InferOutcome;
export declare function infer(expr: Expr, env?: TypeEnv): InferOutcome;
export interface InferSchemeResult {
    scheme: TypeScheme;
    subst: Substitution;
    type: Type;
}
export declare function inferScheme(expr: Expr, env?: TypeEnv): InferSchemeResult | {
    error: string;
};
export declare function normalizeScheme(sc: TypeScheme): TypeScheme;
//# sourceMappingURL=infer.d.ts.map