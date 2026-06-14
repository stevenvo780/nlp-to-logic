import type { MixedStrategy, NormalFormGame } from './types';
/**
 * Devuelve true si la estrategia pura `strategy` del jugador
 * `player` está dominada por otra pura. Si `strict` es true exige
 * dominancia estricta, si no permite weak.
 */
export declare function isDominated(game: NormalFormGame, player: number, strategy: number, strict?: boolean): boolean;
/**
 * Aplica eliminación iterada hasta punto fijo. Devuelve un juego
 * cuyas estrategias son un subconjunto de las originales.
 *
 * Importante: el resultado siempre tiene al menos 1 estrategia por
 * jugador (la última no se elimina aunque "técnicamente" lo esté,
 * porque eliminarla deja el juego vacío y sin sentido).
 */
export declare function eliminateDominated(game: NormalFormGame, strict?: boolean): NormalFormGame;
/**
 * Mejores respuestas puras del jugador `player` dado que los demás
 * juegan según `opponentStrategies` (debe incluir TODOS los jugadores,
 * incluyendo el propio — la entrada de `player` se ignora).
 *
 * Retorna lista de índices de estrategias puras con utilidad máxima
 * (puede haber empates).
 */
export declare function bestResponse(game: NormalFormGame, player: number, opponentStrategies: MixedStrategy[]): number[];
//# sourceMappingURL=dominance.d.ts.map