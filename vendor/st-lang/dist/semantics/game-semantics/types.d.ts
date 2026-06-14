export type IPCFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'and';
    left: IPCFormula;
    right: IPCFormula;
} | {
    kind: 'or';
    left: IPCFormula;
    right: IPCFormula;
} | {
    kind: 'implies';
    left: IPCFormula;
    right: IPCFormula;
} | {
    kind: 'bottom';
};
export type Player = 'proponent' | 'opponent';
/**
 * Movida del juego dialógico:
 *   - `choose-and`  → ataque a `∧`: O elige qué conjunto pedir.
 *   - `choose-or`   → defensa de `∨`: P elige qué disyunto afirmar.
 *   - `attack-implies` → ataque a `→`: O asume el antecedente y
 *     pide el consecuente.
 *   - `defend-bottom`  → "no se puede defender ⊥"; usada
 *     simbólicamente cuando P queda obligado a defender `⊥`.
 */
export type Move = {
    kind: 'choose-and';
    side: 'left' | 'right';
} | {
    kind: 'choose-or';
    side: 'left' | 'right';
} | {
    kind: 'attack-implies';
} | {
    kind: 'defend-bottom';
};
/**
 * Estado del juego pedido por el spec. `current` es la fórmula
 * en juego ahora mismo; `context` son las aserciones del Oponente
 * disponibles para que P las use; `history` traza las movidas.
 */
export interface GameState {
    current: IPCFormula;
    context: IPCFormula[];
    history: Array<{
        player: Player;
        move: string;
        formula?: IPCFormula;
    }>;
}
export declare const ipcAtom: (name: string) => IPCFormula;
export declare const ipcBottom: () => IPCFormula;
export declare const ipcAnd: (left: IPCFormula, right: IPCFormula) => IPCFormula;
export declare const ipcOr: (left: IPCFormula, right: IPCFormula) => IPCFormula;
export declare const ipcImplies: (left: IPCFormula, right: IPCFormula) => IPCFormula;
/** Azúcar: `¬φ` = `φ → ⊥`. Útil para tests pedagógicos. */
export declare const ipcNot: (arg: IPCFormula) => IPCFormula;
export declare function ipcKey(f: IPCFormula): string;
export declare function ipcEquals(a: IPCFormula, b: IPCFormula): boolean;
export declare function ipcToString(f: IPCFormula): string;
//# sourceMappingURL=types.d.ts.map