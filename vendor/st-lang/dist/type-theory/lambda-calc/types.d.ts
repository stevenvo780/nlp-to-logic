export type Term = {
    kind: 'var';
    name: string;
} | {
    kind: 'abs';
    param: string;
    body: Term;
} | {
    kind: 'app';
    fn: Term;
    arg: Term;
};
export declare const v: (name: string) => Term;
export declare const lam: (param: string, body: Term) => Term;
export declare const ap: (fn: Term, arg: Term) => Term;
export declare const apN: (head: Term, ...args: Term[]) => Term;
export declare function alphaEq(a: Term, b: Term): boolean;
export declare function termToString(t: Term): string;
//# sourceMappingURL=types.d.ts.map