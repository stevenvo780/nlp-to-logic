/**
 * MDX diff — detecta qué claims cambiaron entre dos versiones de un MDX.
 *
 * Algoritmo:
 *   1. Parsear ambas versiones a Claim[] (ignorando bloques malformados).
 *   2. Indexar por id.
 *   3. added   = ids en `after` que no estaban en `before`.
 *      removed = ids en `before` que ya no están en `after`.
 *      modified = ids en ambos cuyos campos lógicos difieren.
 */
import type { MDXDelta } from './types';
export declare const diffMDX: (before: string, after: string) => MDXDelta;
//# sourceMappingURL=diff.d.ts.map