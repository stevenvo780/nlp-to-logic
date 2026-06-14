/**
 * formalize() — Función stateless principal de Autologic
 *
 * Toma texto natural + opciones y produce código ST válido.
 * Pipeline: Segment → Analyze → Extract Atoms → Build Formulas → Emit ST → Validate
 */
import type { FormalizeOptions, FormalizationResult } from './types';
/**
 * Formaliza texto natural a código ST.
 *
 * @param text Texto en lenguaje natural a formalizar
 * @param options Opciones de formalización
 * @returns Resultado con código ST, análisis y diagnósticos
 *
 * @example
 * ```ts
 * const result = formalize(
 *   "Si llueve, entonces la calle se moja. Está lloviendo. Por lo tanto, la calle está mojada.",
 *   { profile: 'classical.propositional', language: 'es' }
 * );
 * console.log(result.stCode);
 * ```
 */
export declare function formalize(text: string, options?: FormalizeOptions): FormalizationResult;
import { LLMParsedResult, LLMConfig } from './llm-parser';
import { NLLinterDiagnostic } from './nl-linter';
export interface FormalizeWithLLMOptions extends FormalizeOptions {
    llmConfig: LLMConfig;
    abortOnLinterErrors?: boolean;
}
export interface FormalizationLLMResult extends FormalizationResult {
    linterDiagnostics: NLLinterDiagnostic[];
    llmRawAst?: LLMParsedResult;
}
/**
 * Nueva entrada arquitectonica de Doble Capa.
 * 1. Pasa por en NL Linter
 * 2. Manda a Inferencia (Local o Red)
 */
export declare function formalizeWithLLM(text: string, options: FormalizeWithLLMOptions): Promise<FormalizationLLMResult>;
//# sourceMappingURL=formalize.d.ts.map