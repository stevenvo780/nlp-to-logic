import type { CubeSystem } from './types';
import { type CubeTerm } from './types';
/** Sustitución capture-avoiding: term[value/name]. */
export declare function substitute(term: CubeTerm, name: string, value: CubeTerm): CubeTerm;
/**
 * Un paso de β-reducción top-down (call-by-name): si el término es
 * `(λ x:A. b) arg`, devuelve `b[arg/x]`. Si no hay redex top-level,
 * intenta reducir en sub-términos.
 */
export declare function reduceStep(term: CubeTerm): CubeTerm | undefined;
/** Normaliza por reducción a normal-form. `maxSteps` evita loops divergentes. */
export declare function normalize(term: CubeTerm, _system: CubeSystem, maxSteps?: number): CubeTerm;
/** ¿Dos términos son iguales módulo α y β? */
export declare function alphaBetaEq(a: CubeTerm, b: CubeTerm, system: CubeSystem): boolean;
/** ¿El término está en forma normal (no quedan β-redex)? */
export declare function isNormal(term: CubeTerm): boolean;
//# sourceMappingURL=normalize.d.ts.map