/** Sort SMT-LIB v2: o bien un símbolo (Int, Real, Bool) o una aplicación. */
export type SmtSort = {
    kind: 'symbol';
    name: string;
} | {
    kind: 'app';
    name: string;
    args: SmtSort[];
};
/** Tipos de constantes especiales del estándar (spec_constant). */
export type SmtSpecConstantType = 'numeral' | 'decimal' | 'string' | 'hex' | 'binary';
/** Término SMT-LIB v2. */
export type SmtTerm = {
    kind: 'spec-constant';
    type: SmtSpecConstantType;
    value: string;
} | {
    kind: 'symbol';
    name: string;
} | {
    kind: 'app';
    fn: string;
    args: SmtTerm[];
} | {
    kind: 'let';
    bindings: Array<{
        name: string;
        value: SmtTerm;
    }>;
    body: SmtTerm;
} | {
    kind: 'forall';
    vars: Array<{
        name: string;
        sort: SmtSort;
    }>;
    body: SmtTerm;
} | {
    kind: 'exists';
    vars: Array<{
        name: string;
        sort: SmtSort;
    }>;
    body: SmtTerm;
} | {
    kind: 'match';
    scrutinee: SmtTerm;
    cases: Array<{
        pattern: SmtTerm;
        body: SmtTerm;
    }>;
} | {
    kind: 'annotated';
    term: SmtTerm;
    attrs: Array<{
        key: string;
        value?: string;
    }>;
};
/** Comando SMT-LIB v2 (subset operativo del estándar). */
export type SmtCommand = {
    kind: 'set-logic';
    logic: string;
} | {
    kind: 'set-option';
    key: string;
    value: string;
} | {
    kind: 'set-info';
    key: string;
    value: string;
} | {
    kind: 'declare-sort';
    name: string;
    arity: number;
} | {
    kind: 'define-sort';
    name: string;
    params: string[];
    body: SmtSort;
} | {
    kind: 'declare-fun';
    name: string;
    paramSorts: SmtSort[];
    resultSort: SmtSort;
} | {
    kind: 'define-fun';
    name: string;
    params: Array<{
        name: string;
        sort: SmtSort;
    }>;
    resultSort: SmtSort;
    body: SmtTerm;
} | {
    kind: 'declare-const';
    name: string;
    sort: SmtSort;
} | {
    kind: 'assert';
    formula: SmtTerm;
} | {
    kind: 'check-sat';
} | {
    kind: 'check-sat-assuming';
    assumptions: SmtTerm[];
} | {
    kind: 'get-assertions';
} | {
    kind: 'get-model';
} | {
    kind: 'get-proof';
} | {
    kind: 'get-unsat-core';
} | {
    kind: 'get-value';
    terms: SmtTerm[];
} | {
    kind: 'push';
    levels: number;
} | {
    kind: 'pop';
    levels: number;
} | {
    kind: 'reset';
} | {
    kind: 'reset-assertions';
} | {
    kind: 'exit';
} | {
    kind: 'echo';
    message: string;
};
/** Lógicas estándar reconocidas (no exhaustivo). */
export declare const KNOWN_LOGICS: ReadonlySet<string>;
/** Identifica si una cabeza de comando es nombre estándar del estándar. */
export declare const COMMAND_NAMES: ReadonlySet<string>;
//# sourceMappingURL=ast.d.ts.map