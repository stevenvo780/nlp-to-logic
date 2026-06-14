import { type CubeTerm } from './types';
/**
 * Identidad polimórfica: λ X:*. λ x:X. x  ∈ λ2.
 * Tipo: Π X:*. X → X.
 */
export declare function polymorphicIdentity(): CubeTerm;
/** Tipo de la identidad polimórfica: Π X:*. X → X. */
export declare function polymorphicIdentityType(): CubeTerm;
/**
 * Encoding Church de un natural `n` en System F:
 *     n = λ X:*. λ s:X→X. λ z:X. s (s (... (s z) ...))   con n aplicaciones
 *
 * Tipo: Π X:*. (X → X) → X → X.
 */
export declare function churchNumeral(n: number): CubeTerm;
/** Tipo de un natural Church: Π X:*. (X → X) → X → X. */
export declare function churchNumeralType(): CubeTerm;
/**
 * Tipo polimórfico de pares: Π A:*. Π B:*. (Π C:*. (A → B → C) → C) → ...
 * En la versión sencilla devolvemos solo el tipo de "Pair A B":
 *
 *   Π A:*. Π B:*. Π C:*. (A → B → C) → C
 */
export declare function churchPairType(): CubeTerm;
/**
 * Esquema de "lista dependiente": dado un tipo de vectores indexado
 * por `Nat`, devolvemos el Π típico
 *
 *   Π n : Nat. Vector n
 *
 * Requiere que el contexto declare `Nat : *` y `Vector : Nat → *`.
 * Atención: ambos extremos son `*`, así que esta Π usa la regla
 * (*,*) y queda legal incluso en λ→ una vez que `Vector` está en el
 * contexto. El sabor "dependiente" viene del hecho de que el
 * codominio menciona el binder `n`.
 */
export declare function dependentList(): CubeTerm;
/**
 * Predicado sobre `Nat`: `Π n:Nat. *`. Domino `Nat : *` y codominio
 * `*` (cuyo sort es `◻`). Esa es justo la formación (*,◻) — exclusiva
 * de los vértices con tipos dependientes (λP, λP2, λPω, λC).
 *
 * Requiere `Nat : *` en el contexto.
 */
export declare function predicateOverNat(): CubeTerm;
/**
 * Operador de tipo `id-type`: λ A:*. A → A  en λω.
 * Tipo: * → *.
 */
export declare function typeLevelIdentity(): CubeTerm;
/** Tipo del operador `typeLevelIdentity`: * → *. */
export declare function typeLevelIdentityKind(): CubeTerm;
/**
 * En el Calculus of Constructions, el tipo polimórfico
 *   Π A:*. A → A
 * vive en el universo `*`.
 */
export declare function cocPolyIdentityType(): CubeTerm;
//# sourceMappingURL=examples.d.ts.map