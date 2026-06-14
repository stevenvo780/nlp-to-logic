import { GameState, IPCFormula, Move, Player } from './types';
export interface WinningStrategyResult {
    exists: boolean;
    /** Función estrategia: dado un estado, devuelve la próxima movida del jugador en turno. */
    strategy?: (state: GameState) => Move;
}
/**
 * Decide si el Proponente tiene estrategia ganadora sobre `phi`
 * (equivalente a validez en IPC). Si la tiene, retorna además
 * una estrategia computable.
 */
export declare function winningStrategy(phi: IPCFormula): WinningStrategyResult;
export interface PlayResult {
    winner: Player;
    trace: GameState[];
}
/**
 * Simula una partida con `phi` como tesis del Proponente y una
 * secuencia fija de movidas del Oponente. El Proponente juega
 * según la estrategia (si existe); si no, el Proponente pierde
 * apenas la fórmula falla a ser válida.
 *
 * Diseño:
 *   - El juego avanza por *rounds*: O ataca/elige, luego P
 *     defiende/elige.
 *   - El estado evoluciona reescribiendo `current` (la fórmula
 *     bajo defensa actual) y `context` (las concesiones O).
 *   - La partida termina cuando se llega a un átomo en `current`
 *     o a `⊥`: P gana si el átomo está en `context` (regla
 *     atómica); P pierde si llega a `⊥` sin contexto contradictorio.
 */
export declare function play(phi: IPCFormula, opponentMoves: Move[]): PlayResult;
export declare function traceToString(trace: GameState[]): string;
//# sourceMappingURL=strategy.d.ts.map