/**
 * Claim[] → MDX serializer.
 *
 * Produce MDX con bloques sincronizables en formato 'comment' o 'fence'.
 * El round-trip `mdxToClaims(claimsToMDX(claims))` reproduce los campos
 * lógicos (id, formula, profile, dependencies) sin pérdida.
 */
import type { Claim } from '../types';
import type { ClaimsToMDXOptions } from './types';
/**
 * Claim[] → MDX string.
 *
 * Separa cada bloque con doble newline. El orden de salida respeta el
 * orden del array de entrada.
 */
export declare const claimsToMDX: (claims: Claim[], options?: ClaimsToMDXOptions) => string;
//# sourceMappingURL=serializer.d.ts.map