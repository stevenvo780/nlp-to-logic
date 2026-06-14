import { Formula } from '../../types';
/**
 * Genera un hash canónico y estable para una fórmula.
 * - Ignora whitespace/metadatos de source.
 * - Aplica alpha-renaming antes de serializar: fórmulas alfa-equivalentes
 *   producen el mismo hash.
 */
export declare function hashFormula(f: Formula): string;
//# sourceMappingURL=hash.d.ts.map