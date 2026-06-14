export interface NormalFormGame {
    /** Cantidad de jugadores (≥ 2). */
    players: number;
    /** strategies[i] = número de estrategias puras del jugador i. */
    strategies: number[];
    /** payoffs[player][profileIndex] = utilidad del jugador en ese perfil. */
    payoffs: number[][];
}
export interface MixedStrategy {
    /** Índice del jugador (0-based). */
    player: number;
    /** Distribución sobre estrategias puras; debe sumar 1 y ser no-negativa. */
    distribution: number[];
}
export interface NashEquilibrium {
    /** Una distribución mixta por jugador (en orden de jugador). */
    strategies: MixedStrategy[];
    /** Pagos esperados por jugador en este equilibrio. */
    payoffs: number[];
    /** True si toda distribución pone masa 1 en alguna estrategia pura. */
    isPure: boolean;
    /** True si el equilibrio es estricto (best response única para cada jugador puro). */
    isStrict: boolean;
}
/**
 * Convierte un perfil `(s_0, ..., s_{n-1})` a su índice row-major
 * en `payoffs[player]`. Lanza si el perfil no encaja en `sizes`.
 */
export declare function profileToIndex(profile: number[], sizes: number[]): number;
/** Inversa de `profileToIndex`. */
export declare function indexToProfile(index: number, sizes: number[]): number[];
/** Producto cartesiano de tamaños — número total de perfiles. */
export declare function totalProfiles(sizes: number[]): number;
/**
 * Construye un juego en forma normal validando dimensiones.
 */
export declare function createGame(players: number, strategies: number[], payoffs: number[][]): NormalFormGame;
/**
 * Construye un juego 2-player a partir de dos matrices NxM.
 * `payoff1[i][j]` = utilidad del jugador 1 cuando juega i y el 2 juega j.
 * `payoff2[i][j]` = utilidad del jugador 2.
 */
export declare function createTwoPlayerGame(payoff1: number[][], payoff2: number[][]): NormalFormGame;
/** Lectura ergonómica del pago: u_player(profile). */
export declare function payoffOf(game: NormalFormGame, player: number, profile: number[]): number;
/** Suma de un vector — útil para chequeos de simplex. */
export declare function sumOf(xs: number[]): number;
/** Pago esperado del jugador en un perfil mixto. */
export declare function expectedPayoff(game: NormalFormGame, player: number, mixed: MixedStrategy[]): number;
export declare function expectedPayoffFromDistributions(game: NormalFormGame, player: number, dists: number[][]): number;
/** Distribución pura: masa 1 en `s`, 0 en el resto. */
export declare function pureDistribution(s: number, size: number): number[];
/** Dos números reales aproximadamente iguales. */
export declare function approxEqual(a: number, b: number, tol?: number): boolean;
/** Igualdad punto a punto bajo tolerancia. */
export declare function vectorsApproxEqual(a: number[], b: number[], tol?: number): boolean;
//# sourceMappingURL=types.d.ts.map