import type { Category, Functor, NaturalTransformation } from './types';
/**
 * Crea un functor verificable. El cliente pasa los mapeos a
 * objetos/morfismos; las verificaciones de leyes se derivan
 * recorriendo los `morphisms` de la categoría fuente.
 */
export declare function mkFunctor<O1, M1, O2, M2>(opts: {
    name: string;
    source: Category<O1, M1>;
    target: Category<O2, M2>;
    onObjects: (o: O1) => O2;
    onMorphisms: (m: M1) => M2;
}): Functor<O1, M1, O2, M2>;
/**
 * Functor identidad `Id_C : C → C`. Útil para tests y como elemento
 * neutro de la composición de functores.
 */
export declare function identityFunctor<O, M>(cat: Category<O, M>): Functor<O, M, O, M>;
/**
 * Composición de functores F ; G = G ∘ F. La firma respeta la
 * categoría source/target original sin perder información de tipos.
 */
export declare function composeFunctors<O1, M1, O2, M2, O3, M3>(G: Functor<O2, M2, O3, M3>, F: Functor<O1, M1, O2, M2>): Functor<O1, M1, O3, M3>;
/**
 * Crea una transformación natural η : F ⇒ G verificando su
 * naturalidad por muestreo. El cliente pasa la familia de
 * componentes `component(a) : F(a) → G(a)`.
 */
export declare function mkNaturalTransformation<O1, M1, O2, M2>(opts: {
    name: string;
    source: Functor<O1, M1, O2, M2>;
    target: Functor<O1, M1, O2, M2>;
    component: (o: O1) => M2;
}): NaturalTransformation<O1, M1, O2, M2>;
/**
 * Transformación natural identidad `id_F : F ⇒ F` con componentes
 * `id_{F(a)}`. Sirve como elemento neutro de composición vertical.
 */
export declare function identityNT<O1, M1, O2, M2>(F: Functor<O1, M1, O2, M2>): NaturalTransformation<O1, M1, O2, M2>;
//# sourceMappingURL=functor.d.ts.map