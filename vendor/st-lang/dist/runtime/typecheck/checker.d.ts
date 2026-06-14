import { BaseASTVisitor } from '../../ast/visitor';
import type { Statement, Program } from '../../ast/nodes';
import type { LogicDeclNode, AxiomDeclNode, TheoremDeclNode, DeriveCmdNode, CheckValidCmdNode, CheckSatisfiableCmdNode, CheckEquivalentCmdNode, ProveCmdNode, CountermodelCmdNode, TruthTableCmdNode, LetDeclNode, AnalyzeCmdNode, ExplainCmdNode, ImportDeclNode, ProofBlockNode, TheoryDeclNode, IfStmtNode, ForStmtNode, WhileStmtNode, FnDeclNode, ReturnStmtNode, FnCallNode, ExportDeclNode, DefineDeclNode, UnfoldCmdNode, FoldCmdNode, InterpretCmdNode } from '../../ast/nodes';
import type { TypeError, ProfileName } from './types';
export declare class TypeChecker extends BaseASTVisitor<TypeError[]> {
    private profile;
    private scope;
    /** Axioms y teoremas declarados (nombres) — para duplicados */
    private axiomNames;
    private theoremNames;
    /** Imports vistos en este programa (para TC007) */
    private importsSeen;
    /** Nombre del archivo actual */
    private file;
    constructor(profile?: ProfileName, file?: string);
    protected defaultResult(_node: Statement): TypeError[];
    private err;
    /** Todos los nombres declarados en el scope actual (para sugerencias) */
    private allDeclaredNames;
    /** Comprueba si el perfil actual es modal */
    private isModalProfile;
    /** Comprueba si el perfil actual es temporal */
    private isTemporalProfile;
    /** Comprueba si el perfil actual soporta FO (cuantificadores) */
    private isFirstOrderProfile;
    /**
     * Recorre una Formula recursivamente buscando errores.
     * Devuelve lista de errores encontrados.
     */
    private checkFormula;
    /**
     * Visita recursivamente una lista de statements en un scope dado.
     */
    private visitStatements;
    visitLogicDecl(node: LogicDeclNode): TypeError[];
    visitAxiomDecl(node: AxiomDeclNode): TypeError[];
    visitTheoremDecl(node: TheoremDeclNode): TypeError[];
    visitDeriveCmd(node: DeriveCmdNode): TypeError[];
    visitCheckValidCmd(node: CheckValidCmdNode): TypeError[];
    visitCheckSatisfiableCmd(node: CheckSatisfiableCmdNode): TypeError[];
    visitCheckEquivalentCmd(node: CheckEquivalentCmdNode): TypeError[];
    visitProveCmd(node: ProveCmdNode): TypeError[];
    visitCountermodelCmd(node: CountermodelCmdNode): TypeError[];
    visitTruthTableCmd(node: TruthTableCmdNode): TypeError[];
    visitLetDecl(node: LetDeclNode): TypeError[];
    visitAnalyzeCmd(node: AnalyzeCmdNode): TypeError[];
    visitExplainCmd(node: ExplainCmdNode): TypeError[];
    visitImportDecl(node: ImportDeclNode): TypeError[];
    visitProofBlock(node: ProofBlockNode): TypeError[];
    visitTheoryDecl(node: TheoryDeclNode): TypeError[];
    visitIfStmt(node: IfStmtNode): TypeError[];
    visitForStmt(node: ForStmtNode): TypeError[];
    visitWhileStmt(node: WhileStmtNode): TypeError[];
    visitFnDecl(node: FnDeclNode): TypeError[];
    visitReturnStmt(node: ReturnStmtNode): TypeError[];
    visitFnCall(node: FnCallNode): TypeError[];
    visitExportDecl(node: ExportDeclNode): TypeError[];
    visitDefineDecl(node: DefineDeclNode): TypeError[];
    visitUnfoldCmd(node: UnfoldCmdNode): TypeError[];
    visitFoldCmd(node: FoldCmdNode): TypeError[];
    visitInterpretCmd(node: InterpretCmdNode): TypeError[];
}
/**
 * Ejecuta el type-checker estático sobre un Program ya parseado.
 *
 * @param program AST del programa ST
 * @param profile Nombre del perfil activo (puede estar en el AST como logic_decl)
 * @param file    Nombre del archivo (para TC007)
 * @returns Lista de TypeError[]  — vacía si no hay errores
 */
export declare function typeCheck(program: Program, profile?: ProfileName, file?: string): TypeError[];
//# sourceMappingURL=checker.d.ts.map