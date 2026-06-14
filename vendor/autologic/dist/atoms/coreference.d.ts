/**
 * Coreference — Resolución de coreferencia por similitud léxica + morfológica
 *
 * Detecta cuando dos cláusulas se refieren a la misma proposición:
 * "llueve" ≈ "está lloviendo" → mismo átomo
 * "la calle se moja" ≈ "la calle está mojada" → mismo átomo
 *
 * Usa:
 * 1. Coeficiente Dice sobre bags-of-stems
 * 2. Normalización de formas verbales (gerundio, participio, conjugaciones)
 * 3. Eliminación de verbos copulativos/auxiliares
 */
import type { Language } from '../types';
export declare function canonicalRoot(root: string): string;
/**
 * Stems del español sufren sobre-stemming en participios femeninos:
 * "mojada" → `mojad` mientras que "mojado"/"moja" → `moj`. Esto rompe la
 * unificación de átomos (LLUEVE vs LLOVIENDO ya lo cubre el mapa irregular;
 * aquí cubrimos la variante flexiva de participio). Plegamos el residuo
 * `-ad`/`-id` cuando deja una raíz de ≥3 caracteres y la raíz original
 * tiene ≥5, evitando colapsar sustantivos como `edad`, `verdad`, `ciudad`
 * (raíz < 5) o cualquier raíz corta.
 */
export declare function canonicalStem(root: string): string;
/**
 * Calcula la similitud Dice entre dos conjuntos de stems.
 * Dice = 2|A∩B| / (|A| + |B|)
 */
export declare function diceSimilarity(setA: Set<string>, setB: Set<string>): number;
/**
 * Calcula la similitud Jaccard entre dos conjuntos.
 * Jaccard = |A∩B| / |A∪B|
 */
export declare function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number;
/**
 * Determina si dos textos son correferentes (hablan de lo mismo).
 * Usa similitud mejorada con normalización morfológica.
 */
export declare function areCoreferent(textA: string, textB: string, language?: Language, threshold?: number): boolean;
/**
 * Dado un array de textos, agrupa los correferentes y retorna
 * un mapa de texto → índice del grupo representativo.
 */
export declare function resolveCoreferenceGroups(texts: string[], language?: Language, threshold?: number): Map<number, number>;
//# sourceMappingURL=coreference.d.ts.map