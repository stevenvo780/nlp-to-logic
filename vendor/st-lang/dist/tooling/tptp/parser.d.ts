import { TptpFormula, TptpLanguage, TptpProblem, TptpTerm } from './ast';
import { TptpToken, TptpTokenKind } from './tokenizer';
export declare class TptpParserError extends Error {
    readonly line: number;
    readonly col: number;
    constructor(message: string, line: number, col: number);
}
declare class Cursor {
    private readonly tokens;
    private idx;
    constructor(tokens: TptpToken[]);
    peek(offset?: number): TptpToken | undefined;
    next(): TptpToken;
    done(): boolean;
    expect(kind: TptpTokenKind): TptpToken;
    matchKind(kind: TptpTokenKind): boolean;
    consumeKind(kind: TptpTokenKind): TptpToken | undefined;
}
export declare function parseTptp(input: string): TptpProblem;
export declare function parseFormula(input: string, lang: TptpLanguage): TptpFormula;
export declare function parseTerm(cur: Cursor | string): TptpTerm;
export {};
//# sourceMappingURL=parser.d.ts.map