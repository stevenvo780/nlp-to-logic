/**
 * Calcula la distancia de edición (Levenshtein) entre dos strings.
 * Complejidad: O(|a| * |b|) en tiempo y espacio.
 */
export declare function levenshtein(a: string, b: string): number;
/**
 * Dado un identificador no reconocido y un set de candidatos declarados,
 * devuelve el más cercano si su distancia ≤ maxDistance, o undefined.
 */
export declare function findClosest(unknown: string, candidates: Iterable<string>, maxDistance?: number): string | undefined;
//# sourceMappingURL=levenshtein.d.ts.map