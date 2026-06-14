/**
 * Clause Splitter — Divide oraciones en cláusulas usando marcadores discursivos.
 *
 * Estrategia:
 * 1. Detectar marcadores discursivos dentro de la oración
 * 2. Dividir por marcadores (priorizando los más largos)
 * 3. Dividir por comas que separan cláusulas sustantivas
 * 4. Asignar marcadores detectados a cada cláusula
 */
import type { Clause, Language } from '../types';
/**
 * Divide una oración en cláusulas basándose en marcadores discursivos.
 */
export declare function splitClauses(sentence: string, language?: Language): Clause[];
//# sourceMappingURL=clause-splitter.d.ts.map