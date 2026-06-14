"use strict";
// ============================================================
// ST Streaming — streamEval(): evaluación incremental con AsyncIterable
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamEval = streamEval;
const interface_1 = require("../../logic/profiles/interface");
const propositional_1 = require("../../logic/profiles/classical/propositional");
require("../../logic/profiles"); // registra perfiles built-in
// ── Helpers internos ──────────────────────────────────────────
/** Yield un tick de event-loop para que el iterable sea genuinamente async. */
function tick() {
    return new Promise((resolve) => setImmediate(resolve));
}
/**
 * Mapea el status de RunResult a las categorías de subproof.
 */
function statusToSubproofResult(status) {
    switch (status) {
        case 'valid':
        case 'provable':
        case 'satisfiable':
            return 'T';
        case 'invalid':
        case 'refutable':
        case 'unsatisfiable':
            return 'F';
        case 'error':
            return 'unknown';
        default:
            return 'unknown';
    }
}
/**
 * Extrae sub-nodos significativos de la fórmula para generar eventos subproof.
 * Devuelve hasta maxNodes sub-fórmulas con su representación string.
 */
function extractSubnodes(formula, maxNodes = 8) {
    const result = [];
    function walk(f, depth) {
        if (result.length >= maxNodes)
            return;
        if (depth > 0 && f.kind !== 'atom') {
            result.push(f);
        }
        for (const arg of f.args ?? []) {
            walk(arg, depth + 1);
        }
    }
    walk(formula, 0);
    return result;
}
// ── API principal ─────────────────────────────────────────────
/**
 * Evalúa una fórmula AST bajo el perfil dado y emite eventos progresivos.
 *
 * Orden garantizado de eventos:
 *   `start` → (`subproof` | `progress`)* → `partial` → `done` | `error`
 *
 * Soporta cancelación vía `AbortSignal`. Cuando se cancela:
 *   - Se emite un evento `error` con mensaje de cancelación.
 *   - El iterable termina inmediatamente.
 *
 * Errores en la evaluación producen un evento `error` (no throw).
 *
 * @example
 * ```ts
 * const formula: Formula = { kind: 'implies', args: [
 *   { kind: 'atom', name: 'P' },
 *   { kind: 'atom', name: 'P' },
 * ]};
 * for await (const event of streamEval(formula, 'classical.propositional')) {
 *   console.log(event);
 * }
 * ```
 */
async function* streamEval(formula, profile, opts) {
    const signal = opts?.abortSignal;
    const startTime = Date.now();
    const checkAborted = () => signal?.aborted ?? false;
    const formulaStr = (0, propositional_1.formulaToString)(formula);
    // ── start ────────────────────────────────────────────────────
    yield { kind: 'start', formula: formulaStr };
    await tick();
    if (checkAborted()) {
        yield { kind: 'error', error: 'Evaluación cancelada (AbortSignal)' };
        return;
    }
    // ── Resolver perfil ─────────────────────────────────────────
    const logicProfile = interface_1.registry.get(profile);
    if (!logicProfile) {
        yield {
            kind: 'error',
            error: `Perfil lógico desconocido: "${profile}"`,
        };
        return;
    }
    // ── Sub-nodos para eventos subproof ──────────────────────────
    const subnodes = extractSubnodes(formula);
    const total = subnodes.length;
    for (let i = 0; i < subnodes.length; i++) {
        if (checkAborted()) {
            yield { kind: 'error', error: 'Evaluación cancelada (AbortSignal)' };
            return;
        }
        const sub = subnodes[i];
        if (!sub)
            continue;
        let subResult;
        try {
            subResult = logicProfile.checkValid(sub);
        }
        catch {
            subResult = { status: 'unknown', diagnostics: [], formula: sub };
        }
        const subStr = (0, propositional_1.formulaToString)(sub);
        yield {
            kind: 'subproof',
            node: subStr,
            result: statusToSubproofResult(subResult.status),
        };
        await tick();
        const ratio = (i + 1) / (total + 1);
        yield { kind: 'progress', ratio };
        await tick();
    }
    if (checkAborted()) {
        yield { kind: 'error', error: 'Evaluación cancelada (AbortSignal)' };
        return;
    }
    // ── Progreso: 90% — a punto de evaluar ──────────────────────
    yield { kind: 'progress', ratio: 0.9 };
    await tick();
    // ── Evaluación principal ─────────────────────────────────────
    let finalResult;
    try {
        finalResult = logicProfile.checkValid(formula);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        yield { kind: 'error', error: message };
        return;
    }
    if (checkAborted()) {
        yield { kind: 'error', error: 'Evaluación cancelada (AbortSignal)' };
        return;
    }
    // ── partial result ───────────────────────────────────────────
    yield { kind: 'partial', result: finalResult };
    await tick();
    // ── done ─────────────────────────────────────────────────────
    const totalMs = Date.now() - startTime;
    yield { kind: 'done', result: finalResult, totalMs };
}
//# sourceMappingURL=stream-eval.js.map