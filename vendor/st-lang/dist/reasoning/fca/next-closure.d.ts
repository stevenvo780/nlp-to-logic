import type { FormalConcept, FormalContext } from './types';
/**
 * Enumera todos los conceptos formales de `ctx` mediante Next Closure.
 *
 * Garantías:
 *  - Cada concepto aparece exactamente una vez.
 *  - El orden de salida es lectic sobre intents (creciente).
 *  - Incluye el Top concept (G, G') y el Bottom concept (M', M) cuando
 *    existen como cerrados (siempre existen).
 */
export declare function allConcepts(ctx: FormalContext): FormalConcept[];
//# sourceMappingURL=next-closure.d.ts.map