import { type ProofNet } from './types';
export declare function reduceCutStep(net: ProofNet): {
    net: ProofNet;
    reduced: boolean;
};
export declare function reduceCut(net: ProofNet): ProofNet;
export declare function isCutFree(net: ProofNet): boolean;
export declare function normalizeCuts(net: ProofNet, maxSteps?: number): ProofNet;
//# sourceMappingURL=cut-elim.d.ts.map