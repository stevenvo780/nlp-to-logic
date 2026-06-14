/** Término aritmético real. Subset de R[x₁,…,xₙ]. */
export type DLTerm = {
    kind: 'num';
    value: number;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'plus';
    left: DLTerm;
    right: DLTerm;
} | {
    kind: 'minus';
    left: DLTerm;
    right: DLTerm;
} | {
    kind: 'times';
    left: DLTerm;
    right: DLTerm;
} | {
    kind: 'div';
    left: DLTerm;
    right: DLTerm;
} | {
    kind: 'neg';
    arg: DLTerm;
} | {
    kind: 'pow';
    base: DLTerm;
    exp: number;
};
/** Operador de comparación sobre términos. */
export type CompOp = '=' | '!=' | '<' | '<=' | '>' | '>=';
/** Sistema de ODEs: lista de (variable, ladoDerecho) + dominio opcional. */
export interface OdeSystem {
    /** Cada par representa la ecuación var' = rhs. */
    equations: Array<{
        varName: string;
        rhs: DLTerm;
    }>;
    /** Dominio Q: la evolución continúa mientras Q se mantiene. */
    domain?: DLFormula;
}
/**
 * Programa híbrido del cálculo dL.
 *
 * Operadores:
 *   x := e          asignación discreta
 *   x := *          asignación no determinista (any-real)
 *   ?φ              test (bloquea si φ no se cumple)
 *   α ; β           secuencia
 *   α ∪ β           choice no determinista
 *   α*              loop (bounded en la implementación)
 *   x' = f(x) & Q   evolución continua según ODE bajo dominio Q
 */
export type HybridProgram = {
    kind: 'assign';
    varName: string;
    rhs: DLTerm;
} | {
    kind: 'nondet';
    varName: string;
} | {
    kind: 'test';
    cond: DLFormula;
} | {
    kind: 'seq';
    left: HybridProgram;
    right: HybridProgram;
} | {
    kind: 'choice';
    left: HybridProgram;
    right: HybridProgram;
} | {
    kind: 'loop';
    body: HybridProgram;
} | {
    kind: 'ode';
    system: OdeSystem;
};
/** Fórmula del cálculo dL. */
export type DLFormula = {
    kind: 'true';
} | {
    kind: 'false';
} | {
    kind: 'comp';
    op: CompOp;
    left: DLTerm;
    right: DLTerm;
} | {
    kind: 'not';
    arg: DLFormula;
} | {
    kind: 'and';
    left: DLFormula;
    right: DLFormula;
} | {
    kind: 'or';
    left: DLFormula;
    right: DLFormula;
} | {
    kind: 'implies';
    left: DLFormula;
    right: DLFormula;
} | {
    kind: 'iff';
    left: DLFormula;
    right: DLFormula;
} | {
    kind: 'box';
    program: HybridProgram;
    post: DLFormula;
} | {
    kind: 'diamond';
    program: HybridProgram;
    post: DLFormula;
};
export declare const num: (value: number) => DLTerm;
export declare const variable: (name: string) => DLTerm;
export declare const plus: (left: DLTerm, right: DLTerm) => DLTerm;
export declare const minus: (left: DLTerm, right: DLTerm) => DLTerm;
export declare const times: (left: DLTerm, right: DLTerm) => DLTerm;
export declare const divide: (left: DLTerm, right: DLTerm) => DLTerm;
export declare const negTerm: (arg: DLTerm) => DLTerm;
export declare const power: (base: DLTerm, exp: number) => DLTerm;
export declare const comp: (op: CompOp, left: DLTerm, right: DLTerm) => DLFormula;
export declare const trueF: DLFormula;
export declare const falseF: DLFormula;
export declare const notF: (arg: DLFormula) => DLFormula;
export declare const andF: (left: DLFormula, right: DLFormula) => DLFormula;
export declare const orF: (left: DLFormula, right: DLFormula) => DLFormula;
export declare const implies: (left: DLFormula, right: DLFormula) => DLFormula;
export declare const iff: (left: DLFormula, right: DLFormula) => DLFormula;
export declare const box: (program: HybridProgram, post: DLFormula) => DLFormula;
export declare const diamond: (program: HybridProgram, post: DLFormula) => DLFormula;
export declare const assign: (varName: string, rhs: DLTerm) => HybridProgram;
export declare const nondet: (varName: string) => HybridProgram;
export declare const test: (cond: DLFormula) => HybridProgram;
export declare const seq: (left: HybridProgram, right: HybridProgram) => HybridProgram;
export declare const choice: (left: HybridProgram, right: HybridProgram) => HybridProgram;
export declare const loop: (body: HybridProgram) => HybridProgram;
export declare const ode: (system: OdeSystem) => HybridProgram;
/** Estado en R^n: asignación variable → número. */
export type State = Map<string, number>;
/** Clona un estado para uso inmutable durante traversal. */
export declare function cloneState(s: State): State;
/** Recoge las variables libres en un término. */
export declare function termVars(t: DLTerm, acc?: Set<string>): Set<string>;
/** Recoge las variables que aparecen en una fórmula. */
export declare function formulaVars(f: DLFormula, acc?: Set<string>): Set<string>;
/** Recoge variables modificadas/leídas por un programa. */
export declare function programVars(p: HybridProgram, acc?: Set<string>): Set<string>;
/** Render legible de un término dL. */
export declare function termToString(t: DLTerm): string;
/** Render legible de un programa híbrido. */
export declare function programToString(p: HybridProgram): string;
/** Render legible de una fórmula dL. */
export declare function formulaToString(f: DLFormula): string;
//# sourceMappingURL=ast.d.ts.map