import { Formula } from '../../../types';
import { BaseTableauProfile } from '../shared/base-profile';
export declare class ModalK extends BaseTableauProfile {
    name: string;
    description: string;
    frameRules: import("../shared/tableau-engine").FrameRules;
    formatFormula(f: Formula): string;
    explainSystem(): string;
}
//# sourceMappingURL=k.d.ts.map