export type TptpTokenKind = 'lparen' | 'rparen' | 'lbracket' | 'rbracket' | 'comma' | 'dot' | 'colon' | 'lower_word' | 'upper_word' | 'single_quoted' | 'distinct_object' | 'integer' | 'op_not' | 'op_and' | 'op_or' | 'op_implies' | 'op_iff' | 'op_xor' | 'op_nimplies' | 'op_forall' | 'op_exists' | 'op_eq' | 'op_neq';
export interface TptpToken {
    kind: TptpTokenKind;
    value: string;
    line: number;
    col: number;
}
export declare class TptpTokenizerError extends Error {
    readonly line: number;
    readonly col: number;
    constructor(message: string, line: number, col: number);
}
export declare function tokenize(input: string): TptpToken[];
//# sourceMappingURL=tokenizer.d.ts.map