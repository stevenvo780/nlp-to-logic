export interface ReplCompatState {
    nextId: number;
    pendingPremises: Array<{
        name: string;
        formula: string;
    }>;
    pendingBlockLines: string[];
    pendingBlockBraceDepth: number;
    pendingBlockProofDepth: number;
    pendingBlockProofAwaitingShow: boolean[];
}
export interface ReplCompatContext {
    knownPremises?: string[];
}
export type ReplTransformResult = {
    kind: 'buffered';
    source: string;
    message: string;
} | {
    kind: 'execute';
    source: string;
} | {
    kind: 'executeSingle';
    source: string;
};
export declare function normalizeSTSource(source: string): string;
export declare function createReplCompatState(): ReplCompatState;
export declare function transformReplInput(source: string, state: ReplCompatState, context?: ReplCompatContext): ReplTransformResult;
//# sourceMappingURL=compat.d.ts.map