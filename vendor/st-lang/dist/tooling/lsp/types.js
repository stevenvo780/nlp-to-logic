"use strict";
// ============================================================
// ST LSP — Tipos LSP minimos (sin dependencias externas)
// ============================================================
//
// Subconjunto del spec Language Server Protocol 3.17 suficiente
// para implementar el server v1 de ST. Las posiciones del LSP son
// 0-based (linea y character), mientras que el parser de ST emite
// posiciones 1-based — la conversion se hace explicitamente en server.ts.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDocumentSyncKind = exports.InsertTextFormat = exports.CompletionItemKind = exports.DiagnosticSeverity = exports.JSON_RPC_ERROR_CODES = void 0;
/** Códigos de error estándar JSON-RPC 2.0 y extensiones LSP (RequestCancelled). */
exports.JSON_RPC_ERROR_CODES = {
    ParseError: -32700,
    InvalidRequest: -32600,
    MethodNotFound: -32601,
    InvalidParams: -32602,
    InternalError: -32603,
    ServerNotInitialized: -32002,
    RequestCancelled: -32800,
};
// ── Diagnostics ──────────────────────────────────────────────
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 1] = "Error";
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 2] = "Warning";
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 3] = "Information";
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 4] = "Hint";
})(DiagnosticSeverity || (exports.DiagnosticSeverity = DiagnosticSeverity = {}));
// ── Completion ───────────────────────────────────────────────
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 1] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 2] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 3] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 4] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 5] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 6] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 7] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 8] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 9] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 10] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 11] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 12] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 13] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 14] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 15] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 16] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 17] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 18] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 19] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 20] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 21] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 22] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 23] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 24] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 25] = "TypeParameter";
})(CompletionItemKind || (exports.CompletionItemKind = CompletionItemKind = {}));
var InsertTextFormat;
(function (InsertTextFormat) {
    InsertTextFormat[InsertTextFormat["PlainText"] = 1] = "PlainText";
    InsertTextFormat[InsertTextFormat["Snippet"] = 2] = "Snippet";
})(InsertTextFormat || (exports.InsertTextFormat = InsertTextFormat = {}));
// ── Server capabilities ──────────────────────────────────────
var TextDocumentSyncKind;
(function (TextDocumentSyncKind) {
    TextDocumentSyncKind[TextDocumentSyncKind["None"] = 0] = "None";
    TextDocumentSyncKind[TextDocumentSyncKind["Full"] = 1] = "Full";
    TextDocumentSyncKind[TextDocumentSyncKind["Incremental"] = 2] = "Incremental";
})(TextDocumentSyncKind || (exports.TextDocumentSyncKind = TextDocumentSyncKind = {}));
//# sourceMappingURL=types.js.map