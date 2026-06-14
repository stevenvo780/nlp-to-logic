export type SmtTokenKind = 'lparen' | 'rparen' | 'symbol' | 'keyword' | 'numeral' | 'decimal' | 'hex' | 'binary' | 'string';
export interface SmtToken {
    kind: SmtTokenKind;
    value: string;
    /** Línea 1-based donde inicia el token. */
    line: number;
    /** Columna 1-based donde inicia el token. */
    col: number;
}
export declare class SmtTokenizerError extends Error {
    readonly line: number;
    readonly col: number;
    constructor(message: string, line: number, col: number);
}
export declare function tokenize(input: string): SmtToken[];
//# sourceMappingURL=tokenizer.d.ts.map