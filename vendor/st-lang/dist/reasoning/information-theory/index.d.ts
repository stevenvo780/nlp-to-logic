/** Distribución de probabilidad discreta sobre símbolos de tipo `T` (`Map<T, number>`, masa ≈ 1). */
export type Distribution<T> = Map<T, number>;
/**
 * Distribución conjunta sobre pares (X, Y).
 * Nota: `Map<[X, Y], number>` no des-duplica por igualdad estructural;
 * el llamante debe garantizar un par por combinación (x, y).
 */
export type Joint<X, Y> = Map<[X, Y], number>;
/** Devuelve los símbolos con probabilidad estrictamente positiva (soporte de `p`). */
export declare function support<T>(p: Distribution<T>): T[];
/** `true` si todas las probabilidades son ≥ 0, finitas y su suma difiere de 1 en menos de `eps`. */
export declare function isValidDistribution<T>(p: Distribution<T>, eps?: number): boolean;
/**
 * Reescala la distribución `p` para que su masa sea 1.
 * @throws si alguna probabilidad es inválida o la masa total es 0.
 */
export declare function normalize<T>(p: Distribution<T>): Distribution<T>;
/** Base del logaritmo para entropías: `2` (bits, default), `'e'` (nats), `10` (hartleys), `'log'` (alias de 2). */
export type LogBase = 'log' | 'e' | 2 | 10;
/** Entropía de Shannon: H(p) = −Σ p(x)·log p(x). Convención: 0·log 0 = 0. */
export declare function shannonEntropy<T>(p: Distribution<T>, base?: LogBase): number;
/**
 * Entropía de Rényi de orden `alpha` (α ≥ 0): H_α(p) = 1/(1−α)·log Σ p(x)^α.
 * Límites: α=0 → max-entropy, α=1 → Shannon, α=2 → colisión, α→∞ → min-entropy.
 * @throws si `alpha` es negativo o no finito.
 */
export declare function renyiEntropy<T>(p: Distribution<T>, alpha: number, base?: LogBase): number;
/** Min-entropy: −log max_x p(x). Mide la peor predictibilidad en un solo intento. */
export declare function minEntropy<T>(p: Distribution<T>, base?: LogBase): number;
/** Max-entropy (Hartley): log|soporte(p)|, el logaritmo del tamaño del soporte estricto. */
export declare function maxEntropy<T>(p: Distribution<T>, base?: LogBase): number;
/** Entropía de colisión: Rényi α=2 = −log Σ p(x)². Mide la probabilidad de dos muestras iguales. */
export declare function collisionEntropy<T>(p: Distribution<T>, base?: LogBase): number;
/** Divergencia KL: KL(p ‖ q) = Σ p(x)·log(p(x)/q(x)). Devuelve +∞ si p(x)>0 y q(x)=0. */
export declare function klDivergence<T>(p: Distribution<T>, q: Distribution<T>, base?: LogBase): number;
/** Divergencia Jensen-Shannon: JS(p,q) = ½ KL(p ‖ m) + ½ KL(q ‖ m), m = ½(p+q). Simétrica, ∈ [0, log 2]. */
export declare function jsDivergence<T>(p: Distribution<T>, q: Distribution<T>, base?: LogBase): number;
/** Distancia de variación total: TV(p,q) = ½ Σ |p(x) − q(x)|. ∈ [0, 1]. */
export declare function tvDistance<T>(p: Distribution<T>, q: Distribution<T>): number;
/** Distancia de Hellinger: H(p,q) = (1/√2)·√(Σ (√p(x) − √q(x))²). ∈ [0, 1]; 0 ⟺ p = q; 1 ⟺ soportes disjuntos. */
export declare function hellingerDistance<T>(p: Distribution<T>, q: Distribution<T>): number;
/** Cross-entropía: H(p,q) = −Σ p(x)·log q(x) = H(p) + KL(p ‖ q). Devuelve +∞ si p(x)>0 y q(x)=0. */
export declare function crossEntropy<T>(p: Distribution<T>, q: Distribution<T>, base?: LogBase): number;
/** Proyecta la distribución conjunta `j` sobre cada eje, devolviendo las marginales `X` e `Y`. */
export declare function jointToMarginals<X, Y>(j: Joint<X, Y>): {
    X: Distribution<X>;
    Y: Distribution<Y>;
};
/** Información mutua I(X;Y) = Σ p(x,y)·log(p(x,y)/(p(x)·p(y))) = H(X) + H(Y) − H(X,Y). */
export declare function mutualInformation<X, Y>(j: Joint<X, Y>, base?: LogBase): number;
/** Entropía condicional H(X|Y) o H(Y|X) según `condOn`. H(X|Y) = H(X,Y) − H(Y) ≥ 0. */
export declare function conditionalEntropy<X, Y>(j: Joint<X, Y>, condOn: 'X' | 'Y', base?: LogBase): number;
/**
 * Devuelve los cuatro escalares {hX, hY, hXY, iXY} de la regla de la cadena.
 * Verifica: H(X,Y) = H(X) + H(Y) − I(X;Y).
 */
export declare function chainRule<X, Y>(j: Joint<X, Y>, base?: LogBase): {
    hX: number;
    hY: number;
    hXY: number;
    iXY: number;
};
//# sourceMappingURL=index.d.ts.map