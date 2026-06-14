import type { HoTTTerm } from './types';
export type InferContextHoTT = Map<string, HoTTTerm>;
export type InferResultHoTT = HoTTTerm | {
    error: string;
};
export declare function isInferErrorHoTT(r: InferResultHoTT): r is {
    error: string;
};
export declare function inferType(term: HoTTTerm, ctx?: InferContextHoTT): InferResultHoTT;
export declare function checkType(term: HoTTTerm, expected: HoTTTerm, ctx?: InferContextHoTT): boolean;
//# sourceMappingURL=infer.d.ts.map