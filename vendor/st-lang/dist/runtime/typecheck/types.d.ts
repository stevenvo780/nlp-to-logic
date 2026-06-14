import type { SourceLocation } from '../../types';
export interface TypeError {
    code: string;
    severity: 'error' | 'warning';
    message: string;
    suggestion?: string;
    location: SourceLocation;
}
export declare const MODAL_PROFILES: Set<string>;
export declare const TEMPORAL_PROFILES: Set<string>;
export declare const FIRST_ORDER_PROFILES: Set<string>;
export declare const ARITHMETIC_PROFILES: Set<string>;
export type ProfileName = string;
//# sourceMappingURL=types.d.ts.map