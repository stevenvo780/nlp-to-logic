"use strict";
// ============================================================
// ST AST — Visitor pattern tipado
// ============================================================
//
// Define `ASTVisitor<T>` y un dispatcher `visit(node, visitor)`
// para consumir el AST sin escribir un switch enorme cada vez.
// Es opcional: el interprete actual sigue usando switch directo.
// Este modulo existe para que consumidores nuevos (linter,
// formatter, type-checker, etc.) tengan una API uniforme.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseASTVisitor = void 0;
exports.visit = visit;
exports.visitProgram = visitProgram;
/**
 * Dispatch tipado: rutea un `Statement` al metodo correspondiente del visitor.
 * Exhaustivo por discriminated union — si se agrega un kind nuevo,
 * TypeScript marca el switch como incompleto.
 */
function visit(node, visitor) {
    switch (node.kind) {
        case 'logic_decl':
            return visitor.visitLogicDecl(node);
        case 'axiom_decl':
            return visitor.visitAxiomDecl(node);
        case 'theorem_decl':
            return visitor.visitTheoremDecl(node);
        case 'derive_cmd':
            return visitor.visitDeriveCmd(node);
        case 'check_valid_cmd':
            return visitor.visitCheckValidCmd(node);
        case 'check_satisfiable_cmd':
            return visitor.visitCheckSatisfiableCmd(node);
        case 'check_equivalent_cmd':
            return visitor.visitCheckEquivalentCmd(node);
        case 'prove_cmd':
            return visitor.visitProveCmd(node);
        case 'countermodel_cmd':
            return visitor.visitCountermodelCmd(node);
        case 'truth_table_cmd':
            return visitor.visitTruthTableCmd(node);
        case 'let_decl':
            return visitor.visitLetDecl(node);
        case 'claim_decl':
            return visitor.visitClaimDecl(node);
        case 'support_decl':
            return visitor.visitSupportDecl(node);
        case 'confidence_decl':
            return visitor.visitConfidenceDecl(node);
        case 'context_decl':
            return visitor.visitContextDecl(node);
        case 'render_cmd':
            return visitor.visitRenderCmd(node);
        case 'analyze_cmd':
            return visitor.visitAnalyzeCmd(node);
        case 'explain_cmd':
            return visitor.visitExplainCmd(node);
        case 'import_decl':
            return visitor.visitImportDecl(node);
        case 'proof_block':
            return visitor.visitProofBlock(node);
        case 'theory_decl':
            return visitor.visitTheoryDecl(node);
        case 'print_cmd':
            return visitor.visitPrintCmd(node);
        case 'set_cmd':
            return visitor.visitSetCmd(node);
        case 'if_stmt':
            return visitor.visitIfStmt(node);
        case 'for_stmt':
            return visitor.visitForStmt(node);
        case 'while_stmt':
            return visitor.visitWhileStmt(node);
        case 'fn_decl':
            return visitor.visitFnDecl(node);
        case 'return_stmt':
            return visitor.visitReturnStmt(node);
        case 'fn_call':
            return visitor.visitFnCall(node);
        case 'export_decl':
            return visitor.visitExportDecl(node);
        case 'define_decl':
            return visitor.visitDefineDecl(node);
        case 'unfold_cmd':
            return visitor.visitUnfoldCmd(node);
        case 'fold_cmd':
            return visitor.visitFoldCmd(node);
        case 'source_decl':
            return visitor.visitSourceDecl(node);
        case 'interpret_cmd':
            return visitor.visitInterpretCmd(node);
        case 'glossary_cmd':
            return visitor.visitGlossaryCmd(node);
        default: {
            const _exhaustive = node;
            throw new Error(`visit: kind no manejado en switch exhaustivo: ${JSON.stringify(_exhaustive)}`);
        }
    }
}
/**
 * Recorre todos los statements de un programa aplicando el visitor.
 * Devuelve la lista de resultados.
 */
function visitProgram(program, visitor) {
    return program.statements.map((stmt) => visit(stmt, visitor));
}
/**
 * Visitor base con default a `undefined`. Subclases sobrescriben solo
 * los metodos que les interesan. Util para herramientas que solo se
 * preocupan por algunos kinds (ej: linter que solo mira theory_decl).
 */
class BaseASTVisitor {
    visitLogicDecl(node) {
        return this.defaultResult(node);
    }
    visitAxiomDecl(node) {
        return this.defaultResult(node);
    }
    visitTheoremDecl(node) {
        return this.defaultResult(node);
    }
    visitDeriveCmd(node) {
        return this.defaultResult(node);
    }
    visitCheckValidCmd(node) {
        return this.defaultResult(node);
    }
    visitCheckSatisfiableCmd(node) {
        return this.defaultResult(node);
    }
    visitCheckEquivalentCmd(node) {
        return this.defaultResult(node);
    }
    visitProveCmd(node) {
        return this.defaultResult(node);
    }
    visitCountermodelCmd(node) {
        return this.defaultResult(node);
    }
    visitTruthTableCmd(node) {
        return this.defaultResult(node);
    }
    visitLetDecl(node) {
        return this.defaultResult(node);
    }
    visitClaimDecl(node) {
        return this.defaultResult(node);
    }
    visitSupportDecl(node) {
        return this.defaultResult(node);
    }
    visitConfidenceDecl(node) {
        return this.defaultResult(node);
    }
    visitContextDecl(node) {
        return this.defaultResult(node);
    }
    visitRenderCmd(node) {
        return this.defaultResult(node);
    }
    visitAnalyzeCmd(node) {
        return this.defaultResult(node);
    }
    visitExplainCmd(node) {
        return this.defaultResult(node);
    }
    visitImportDecl(node) {
        return this.defaultResult(node);
    }
    visitProofBlock(node) {
        return this.defaultResult(node);
    }
    visitTheoryDecl(node) {
        return this.defaultResult(node);
    }
    visitPrintCmd(node) {
        return this.defaultResult(node);
    }
    visitSetCmd(node) {
        return this.defaultResult(node);
    }
    visitIfStmt(node) {
        return this.defaultResult(node);
    }
    visitForStmt(node) {
        return this.defaultResult(node);
    }
    visitWhileStmt(node) {
        return this.defaultResult(node);
    }
    visitFnDecl(node) {
        return this.defaultResult(node);
    }
    visitReturnStmt(node) {
        return this.defaultResult(node);
    }
    visitFnCall(node) {
        return this.defaultResult(node);
    }
    visitExportDecl(node) {
        return this.defaultResult(node);
    }
    visitDefineDecl(node) {
        return this.defaultResult(node);
    }
    visitUnfoldCmd(node) {
        return this.defaultResult(node);
    }
    visitFoldCmd(node) {
        return this.defaultResult(node);
    }
    visitSourceDecl(node) {
        return this.defaultResult(node);
    }
    visitInterpretCmd(node) {
        return this.defaultResult(node);
    }
    visitGlossaryCmd(node) {
        return this.defaultResult(node);
    }
}
exports.BaseASTVisitor = BaseASTVisitor;
//# sourceMappingURL=visitor.js.map