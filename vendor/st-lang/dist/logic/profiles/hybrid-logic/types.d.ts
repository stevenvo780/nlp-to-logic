/** Constructores sintácticos del fragmento. */
export type HybridFormulaKind = 'atom' | 'nominal' | 'not' | 'and' | 'or' | 'implies' | 'box' | 'diamond' | 'at' | 'down' | 'exists-world';
/**
 * AST de fórmulas híbridas.
 *
 * Las "variables de mundo" producidas por ↓ y ∃ comparten espacio de
 * nombres con los nominales libres; ambas se resuelven al mismo
 * mundo del frame en tiempo de evaluación (vía `env`).
 */
export type HybridFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'nominal';
    name: string;
} | {
    kind: 'not';
    arg: HybridFormula;
} | {
    kind: 'and';
    args: HybridFormula[];
} | {
    kind: 'or';
    args: HybridFormula[];
} | {
    kind: 'implies';
    left: HybridFormula;
    right: HybridFormula;
} | {
    kind: 'box';
    arg: HybridFormula;
} | {
    kind: 'diamond';
    arg: HybridFormula;
} | {
    kind: 'at';
    nominal: string;
    arg: HybridFormula;
} | {
    kind: 'down';
    bind: string;
    arg: HybridFormula;
} | {
    kind: 'exists-world';
    bind: string;
    arg: HybridFormula;
};
/**
 * Modelo de Kripke enriquecido con asignación de nominales.
 *
 * - `worlds`        : identificadores de los mundos.
 * - `accessibility` : relación R ⊆ W × W (pares ordenados).
 * - `nominals`      : nominal-name → world-id (función parcial total
 *                     sobre los nominales libres usados por la
 *                     fórmula que se evalúa).
 * - `valuation`     : atom-name → set de mundos donde el átomo es
 *                     verdadero.
 */
export interface HybridFrame {
    worlds: string[];
    accessibility: Array<[string, string]>;
    nominals: Record<string, string>;
    valuation: Record<string, Set<string>>;
}
/** Crea un átomo proposicional híbrido. */
export declare function atom(name: string): HybridFormula;
/** Crea un nominal (proposición que denota un único mundo). */
export declare function nominal(name: string): HybridFormula;
/** Negación: ¬φ. */
export declare function not(arg: HybridFormula): HybridFormula;
/**
 * Conjunción n-aria: φ₁ ∧ … ∧ φₙ.
 * @throws si se llama sin argumentos.
 */
export declare function and(...args: HybridFormula[]): HybridFormula;
/**
 * Disyunción n-aria: φ₁ ∨ … ∨ φₙ.
 * @throws si se llama sin argumentos.
 */
export declare function or(...args: HybridFormula[]): HybridFormula;
/** Implicación: left → right. */
export declare function implies(left: HybridFormula, right: HybridFormula): HybridFormula;
/** Operador □ (necesidad modal). */
export declare function box(arg: HybridFormula): HybridFormula;
/** Operador ◇ (posibilidad modal). */
export declare function diamond(arg: HybridFormula): HybridFormula;
/** Operador de satisfacción: @i φ ("φ en el mundo i"). */
export declare function at(nominalName: string, arg: HybridFormula): HybridFormula;
/** Operador de ligadura: ↓bind. φ (bind el mundo actual). */
export declare function down(bind: string, arg: HybridFormula): HybridFormula;
/** Cuantificador de mundo: ∃bind. φ (existe un mundo bind donde φ). */
export declare function existsWorld(bind: string, arg: HybridFormula): HybridFormula;
/** Renderiza una fórmula híbrida en notación textual estándar. */
export declare function formulaToString(phi: HybridFormula): string;
//# sourceMappingURL=types.d.ts.map