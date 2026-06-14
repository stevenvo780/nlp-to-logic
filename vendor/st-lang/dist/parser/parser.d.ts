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
import { Diagnostic } from '../types';
import { Program } from '../ast/nodes';
export declare class Parser {
    private state;
    private initialProfile;
    constructor(file?: string, profile?: string);
    get diagnostics(): Diagnostic[];
    set diagnostics(value: Diagnostic[]);
    parse(source: string): Program;
    private parseStatement;
    private parseLogicDecl;
    private parseAxiomDecl;
    private parseTheoremDecl;
    private parseDeriveCmd;
    private parseCheckCmd;
    private parseProveCmd;
    private parseCountermodelCmd;
    private parseTruthTableCmd;
    private parseLetDecl;
    private parseClaimDecl;
    private parseSupportDecl;
    private parseConfidenceDecl;
    private parseContextDecl;
    private parseRenderCmd;
    private parseAnalyzeCmd;
    private parseExplainCmd;
    private canStartActionExpr;
    private parseActionExpr;
    private parseImportDecl;
    private parseProofBlock;
    private parseShowStatement;
    private parseTheoryDecl;
    private parsePrintCmd;
    private parseSetCmd;
    private parseIfStmt;
    private checkElseIf;
    private parseConditionBranch;
    private parseConditionKeyword;
    private parseForStmt;
    private parseWhileStmt;
    private parseFnDecl;
    private parseReturnStmt;
    private parseExportDecl;
    private parseDefineDecl;
    private parseUnfoldCmd;
    private parseFoldCmd;
    private parseSourceDecl;
    private parseInterpretCmd;
    private parseGlossaryCmd;
    private parseFnCall;
    private parseMemberFnCall;
    private parseBlock;
    private parseFormula;
    private describeStatementContext;
    private advanceToNextStatement;
}
//# sourceMappingURL=parser.d.ts.map