export type BDDNode = {
    kind: 'terminal';
    value: boolean;
} | {
    kind: 'internal';
    variable: number;
    low: BDDNode;
    high: BDDNode;
    id: number;
};
export interface BDDStats {
    nodes: number;
    reductions: number;
}
export declare function isTerminal(b: BDDNode): b is {
    kind: 'terminal';
    value: boolean;
};
export declare function nodeId(b: BDDNode): string;
//# sourceMappingURL=types.d.ts.map