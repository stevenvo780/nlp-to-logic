/**
 * MDX → Claim[] parser.
 *
 * Reconoce dos formatos en cualquier orden y en cualquier posición del
 * documento (dentro de prosa, dentro de listas, etc):
 *
 *   - HTML comment style:
 *       <!-- st:claim id="c1" profile="p" formula="A->B" deps="c0,c2" -->
 *
 *   - Fenced code block style:
 *       ```st-claim id=c1 profile=p deps=c0
 *       A->B
 *       ```
 *
 * Bloques malformados (sin id, sin profile, sin formula, etc.) se ignoran
 * acumulando un warning. NUNCA lanza.
 */
import type { Claim } from '../types';
import type { MDXClaim, MDXParseResult } from './types';
/**
 * Versión "rica" — devuelve también warnings. La API pública delega aquí.
 */
export declare const mdxToClaimsDetailed: (mdx: string) => MDXParseResult;
/**
 * MDX → Claim[]. Tolera bloques malformados ignorándolos.
 */
export declare const mdxToClaims: (mdx: string) => MDXClaim[];
/**
 * Helper interno: convierte MDXClaim a Claim "pelado" (sin rawBlock/source).
 * Útil para diff que sólo compara campos lógicos.
 */
export declare const stripMDXMetadata: (claim: MDXClaim) => Claim;
//# sourceMappingURL=parser.d.ts.map