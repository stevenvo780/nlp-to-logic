/**
 * Fórmula proposicional clásica. Misma forma sintáctica que NJ;
 * la diferencia entre ambas lógicas vive en el sistema de reglas.
 */
export type NKFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'and';
    left: NKFormula;
    right: NKFormula;
} | {
    kind: 'or';
    left: NKFormula;
    right: NKFormula;
} | {
    kind: 'implies';
    left: NKFormula;
    right: NKFormula;
} | {
    kind: 'not';
    arg: NKFormula;
} | {
    kind: 'bottom';
};
/**
 * Reglas de prueba NK. Las primeras son las de NJ; las últimas
 * cuatro son los "extras" clásicos.
 */
export type NKRule = 'assumption' | 'andI' | 'andEL' | 'andER' | 'orIL' | 'orIR' | 'orE' | 'impI' | 'impE' | 'notI' | 'notE' | 'bottomE' | 'doubleNegE' | 'LEM' | 'pierce' | 'rAA';
/**
 * Árbol de prueba NK. Las hipótesis abiertas viven implícitamente
 * en el contexto del subárbol; `discharged` lista las hipótesis
 * cerradas por la regla aplicada en este nodo (relevante para →I,
 * ¬I, ∨E y rAA).
 */
export interface NKProof {
    conclusion: NKFormula;
    rule: NKRule;
    premises: NKProof[];
    discharged?: NKFormula[];
}
/**
 * Conjunto de reglas que sólo existen en NK (no en NJ).
 * Útil para detectar si una prueba NK es trasladable a NJ.
 */
export declare const CLASSICAL_ONLY_RULES: ReadonlyArray<NKRule>;
//# sourceMappingURL=types.d.ts.map