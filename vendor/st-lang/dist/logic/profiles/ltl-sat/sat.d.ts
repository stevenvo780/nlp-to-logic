import { LTLFormula, SatResult } from './types';
export declare function isSatisfiable(phi: LTLFormula): SatResult;
export declare function isValid(phi: LTLFormula): boolean;
export declare function toBuchi(phi: LTLFormula): {
    states: number;
    accepting: number;
};
//# sourceMappingURL=sat.d.ts.map