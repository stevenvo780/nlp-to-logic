import { Formula } from '../types';
export interface KnownTheorem {
    pattern: string;
    name: string;
    abbr: string;
    systems: string[];
    note?: string;
    paradox?: boolean;
}
export declare const MODAL_THEOREMS: KnownTheorem[];
export declare function identifyTheorem(f: Formula, system: string): KnownTheorem | undefined;
//# sourceMappingURL=known-theorems.d.ts.map