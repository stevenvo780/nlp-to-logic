import type { CubicalTerm } from './types';
export declare function reflPath(x: CubicalTerm): CubicalTerm;
export declare function pathInverse(p: CubicalTerm): CubicalTerm;
export declare function pathCompose(p: CubicalTerm, q: CubicalTerm): CubicalTerm;
/**
 * Glue: convierte una equivalencia A ≃ B (codificada como par Σ con
 * dominio y codominio) en un Path en el universo. Es el precursor
 * sintáctico de la computación de ua en CTT — aquí no implementamos
 * la regla de cómputo full, sólo la introducción del término.
 */
export declare function glue(equiv: CubicalTerm, partial: CubicalTerm): CubicalTerm;
//# sourceMappingURL=path-algebra.d.ts.map