export interface Vector {
    values: number[];
}
export declare function vec(values: number[]): Vector;
export declare function dot(a: Vector, b: Vector): number;
export declare function norm(v: Vector): number;
export declare function normalize(v: Vector): Vector;
export declare function isOrthogonal(a: Vector, b: Vector, eps?: number): boolean;
/**
 * Gram-Schmidt sobre `vectors`. Devuelve la base ortonormal del
 * subespacio que generan (puede tener menos vectores que la entrada
 * si hay dependencias). Devuelve `null` solo si la entrada está vacía.
 */
export declare function orthonormalBasis(vectors: Vector[], eps?: number): Vector[] | null;
export interface Subspace {
    basis: Vector[];
    dimension: number;
    ambientDim: number;
}
/**
 * Subespacio generado por `vectors`. Si la lista está vacía,
 * `ambientDim` debe pasarse para devolver el subespacio cero del
 * ambiente correcto.
 */
export declare function span(vectors: Vector[], ambientDim?: number): Subspace;
/** ¿a ⊆ b? Todos los vectores de la base de a están en b. */
export declare function isContained(a: Subspace, b: Subspace, eps?: number): boolean;
export declare function equalsSubspace(a: Subspace, b: Subspace, eps?: number): boolean;
/**
 * Ortocomplemento de `s` en el ambiente de dimensión `ambientDim`.
 * Algoritmo: tomar la base canónica e_1..e_n, restarle la proyección
 * sobre `s`, y aplicar Gram-Schmidt; los vectores supervivientes
 * forman la base ortonormal de s⊥.
 */
export declare function orthocomplement(s: Subspace, ambientDim?: number): Subspace;
/**
 * Join (∨) = span(a.basis ∪ b.basis). Es la operación supremo
 * en el lattice; el resultado siempre contiene tanto a como b.
 */
export declare function join(a: Subspace, b: Subspace): Subspace;
/**
 * Meet (∧) = intersección de subespacios. Identidad lattice:
 *   a ∧ b = (a⊥ ∨ b⊥)⊥
 */
export declare function meet(a: Subspace, b: Subspace): Subspace;
/** Subespacio cero (dimensión 0) en R^n. */
export declare function zeroSubspace(ambientDim: number): Subspace;
/** Top: todo el espacio R^n con la base canónica. */
export declare function topSubspace(ambientDim: number): Subspace;
export interface QuantumLattice {
    dimensions: number;
    meet: (a: Subspace, b: Subspace) => Subspace;
    join: (a: Subspace, b: Subspace) => Subspace;
    orthocomplement: (s: Subspace) => Subspace;
    zero: Subspace;
    top: Subspace;
}
export declare function makeQuantumLattice(dim: number): QuantumLattice;
/**
 * Distributividad: a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c).
 * En el lattice cuántico FALLA — devolvemos true sólo si se cumple
 * para *toda* muestra (lo cual prácticamente nunca pasa para n ≥ 2).
 */
export declare function isDistributive(L: QuantumLattice, samples?: number): boolean;
/**
 * Modularidad: si a ≤ c entonces a ∨ (b ∧ c) = (a ∨ b) ∧ c.
 * En dimensión finita el lattice de subespacios SÍ es modular
 * (resultado clásico). El test forma a' = a ∧ c (siempre ≤ c)
 * para garantizar la hipótesis a' ≤ c.
 */
export declare function isModular(L: QuantumLattice, samples?: number): boolean;
/**
 * Ortomodularidad: si a ≤ b entonces b = a ∨ (b ∧ a⊥).
 * Se cumple en el lattice de subespacios de un espacio de Hilbert.
 */
export declare function isOrthomodular(L: QuantumLattice, samples?: number): boolean;
export interface KSConfiguration {
    vectors: Vector[];
    /** Tripletes (i,j,k) tales que v_i, v_j, v_k son mutuamente ortogonales. */
    orthoTriples: Array<[number, number, number]>;
}
/**
 * Detecta automáticamente todos los triples ortogonales en R^3
 * dentro de `vectors` y los registra. En R^3, tres vectores no
 * nulos mutuamente ortogonales forman base.
 */
export declare function findOrthogonalTriples(vectors: Vector[], eps?: number): Array<[number, number, number]>;
/**
 * ¿Existe una coloración {0,1} de los vectores tal que:
 *  - dos vectores que generan el mismo rayo reciben el mismo color,
 *  - en cada triple ortogonal exactamente uno recibe color 1?
 *
 * Devuelve true si tal coloración existe (configuración "trivial"),
 * false si la configuración es un teorema KS (no coloreable).
 *
 * Algoritmo: backtracking sobre los rayos (no los vectores), con
 * unit-propagation por las restricciones de cada triple.
 */
export declare function isKSColorable(config: KSConfiguration): boolean;
/**
 * Configuración estilo-Peres: rayos en R^3 con coordenadas en
 * { -1, 0, 1, ±√2 }, deduplicados por rayo. La cantidad exacta de
 * rayos depende de cuáles dedupliquen (p.ej. (√2,√2,0) define el
 * mismo rayo que (1,1,0)).
 *
 * Aviso histórico: la prueba ORIGINAL de Kochen-Specker (1967)
 * usa 117 vectores en R^3. Asher Peres (1991) la simplificó a 33
 * vectores en R^3, y Cabello-Estebaranz-García (1996) probaron
 * que en R^4 bastan 18 — el mínimo conocido en cualquier
 * dimensión, ver `kochenSpeckerCabello18()`. Aquí construimos
 * la familia clásica de rayos R^3 a partir del cubo unitario;
 * la prueba de no-coloreabilidad rigurosa se delega a la
 * configuración Cabello-18 (R^4), que se incluye en el mismo
 * módulo y es la que usan los tests para el teorema KS.
 */
export declare function kochenSpeckerTheorem3D(): KSConfiguration;
/**
 * Configuración Cabello-Estebaranz-García (1996): 18 vectores en
 * R^4 que constituyen el menor conjunto Kochen-Specker conocido
 * en cualquier dimensión. La prueba se basa en 9 "contextos"
 * (bases ortonormales de R^4); cada vector aparece en exactamente
 * 2 contextos, así que cualquier asignación 0/1 que ponga
 * exactamente un "1" por contexto requeriría que la suma global
 * sea 9 (impar), pero como cada vector contribuye 0 ó 2, la suma
 * debe ser par — contradicción.
 *
 * El `KSConfiguration` devuelto es R^4; la función `isKSColorable`
 * funciona idénticamente en cualquier dimensión, sólo verifica
 * la estructura combinatoria de los `orthoTriples` (aquí, en R^4,
 * los "triples" son en realidad CUÁDRUPLAS — para mantener la
 * interfaz, partimos cada cuádrupla {a,b,c,d} en sus C(4,3)=4
 * triples implicados; esto preserva la lógica "exactamente un 1
 * por base" porque sumar exactamente 1 en cada uno de los 4
 * triples implica sumar exactamente 1 en el cuádruplo).
 *
 * Wait: realmente el enunciado correcto en R^4 es "exactamente
 * UN 1 por contexto ortonormal de 4 vectores". El checker actual
 * trabaja en triples (R^3). Para R^4 usamos un solver
 * especializado: `isKSColorableContexts`.
 */
export declare function kochenSpeckerCabello18(): {
    vectors: Vector[];
    contexts: number[][];
};
/**
 * Checker KS para contextos de cualquier aridad (no sólo R^3
 * triples). Verifica que existe una asignación {0,1} a cada rayo
 * tal que en cada contexto se asigna exactamente un 1.
 *
 * Usado para R^4 Cabello-18 (la prueba KS más pequeña conocida).
 */
export declare function isKSColorableContexts(vectors: Vector[], contexts: number[][]): boolean;
//# sourceMappingURL=index.d.ts.map