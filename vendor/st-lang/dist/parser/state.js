"use strict";
// ============================================================
// ST Parser — Estado compartido (token cursor + diagnostico)
// ============================================================
//
// Encapsula el estado mutable del parser y todos los helpers
// de bajo nivel (current/peek/advance/match/expect). Los modulos
// de parsing especializados (statements, control-flow, formulas,
// etc.) operan sobre una instancia de ParserState pasada por
// referencia.
//
// Esta capa NO produce nodos AST — solo navega tokens y emite
// diagnosticos. Toda la logica de construccion de nodos vive
// en los modulos hijos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserState = void 0;
const tokens_1 = require("../lexer/tokens");
class ParserState {
    tokens = [];
    pos = 0;
    file;
    diagnostics = [];
    contextStack = [];
    currentProfile = '';
    knownFunctionNames = new Set([
        'typeof',
        'is_valid',
        'is_satisfiable',
        'get_atoms',
        'atoms_of',
        'len',
        'at',
        'formula_eq',
        'input',
    ]);
    knownTheoryNames = new Set();
    constructor(file = '<stdin>') {
        this.file = file;
    }
    // --- Acceso a tokens ---
    current() {
        if (this.pos >= this.tokens.length) {
            return { type: tokens_1.TokenType.EOF, value: '', line: 0, column: 0 };
        }
        return this.tokens[this.pos];
    }
    previous() {
        if (this.pos === 0)
            return this.tokens[0];
        return this.tokens[this.pos - 1];
    }
    peek(offset) {
        const idx = this.pos + offset;
        if (idx >= this.tokens.length)
            return tokens_1.TokenType.EOF;
        return this.tokens[idx].type;
    }
    advance() {
        const tok = this.current();
        this.pos++;
        return tok;
    }
    isAtEnd() {
        return this.current().type === tokens_1.TokenType.EOF;
    }
    checkType(type) {
        return this.current().type === type;
    }
    match(type) {
        if (this.checkType(type)) {
            this.advance();
            return true;
        }
        return false;
    }
    expect(type) {
        if (this.checkType(type)) {
            return this.advance();
        }
        throw new Error(this.contextualize(`Se esperaba ${type}, encontrado '${this.current().value}' (${this.current().type}) ` +
            `en linea ${this.current().line}, columna ${this.current().column}`));
    }
    expectOneOf(...types) {
        for (const type of types) {
            if (this.checkType(type)) {
                return this.advance();
            }
        }
        throw new Error(this.contextualize(`Se esperaba ${types.join(' o ')}, encontrado '${this.current().value}' (${this.current().type}) ` +
            `en linea ${this.current().line}, columna ${this.current().column}`));
    }
    expectIdent() {
        const tok = this.expect(tokens_1.TokenType.IDENTIFIER);
        return tok.value;
    }
    /**
     * Acepta un IDENTIFIER o cualquier keyword como nombre
     * (para soportar nombres como "Logic", "Theory", etc. que colisionan con keywords)
     */
    expectName() {
        const tok = this.current();
        if (tok.type === tokens_1.TokenType.IDENTIFIER) {
            this.advance();
            return tok.value;
        }
        if (tok.type !== tokens_1.TokenType.NEWLINE &&
            tok.type !== tokens_1.TokenType.EOF &&
            tok.type !== tokens_1.TokenType.LPAREN &&
            tok.type !== tokens_1.TokenType.RPAREN &&
            tok.type !== tokens_1.TokenType.LBRACE &&
            tok.type !== tokens_1.TokenType.RBRACE &&
            tok.type !== tokens_1.TokenType.COLON &&
            tok.type !== tokens_1.TokenType.EQUALS &&
            tok.type !== tokens_1.TokenType.ARROW &&
            tok.type !== tokens_1.TokenType.AND &&
            tok.type !== tokens_1.TokenType.OR &&
            tok.type !== tokens_1.TokenType.NOT &&
            tok.type !== tokens_1.TokenType.DOT &&
            tok.type !== tokens_1.TokenType.COMMA &&
            tok.type !== tokens_1.TokenType.STRING &&
            tok.type !== tokens_1.TokenType.NUMBER) {
            this.advance();
            return tok.value;
        }
        throw new Error(this.contextualize(`Se esperaba nombre/identificador, encontrado '${tok.value}' (${tok.type}) ` +
            `en linea ${tok.line}, columna ${tok.column}`));
    }
    // --- Diagnostico y contexto ---
    contextualize(message) {
        if (this.contextStack.length === 0)
            return message;
        return `${message} mientras se parseaba ${this.contextStack.join(' > ')}`;
    }
    withContext(context, fn) {
        this.contextStack.push(context);
        try {
            return fn();
        }
        finally {
            this.contextStack.pop();
        }
    }
    loc() {
        const tok = this.current();
        return { line: tok.line, column: tok.column, file: this.file };
    }
    skipNewlines() {
        while (this.checkType(tokens_1.TokenType.NEWLINE)) {
            this.advance();
        }
    }
    pushDiagnostic(severity, message) {
        this.diagnostics.push({
            severity,
            message,
            file: this.file,
            line: this.current().line,
            column: this.current().column,
        });
    }
}
exports.ParserState = ParserState;
//# sourceMappingURL=state.js.map