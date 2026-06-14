"use strict";
/**
 * ST Parser — Parser recursivo descendente
 *
 * Refactor α2 (V4): el parser monolitico se descompone en modulos.
 * - ./state.ts        — ParserState: token cursor + diagnostico
 * - ./formulas.ts     — precedencia de formulas + MODAL_ALIASES + formulaToString
 *
 * La clase `Parser` es el facade publico: misma firma de constructor,
 * mismo `parse(source): Program`, mismo `diagnostics`. Los consumidores
 * (interpreter, cli, api, protocol/handler) NO cambian.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const tokens_1 = require("../lexer/tokens");
const lexer_1 = require("../lexer/lexer");
const compat_1 = require("../runtime/compat");
const state_1 = require("./state");
const formulas_1 = require("./formulas");
class Parser {
    state;
    initialProfile;
    constructor(file = '<stdin>', profile) {
        this.state = new state_1.ParserState(file);
        this.initialProfile = profile;
    }
    // --- Acceso compatible al estado (diagnostics expuesto como antes) ---
    get diagnostics() {
        return this.state.diagnostics;
    }
    set diagnostics(value) {
        this.state.diagnostics = value;
    }
    parse(source) {
        const normalizedSource = (0, compat_1.normalizeSTSource)(source);
        const lexer = new lexer_1.Lexer(normalizedSource, this.state.file, this.initialProfile);
        this.state.tokens = lexer.tokenize();
        this.state.diagnostics.push(...lexer.diagnostics);
        this.state.pos = 0;
        this.state.contextStack = [];
        const statements = [];
        while (!this.state.isAtEnd()) {
            this.state.skipNewlines();
            if (this.state.isAtEnd())
                break;
            try {
                const stmt = this.parseStatement();
                if (stmt) {
                    statements.push(stmt);
                }
            }
            catch (e) {
                const message = e instanceof Error ? e.message : 'Error de parseo inesperado';
                this.state.pushDiagnostic('error', message);
                this.advanceToNextStatement();
            }
        }
        return { statements, file: this.state.file };
    }
    // --- Parsing de statements ---
    parseStatement() {
        const s = this.state;
        const tok = s.current();
        // Detección de llamada a función: nombre(...)
        if (s.peek(1) === tokens_1.TokenType.LPAREN &&
            (tok.type === tokens_1.TokenType.IDENTIFIER || s.knownFunctionNames.has(tok.value))) {
            return s.withContext(`llamada a funcion '${tok.value}'`, () => this.parseFnCall());
        }
        // Detección de llamada a método: objeto.metodo(...)
        if (tok.type === tokens_1.TokenType.IDENTIFIER &&
            s.peek(1) === tokens_1.TokenType.DOT &&
            s.peek(2) === tokens_1.TokenType.IDENTIFIER &&
            s.peek(3) === tokens_1.TokenType.LPAREN) {
            return s.withContext(`llamada a metodo '${tok.value}'`, () => this.parseMemberFnCall());
        }
        return s.withContext(this.describeStatementContext(tok), () => {
            switch (tok.type) {
                case tokens_1.TokenType.LOGIC:
                    return this.parseLogicDecl();
                case tokens_1.TokenType.AXIOM:
                    return this.parseAxiomDecl();
                case tokens_1.TokenType.THEOREM:
                    return this.parseTheoremDecl();
                case tokens_1.TokenType.DERIVE:
                    return this.parseDeriveCmd();
                case tokens_1.TokenType.CHECK:
                    return this.parseCheckCmd();
                case tokens_1.TokenType.PROVE:
                    return this.parseProveCmd();
                case tokens_1.TokenType.COUNTERMODEL:
                case tokens_1.TokenType.REFUTE:
                    return this.parseCountermodelCmd();
                case tokens_1.TokenType.TRUTH_TABLE:
                    return this.parseTruthTableCmd();
                case tokens_1.TokenType.LET:
                    return this.parseLetDecl();
                case tokens_1.TokenType.CLAIM:
                    return this.parseClaimDecl();
                case tokens_1.TokenType.SUPPORT:
                    return this.parseSupportDecl();
                case tokens_1.TokenType.CONFIDENCE:
                    return this.parseConfidenceDecl();
                case tokens_1.TokenType.CONTEXT:
                    return this.parseContextDecl();
                case tokens_1.TokenType.RENDER:
                    return this.parseRenderCmd();
                case tokens_1.TokenType.ANALYZE:
                    return this.parseAnalyzeCmd();
                case tokens_1.TokenType.EXPLAIN:
                    return this.parseExplainCmd();
                case tokens_1.TokenType.IMPORT:
                    return this.parseImportDecl();
                case tokens_1.TokenType.ASSUME:
                    return this.parseProofBlock();
                case tokens_1.TokenType.SHOW:
                    return this.parseShowStatement();
                case tokens_1.TokenType.THEORY:
                    return this.parseTheoryDecl();
                case tokens_1.TokenType.PRINT:
                    return this.parsePrintCmd();
                case tokens_1.TokenType.SET:
                    return this.parseSetCmd();
                case tokens_1.TokenType.IF:
                    return this.parseIfStmt();
                case tokens_1.TokenType.FOR:
                    return this.parseForStmt();
                case tokens_1.TokenType.WHILE:
                    return this.parseWhileStmt();
                case tokens_1.TokenType.FN:
                    return this.parseFnDecl();
                case tokens_1.TokenType.RETURN:
                    return this.parseReturnStmt();
                case tokens_1.TokenType.EXPORT:
                    return this.parseExportDecl();
                case tokens_1.TokenType.DEFINE:
                    return this.parseDefineDecl();
                case tokens_1.TokenType.UNFOLD:
                    return this.parseUnfoldCmd();
                case tokens_1.TokenType.FOLD:
                    return this.parseFoldCmd();
                case tokens_1.TokenType.SOURCE_KW:
                    return this.parseSourceDecl();
                case tokens_1.TokenType.INTERPRET:
                    return this.parseInterpretCmd();
                case tokens_1.TokenType.GLOSSARY:
                    return this.parseGlossaryCmd();
                case tokens_1.TokenType.IDENTIFIER:
                    throw new Error(s.contextualize(`Statement inesperado: '${tok.value}' (${tok.type})`));
                case tokens_1.TokenType.NEWLINE:
                    s.advance();
                    return null;
                case tokens_1.TokenType.EOF:
                    return null;
                default:
                    throw new Error(s.contextualize(`Statement inesperado: '${tok.value}' (${tok.type})`));
            }
        });
    }
    // logic classical.propositional
    parseLogicDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.LOGIC);
        let profile = s.expectIdent();
        while (s.match(tokens_1.TokenType.DOT)) {
            profile += '.';
            profile += s.expectIdent();
        }
        s.currentProfile = profile;
        return { kind: 'logic_decl', profile, source: src };
    }
    // axiom name = FORMULA  o  axiom name : FORMULA
    parseAxiomDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.AXIOM);
        const name = s.expectIdent();
        s.expectOneOf(tokens_1.TokenType.EQUALS, tokens_1.TokenType.COLON);
        const formula = this.parseFormula();
        return { kind: 'axiom_decl', name, formula, source: src };
    }
    // theorem name = FORMULA  o  theorem name : FORMULA
    parseTheoremDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.THEOREM);
        const name = s.expectIdent();
        s.expectOneOf(tokens_1.TokenType.EQUALS, tokens_1.TokenType.COLON);
        const formula = this.parseFormula();
        return { kind: 'theorem_decl', name, formula, source: src };
    }
    // derive FORMULA from {a1, a2, ...}
    parseDeriveCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.DERIVE);
        const goal = this.parseFormula();
        s.expect(tokens_1.TokenType.FROM);
        const premises = (0, formulas_1.parseIdList)(s);
        return { kind: 'derive_cmd', goal, premises, source: src };
    }
    // check valid FORMULA | check satisfiable FORMULA | check equivalent F, F
    parseCheckCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.CHECK);
        if (s.match(tokens_1.TokenType.VALID)) {
            const formula = this.parseFormula();
            return { kind: 'check_valid_cmd', formula, source: src };
        }
        if (s.match(tokens_1.TokenType.SATISFIABLE)) {
            const formula = this.parseFormula();
            return { kind: 'check_satisfiable_cmd', formula, source: src };
        }
        if (s.match(tokens_1.TokenType.EQUIVALENT)) {
            const left = this.parseFormula();
            s.expect(tokens_1.TokenType.COMMA);
            const right = this.parseFormula();
            return { kind: 'check_equivalent_cmd', left, right, source: src };
        }
        throw new Error(`Se esperaba 'valid', 'satisfiable' o 'equivalent' despues de 'check'`);
    }
    // prove FORMULA [from {a1, a2}]
    parseProveCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.PROVE);
        const goal = this.parseFormula();
        let premises = [];
        if (s.match(tokens_1.TokenType.FROM)) {
            premises = (0, formulas_1.parseIdList)(s);
        }
        return { kind: 'prove_cmd', goal, premises, source: src };
    }
    // countermodel FORMULA | refute FORMULA
    parseCountermodelCmd() {
        const s = this.state;
        const src = s.loc();
        if (s.checkType(tokens_1.TokenType.COUNTERMODEL)) {
            s.advance();
        }
        else {
            s.expect(tokens_1.TokenType.REFUTE);
        }
        const formula = this.parseFormula();
        return { kind: 'countermodel_cmd', formula, source: src };
    }
    // truth_table FORMULA
    parseTruthTableCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.TRUTH_TABLE);
        const formula = this.parseFormula();
        return { kind: 'truth_table_cmd', formula, source: src };
    }
    // let name = passage([[path#anchor]])
    // let name = formalize passageName as FORMULA
    parseLetDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.LET);
        const name = s.expectIdent();
        s.expect(tokens_1.TokenType.EQUALS);
        if (this.canStartActionExpr()) {
            const action = this.parseActionExpr();
            return { kind: 'let_decl', name, letType: 'action', action, source: src };
        }
        if (s.match(tokens_1.TokenType.PASSAGE)) {
            // passage @Source "text" (standalone passage with source and raw text)
            if (s.checkType(tokens_1.TokenType.AT)) {
                s.advance(); // skip @
                const sourceRef = s.expectName();
                let section = '';
                if (s.checkType(tokens_1.TokenType.STRING)) {
                    // No section, just text
                }
                else if (s.checkType(tokens_1.TokenType.IDENTIFIER) || s.checkType(tokens_1.TokenType.NUMBER)) {
                    section = s.current().value;
                    s.advance();
                }
                if (s.checkType(tokens_1.TokenType.STRING)) {
                    s.advance();
                    const anchorPath = `@${sourceRef}${section ? '#' + section : ''}`;
                    return { kind: 'let_decl', name, letType: 'passage', anchorPath, source: src };
                }
            }
            s.expect(tokens_1.TokenType.LPAREN);
            s.expect(tokens_1.TokenType.LBRACKET_DOUBLE);
            let anchorPath = '';
            if (s.checkType(tokens_1.TokenType.STRING)) {
                anchorPath = s.current().value;
                s.advance();
            }
            else {
                while (!s.checkType(tokens_1.TokenType.RBRACKET_DOUBLE) && !s.isAtEnd()) {
                    anchorPath += s.current().value;
                    s.advance();
                }
            }
            s.expect(tokens_1.TokenType.RBRACKET_DOUBLE);
            s.expect(tokens_1.TokenType.RPAREN);
            return { kind: 'let_decl', name, letType: 'passage', anchorPath, source: src };
        }
        if (s.match(tokens_1.TokenType.FORMALIZE)) {
            const passageName = s.expectIdent();
            s.expect(tokens_1.TokenType.AS);
            const formula = this.parseFormula();
            return { kind: 'let_decl', name, letType: 'formalize', passageName, formula, source: src };
        }
        // let name = "texto descriptivo" [: FORMULA]
        if (s.checkType(tokens_1.TokenType.STRING)) {
            const description = s.current().value;
            s.advance();
            if (s.match(tokens_1.TokenType.COLON)) {
                const formula = this.parseFormula();
                return { kind: 'let_decl', name, letType: 'formula', formula, description, source: src };
            }
            return { kind: 'let_decl', name, letType: 'description', description, source: src };
        }
        // let name = FORMULA (alias de fórmula)
        const formula = this.parseFormula();
        return { kind: 'let_decl', name, letType: 'formula', formula, source: src };
    }
    // claim name = ID_OR_FORMULA
    parseClaimDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.CLAIM);
        const name = s.expectIdent();
        s.expect(tokens_1.TokenType.EQUALS);
        if (s.checkType(tokens_1.TokenType.IDENTIFIER) && s.peek(1) !== tokens_1.TokenType.LPAREN) {
            const val = s.current().value;
            const saved = s.pos;
            s.advance();
            if (s.isAtEnd() || s.checkType(tokens_1.TokenType.NEWLINE)) {
                return { kind: 'claim_decl', name, value: val, formalization: val, source: src };
            }
            s.pos = saved;
        }
        const formula = this.parseFormula();
        return {
            kind: 'claim_decl',
            name,
            value: (0, formulas_1.formulaToString)(formula),
            formula,
            source: src,
        };
    }
    // support claimName <- sourceName
    parseSupportDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.SUPPORT);
        const claimName = s.expectIdent();
        s.expect(tokens_1.TokenType.BACK_ARROW);
        const sourceName = s.expectIdent();
        return { kind: 'support_decl', claimName, sourceName, source: src };
    }
    // confidence claimName = NUMBER
    parseConfidenceDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.CONFIDENCE);
        const claimName = s.expectIdent();
        s.expect(tokens_1.TokenType.EQUALS);
        const tok = s.expect(tokens_1.TokenType.NUMBER);
        return { kind: 'confidence_decl', claimName, value: parseFloat(tok.value), source: src };
    }
    // context claimName = "text"
    parseContextDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.CONTEXT);
        const claimName = s.expectIdent();
        s.expect(tokens_1.TokenType.EQUALS);
        const tok = s.expect(tokens_1.TokenType.STRING);
        return { kind: 'context_decl', claimName, text: tok.value, source: src };
    }
    // render target [as FORMAT] | render glossary [as FORMAT] | render analysis [as FORMAT]
    parseRenderCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.RENDER);
        let target;
        if (s.checkType(tokens_1.TokenType.THEORY)) {
            target = s.current().value;
            s.advance();
        }
        else if (s.checkType(tokens_1.TokenType.GLOSSARY)) {
            target = 'glossary';
            s.advance();
        }
        else {
            target = s.expectIdent();
        }
        let format = 'markdown';
        if (s.match(tokens_1.TokenType.AS)) {
            if (s.checkType(tokens_1.TokenType.IDENTIFIER)) {
                format = s.current().value;
                s.advance();
            }
        }
        else if (s.checkType(tokens_1.TokenType.IDENTIFIER)) {
            format = s.current().value;
            s.advance();
        }
        return { kind: 'render_cmd', target, format, source: src };
    }
    // analyze {P1, P2, ...} -> CONCLUSION
    parseAnalyzeCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.ANALYZE);
        s.expect(tokens_1.TokenType.LBRACE);
        const premises = [];
        if (!s.checkType(tokens_1.TokenType.RBRACE)) {
            premises.push(this.parseFormula());
            while (s.match(tokens_1.TokenType.COMMA)) {
                premises.push(this.parseFormula());
            }
        }
        s.expect(tokens_1.TokenType.RBRACE);
        s.expect(tokens_1.TokenType.ARROW);
        const conclusion = this.parseFormula();
        return { kind: 'analyze_cmd', premises, conclusion, source: src };
    }
    // explain FORMULA
    parseExplainCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.EXPLAIN);
        const formula = this.parseFormula();
        return { kind: 'explain_cmd', formula, source: src };
    }
    canStartActionExpr() {
        const s = this.state;
        return (s.checkType(tokens_1.TokenType.CHECK) ||
            s.checkType(tokens_1.TokenType.DERIVE) ||
            s.checkType(tokens_1.TokenType.PROVE) ||
            s.checkType(tokens_1.TokenType.COUNTERMODEL) ||
            s.checkType(tokens_1.TokenType.REFUTE) ||
            s.checkType(tokens_1.TokenType.TRUTH_TABLE) ||
            s.checkType(tokens_1.TokenType.EXPLAIN));
    }
    parseActionExpr() {
        const s = this.state;
        const src = s.loc();
        if (s.match(tokens_1.TokenType.CHECK)) {
            if (s.match(tokens_1.TokenType.VALID)) {
                const formula = this.parseFormula();
                return { kind: 'action_expr', action: 'check_valid', formula, source: src };
            }
            if (s.match(tokens_1.TokenType.SATISFIABLE)) {
                const formula = this.parseFormula();
                return { kind: 'action_expr', action: 'check_satisfiable', formula, source: src };
            }
            if (s.match(tokens_1.TokenType.EQUIVALENT)) {
                const left = this.parseFormula();
                s.expect(tokens_1.TokenType.COMMA);
                const right = this.parseFormula();
                return { kind: 'action_expr', action: 'check_equivalent', left, right, source: src };
            }
            throw new Error(`Se esperaba 'valid', 'satisfiable' o 'equivalent' despues de 'check'`);
        }
        if (s.match(tokens_1.TokenType.DERIVE)) {
            const goal = this.parseFormula();
            s.expect(tokens_1.TokenType.FROM);
            const premises = (0, formulas_1.parseIdList)(s);
            return { kind: 'action_expr', action: 'derive', goal, premises, source: src };
        }
        if (s.match(tokens_1.TokenType.PROVE)) {
            const goal = this.parseFormula();
            s.expect(tokens_1.TokenType.FROM);
            const premises = (0, formulas_1.parseIdList)(s);
            return { kind: 'action_expr', action: 'prove', goal, premises, source: src };
        }
        if (s.checkType(tokens_1.TokenType.COUNTERMODEL)) {
            s.advance();
            const formula = this.parseFormula();
            return { kind: 'action_expr', action: 'countermodel', formula, source: src };
        }
        if (s.match(tokens_1.TokenType.REFUTE)) {
            const formula = this.parseFormula();
            return { kind: 'action_expr', action: 'countermodel', formula, source: src };
        }
        if (s.match(tokens_1.TokenType.TRUTH_TABLE)) {
            const formula = this.parseFormula();
            return { kind: 'action_expr', action: 'truth_table', formula, source: src };
        }
        if (s.match(tokens_1.TokenType.EXPLAIN)) {
            const formula = this.parseFormula();
            return { kind: 'action_expr', action: 'explain', formula, source: src };
        }
        throw new Error(`Se esperaba una acción capturable, encontrado '${s.current().value}'`);
    }
    // import "path/to/file.st" | import path/to/file
    parseImportDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.IMPORT);
        let path;
        if (s.checkType(tokens_1.TokenType.STRING)) {
            path = s.current().value;
            s.advance();
        }
        else {
            path = s.expectIdent();
            while (s.checkType(tokens_1.TokenType.DOT) || s.checkType(tokens_1.TokenType.IDENTIFIER)) {
                if (s.match(tokens_1.TokenType.DOT)) {
                    path += '.';
                    if (s.checkType(tokens_1.TokenType.IDENTIFIER)) {
                        path += s.current().value;
                        s.advance();
                    }
                }
                else {
                    break;
                }
            }
        }
        return { kind: 'import_decl', path, source: src };
    }
    // assume name : FORMULA\n ... \n show FORMULA\n ... \n qed
    parseProofBlock() {
        const s = this.state;
        const src = s.loc();
        const assumptions = [];
        while (s.checkType(tokens_1.TokenType.ASSUME)) {
            s.advance();
            const name = s.expectIdent();
            s.expectOneOf(tokens_1.TokenType.COLON, tokens_1.TokenType.EQUALS);
            const formula = this.parseFormula();
            assumptions.push({ name, formula });
            s.skipNewlines();
        }
        s.expect(tokens_1.TokenType.SHOW);
        const goal = this.parseFormula();
        s.skipNewlines();
        const body = [];
        while (!s.checkType(tokens_1.TokenType.QED) && !s.isAtEnd()) {
            s.skipNewlines();
            if (s.checkType(tokens_1.TokenType.QED))
                break;
            try {
                const stmt = s.checkType(tokens_1.TokenType.ASSUME) ? this.parseProofBlock() : this.parseStatement();
                if (stmt)
                    body.push(stmt);
            }
            catch (e) {
                const message = e instanceof Error ? e.message : 'Error de parseo en bloque de prueba';
                s.pushDiagnostic('error', message);
                this.advanceToNextStatement();
            }
        }
        if (s.isAtEnd()) {
            throw new Error(`Se esperaba 'qed' para cerrar el bloque de prueba abierto en linea ${src.line}, columna ${src.column}`);
        }
        s.expect(tokens_1.TokenType.QED);
        return { kind: 'proof_block', assumptions, goal, body, source: src };
    }
    // show FORMULA  o  show: FORMULA  (statement suelto: bloque de prueba degenerado sin qed)
    parseShowStatement() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.SHOW);
        s.match(tokens_1.TokenType.COLON);
        const goal = this.parseFormula();
        s.match(tokens_1.TokenType.DOT);
        return { kind: 'proof_block', assumptions: [], goal, body: [], source: src };
    }
    // theory Name(params) { ... } | theory Name extends Parent { ... }
    parseTheoryDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.THEORY);
        const name = s.expectName();
        s.knownTheoryNames.add(name);
        let params;
        if (s.match(tokens_1.TokenType.LPAREN)) {
            params = [];
            if (!s.checkType(tokens_1.TokenType.RPAREN)) {
                params.push(s.expectName());
                while (s.match(tokens_1.TokenType.COMMA)) {
                    params.push(s.expectName());
                }
            }
            s.expect(tokens_1.TokenType.RPAREN);
        }
        let parent;
        if (s.match(tokens_1.TokenType.EXTENDS)) {
            parent = s.expectName();
        }
        s.expect(tokens_1.TokenType.LBRACE);
        s.skipNewlines();
        const members = [];
        while (!s.checkType(tokens_1.TokenType.RBRACE) && !s.isAtEnd()) {
            s.skipNewlines();
            if (s.checkType(tokens_1.TokenType.RBRACE))
                break;
            let visibility = 'public';
            if (s.match(tokens_1.TokenType.PRIVATE)) {
                visibility = 'private';
            }
            try {
                const stmt = this.parseStatement();
                if (stmt) {
                    members.push({ statement: stmt, visibility });
                }
            }
            catch (e) {
                const message = e instanceof Error ? e.message : 'Error de parseo en theory';
                s.pushDiagnostic('error', message);
                this.advanceToNextStatement();
            }
        }
        s.expect(tokens_1.TokenType.RBRACE);
        return { kind: 'theory_decl', name, params, parent, members, source: src };
    }
    // --- print "texto" | print formula ---
    parsePrintCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.PRINT);
        if (s.checkType(tokens_1.TokenType.STRING)) {
            const value = s.current().value;
            s.advance();
            return { kind: 'print_cmd', value, source: src };
        }
        const formula = this.parseFormula();
        return { kind: 'print_cmd', value: null, formula, source: src };
    }
    // --- set x = formula ---
    parseSetCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.SET);
        const name = s.expectName();
        s.expectOneOf(tokens_1.TokenType.EQUALS, tokens_1.TokenType.COLON);
        const formula = this.parseFormula();
        return { kind: 'set_cmd', name, formula, source: src };
    }
    // --- if valid FORMULA { } else if satisfiable FORMULA { } else { } ---
    parseIfStmt() {
        const s = this.state;
        const src = s.loc();
        const branches = [];
        let elseBranch;
        s.expect(tokens_1.TokenType.IF);
        branches.push(this.parseConditionBranch());
        while (this.checkElseIf()) {
            s.expect(tokens_1.TokenType.ELSE);
            s.expect(tokens_1.TokenType.IF);
            branches.push(this.parseConditionBranch());
        }
        if (s.match(tokens_1.TokenType.ELSE)) {
            elseBranch = this.parseBlock();
        }
        return { kind: 'if_stmt', branches, elseBranch, source: src };
    }
    checkElseIf() {
        const s = this.state;
        if (!s.checkType(tokens_1.TokenType.ELSE))
            return false;
        let lookahead = 1;
        while (s.peek(lookahead) === tokens_1.TokenType.NEWLINE)
            lookahead++;
        return s.peek(lookahead) === tokens_1.TokenType.IF;
    }
    parseConditionBranch() {
        const condition = this.parseConditionKeyword();
        const formula = this.parseFormula();
        const body = this.parseBlock();
        return { condition, formula, body };
    }
    parseConditionKeyword() {
        const s = this.state;
        if (s.match(tokens_1.TokenType.VALID))
            return 'valid';
        if (s.match(tokens_1.TokenType.SATISFIABLE))
            return 'satisfiable';
        if (s.checkType(tokens_1.TokenType.IDENTIFIER)) {
            const v = s.current().value.toLowerCase();
            if (v === 'invalid' || v === 'invalido') {
                s.advance();
                return 'invalid';
            }
            if (v === 'unsatisfiable' || v === 'insatisfacible') {
                s.advance();
                return 'unsatisfiable';
            }
        }
        throw new Error(s.contextualize(`Se esperaba una condición lógica ('valid', 'satisfiable', 'invalid' o 'unsatisfiable'), encontrado '${s.current().value}'`));
    }
    // --- for x in {A, B, C} { body } ---
    parseForStmt() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.FOR);
        const variable = s.expectName();
        s.expect(tokens_1.TokenType.IN);
        s.expect(tokens_1.TokenType.LBRACE);
        const items = [];
        if (!s.checkType(tokens_1.TokenType.RBRACE)) {
            items.push(this.parseFormula());
            while (s.match(tokens_1.TokenType.COMMA)) {
                items.push(this.parseFormula());
            }
        }
        s.expect(tokens_1.TokenType.RBRACE);
        const body = this.parseBlock();
        return { kind: 'for_stmt', variable, items, body, source: src };
    }
    // --- while valid FORMULA { body } ---
    parseWhileStmt() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.WHILE);
        const condition = this.parseConditionKeyword();
        const formula = this.parseFormula();
        const body = this.parseBlock();
        return { kind: 'while_stmt', condition, formula, body, maxIterations: 1000, source: src };
    }
    // --- fn nombre(param1, param2) { body } ---
    parseFnDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.FN);
        const name = s.expectName();
        s.knownFunctionNames.add(name);
        s.expect(tokens_1.TokenType.LPAREN);
        const params = [];
        if (!s.checkType(tokens_1.TokenType.RPAREN)) {
            params.push(s.expectName());
            while (s.match(tokens_1.TokenType.COMMA)) {
                params.push(s.expectName());
            }
        }
        s.expect(tokens_1.TokenType.RPAREN);
        const body = this.parseBlock();
        return { kind: 'fn_decl', name, params, body, source: src };
    }
    // --- return formula ---
    parseReturnStmt() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.RETURN);
        let formula;
        if (!s.checkType(tokens_1.TokenType.NEWLINE) &&
            !s.checkType(tokens_1.TokenType.EOF) &&
            !s.checkType(tokens_1.TokenType.RBRACE)) {
            formula = this.parseFormula();
        }
        return { kind: 'return_stmt', formula, source: src };
    }
    // --- export STATEMENT ---
    parseExportDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.EXPORT);
        const stmt = this.parseStatement();
        if (!stmt) {
            throw new Error('Se esperaba un statement después de "export"');
        }
        const exportable = [
            'let_decl',
            'axiom_decl',
            'theorem_decl',
            'fn_decl',
            'theory_decl',
            'define_decl',
        ];
        if (!exportable.includes(stmt.kind)) {
            throw new Error(`No se puede exportar un statement de tipo: ${stmt.kind}`);
        }
        return { kind: 'export_decl', statement: stmt, source: src };
    }
    // --- define NAME(params?) := FORMULA (description "text")? ---
    parseDefineDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.DEFINE);
        const name = s.expectName();
        let params;
        if (s.match(tokens_1.TokenType.LPAREN)) {
            params = [];
            if (!s.checkType(tokens_1.TokenType.RPAREN)) {
                params.push(s.expectName());
                while (s.match(tokens_1.TokenType.COMMA)) {
                    params.push(s.expectName());
                }
            }
            s.expect(tokens_1.TokenType.RPAREN);
        }
        if (s.match(tokens_1.TokenType.COLON)) {
            s.expect(tokens_1.TokenType.EQUALS);
        }
        else {
            s.expect(tokens_1.TokenType.EQUALS);
        }
        const body = this.parseFormula();
        let description;
        s.skipNewlines();
        if (s.checkType(tokens_1.TokenType.DESCRIPTION)) {
            s.advance();
            if (s.checkType(tokens_1.TokenType.STRING)) {
                description = s.current().value;
                s.advance();
            }
        }
        return { kind: 'define_decl', name, params, body, description, source: src };
    }
    // --- unfold FORMULA ---
    parseUnfoldCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.UNFOLD);
        const formula = this.parseFormula();
        return { kind: 'unfold_cmd', formula, source: src };
    }
    // --- fold FORMULA ---
    parseFoldCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.FOLD);
        const formula = this.parseFormula();
        return { kind: 'fold_cmd', formula, source: src };
    }
    // --- source NAME { key "value", ... } ---
    parseSourceDecl() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.SOURCE_KW);
        const name = s.expectName();
        s.expect(tokens_1.TokenType.LBRACE);
        s.skipNewlines();
        const fields = [];
        while (!s.checkType(tokens_1.TokenType.RBRACE) && !s.isAtEnd()) {
            s.skipNewlines();
            if (s.checkType(tokens_1.TokenType.RBRACE))
                break;
            const key = s.expectName();
            if (s.checkType(tokens_1.TokenType.STRING)) {
                fields.push({ key, value: s.current().value });
                s.advance();
            }
            else if (s.checkType(tokens_1.TokenType.NUMBER)) {
                fields.push({ key, value: parseFloat(s.current().value) });
                s.advance();
            }
            else if (s.checkType(tokens_1.TokenType.MINUS)) {
                s.advance();
                if (s.checkType(tokens_1.TokenType.NUMBER)) {
                    fields.push({ key, value: -parseFloat(s.current().value) });
                    s.advance();
                }
            }
            s.skipNewlines();
        }
        s.expect(tokens_1.TokenType.RBRACE);
        return { kind: 'source_decl', name, fields, source: src };
    }
    // --- interpret "text" as FORMULA  |  interpret IDENT as FORMULA ---
    parseInterpretCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.INTERPRET);
        let text;
        let passageRef;
        if (s.checkType(tokens_1.TokenType.STRING)) {
            text = s.current().value;
            s.advance();
        }
        else {
            passageRef = s.expectName();
            text = passageRef;
        }
        s.expect(tokens_1.TokenType.AS);
        const formula = this.parseFormula();
        return { kind: 'interpret_cmd', text, passageRef, formula, source: src };
    }
    // --- glossary ---
    parseGlossaryCmd() {
        const s = this.state;
        const src = s.loc();
        s.expect(tokens_1.TokenType.GLOSSARY);
        return { kind: 'glossary_cmd', source: src };
    }
    // --- nombre(arg1, arg2) — llamada a función ---
    parseFnCall() {
        const s = this.state;
        const src = s.loc();
        const name = s.expectName();
        s.expect(tokens_1.TokenType.LPAREN);
        const args = [];
        if (!s.checkType(tokens_1.TokenType.RPAREN)) {
            args.push(this.parseFormula());
            while (s.match(tokens_1.TokenType.COMMA)) {
                args.push(this.parseFormula());
            }
        }
        s.expect(tokens_1.TokenType.RPAREN);
        return { kind: 'fn_call', name, args, source: src };
    }
    // --- obj.method(arg1, arg2) ---
    parseMemberFnCall() {
        const s = this.state;
        const src = s.loc();
        const obj = s.expectIdent();
        s.expect(tokens_1.TokenType.DOT);
        const method = s.expectIdent();
        const fullName = `${obj}.${method}`;
        s.expect(tokens_1.TokenType.LPAREN);
        const args = [];
        if (!s.checkType(tokens_1.TokenType.RPAREN)) {
            args.push(this.parseFormula());
            while (s.match(tokens_1.TokenType.COMMA)) {
                args.push(this.parseFormula());
            }
        }
        s.expect(tokens_1.TokenType.RPAREN);
        return { kind: 'fn_call', name: fullName, args, source: src };
    }
    // --- Helper: parsear un bloque { statements } ---
    parseBlock() {
        const s = this.state;
        s.skipNewlines();
        s.expect(tokens_1.TokenType.LBRACE);
        s.skipNewlines();
        const body = [];
        while (!s.checkType(tokens_1.TokenType.RBRACE) && !s.isAtEnd()) {
            s.skipNewlines();
            if (s.checkType(tokens_1.TokenType.RBRACE))
                break;
            try {
                const stmt = this.parseStatement();
                if (stmt)
                    body.push(stmt);
            }
            catch (e) {
                const message = e instanceof Error ? e.message : 'Error de parseo en bloque';
                s.pushDiagnostic('error', message);
                this.advanceToNextStatement();
            }
        }
        s.expect(tokens_1.TokenType.RBRACE);
        return body;
    }
    // --- Delegacion a modulo de formulas ---
    parseFormula() {
        return (0, formulas_1.parseFormula)(this.state);
    }
    // --- Helpers de diagnostico/descripcion ---
    describeStatementContext(tok) {
        switch (tok.type) {
            case tokens_1.TokenType.LOGIC:
                return 'declaracion logic';
            case tokens_1.TokenType.AXIOM:
                return 'declaracion de axioma';
            case tokens_1.TokenType.THEOREM:
                return 'declaracion de teorema';
            case tokens_1.TokenType.DERIVE:
                return 'comando derive';
            case tokens_1.TokenType.CHECK:
                return 'comando check';
            case tokens_1.TokenType.PROVE:
                return 'comando prove';
            case tokens_1.TokenType.COUNTERMODEL:
            case tokens_1.TokenType.REFUTE:
                return 'comando countermodel';
            case tokens_1.TokenType.TRUTH_TABLE:
                return 'comando truth_table';
            case tokens_1.TokenType.LET:
                return 'declaracion let';
            case tokens_1.TokenType.CLAIM:
                return 'declaracion claim';
            case tokens_1.TokenType.SUPPORT:
                return 'declaracion support';
            case tokens_1.TokenType.CONFIDENCE:
                return 'declaracion confidence';
            case tokens_1.TokenType.CONTEXT:
                return 'declaracion context';
            case tokens_1.TokenType.RENDER:
                return 'comando render';
            case tokens_1.TokenType.ANALYZE:
                return 'comando analyze';
            case tokens_1.TokenType.EXPLAIN:
                return 'comando explain';
            case tokens_1.TokenType.IMPORT:
                return 'declaracion import';
            case tokens_1.TokenType.ASSUME:
                return 'bloque de prueba';
            case tokens_1.TokenType.THEORY:
                return 'declaracion theory';
            case tokens_1.TokenType.PRINT:
                return 'comando print';
            case tokens_1.TokenType.SET:
                return 'comando set';
            case tokens_1.TokenType.IF:
                return 'sentencia if';
            case tokens_1.TokenType.FOR:
                return 'sentencia for';
            case tokens_1.TokenType.WHILE:
                return 'sentencia while';
            case tokens_1.TokenType.FN:
                return 'declaracion fn';
            case tokens_1.TokenType.RETURN:
                return 'sentencia return';
            case tokens_1.TokenType.EXPORT:
                return 'declaracion export';
            case tokens_1.TokenType.DEFINE:
                return 'declaracion define';
            case tokens_1.TokenType.UNFOLD:
                return 'comando unfold';
            case tokens_1.TokenType.FOLD:
                return 'comando fold';
            case tokens_1.TokenType.SOURCE_KW:
                return 'declaracion source';
            case tokens_1.TokenType.INTERPRET:
                return 'comando interpret';
            case tokens_1.TokenType.GLOSSARY:
                return 'comando glossary';
            default:
                return `statement '${tok.value}'`;
        }
    }
    advanceToNextStatement() {
        const s = this.state;
        const statementStarters = new Set([
            tokens_1.TokenType.LOGIC,
            tokens_1.TokenType.AXIOM,
            tokens_1.TokenType.THEOREM,
            tokens_1.TokenType.DERIVE,
            tokens_1.TokenType.CHECK,
            tokens_1.TokenType.PROVE,
            tokens_1.TokenType.COUNTERMODEL,
            tokens_1.TokenType.REFUTE,
            tokens_1.TokenType.TRUTH_TABLE,
            tokens_1.TokenType.LET,
            tokens_1.TokenType.CLAIM,
            tokens_1.TokenType.SUPPORT,
            tokens_1.TokenType.CONFIDENCE,
            tokens_1.TokenType.CONTEXT,
            tokens_1.TokenType.RENDER,
            tokens_1.TokenType.ANALYZE,
            tokens_1.TokenType.EXPLAIN,
            tokens_1.TokenType.NEXT,
            tokens_1.TokenType.UNTIL,
            tokens_1.TokenType.IMPORT,
            tokens_1.TokenType.ASSUME,
            tokens_1.TokenType.SHOW,
            tokens_1.TokenType.QED,
            tokens_1.TokenType.THEORY,
            tokens_1.TokenType.PRINT,
            tokens_1.TokenType.SET,
            tokens_1.TokenType.IF,
            tokens_1.TokenType.FOR,
            tokens_1.TokenType.WHILE,
            tokens_1.TokenType.FN,
            tokens_1.TokenType.RETURN,
            tokens_1.TokenType.DEFINE,
            tokens_1.TokenType.UNFOLD,
            tokens_1.TokenType.FOLD,
            tokens_1.TokenType.SOURCE_KW,
            tokens_1.TokenType.INTERPRET,
            tokens_1.TokenType.GLOSSARY,
        ]);
        let parenDepth = 0;
        let braceDepth = 0;
        let bracketDepth = 0;
        // Consumir al menos el token ofensivo: si el error ocurrió en un token que
        // ES un statement-starter (p.ej. 'show' sin handler), no avanzar aquí
        // provocaría un loop infinito de throw→recover→throw que crece el array de
        // diagnósticos hasta OOM. Garantizamos progreso saltando el primer token.
        if (!s.isAtEnd()) {
            s.advance();
        }
        while (!s.isAtEnd()) {
            if (s.checkType(tokens_1.TokenType.NEWLINE) &&
                parenDepth === 0 &&
                braceDepth === 0 &&
                bracketDepth === 0) {
                s.skipNewlines();
                return;
            }
            if (parenDepth === 0 &&
                braceDepth === 0 &&
                bracketDepth === 0 &&
                statementStarters.has(s.current().type)) {
                return;
            }
            if (s.checkType(tokens_1.TokenType.LPAREN))
                parenDepth += 1;
            else if (s.checkType(tokens_1.TokenType.RPAREN))
                parenDepth = Math.max(0, parenDepth - 1);
            else if (s.checkType(tokens_1.TokenType.LBRACE))
                braceDepth += 1;
            else if (s.checkType(tokens_1.TokenType.RBRACE))
                braceDepth = Math.max(0, braceDepth - 1);
            else if (s.checkType(tokens_1.TokenType.LBRACKET) || s.checkType(tokens_1.TokenType.LBRACKET_DOUBLE)) {
                bracketDepth += 1;
            }
            else if (s.checkType(tokens_1.TokenType.RBRACKET) || s.checkType(tokens_1.TokenType.RBRACKET_DOUBLE)) {
                bracketDepth = Math.max(0, bracketDepth - 1);
            }
            s.advance();
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map