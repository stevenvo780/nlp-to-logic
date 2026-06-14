import { NLLinterDiagnostic, NLRule } from './types';
export declare const DEFAULT_RULES: NLRule[];
/**
 * Escanea de forma asíncrona un texto buscando posibles violaciones de formalización sintiéndose como un Linter "ESLint".
 * Totalmente compatible con ejecución en cliente.
 */
export declare function lintNaturalLanguage(text: string, rules?: NLRule[]): NLLinterDiagnostic[];
export * from './types';
export * from './rules';
//# sourceMappingURL=index.d.ts.map