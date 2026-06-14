/**
 * ST — API programática para uso como librería
 *
 * Uso:
 *   import { evaluate, parse, check, createInterpreter } from 'st-lang/api';
 *   const result = evaluate('logic classical.propositional\ncheck valid (P -> P)');
 */
import type { Diagnostic, RunResult, SymbolInfo, HoverInfo, CompletionItem, SourceLocation } from './types';
import type { Program } from './ast/nodes';
/** Resultado de evaluate() */
export interface STEvalResult {
    /** true si no hubo errores */
    ok: boolean;
    /** Salida formateada para humanos (lo que imprimiría el CLI) */
    stdout: string;
    /** Errores si los hubo */
    stderr: string;
    /** Código de salida (0 = ok, 1 = parse error, 3 = runtime error) */
    exitCode: number;
    /** Resultados lógicos individuales (uno por cada check/derive/prove/etc) */
    results: RunResult[];
    /** Diagnósticos (errores, warnings, hints) */
    diagnostics: Diagnostic[];
}
/** Resultado de parse() */
export interface STParseResult {
    ok: boolean;
    program: Program | null;
    diagnostics: Diagnostic[];
}
/** Resultado de check() */
export interface STCheckResult {
    ok: boolean;
    diagnostics: Diagnostic[];
}
/**
 * Ejecuta código ST completo y devuelve resultado estructurado.
 *
 * @example
 * ```ts
 * const r = evaluate(`
 *   logic classical.propositional
 *   axiom a1 : P -> Q
 *   axiom a2 : P
 *   derive Q from a1, a2
 * `);
 * console.log(r.ok);     // true
 * console.log(r.stdout); // "✓ [derive] Q es DERIVABLE..."
 * ```
 */
export declare function evaluate(source: string, file?: string): STEvalResult;
/**
 * Parsea código ST sin ejecutarlo. Útil para validación de sintaxis.
 */
export declare function parse(source: string, file?: string): STParseResult;
/**
 * Verifica sintaxis y bien-formación sin ejecutar comandos lógicos.
 * Parsea el código y reporta errores.
 */
export declare function check(source: string, file?: string): STCheckResult;
/**
 * Evalúa una expresión lógica rápida (auto-prepone "logic classical.propositional").
 * Útil para validaciones inline sin necesidad de declarar perfil.
 *
 * @example
 * ```ts
 * const r = quickEval('check valid (P -> (Q -> P))');
 * console.log(r.ok);              // true
 * console.log(r.results[0].status); // 'valid'
 * ```
 */
export declare function quickEval(expression: string): STEvalResult;
/**
 * Intérprete con estado persistente. Permite ejecutar líneas incrementalmente
 * manteniendo axiomas, teoremas, claims y perfil entre llamadas.
 *
 * @example
 * ```ts
 * const st = createInterpreter();
 * st.exec('logic classical.propositional');
 * st.exec('axiom a1 : P -> Q');
 * st.exec('axiom a2 : P');
 * const r = st.exec('derive Q from a1, a2');
 * console.log(r.results[0].status); // 'valid'
 * console.log(st.getTheorySummary()); // { axioms: ['a1', 'a2'], ... }
 * ```
 */
export interface STInterpreter {
    /** Ejecuta uno o más statements manteniendo el estado */
    exec(source: string): STEvalResult;
    /** Reinicia todo el estado (perfil, axiomas, claims, etc.) */
    reset(): void;
    /** Obtiene el perfil lógico actual */
    getProfile(): string | null;
    /** Lista nombres de axiomas registrados */
    getAxioms(): string[];
    /** Lista nombres de teoremas registrados */
    getTheorems(): string[];
    /** Lista nombres de claims registrados */
    getClaims(): string[];
    /** Resumen completo del estado actual */
    getTheorySummary(): TheorySummary;
    /** Historial de todos los resultados ejecutados */
    getHistory(): STEvalResult[];
}
export interface TheorySummary {
    profile: string;
    axioms: string[];
    theorems: string[];
    claims: string[];
    judgmentCount: number;
}
/**
 * Crea una instancia de intérprete ST con estado persistente.
 */
export declare function createInterpreter(): STInterpreter;
/** Convierte una fórmula AST a string legible (notación programática) */
export { formulaToString } from './logic/profiles/classical/propositional';
/** Convierte una fórmula AST a notación Unicode (¬, ∧, ∨, →, ↔, □, ◇, ∀, ∃) */
export { formulaToUnicode } from './runtime/format';
/** Convierte una fórmula AST a notación LaTeX */
export { formulaToLaTeX } from './runtime/format';
/** Re-exportar tipos del detector de falacias */
export type { FallacyInfo } from './runtime/fallacies';
export { detectFallacies } from './runtime/fallacies';
/** Lista los perfiles lógicos disponibles */
export declare function listProfiles(): string[];
/** Resultado de hover() */
export interface STHoverResult {
    content: string;
    range?: SourceLocation;
}
/** Resultado de render() */
export interface STRenderResult {
    rendered: string;
    format: string;
    diagnostics: Diagnostic[];
}
/**
 * Obtiene información de hover para una posición en el código ST.
 * Útil para tooltips en editores.
 *
 * @returns HoverInfo o null si no hay info en esa posición
 */
export declare function hover(source: string, line: number, column: number, file?: string): HoverInfo | null;
/**
 * Lista todos los símbolos definidos en el código ST (axiomas, teoremas, claims, passages, etc.).
 * Útil para panel de símbolos en editores.
 */
export declare function symbols(source: string, file?: string): SymbolInfo[];
/**
 * Busca la definición de un símbolo por nombre en el código ST.
 * Útil para "Go to Definition" en editores.
 *
 * @returns SourceLocation de la definición o null si no se encuentra
 */
export declare function gotoDefinition(source: string, name: string, file?: string): SourceLocation | null;
/**
 * Obtiene sugerencias de completado para el lenguaje ST.
 * Devuelve keywords y snippets disponibles.
 */
export declare function completion(): CompletionItem[];
/**
 * Ejecuta y renderiza el código ST en el formato especificado.
 *
 * @param format 'markdown' | 'json' (default: 'markdown')
 */
export declare function render(source: string, format?: string, file?: string): STRenderResult;
export type { ExecutionOutput, Diagnostic, RunResult, Formula, LogicStatus, Theory, TruthTableResult, Proof, Model, Valuation, Severity, FormulaKind, Claim, Passage, Anchor, SymbolInfo, HoverInfo, CompletionItem, SourceLocation, } from './types';
export type { Program, Statement } from './ast/nodes';
export { typeCheck, TypeChecker } from './runtime/typecheck';
export type { TypeError } from './runtime/typecheck';
//# sourceMappingURL=api.d.ts.map