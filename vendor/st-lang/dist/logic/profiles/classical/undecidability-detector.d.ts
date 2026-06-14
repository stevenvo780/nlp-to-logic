import { Formula } from '../../../types';
export interface UndecidabilityWarning {
    pattern: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    suggestion: string;
}
/**
 * Analyze a first-order formula for known undecidable or computationally
 * intractable patterns. Returns warnings if any are detected.
 */
export declare function detectUndecidable(formula: Formula): UndecidabilityWarning[];
//# sourceMappingURL=undecidability-detector.d.ts.map