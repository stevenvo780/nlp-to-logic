/** Variable proposicional ligada por μ/ν. */
export type MuVarName = string;
/** AST del modal μ-calculus. */
export type MuFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'var';
    name: MuVarName;
} | {
    kind: 'not';
    arg: MuFormula;
} | {
    kind: 'and';
    left: MuFormula;
    right: MuFormula;
} | {
    kind: 'or';
    left: MuFormula;
    right: MuFormula;
} | {
    kind: 'box';
    arg: MuFormula;
} | {
    kind: 'diamond';
    arg: MuFormula;
} | {
    kind: 'mu';
    bind: MuVarName;
    body: MuFormula;
} | {
    kind: 'nu';
    bind: MuVarName;
    body: MuFormula;
};
/**
 * Estructura de Kripke en el formato pedido por la API pública del
 * perfil. `labelling[stateId]` es el conjunto de proposiciones que
 * se cumplen en ese estado.
 *
 * El algoritmo asume estructuras finitas. Estados sin sucesores son
 * "deadlocks": `□φ` se cumple trivialmente, `◇φ` es falso.
 */
export interface KripkeStructure {
    states: string[];
    transitions: Array<[string, string]>;
    labelling: Record<string, Set<string>>;
}
/** Renderiza una fórmula μ-cálculo a notación textual estándar. */
export declare function muToString(phi: MuFormula): string;
//# sourceMappingURL=types.d.ts.map