export type HOTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'meta';
    name: string;
} | {
    kind: 'abs';
    param: string;
    body: HOTerm;
} | {
    kind: 'app';
    fn: HOTerm;
    args: HOTerm[];
};
export interface HOSubst {
    [meta: string]: HOTerm;
}
//# sourceMappingURL=types.d.ts.map