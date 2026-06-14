import type { NormalFormGame } from './types';
/**
 * Prisoner's dilemma. Estrategias: 0=cooperate, 1=defect.
 * Pagos típicos (T > R > P > S):
 *   T=5, R=3, P=1, S=0
 *
 *           C       D
 *      C  (3,3)  (0,5)
 *      D  (5,0)  (1,1)
 *
 * Único Nash: (D, D) con payoff (1, 1).
 */
export declare function prisonersDilemma(): NormalFormGame;
/**
 * Rock-Paper-Scissors (zero-sum). Estrategias: 0=R, 1=P, 2=S.
 * Único Nash: (1/3, 1/3, 1/3) por jugador, payoff (0, 0).
 */
export declare function rockPaperScissors(): NormalFormGame;
/**
 * Battle of the sexes. Dos jugadores prefieren coordinar pero
 * en cosas distintas. Estrategias: 0=Opera, 1=Football.
 *
 *           O       F
 *      O  (2,1)  (0,0)
 *      F  (0,0)  (1,2)
 *
 * Tres Nash: (O,O), (F,F), mixto.
 */
export declare function battleOfSexes(): NormalFormGame;
/**
 * Matching pennies (zero-sum). Estrategias: 0=H, 1=T.
 *
 *           H        T
 *      H  ( 1,-1) (-1, 1)
 *      T  (-1, 1) ( 1,-1)
 *
 * Único Nash: (1/2, 1/2).
 */
export declare function matchingPennies(): NormalFormGame;
/**
 * Coordination "stag hunt". Estrategias: 0=Stag, 1=Hare.
 *
 *           S       H
 *      S  (4,4)  (0,3)
 *      H  (3,0)  (2,2)
 *
 * Nash puros: (S,S) y (H,H); además uno mixto.
 */
export declare function stagHunt(): NormalFormGame;
//# sourceMappingURL=common-games.d.ts.map