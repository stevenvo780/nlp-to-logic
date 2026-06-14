/**
 * Estado de una estructura de Kripke.
 *  - `id`     identificador único del estado.
 *  - `labels` proposiciones atómicas que se cumplen en el estado.
 */
export interface KripkeState {
    id: string;
    labels: Set<string>;
}
/**
 * Estructura de Kripke: M = (S, R, L, S0).
 *  - `states`      conjunto de estados con sus etiquetas.
 *  - `transitions` relación R ⊆ S × S codificada como pares [from, to].
 *  - `initial`     subconjunto de estados iniciales (S0).
 */
export interface KripkeStructure {
    states: KripkeState[];
    transitions: Array<[string, string]>;
    initial: string[];
}
/**
 * AST de Computation Tree Logic. Cubre los 8 operadores temporales
 * estándar: EX/AX, EF/AF, EG/AG, EU/AU.
 */
export type CTLFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'true';
} | {
    kind: 'false';
} | {
    kind: 'not';
    arg: CTLFormula;
} | {
    kind: 'and';
    args: CTLFormula[];
} | {
    kind: 'or';
    args: CTLFormula[];
} | {
    kind: 'implies';
    left: CTLFormula;
    right: CTLFormula;
} | {
    kind: 'EX';
    arg: CTLFormula;
} | {
    kind: 'AX';
    arg: CTLFormula;
} | {
    kind: 'EF';
    arg: CTLFormula;
} | {
    kind: 'AF';
    arg: CTLFormula;
} | {
    kind: 'EG';
    arg: CTLFormula;
} | {
    kind: 'AG';
    arg: CTLFormula;
} | {
    kind: 'EU';
    left: CTLFormula;
    right: CTLFormula;
} | {
    kind: 'AU';
    left: CTLFormula;
    right: CTLFormula;
};
/** Renderiza una fórmula CTL a notación textual estándar. */
export declare function ctlToString(f: CTLFormula): string;
//# sourceMappingURL=types.d.ts.map