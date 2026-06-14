export type UnaryFn = 'sin' | 'cos' | 'tan' | 'log' | 'exp';
export type Expr = {
    kind: 'const';
    value: number;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'add';
    args: Expr[];
} | {
    kind: 'mul';
    args: Expr[];
} | {
    kind: 'sub';
    left: Expr;
    right: Expr;
} | {
    kind: 'div';
    left: Expr;
    right: Expr;
} | {
    kind: 'pow';
    base: Expr;
    exp: Expr;
} | {
    kind: 'neg';
    arg: Expr;
} | {
    kind: UnaryFn;
    arg: Expr;
};
export declare const UNARY_FUNCTIONS: readonly UnaryFn[];
export declare function isUnaryFn(kind: string): kind is UnaryFn;
//# sourceMappingURL=types.d.ts.map