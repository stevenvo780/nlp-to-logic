/**
 * AST de fórmulas LTL.
 *
 * Operadores temporales: X (next), F (eventually), G (globally),
 * U (until), R (release). W (weak-until) se codifica como `or(until, globally)`.
 */
export type LTLFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'not';
    arg: LTLFormula;
} | {
    kind: 'and';
    args: LTLFormula[];
} | {
    kind: 'or';
    args: LTLFormula[];
} | {
    kind: 'X';
    arg: LTLFormula;
} | {
    kind: 'F';
    arg: LTLFormula;
} | {
    kind: 'G';
    arg: LTLFormula;
} | {
    kind: 'U';
    left: LTLFormula;
    right: LTLFormula;
} | {
    kind: 'R';
    left: LTLFormula;
    right: LTLFormula;
};
export declare const atom: (name: string) => LTLFormula;
export declare const not: (arg: LTLFormula) => LTLFormula;
export declare const and: (...args: LTLFormula[]) => LTLFormula;
export declare const or: (...args: LTLFormula[]) => LTLFormula;
export declare const next: (arg: LTLFormula) => LTLFormula;
export declare const eventually: (arg: LTLFormula) => LTLFormula;
export declare const globally: (arg: LTLFormula) => LTLFormula;
export declare const until: (left: LTLFormula, right: LTLFormula) => LTLFormula;
export declare const release: (left: LTLFormula, right: LTLFormula) => LTLFormula;
export declare const weakUntil: (left: LTLFormula, right: LTLFormula) => LTLFormula;
export declare const implies: (left: LTLFormula, right: LTLFormula) => LTLFormula;
/** Modelo lasso que satisface una fórmula LTL: prefijo + lazo infinito. */
export interface Witness {
    /** Segmento inicial (finito) antes del lazo. Cada elemento es la etiqueta del estado. */
    prefix: string[];
    /** Segmento cíclico que se repite infinitamente. */
    loop: string[];
}
/**
 * Resultado de la decisión de satisfacibilidad LTL.
 * Si `sat` es verdadero, `witness` contiene un modelo lasso.
 */
export interface SatResult {
    sat: boolean;
    witness?: Witness;
}
/** Renderiza una fórmula LTL en notación textual estándar. */
export declare function formulaToString(f: LTLFormula): string;
/** Clave canónica determinista de una fórmula LTL, usada para hashing en sets/maps. */
export declare function formulaKey(f: LTLFormula): string;
//# sourceMappingURL=types.d.ts.map