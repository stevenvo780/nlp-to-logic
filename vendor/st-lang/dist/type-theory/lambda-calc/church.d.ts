import type { Term } from './types';
export declare function churchNumeral(n: number): Term;
export declare function decodeChurch(t: Term): number | null;
export declare function evalChurch(t: Term, maxSteps?: number): number | null;
export declare const churchSucc: Term;
export declare const churchAdd: Term;
export declare const churchMul: Term;
//# sourceMappingURL=church.d.ts.map