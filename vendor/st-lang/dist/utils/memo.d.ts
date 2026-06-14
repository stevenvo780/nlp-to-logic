import { Formula } from '../types';
/**
 * Función genérica de memoización para operaciones que toman FormData y
 * devuelven un string.
 */
export declare function memoizeString(f: Formula, compute: (f: Formula) => string): string;
export declare function memoizeHash(f: Formula, compute: (f: Formula) => string): string;
export declare function memoizeAtoms(f: Formula, compute: (f: Formula) => Set<string>): Set<string>;
export declare function memoizeNNF(f: Formula, compute: (f: Formula) => Formula): Formula;
export declare function memoizeCNF(f: Formula, compute: (f: Formula) => Formula): Formula;
export declare function memoizeDNF(f: Formula, compute: (f: Formula) => Formula): Formula;
//# sourceMappingURL=memo.d.ts.map