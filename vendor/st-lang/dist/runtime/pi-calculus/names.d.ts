import type { PiProcess } from './types';
/**
 * Conjunto de nombres libres de un proceso π. Un nombre es "libre" si
 * aparece referenciado pero no está bajo el alcance de un binder
 * (input `c(x)` liga `x`; new `(νc)` liga `c`).
 */
export declare function freeNames(p: PiProcess): Set<string>;
/**
 * Conjunto de nombres ligados (introducidos por algún binder en el
 * subárbol). Útil para detectar shadowing y evitar capturas.
 */
export declare function boundNames(p: PiProcess): Set<string>;
/**
 * α-renaming: renombrar un nombre en todo el AST. Útil para:
 *   - Refrescar nombres ligados antes de sustituir (evitar capturas).
 *   - Normalizar canales restringidos al testear congruencia estructural.
 *
 * No diferencia entre nombres libres y ligados: simplemente reemplaza
 * cada ocurrencia de `oldN` por `newN`. La diferenciación libre/ligado
 * se hace en `substitute`, que usa `alphaRename` como utility.
 */
export declare function alphaRename(p: PiProcess, oldN: string, newN: string): PiProcess;
/**
 * Genera un nombre fresco que no aparece en ninguno de los conjuntos
 * `avoid`. Estrategia simple: base + sufijo numérico incremental.
 */
export declare function freshName(base: string, avoid: ReadonlySet<string>): string;
//# sourceMappingURL=names.d.ts.map