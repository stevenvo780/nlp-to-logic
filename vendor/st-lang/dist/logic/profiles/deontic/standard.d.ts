import { Formula } from '../../../types';
import { BaseTableauProfile } from '../shared/base-profile';
export declare class DeonticStandard extends BaseTableauProfile {
    name: string;
    description: string;
    frameRules: import("../shared/tableau-engine").FrameRules;
    formatFormula(f: Formula): string;
    explainSystem(): string;
}
//# sourceMappingURL=standard.d.ts.map