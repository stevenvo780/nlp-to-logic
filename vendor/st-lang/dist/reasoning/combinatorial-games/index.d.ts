export interface ImpartialGame<S> {
    readonly initial: S;
    readonly moves: (state: S) => S[];
    readonly isTerminal: (state: S) => boolean;
    readonly key?: (state: S) => string;
}
/**
 * Minimum Excludant: menor entero ≥ 0 que no está en el conjunto.
 * mex(∅) = 0, mex({0,1,3}) = 2, mex({1,2}) = 0.
 */
export declare function mex(set: Set<number>): number;
/**
 * Valor de Grundy del estado dado bajo el juego imparcial.
 * Define: G(terminal) = 0; G(s) = mex { G(s') : s' ∈ moves(s) }.
 * Usa caché (compartido entre llamadas) keyed por la clave canónica del estado.
 */
export declare function grundyValue<S>(game: ImpartialGame<S>, state: S, cache?: Map<string, number>): number;
/**
 * El jugador a mover gana sii grundy ≠ 0 (juego imparcial con convención
 * normal: el que no puede mover, pierde).
 */
export declare function isWinning<S>(game: ImpartialGame<S>, state: S): boolean;
/**
 * Nim-sum: XOR bit a bit de los valores. Identidad del monoide de Grundy
 * bajo suma disjunta de juegos imparciales.
 */
export declare function nimSum(values: number[]): number;
/**
 * Grundy de la suma disjunta de juegos imparciales independientes:
 *   G(G1 + G2 + ... + Gn)(s1,...,sn) = G1(s1) ⊕ G2(s2) ⊕ ... ⊕ Gn(sn).
 * Requiere games.length === states.length.
 */
export declare function multiGameGrundy<S>(games: Array<ImpartialGame<S>>, states: S[]): number;
/**
 * Nim clásico: varios montones de piedras, un movimiento = sacar ≥1
 * piedras de un único montón. Pierde quien no puede mover (todos los
 * montones a 0). Estado: vector de tamaños (normalizado, sin ceros y
 * ordenado descendente para que el caché sea efectivo entre simetrías).
 */
export declare function nim(piles: number[]): ImpartialGame<number[]>;
/**
 * Nim 1D: una sola pila de `stones` piedras; sacar 1..stones. Equivale
 * a `nim([stones])` pero con estado más compacto (un número).
 */
export declare function nim1d(stones: number): ImpartialGame<number>;
/**
 * Chomp: tablero rows×cols de "chocolate". Cada movida elige una casilla
 * viva (true) y "muerde" todo el rectángulo abajo-derecha desde ella. La
 * casilla (0,0) es veneno: quien la come pierde (convención misère
 * implementada como: estado terminal cuando solo queda (0,0)).
 *
 * Estado: matriz booleana rows×cols con true = casilla viva.
 *
 * Nota: Chomp tiene posición ganadora conocida para el primer jugador
 * en todo tablero ≥ 2×2 (argumento de robo de estrategia), pero la
 * estrategia explícita es desconocida en general. Para 1×1 (sólo el
 * veneno) el jugador a mover pierde, así que grundy = 0.
 */
export declare function chompGame(rows: number, cols: number): ImpartialGame<boolean[][]>;
export interface SurrealNumber {
    readonly left: SurrealNumber[];
    readonly right: SurrealNumber[];
}
/** 0 = { | } — sin opciones para ninguno; "second player wins". */
export declare const ZERO: SurrealNumber;
/** 1 = { 0 | }. */
export declare const ONE: SurrealNumber;
/** -1 = { | 0 }. */
export declare const MINUS_ONE: SurrealNumber;
/** * (star) = { 0 | 0 } — primer jugador gana, no comparable a 0 (fuzzy). */
export declare const STAR: SurrealNumber;
/**
 * Construye el surreal correspondiente al entero `n`.
 *   0 = { | }
 *   n = { n-1 | }            (n > 0)
 *  -n = {     | -(n-1) }     (n < 0)
 */
export declare function fromInt(n: number): SurrealNumber;
/**
 * Negación: -G = { -GR | -GL }.
 */
export declare function negate(s: SurrealNumber): SurrealNumber;
/**
 * Suma de juegos: G + H = { GL+H, G+HL  |  GR+H, G+HR }.
 */
export declare function add(a: SurrealNumber, b: SurrealNumber): SurrealNumber;
export declare function compare(a: SurrealNumber, b: SurrealNumber): -1 | 0 | 1;
/**
 * G es fuzzy con 0 sii no satisface G ≤ 0 ni 0 ≤ G — es decir, el
 * primer jugador gana. * es el ejemplo canónico.
 */
export declare function isFuzzy(s: SurrealNumber): boolean;
/**
 * Simplificación parcial: elimina opciones dominadas en cada lado.
 *
 *   En la lista Left, una opción L1 domina a L2 si L1 ≥ L2 (entonces
 *   L2 puede borrarse: el jugador Left preferirá L1).
 *   En la lista Right, una opción R1 domina a R2 si R1 ≤ R2.
 *
 * No hace eliminación reversible ("bypass") — eso podría requerirse
 * para canonicalización completa Conway. Para nuestros tests es
 * suficiente.
 */
export declare function simplify(s: SurrealNumber): SurrealNumber;
//# sourceMappingURL=index.d.ts.map