export type PExpr = {
    kind: 'num';
    value: number;
} | {
    kind: 'bool';
    value: boolean;
} | {
    kind: 'str';
    value: string;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'unop';
    op: '!' | '-';
    arg: PExpr;
} | {
    kind: 'binop';
    op: '+' | '-' | '*' | '/' | '<' | '<=' | '>' | '>=' | '==' | '!=' | '&&' | '||';
    left: PExpr;
    right: PExpr;
};
export declare function parsePredicate(src: string): PExpr;
export declare function freeVars(e: PExpr, acc?: Set<string>): Set<string>;
export declare function substVar(e: PExpr, name: string, replacement: PExpr): PExpr;
export declare function renameVar(predicate: string, fromName: string, toName: string): string;
export declare function predicateToString(e: PExpr): string;
export type PValue = number | boolean | string;
export type PEnv = Record<string, PValue>;
export declare function evalPredicate(e: PExpr, env: PEnv): PValue;
//# sourceMappingURL=predicate.d.ts.map