/**
 * Validator — Valida código ST generado con st-lang parse()
 *
 * Intenta importar st-lang dinámicamente (peerDep).
 * Si no está disponible, reporta warning pero no falla.
 *
 * NOTE: child_process is loaded dynamically to keep this module
 *       importable in browser/webpack contexts (Next.js client bundles).
 */
import type { Diagnostic } from '../types';
interface ValidationResult {
    ok: boolean;
    errors: string[];
}
interface ExecutionResult {
    ok: boolean;
    semanticOk: boolean;
    failingStatuses: string[];
    exitCode: number;
    timedOut: boolean;
    durationMs: number;
    errors: string[];
    resultStatuses: string[];
}
/**
 * Valida código ST usando el parser de st-lang.
 * Requiere que @stevenvo780/st-lang esté instalado (peerDependency).
 */
export declare function validateST(code: string): ValidationResult;
/**
 * Ejecuta código ST para detectar errores reales de parser/runtime.
 * Si st-lang no está disponible, no bloquea la formalización.
 */
export declare function executeST(code: string): ExecutionResult;
/**
 * Convierte errores de validación en diagnósticos.
 */
export declare function validationToDiagnostics(validation: ValidationResult): Diagnostic[];
/**
 * Convierte errores de ejecución en diagnósticos.
 *
 * Dos clases de diagnóstico:
 *  - ST_EXECUTION: error/timeout de runtime (parser/crash/timeout).
 *  - ST_SEMANTIC: la corrida terminó bien pero una derivación/prueba es
 *    refutable o no demostrable. Antes (BUG-C7) esto se perdía en silencio
 *    con `ok=true`. Se emite como `warning` para no enmascarar éxitos de
 *    runtime, pero `formalize().ok` lo refleja vía `semanticOk`.
 */
export declare function executionToDiagnostics(execution: ExecutionResult): Diagnostic[];
export {};
//# sourceMappingURL=validator.d.ts.map