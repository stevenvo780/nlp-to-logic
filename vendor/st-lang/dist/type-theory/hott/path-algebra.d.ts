import type { HoTTTerm } from './types';
import { type InferContextHoTT } from './infer';
export declare function refl(x: HoTTTerm): HoTTTerm;
export declare function pathInverse(path: HoTTTerm): HoTTTerm;
export declare function pathCompose(p: HoTTTerm, q: HoTTTerm): HoTTTerm;
/**
 * Chequeo heurístico de h-equivalencia.
 * Una equivalencia verdadera requiere isContr de las fibras, que aquí
 * NO computamos. Aceptamos pares ⟨A, B⟩ : Σ Type. Type con A αβ= B
 * (equivalencia trivial), o cualquier término marcado explícitamente
 * con la estructura ⟨f, ⟨g, ⟨α, β⟩⟩⟩ y posponemos verificación.
 */
export declare function isHEquivalence(f: HoTTTerm, ctx?: InferContextHoTT): boolean;
export interface UnivalenceWitness {
    equiv: HoTTTerm;
    path: HoTTTerm;
}
/**
 * Postula un path desde una equivalencia. No es computacional:
 * normalizar `transport(P, ua(e), x)` no reduce — eso requiere
 * cubical type theory.
 */
export declare function univalence(equiv: HoTTTerm): HoTTTerm;
export declare function univalenceWitness(equiv: HoTTTerm): UnivalenceWitness;
//# sourceMappingURL=path-algebra.d.ts.map