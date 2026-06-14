import { Token, TokenType } from '../lexer/tokens';
import { Diagnostic, SourceLocation } from '../types';
export declare class ParserState {
    tokens: Token[];
    pos: number;
    file: string;
    diagnostics: Diagnostic[];
    contextStack: string[];
    currentProfile: string;
    knownFunctionNames: Set<string>;
    knownTheoryNames: Set<string>;
    constructor(file?: string);
    current(): Token;
    previous(): Token;
    peek(offset: number): TokenType;
    advance(): Token;
    isAtEnd(): boolean;
    checkType(type: TokenType): boolean;
    match(type: TokenType): boolean;
    expect(type: TokenType): Token;
    expectOneOf(...types: TokenType[]): Token;
    expectIdent(): string;
    /**
     * Acepta un IDENTIFIER o cualquier keyword como nombre
     * (para soportar nombres como "Logic", "Theory", etc. que colisionan con keywords)
     */
    expectName(): string;
    contextualize(message: string): string;
    withContext<T>(context: string, fn: () => T): T;
    loc(): SourceLocation;
    skipNewlines(): void;
    pushDiagnostic(severity: 'error' | 'warning' | 'info', message: string): void;
}
//# sourceMappingURL=state.d.ts.map