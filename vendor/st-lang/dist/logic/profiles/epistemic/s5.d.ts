import { Formula } from '../../../types';
import { BaseTableauProfile } from '../shared/base-profile';
export declare class EpistemicS5 extends BaseTableauProfile {
    name: string;
    description: string;
    frameRules: import("../shared/tableau-engine").FrameRules;
    formatFormula(f: Formula): string;
    explainSystem(): string;
}
//# sourceMappingURL=s5.d.ts.map