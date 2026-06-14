export type TptpRole = 'axiom' | 'hypothesis' | 'conjecture' | 'negated_conjecture' | 'lemma' | 'theorem' | 'definition' | 'plain';
export type TptpLanguage = 'fof' | 'cnf' | 'tff' | 'thf';
export type TptpTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'const';
    name: string;
} | {
    kind: 'func';
    name: string;
    args: TptpTerm[];
};
export type TptpFormula = {
    kind: 'atom';
    predicate: string;
    args: TptpTerm[];
} | {
    kind: 'eq';
    left: TptpTerm;
    right: TptpTerm;
} | {
    kind: 'neq';
    left: TptpTerm;
    right: TptpTerm;
} | {
    kind: 'not';
    arg: TptpFormula;
} | {
    kind: 'and';
    args: TptpFormula[];
} | {
    kind: 'or';
    args: TptpFormula[];
} | {
    kind: 'implies';
    left: TptpFormula;
    right: TptpFormula;
} | {
    kind: 'iff';
    left: TptpFormula;
    right: TptpFormula;
} | {
    kind: 'xor';
    left: TptpFormula;
    right: TptpFormula;
} | {
    kind: 'forall';
    vars: string[];
    body: TptpFormula;
} | {
    kind: 'exists';
    vars: string[];
    body: TptpFormula;
} | {
    kind: 'true';
} | {
    kind: 'false';
};
export interface TptpAnnotated {
    language: TptpLanguage;
    name: string;
    role: TptpRole;
    formula: TptpFormula;
    comment?: string;
}
export interface TptpProblem {
    annotated: TptpAnnotated[];
    includes: string[];
}
export declare const TPTP_ROLES: ReadonlySet<TptpRole>;
export declare const TPTP_LANGUAGES: ReadonlySet<TptpLanguage>;
//# sourceMappingURL=ast.d.ts.map