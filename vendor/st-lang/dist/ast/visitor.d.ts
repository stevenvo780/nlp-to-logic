import { Statement, Program, LogicDeclNode, AxiomDeclNode, TheoremDeclNode, DeriveCmdNode, CheckValidCmdNode, CheckSatisfiableCmdNode, CheckEquivalentCmdNode, ProveCmdNode, CountermodelCmdNode, TruthTableCmdNode, LetDeclNode, ClaimDeclNode, SupportDeclNode, ConfidenceDeclNode, ContextDeclNode, RenderCmdNode, AnalyzeCmdNode, ExplainCmdNode, ImportDeclNode, ProofBlockNode, TheoryDeclNode, PrintCmdNode, SetCmdNode, IfStmtNode, ForStmtNode, WhileStmtNode, FnDeclNode, ReturnStmtNode, FnCallNode, ExportDeclNode, DefineDeclNode, UnfoldCmdNode, FoldCmdNode, SourceDeclNode, InterpretCmdNode, GlossaryCmdNode } from './nodes';
export interface ASTVisitor<T> {
    visitLogicDecl(node: LogicDeclNode): T;
    visitAxiomDecl(node: AxiomDeclNode): T;
    visitTheoremDecl(node: TheoremDeclNode): T;
    visitDeriveCmd(node: DeriveCmdNode): T;
    visitCheckValidCmd(node: CheckValidCmdNode): T;
    visitCheckSatisfiableCmd(node: CheckSatisfiableCmdNode): T;
    visitCheckEquivalentCmd(node: CheckEquivalentCmdNode): T;
    visitProveCmd(node: ProveCmdNode): T;
    visitCountermodelCmd(node: CountermodelCmdNode): T;
    visitTruthTableCmd(node: TruthTableCmdNode): T;
    visitLetDecl(node: LetDeclNode): T;
    visitClaimDecl(node: ClaimDeclNode): T;
    visitSupportDecl(node: SupportDeclNode): T;
    visitConfidenceDecl(node: ConfidenceDeclNode): T;
    visitContextDecl(node: ContextDeclNode): T;
    visitRenderCmd(node: RenderCmdNode): T;
    visitAnalyzeCmd(node: AnalyzeCmdNode): T;
    visitExplainCmd(node: ExplainCmdNode): T;
    visitImportDecl(node: ImportDeclNode): T;
    visitProofBlock(node: ProofBlockNode): T;
    visitTheoryDecl(node: TheoryDeclNode): T;
    visitPrintCmd(node: PrintCmdNode): T;
    visitSetCmd(node: SetCmdNode): T;
    visitIfStmt(node: IfStmtNode): T;
    visitForStmt(node: ForStmtNode): T;
    visitWhileStmt(node: WhileStmtNode): T;
    visitFnDecl(node: FnDeclNode): T;
    visitReturnStmt(node: ReturnStmtNode): T;
    visitFnCall(node: FnCallNode): T;
    visitExportDecl(node: ExportDeclNode): T;
    visitDefineDecl(node: DefineDeclNode): T;
    visitUnfoldCmd(node: UnfoldCmdNode): T;
    visitFoldCmd(node: FoldCmdNode): T;
    visitSourceDecl(node: SourceDeclNode): T;
    visitInterpretCmd(node: InterpretCmdNode): T;
    visitGlossaryCmd(node: GlossaryCmdNode): T;
}
/**
 * Dispatch tipado: rutea un `Statement` al metodo correspondiente del visitor.
 * Exhaustivo por discriminated union — si se agrega un kind nuevo,
 * TypeScript marca el switch como incompleto.
 */
export declare function visit<T>(node: Statement, visitor: ASTVisitor<T>): T;
/**
 * Recorre todos los statements de un programa aplicando el visitor.
 * Devuelve la lista de resultados.
 */
export declare function visitProgram<T>(program: Program, visitor: ASTVisitor<T>): T[];
/**
 * Visitor base con default a `undefined`. Subclases sobrescriben solo
 * los metodos que les interesan. Util para herramientas que solo se
 * preocupan por algunos kinds (ej: linter que solo mira theory_decl).
 */
export declare abstract class BaseASTVisitor<T> implements ASTVisitor<T> {
    protected abstract defaultResult(node: Statement): T;
    visitLogicDecl(node: LogicDeclNode): T;
    visitAxiomDecl(node: AxiomDeclNode): T;
    visitTheoremDecl(node: TheoremDeclNode): T;
    visitDeriveCmd(node: DeriveCmdNode): T;
    visitCheckValidCmd(node: CheckValidCmdNode): T;
    visitCheckSatisfiableCmd(node: CheckSatisfiableCmdNode): T;
    visitCheckEquivalentCmd(node: CheckEquivalentCmdNode): T;
    visitProveCmd(node: ProveCmdNode): T;
    visitCountermodelCmd(node: CountermodelCmdNode): T;
    visitTruthTableCmd(node: TruthTableCmdNode): T;
    visitLetDecl(node: LetDeclNode): T;
    visitClaimDecl(node: ClaimDeclNode): T;
    visitSupportDecl(node: SupportDeclNode): T;
    visitConfidenceDecl(node: ConfidenceDeclNode): T;
    visitContextDecl(node: ContextDeclNode): T;
    visitRenderCmd(node: RenderCmdNode): T;
    visitAnalyzeCmd(node: AnalyzeCmdNode): T;
    visitExplainCmd(node: ExplainCmdNode): T;
    visitImportDecl(node: ImportDeclNode): T;
    visitProofBlock(node: ProofBlockNode): T;
    visitTheoryDecl(node: TheoryDeclNode): T;
    visitPrintCmd(node: PrintCmdNode): T;
    visitSetCmd(node: SetCmdNode): T;
    visitIfStmt(node: IfStmtNode): T;
    visitForStmt(node: ForStmtNode): T;
    visitWhileStmt(node: WhileStmtNode): T;
    visitFnDecl(node: FnDeclNode): T;
    visitReturnStmt(node: ReturnStmtNode): T;
    visitFnCall(node: FnCallNode): T;
    visitExportDecl(node: ExportDeclNode): T;
    visitDefineDecl(node: DefineDeclNode): T;
    visitUnfoldCmd(node: UnfoldCmdNode): T;
    visitFoldCmd(node: FoldCmdNode): T;
    visitSourceDecl(node: SourceDeclNode): T;
    visitInterpretCmd(node: InterpretCmdNode): T;
    visitGlossaryCmd(node: GlossaryCmdNode): T;
}
//# sourceMappingURL=visitor.d.ts.map