import type { Formula } from '../../types';
import '../../logic/profiles';
import type { StreamEvent, ProfileName } from './types';
export interface StreamEvalOptions {
    abortSignal?: AbortSignal;
}
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
export declare function streamEval(formula: Formula, profile: ProfileName, opts?: StreamEvalOptions): AsyncIterable<StreamEvent>;
//# sourceMappingURL=stream-eval.d.ts.map