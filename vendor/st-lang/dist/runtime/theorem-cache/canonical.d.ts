/**
 * Canonicalización de fórmulas (string-based) para el theorem cache.
 *
 * El objetivo no es parsear lógica completa, sino normalizar:
 * - whitespace
 * - mapear identificadores (átomos / metavariables) a placeholders
 *   canónicos en orden de primera aparición, preservando estructura.
 *
 * Resultado: `P -> P` y `Q -> Q` producen la misma forma canónica
 * (`?0 -> ?0`), mientras que `P -> Q` produce `?0 -> ?1`. Esto soporta
 * proof reuse via substitución.
 *
 * Símbolos lógicos reservados (palabras clave) NO se renombran:
 *   not, and, or, implies, iff, forall, exists, true, false, ->,
 *   →, ∧, ∨, ¬, ↔, ∀, ∃, ⊤, ⊥
 */
/**
 * Normaliza whitespace: colapsa runs de espacio/tabs/newlines a un solo
 * espacio, y trimea. Mantiene la separación de tokens.
 */
export declare function normalizeWhitespace(formula: string): string;
/**
 * Devuelve la forma canónica de una fórmula como string.
 *
 * Cada identificador no reservado se reemplaza por `?N` donde N es el
 * orden de primera aparición. La estructura (operadores, paréntesis,
 * cuantificadores) se preserva intacta tras normalizar whitespace.
 *
 * También devuelve el mapping inverso (canonical → original) para
 * poder reconstruir substituciones.
 */
export interface CanonicalResult {
    canonical: string;
    /** Mapping de original → placeholder. Ej: `{P: "?0", Q: "?1"}` */
    forward: Map<string, string>;
    /** Mapping de placeholder → original. Ej: `{"?0": "P", "?1": "Q"}` */
    reverse: Map<string, string>;
}
export declare function canonicalize(formula: string): CanonicalResult;
/**
 * Versión simple que sólo devuelve el string canónico.
 */
export declare function canonicalString(formula: string): string;
/**
 * Intenta encontrar una substitución que mapee la fórmula cacheada
 * al target. Si las formas canónicas coinciden, calcula el mapping
 * desde los identificadores originales del teorema hacia los del
 * target.
 *
 * Retorna `undefined` si no son canónicamente equivalentes.
 */
export declare function computeSubstitution(cachedFormula: string, targetFormula: string): Record<string, string> | undefined;
/**
 * Aplica una substitución textual (mapping original → reemplazo) a
 * una fórmula, respetando límites de identificador. Útil para
 * rehidratar pruebas reutilizadas.
 */
export declare function applySubstitution(formula: string, substitution: Record<string, string>): string;
//# sourceMappingURL=canonical.d.ts.map