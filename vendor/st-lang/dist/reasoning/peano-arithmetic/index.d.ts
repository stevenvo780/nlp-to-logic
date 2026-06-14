/** Término de la aritmética de Peano: cero, sucesor, variables, suma y multiplicación. */
export type PeanoTerm = {
    kind: 'zero';
} | {
    kind: 'succ';
    arg: PeanoTerm;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'add';
    left: PeanoTerm;
    right: PeanoTerm;
} | {
    kind: 'mul';
    left: PeanoTerm;
    right: PeanoTerm;
};
/** Fórmula de primer orden sobre términos de Peano: ecuaciones, desigualdades y conectivas lógicas. */
export type PeanoFormula = {
    kind: 'eq';
    left: PeanoTerm;
    right: PeanoTerm;
} | {
    kind: 'lt';
    left: PeanoTerm;
    right: PeanoTerm;
} | {
    kind: 'le';
    left: PeanoTerm;
    right: PeanoTerm;
} | {
    kind: 'not';
    arg: PeanoFormula;
} | {
    kind: 'and';
    args: PeanoFormula[];
} | {
    kind: 'or';
    args: PeanoFormula[];
} | {
    kind: 'implies';
    left: PeanoFormula;
    right: PeanoFormula;
} | {
    kind: 'forall';
    bind: string;
    body: PeanoFormula;
} | {
    kind: 'exists';
    bind: string;
    body: PeanoFormula;
};
/** Constante 0 de la aritmética de Peano. */
export declare const zero: PeanoTerm;
/** Constructor sucesor: `succ(t)` representa t+1. */
export declare const succ: (arg: PeanoTerm) => PeanoTerm;
/** Variable de término de Peano referenciada por nombre. */
export declare const vt: (name: string) => PeanoTerm;
/** Constructor de suma de términos de Peano. */
export declare const add: (left: PeanoTerm, right: PeanoTerm) => PeanoTerm;
/** Constructor de multiplicación de términos de Peano. */
export declare const mul: (left: PeanoTerm, right: PeanoTerm) => PeanoTerm;
/** Constructor de la fórmula de igualdad: `left = right`. */
export declare const eq: (left: PeanoTerm, right: PeanoTerm) => PeanoFormula;
/** Constructor de la fórmula de orden estricto: `left < right`. */
export declare const lt: (left: PeanoTerm, right: PeanoTerm) => PeanoFormula;
/** Constructor de la fórmula de orden no estricto: `left ≤ right`. */
export declare const le: (left: PeanoTerm, right: PeanoTerm) => PeanoFormula;
/** Constructor de la negación de una fórmula de Peano. */
export declare const notF: (arg: PeanoFormula) => PeanoFormula;
/** Constructor de conjunción (n-aria) de fórmulas de Peano. */
export declare const andF: (...args: PeanoFormula[]) => PeanoFormula;
/** Constructor de disyunción (n-aria) de fórmulas de Peano. */
export declare const orF: (...args: PeanoFormula[]) => PeanoFormula;
/** Constructor de implicación: `left → right`. */
export declare const implies: (left: PeanoFormula, right: PeanoFormula) => PeanoFormula;
/** Constructor del cuantificador universal: `∀bind. body`. */
export declare const forall: (bind: string, body: PeanoFormula) => PeanoFormula;
/** Constructor del cuantificador existencial: `∃bind. body`. */
export declare const exists: (bind: string, body: PeanoFormula) => PeanoFormula;
export declare function numeral(n: number): PeanoTerm;
/** P1: ∀x. ¬(succ(x) = 0) — el cero no es sucesor de ningún número. */
export declare const AXIOM_P1: PeanoFormula;
/** P2: ∀x,y. succ(x) = succ(y) → x = y — inyectividad del sucesor. */
export declare const AXIOM_P2: PeanoFormula;
/** P3: ∀x. x + 0 = x — neutro derecho de la suma. */
export declare const AXIOM_P3: PeanoFormula;
/** P4: ∀x,y. x + succ(y) = succ(x + y) — recursión de la suma. */
export declare const AXIOM_P4: PeanoFormula;
/** P5: ∀x. x · 0 = 0 — absorción del cero en la multiplicación. */
export declare const AXIOM_P5: PeanoFormula;
/** P6: ∀x,y. x · succ(y) = (x · y) + x — recursión de la multiplicación. */
export declare const AXIOM_P6: PeanoFormula;
/** Los seis axiomas no-inductivos de la aritmética de Peano (P1–P6). */
export declare const PEANO_AXIOMS: readonly PeanoFormula[];
/** Genera el esquema de inducción para un predicado P: (P(0) ∧ ∀x.(P(x) → P(succ(x)))) → ∀x.P(x). */
export declare function inductionSchema(P: (n: PeanoTerm) => PeanoFormula): PeanoFormula;
/** Evalúa un término de Peano en el modelo estándar ℕ con el entorno dado. Devuelve `null` si hay variables libres sin valor. */
export declare function evalNat(term: PeanoTerm, env?: Record<string, number>): number | null;
export declare function freeVars(formula: PeanoFormula): Set<string>;
export declare function evalFormula(formula: PeanoFormula, env?: Record<string, number>, maxN?: number): boolean | null;
export declare function theoremAddCommutative(): PeanoFormula;
export declare function theoremAddAssociative(): PeanoFormula;
export declare function theoremMulCommutative(): PeanoFormula;
export declare function theoremMulDistOverAdd(): PeanoFormula;
export interface VerifyResult {
    valid: boolean;
    counterexample?: Record<string, number>;
}
export declare function verifyTheoremBySampling(thm: PeanoFormula, maxN?: number): VerifyResult;
export declare function godelNumber(formula: PeanoFormula): bigint;
export declare function fromGodel(n: bigint): PeanoFormula | null;
//# sourceMappingURL=index.d.ts.map