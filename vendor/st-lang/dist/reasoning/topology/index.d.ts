/** Simplex abstracto: lista ordenada ascendente de vértices (enteros). */
export type Simplex = number[];
/** Simplex con signo orientado, usado por el operador borde ∂ sobre Z. */
export interface SignedSimplex {
    sign: 1 | -1;
    simplex: Simplex;
}
/**
 * Complejo simplicial abstracto.
 * Internamente los simplices se indexan por dimensión (`k = |s|-1`) y se
 * almacenan por su clave canónica `v0,v1,...,vk`.
 */
export interface SimplicialComplex {
    vertices: number[];
    simplices: Map<number, Set<string>>;
    dim: number;
}
/**
 * Resultado de un cómputo de homología sobre un complejo simplicial.
 * Incluye números de Betti, característica de Euler y, cuando se trabaja
 * sobre Z, la torsión por dimensión.
 */
export interface HomologyResult {
    dim: number;
    bettiNumbers: number[];
    eulerChar: number;
    torsion?: Record<number, number[]>;
}
/** Crea un complejo simplicial vacío (sin vértices ni simplices). */
export declare function makeComplex(): SimplicialComplex;
/**
 * Añade un simplex `s` y todas sus caras al complejo `K` (cierre hacia abajo).
 * El simplex se normaliza a orden creciente antes de insertarse.
 * @throws si `s` contiene vértices repetidos.
 */
export declare function addSimplex(K: SimplicialComplex, s: Simplex): void;
/**
 * Devuelve las caras directas (codimensión 1) del k-simplex `s`.
 * Un k-simplex tiene exactamente k+1 caras. Devuelve `[]` para 0-simplices.
 */
export declare function faces(s: Simplex): Simplex[];
/** Operador borde ∂ sobre Z/2 (coeficientes en F₂): lista de caras sin signos. */
export declare function boundaryZ2(simplex: Simplex): Simplex[];
/**
 * Operador borde ∂ sobre Z: devuelve cada cara con signo `(-1)^i`, donde `i`
 * es el índice del vértice omitido en el orden canónico del simplex.
 */
export declare function boundaryZ(simplex: Simplex): SignedSimplex[];
/** Dimensión del complejo simplicial (el mayor k tal que K contiene un k-simplex, o -1 si está vacío). */
export declare function dimension(K: SimplicialComplex): number;
/**
 * f-vector del complejo: `f[i]` = número de i-simplices, para i = 0..dim.
 * @example fVector(nSimplex(2)) // [3, 3, 1] (triángulo lleno)
 */
export declare function fVector(K: SimplicialComplex): number[];
/**
 * Característica de Euler: χ = ∑ (-1)^i f_i.
 * Invariante topológico (S² → 2, T² → 0, RP² → 1).
 */
export declare function eulerCharacteristic(K: SimplicialComplex): number;
/** Rango del operador borde ∂_d : C_d → C_{d-1} sobre F₂. */
export declare function rankBoundaryZ2(K: SimplicialComplex, dim: number): number;
/**
 * Número de Betti β_d sobre Z/2 (F₂).
 * β_d = dim ker ∂_d − dim im ∂_{d+1} = n_d − rank ∂_d − rank ∂_{d+1}.
 */
export declare function bettiNumberZ2(K: SimplicialComplex, dim: number): number;
/**
 * Forma Normal de Smith sobre Z para una matriz entera.
 * Devuelve la SNF (diagonal con factores invariantes d₁ | d₂ | … | dᵣ, resto ceros),
 * el rango (número de pivotes no nulos) y la dimensión del kernel (cols − rankIm).
 * Algoritmo: reducción iterativa estilo Bareiss/Euclídea sobre filas y columnas.
 */
export declare function smithNormalForm(matrix: number[][]): {
    snf: number[][];
    rankIm: number;
    rankKer: number;
    invariants: number[];
};
/**
 * Número de Betti β_d sobre Z (parte libre de la homología H_d).
 * β_d = rank ker ∂_d − rank im ∂_{d+1}, equivalente a contar copias de Z en H_d.
 */
export declare function bettiNumberZ(K: SimplicialComplex, dim: number): number;
/**
 * Factores invariantes (> 1) de la torsión de H_d sobre Z.
 * H_d = Z^{β_d} ⊕ ⊕ᵢ Z/dᵢ, con d₁ | d₂ | … | dₖ, dᵢ > 1.
 * Ejemplo: RP² tiene torsión [2] en dimensión 1.
 */
export declare function torsionZ(K: SimplicialComplex, dim: number): number[];
/**
 * Complejo del n-simplex completo: todos los subconjuntos no vacíos de {0,…,n}.
 * `nSimplex(2)` da un triángulo relleno (2-cara incluida), no solo su borde.
 */
export declare function nSimplex(n: number): SimplicialComplex;
/**
 * Triangulación canónica de la esfera S^n (frontera del (n+1)-simplex).
 * `spheres(2)` = borde del tetraedro: 4 vértices, 6 aristas, 4 triángulos; χ = 2.
 */
export declare function spheres(n: number): SimplicialComplex;
/**
 * Triangulación del toro T² (cuadrado 3×3 con identificaciones a b a⁻¹ b⁻¹).
 * 9 vértices, 27 aristas, 18 triángulos. χ = 0, β_{Z/2} = [1,2,1].
 */
export declare function torus2(): SimplicialComplex;
/**
 * Triangulación mínima del plano proyectivo real RP² (6 vértices, 15 aristas, 10 triángulos).
 * β_Z = [1,0,0] con torsión Z/2 en dimensión 1; β_{Z/2} = [1,1,1]; χ = 1.
 */
export declare function projectivePlane(): SimplicialComplex;
/**
 * Triangulación de la botella de Klein (cuadrado 3×3 con identificaciones a b a b⁻¹).
 * 9 vértices; χ = 0; β_Z = [1,1,0]; torsión Z/2 en dim 1.
 */
export declare function kleinBottle(): SimplicialComplex;
/**
 * Cómputo completo de homología de `K` con coeficientes en Z/2 o Z.
 * Devuelve números de Betti, característica de Euler y (si Z) la torsión por dimensión.
 * @param coefficients `'Z2'` para F₂ (defecto) o `'Z'` para coeficientes enteros.
 */
export declare function computeHomology(K: SimplicialComplex, coefficients?: 'Z2' | 'Z'): HomologyResult;
//# sourceMappingURL=index.d.ts.map