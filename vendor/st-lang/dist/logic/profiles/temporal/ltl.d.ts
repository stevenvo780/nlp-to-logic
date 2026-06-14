import { Formula } from '../../../types';
import { BaseTableauProfile } from '../shared/base-profile';
import { type FrameRules } from '../shared/tableau-engine';
export declare class TemporalLTL extends BaseTableauProfile {
    name: string;
    description: string;
    frameRules: FrameRules;
    formatFormula(f: Formula): string;
    explainSystem(): string;
    explain(formula: Formula): import('../../../types').RunResult;
}
//# sourceMappingURL=ltl.d.ts.map