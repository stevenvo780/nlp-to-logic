"use strict";
/**
 * ST — API programática para uso como librería
 *
 * Uso:
 *   import { evaluate, parse, check, createInterpreter } from 'st-lang/api';
 *   const result = evaluate('logic classical.propositional\ncheck valid (P -> P)');
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeChecker = exports.typeCheck = exports.detectFallacies = exports.formulaToLaTeX = exports.formulaToUnicode = exports.formulaToString = void 0;
exports.evaluate = evaluate;
exports.parse = parse;
exports.check = check;
exports.quickEval = quickEval;
exports.createInterpreter = createInterpreter;
exports.listProfiles = listProfiles;
exports.hover = hover;
exports.symbols = symbols;
exports.gotoDefinition = gotoDefinition;
exports.completion = completion;
exports.render = render;
const parser_1 = require("./parser/parser");
const interpreter_1 = require("./runtime/interpreter");
const compat_1 = require("./runtime/compat");
const handler_1 = require("./protocol/handler");
const interface_1 = require("./logic/profiles/interface");
// ── Funciones estateless (una sola invocación) ────────────────
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
function evaluate(source, file) {
    const interpreter = new interpreter_1.Interpreter();
    const output = interpreter.execute(source, file || '<api>');
    return {
        ok: output.exitCode === 0,
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: output.exitCode,
        results: output.results,
        diagnostics: output.diagnostics,
    };
}
/**
 * Parsea código ST sin ejecutarlo. Útil para validación de sintaxis.
 */
function parse(source, file) {
    const parser = new parser_1.Parser(file || '<api>');
    const program = parser.parse(source);
    const hasErrors = parser.diagnostics.some((d) => d.severity === 'error');
    return {
        ok: !hasErrors,
        program: hasErrors ? null : program,
        diagnostics: parser.diagnostics,
    };
}
/**
 * Verifica sintaxis y bien-formación sin ejecutar comandos lógicos.
 * Parsea el código y reporta errores.
 */
function check(source, file) {
    const parser = new parser_1.Parser(file || '<api>');
    parser.parse(source);
    const hasErrors = parser.diagnostics.some((d) => d.severity === 'error');
    return {
        ok: !hasErrors,
        diagnostics: parser.diagnostics,
    };
}
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
function quickEval(expression) {
    return evaluate(`logic classical.propositional\n${expression}`);
}
/**
 * Crea una instancia de intérprete ST con estado persistente.
 */
function createInterpreter() {
    const inner = new interpreter_1.Interpreter();
    const history = [];
    const replCompatState = (0, compat_1.createReplCompatState)();
    const collectKnownPremises = () => {
        const theory = inner.getTheory();
        return Array.from(new Set([
            ...inner.getLetBindings().keys(),
            ...theory.axioms.keys(),
            ...theory.theorems.keys(),
        ]));
    };
    const toResult = (output) => ({
        ok: output.exitCode === 0,
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: output.exitCode,
        results: output.results,
        diagnostics: output.diagnostics,
    });
    return {
        exec(source) {
            const transformed = (0, compat_1.transformReplInput)(source, replCompatState, {
                knownPremises: collectKnownPremises(),
            });
            let output;
            if (transformed.kind === 'buffered') {
                output = {
                    stdout: transformed.message,
                    stderr: '',
                    exitCode: 0,
                    diagnostics: [],
                    results: [],
                };
            }
            else if (transformed.kind === 'execute') {
                output = inner.execute(transformed.source, '<repl>');
            }
            else {
                output = inner.executeSingle(transformed.source);
            }
            const result = toResult(output);
            history.push(result);
            return result;
        },
        reset() {
            inner.reset();
            history.length = 0;
            replCompatState.nextId = 1;
            replCompatState.pendingPremises = [];
            replCompatState.pendingBlockLines = [];
            replCompatState.pendingBlockBraceDepth = 0;
            replCompatState.pendingBlockProofDepth = 0;
            replCompatState.pendingBlockProofAwaitingShow = [];
        },
        getProfile() {
            const p = inner.getProfile();
            return p ? p.name : null;
        },
        getAxioms() {
            return Array.from(inner.getTheory().axioms.keys());
        },
        getTheorems() {
            return Array.from(inner.getTheory().theorems.keys());
        },
        getClaims() {
            return Array.from(inner.getTheory().claims.keys());
        },
        getTheorySummary() {
            const t = inner.getTheory();
            return {
                profile: t.profile,
                axioms: Array.from(t.axioms.keys()),
                theorems: Array.from(t.theorems.keys()),
                claims: Array.from(t.claims.keys()),
                judgmentCount: t.judgments.length,
            };
        },
        getHistory() {
            return [...history];
        },
    };
}
// ── Utilidades expuestas ──────────────────────────────────────
/** Convierte una fórmula AST a string legible (notación programática) */
var propositional_1 = require("./logic/profiles/classical/propositional");
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return propositional_1.formulaToString; } });
/** Convierte una fórmula AST a notación Unicode (¬, ∧, ∨, →, ↔, □, ◇, ∀, ∃) */
var format_1 = require("./runtime/format");
Object.defineProperty(exports, "formulaToUnicode", { enumerable: true, get: function () { return format_1.formulaToUnicode; } });
/** Convierte una fórmula AST a notación LaTeX */
var format_2 = require("./runtime/format");
Object.defineProperty(exports, "formulaToLaTeX", { enumerable: true, get: function () { return format_2.formulaToLaTeX; } });
var fallacies_1 = require("./runtime/fallacies");
Object.defineProperty(exports, "detectFallacies", { enumerable: true, get: function () { return fallacies_1.detectFallacies; } });
/** Lista los perfiles lógicos disponibles */
function listProfiles() {
    // Los perfiles se registran al instanciar un Interpreter,
    // pero ya deberían estar en el registry si se cargan sus archivos.
    // Sin embargo, para asegurar, instanciamos uno.
    new interpreter_1.Interpreter();
    return interface_1.registry.list();
}
/**
 * Obtiene información de hover para una posición en el código ST.
 * Útil para tooltips en editores.
 *
 * @returns HoverInfo o null si no hay info en esa posición
 */
function hover(source, line, column, file) {
    const handler = new handler_1.ProtocolHandler();
    const resp = handler.handle({
        id: 0,
        method: 'hover',
        params: { source, line, column, file: file || '<api>' },
    });
    return resp.result ?? null;
}
/**
 * Lista todos los símbolos definidos en el código ST (axiomas, teoremas, claims, passages, etc.).
 * Útil para panel de símbolos en editores.
 */
function symbols(source, file) {
    const handler = new handler_1.ProtocolHandler();
    const resp = handler.handle({
        id: 0,
        method: 'symbols',
        params: { source, file: file || '<api>' },
    });
    return resp.result ?? [];
}
/**
 * Busca la definición de un símbolo por nombre en el código ST.
 * Útil para "Go to Definition" en editores.
 *
 * @returns SourceLocation de la definición o null si no se encuentra
 */
function gotoDefinition(source, name, file) {
    const handler = new handler_1.ProtocolHandler();
    const resp = handler.handle({
        id: 0,
        method: 'goto_definition',
        params: { source, name, file: file || '<api>' },
    });
    return resp.result ?? null;
}
/**
 * Obtiene sugerencias de completado para el lenguaje ST.
 * Devuelve keywords y snippets disponibles.
 */
function completion() {
    const handler = new handler_1.ProtocolHandler();
    const resp = handler.handle({
        id: 0,
        method: 'completion',
        params: {},
    });
    return resp.result ?? [];
}
/**
 * Ejecuta y renderiza el código ST en el formato especificado.
 *
 * @param format 'markdown' | 'json' (default: 'markdown')
 */
function render(source, format, file) {
    const handler = new handler_1.ProtocolHandler();
    const resp = handler.handle({
        id: 0,
        method: 'render',
        params: { source, format: format || 'markdown', file: file || '<api>' },
    });
    const result = resp.result;
    return {
        rendered: result?.rendered ?? '',
        format: result?.format ?? format ?? 'markdown',
        diagnostics: resp.diagnostics ?? [],
    };
}
// ── TypeChecker ───────────────────────────────────────────────
var typecheck_1 = require("./runtime/typecheck");
Object.defineProperty(exports, "typeCheck", { enumerable: true, get: function () { return typecheck_1.typeCheck; } });
Object.defineProperty(exports, "TypeChecker", { enumerable: true, get: function () { return typecheck_1.TypeChecker; } });
//# sourceMappingURL=api.js.map