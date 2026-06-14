export type CTerm = {
    kind: 'S';
} | {
    kind: 'K';
} | {
    kind: 'I';
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'app';
    fn: CTerm;
    arg: CTerm;
};
export declare const S: () => CTerm;
export declare const K: () => CTerm;
export declare const I: () => CTerm;
export declare const cvar: (name: string) => CTerm;
export declare function app(...ts: CTerm[]): CTerm;
export declare function ctermEq(a: CTerm, b: CTerm): boolean;
export declare function termToString(t: CTerm): string;
export declare function freeVars(t: CTerm): Set<string>;
//# sourceMappingURL=types.d.ts.map