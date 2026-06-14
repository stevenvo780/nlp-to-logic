"use strict";
// ============================================================
// ST dL-Hybrid — Parser de sintaxis textual dL
// ============================================================
// Sintaxis aceptada (subset KeYmaera-like):
//
//   formula  ::= impliesFormula
//   impliesFormula ::= orFormula ('->' impliesFormula)?
//                   |  orFormula '<->' orFormula
//   orFormula  ::= andFormula ('|' andFormula)*
//   andFormula ::= notFormula ('&' notFormula)*
//   notFormula ::= '!' notFormula | atomFormula
//   atomFormula::= 'true' | 'false'
//                | '[' program ']' formula
//                | '<' program '>' formula
//                | '(' formula ')'
//                | comparison
//   comparison ::= term op term       where op ∈ {=, !=, <, <=, >, >=}
//
//   program  ::= seqProgram
//   seqProgram ::= choiceProgram (';' seqProgram)?
//   choiceProgram::= unaryProgram ('++' unaryProgram)*    (++ = ∪)
//   unaryProgram ::= atomProgram '*' ?
//   atomProgram::= var ':=' term
//                | var ':=' '*'
//                | '?' '(' formula ')' | '?' formula
//                | '{' odeEquations ('&' formula)? '}'
//                | '(' program ')'
//
//   term     ::= addTerm
//   addTerm  ::= mulTerm (('+' | '-') mulTerm)*
//   mulTerm  ::= powTerm (('*' | '/') powTerm)*
//   powTerm  ::= unaryTerm ('^' integer)?
//   unaryTerm::= '-' unaryTerm | number | ident | '(' term ')'
//
// Comentarios `//...\n` se ignoran.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormula = parseFormula;
exports.parseProgram = parseProgram;
exports.parseTerm = parseTerm;
class Tokenizer {
    pos = 0;
    src;
    constructor(src) {
        this.src = src;
    }
    skipWs() {
        while (this.pos < this.src.length) {
            const c = this.src[this.pos];
            if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
                this.pos++;
            }
            else if (c === '/' && this.src[this.pos + 1] === '/') {
                while (this.pos < this.src.length && this.src[this.pos] !== '\n')
                    this.pos++;
            }
            else
                break;
        }
    }
    peek() {
        this.skipWs();
        return this.src.slice(this.pos);
    }
    eof() {
        this.skipWs();
        return this.pos >= this.src.length;
    }
    /** Intenta consumir un literal; retorna true si lo consumió. */
    match(literal) {
        this.skipWs();
        if (this.src.startsWith(literal, this.pos)) {
            this.pos += literal.length;
            return true;
        }
        return false;
    }
    /** Consume un literal o lanza error. */
    expect(literal) {
        if (!this.match(literal)) {
            throw new Error(`Esperaba '${literal}' en pos ${this.pos}: '${this.src.slice(this.pos, this.pos + 20)}'`);
        }
    }
    /** Identificador: [a-zA-Z_][a-zA-Z0-9_]* */
    matchIdent() {
        this.skipWs();
        const start = this.pos;
        const c = this.src[start];
        if (!c || !/[a-zA-Z_]/.test(c))
            return null;
        let end = start + 1;
        while (end < this.src.length && /[a-zA-Z0-9_]/.test(this.src[end] ?? ''))
            end++;
        this.pos = end;
        return this.src.slice(start, end);
    }
    /** Número (puede ser real con punto y signo unario gestionado en el parser). */
    matchNumber() {
        this.skipWs();
        const start = this.pos;
        let end = start;
        while (end < this.src.length && /[0-9]/.test(this.src[end] ?? ''))
            end++;
        if (end < this.src.length && this.src[end] === '.') {
            end++;
            while (end < this.src.length && /[0-9]/.test(this.src[end] ?? ''))
                end++;
        }
        if (end === start)
            return null;
        this.pos = end;
        return parseFloat(this.src.slice(start, end));
    }
    /** Mira si el siguiente token (sin consumir) coincide con un literal. */
    lookahead(literal) {
        this.skipWs();
        return this.src.startsWith(literal, this.pos);
    }
    /** Mira si el siguiente token (sin consumir) coincide con un identificador exacto. */
    lookaheadKeyword(kw) {
        this.skipWs();
        if (!this.src.startsWith(kw, this.pos))
            return false;
        const after = this.src[this.pos + kw.length];
        return !after || !/[a-zA-Z0-9_]/.test(after);
    }
    /** Consume un keyword (identificador exacto). */
    matchKeyword(kw) {
        if (this.lookaheadKeyword(kw)) {
            this.pos += kw.length;
            return true;
        }
        return false;
    }
}
class Parser {
    tk;
    constructor(src) {
        this.tk = new Tokenizer(src);
    }
    // --- Programa híbrido ---
    parseProgram() {
        return this.parseSeq();
    }
    parseSeq() {
        let left = this.parseChoice();
        while (this.tk.match(';')) {
            const right = this.parseChoice();
            left = { kind: 'seq', left, right };
        }
        return left;
    }
    parseChoice() {
        let left = this.parseUnary();
        // Usamos `++` como ∪ porque `|` colisiona con `or` en fórmulas.
        while (this.tk.match('++')) {
            const right = this.parseUnary();
            left = { kind: 'choice', left, right };
        }
        return left;
    }
    parseUnary() {
        const atom = this.parseAtomProgram();
        if (this.tk.match('*')) {
            return { kind: 'loop', body: atom };
        }
        return atom;
    }
    parseAtomProgram() {
        if (this.tk.match('(')) {
            const inner = this.parseSeq();
            this.tk.expect(')');
            return inner;
        }
        if (this.tk.match('{')) {
            // ODE: x' = e (, y' = e)* (& Q)?
            const equations = [];
            do {
                const v = this.tk.matchIdent();
                if (!v)
                    throw new Error('Esperaba variable en ODE');
                this.tk.expect("'");
                this.tk.expect('=');
                const rhs = this.parseTerm();
                equations.push({ varName: v, rhs });
            } while (this.tk.match(','));
            let domain;
            if (this.tk.match('&')) {
                domain = this.parseFormula();
            }
            this.tk.expect('}');
            return { kind: 'ode', system: domain ? { equations, domain } : { equations } };
        }
        if (this.tk.match('?')) {
            let cond;
            if (this.tk.match('(')) {
                cond = this.parseFormula();
                this.tk.expect(')');
            }
            else {
                cond = this.parseComparison();
            }
            return { kind: 'test', cond };
        }
        const id = this.tk.matchIdent();
        if (!id)
            throw new Error(`Esperaba programa, encontré '${this.tk.peek().slice(0, 20)}'`);
        this.tk.expect(':=');
        if (this.tk.match('*')) {
            return { kind: 'nondet', varName: id };
        }
        const rhs = this.parseTerm();
        return { kind: 'assign', varName: id, rhs };
    }
    // --- Fórmula ---
    parseFormula() {
        return this.parseImplies();
    }
    parseImplies() {
        const left = this.parseOr();
        if (this.tk.match('<->')) {
            const right = this.parseOr();
            return { kind: 'iff', left, right };
        }
        if (this.tk.match('->')) {
            const right = this.parseImplies();
            return { kind: 'implies', left, right };
        }
        return left;
    }
    parseOr() {
        let left = this.parseAnd();
        while (this.tk.match('|')) {
            const right = this.parseAnd();
            left = { kind: 'or', left, right };
        }
        return left;
    }
    parseAnd() {
        let left = this.parseNot();
        while (this.tk.match('&')) {
            const right = this.parseNot();
            left = { kind: 'and', left, right };
        }
        return left;
    }
    parseNot() {
        if (this.tk.match('!')) {
            const arg = this.parseNot();
            return { kind: 'not', arg };
        }
        return this.parseAtomFormula();
    }
    parseAtomFormula() {
        if (this.tk.matchKeyword('true'))
            return { kind: 'true' };
        if (this.tk.matchKeyword('false'))
            return { kind: 'false' };
        if (this.tk.match('[')) {
            const program = this.parseProgram();
            this.tk.expect(']');
            const post = this.parseAtomFormula();
            return { kind: 'box', program, post };
        }
        if (this.tk.match('<')) {
            // Podría ser una comparación `<` si lo que sigue es un término;
            // ya consumimos `<` aquí. Heurística: una modalidad ⟨α⟩ siempre
            // contiene en algún punto `:=`, `'`, `?`, `{` o `++` antes del `>`.
            // Si el remainder hasta el siguiente `>` contiene esos marcadores,
            // tratamos como modalidad. Si no, retrocedemos a comparison.
            const rest = this.tk.peek();
            const closeIdx = rest.indexOf('>');
            const inside = closeIdx >= 0 ? rest.slice(0, closeIdx) : rest;
            const isModality = /:=|'|\?|\{|\+\+|\*/.test(inside);
            if (isModality) {
                const program = this.parseProgram();
                this.tk.expect('>');
                const post = this.parseAtomFormula();
                return { kind: 'diamond', program, post };
            }
            // No es modalidad — pero ya consumimos `<`. Re-parseamos:
            // armamos un atom de comparación con el lado izquierdo asumido NaN.
            // Para evitar este caso, exigimos que la modalidad no se intente con
            // términos puros; en este punto lanzamos error claro.
            throw new Error(`'<' suelto no parece modalidad ni comparación de la forma 't1 < t2' (use paréntesis)`);
        }
        if (this.tk.match('(')) {
            const inner = this.parseFormula();
            this.tk.expect(')');
            return inner;
        }
        return this.parseComparison();
    }
    parseComparison() {
        const left = this.parseTerm();
        const ops = [
            { tok: '<=', op: '<=' },
            { tok: '>=', op: '>=' },
            { tok: '!=', op: '!=' },
            { tok: '=', op: '=' },
            { tok: '<', op: '<' },
            { tok: '>', op: '>' },
        ];
        for (const { tok, op } of ops) {
            if (this.tk.match(tok)) {
                const right = this.parseTerm();
                return { kind: 'comp', op, left, right };
            }
        }
        throw new Error(`Esperaba operador de comparación tras término en pos ${this.tk.peek().slice(0, 20)}`);
    }
    // --- Términos ---
    parseTerm() {
        return this.parseAdd();
    }
    parseAdd() {
        let left = this.parseMul();
        while (true) {
            if (this.tk.lookahead('+') && !this.tk.lookahead('++')) {
                // Consumimos `+` sólo si NO es el inicio de `++` (choice).
                this.tk.match('+');
                const right = this.parseMul();
                left = { kind: 'plus', left, right };
            }
            else if (this.tk.lookahead('-') &&
                !this.tk.lookahead('->')) {
                // Consumimos `-` sólo si NO es el inicio de `->` (implicación).
                this.tk.match('-');
                const right = this.parseMul();
                left = { kind: 'minus', left, right };
            }
            else
                break;
        }
        return left;
    }
    parseMul() {
        let left = this.parsePow();
        while (true) {
            if (this.tk.match('*')) {
                const right = this.parsePow();
                left = { kind: 'times', left, right };
            }
            else if (this.tk.match('/')) {
                const right = this.parsePow();
                left = { kind: 'div', left, right };
            }
            else
                break;
        }
        return left;
    }
    parsePow() {
        const base = this.parseUnaryTerm();
        if (this.tk.match('^')) {
            const n = this.tk.matchNumber();
            if (n === null || !Number.isInteger(n)) {
                throw new Error('Exponente debe ser entero literal');
            }
            return { kind: 'pow', base, exp: n };
        }
        return base;
    }
    parseUnaryTerm() {
        if (this.tk.match('-')) {
            const arg = this.parseUnaryTerm();
            return { kind: 'neg', arg };
        }
        const n = this.tk.matchNumber();
        if (n !== null)
            return { kind: 'num', value: n };
        if (this.tk.match('(')) {
            const inner = this.parseTerm();
            this.tk.expect(')');
            return inner;
        }
        const id = this.tk.matchIdent();
        if (id)
            return { kind: 'var', name: id };
        throw new Error(`Esperaba término en '${this.tk.peek().slice(0, 20)}'`);
    }
    endOrThrow() {
        if (!this.tk.eof()) {
            throw new Error(`Tokens sobrantes: '${this.tk.peek().slice(0, 30)}'`);
        }
    }
}
/** Parsea una fórmula dL desde una cadena. Lanza Error en sintaxis inválida. */
function parseFormula(src) {
    const p = new Parser(src);
    const f = p.parseFormula();
    p.endOrThrow();
    return f;
}
/** Parsea un programa híbrido desde una cadena. */
function parseProgram(src) {
    const p = new Parser(src);
    const prog = p.parseProgram();
    p.endOrThrow();
    return prog;
}
/** Parsea un término aritmético dL. */
function parseTerm(src) {
    const p = new Parser(src);
    const t = p.parseTerm();
    p.endOrThrow();
    return t;
}
//# sourceMappingURL=parser.js.map