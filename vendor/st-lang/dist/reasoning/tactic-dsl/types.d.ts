export type Formula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'true';
} | {
    kind: 'false';
} | {
    kind: 'not';
    body: Formula;
} | {
    kind: 'and';
    left: Formula;
    right: Formula;
} | {
    kind: 'or';
    left: Formula;
    right: Formula;
} | {
    kind: 'imp';
    left: Formula;
    right: Formula;
} | {
    kind: 'eq';
    left: Formula;
    right: Formula;
};
export interface Goal {
    id: string;
    hyps: Record<string, string>;
    concl: string;
}
export interface ProofState {
    goals: Goal[];
    history: TacticInvocation[];
    done: boolean;
}
export interface TacticInvocation {
    tactic: string;
    args: unknown[];
    before: ProofState;
    after: ProofState;
}
export type Tactic = (state: ProofState) => ProofState;
export declare class TacticError extends Error {
    tactic: string;
    constructor(tactic: string, message: string);
}
export declare function parseFormula(src: string): Formula;
export declare function formulaToString(f: Formula): string;
export declare function normalizeFormula(src: string): string;
export declare function formulaEq(a: string, b: string): boolean;
export declare function substitute(target: string, lhs: string, rhs: string): string;
//# sourceMappingURL=types.d.ts.map