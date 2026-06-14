import type { CitedClaim, CitationDerivation, CitationDerivationResult } from './types';
/**
 * Evaluador externo que el caller provee.
 * Recibe premisas (en orden: citadas primero, luego locales), el goal y el
 * perfil lógico dominante; devuelve { valid, proof? }.
 */
export type Evaluator = (premises: string[], goal: string, profile: string) => Promise<{
    valid: boolean;
    proof?: unknown;
}>;
/**
 * Ejecuta una derivación que combina premisas de documentos externos (citations)
 * con premisas locales para intentar demostrar `goal`.
 *
 * Contrato:
 * - Las citas se ordenan por `weight` descendente (mayor peso = premisa más
 *   fuerte primero). Empates se resuelven por `id` lexicográfico.
 * - El evaluador recibe: [...formulas_citadas_ordenadas, ...localPremises].
 * - Si no hay citas, la derivación es puramente local.
 * - La traza incluye un paso por cada citación y uno por cada premisa local,
 *   más el paso de conclusión.
 */
export declare function deriveWithCitations(derivation: CitationDerivation, evaluator: Evaluator): Promise<CitationDerivationResult>;
/**
 * Genera una explicación en lenguaje natural de una prueba formal,
 * referenciando las citas que participaron como premisas.
 *
 * Si `proof` es null/undefined devuelve un mensaje genérico.
 */
export declare function explainProof(proof: unknown, citations: CitedClaim[]): string;
//# sourceMappingURL=derive.d.ts.map