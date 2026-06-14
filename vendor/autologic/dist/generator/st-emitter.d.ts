/**
 * ST Emitter — Genera código fuente ST válido y legible
 *
 * Produce código ST con trazabilidad, comentarios y formato estructurado.
 * Sintaxis ST: `axiom name = FORMULA`, `derive FORMULA from {labels}`
 */
import type { FormulaEntry, LogicProfile, Diagnostic } from '../types';
interface EmitOptions {
    profile: LogicProfile;
    language: 'es' | 'en';
    includeComments: boolean;
    atoms: Map<string, string>;
    formulas: FormulaEntry[];
    detectedPatterns: string[];
}
/**
 * Emite código ST completo a partir de fórmulas construidas.
 */
export declare function emitST(options: EmitOptions): {
    code: string;
    diagnostics: Diagnostic[];
};
export {};
//# sourceMappingURL=st-emitter.d.ts.map