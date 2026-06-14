import type { SmtCommand, SmtSort, SmtTerm } from './ast';
export declare class SmtParserError extends Error {
    readonly line: number;
    readonly col: number;
    constructor(message: string, line: number, col: number);
}
/** Parse de un script SMT-LIB completo. */
export declare function parseSmtLib(input: string): SmtCommand[];
/** Parse de un único término. Útil para tests y bridges. */
export declare function parseTerm(input: string): SmtTerm;
/** Parse de un único sort. */
export declare function parseSort(input: string): SmtSort;
//# sourceMappingURL=parser.d.ts.map