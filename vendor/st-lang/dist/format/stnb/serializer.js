"use strict";
/**
 * Serializer del formato .stnb — Notebook → JSON string
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeNotebook = serializeNotebook;
exports.serializeNotebookCompact = serializeNotebookCompact;
/**
 * Serializa un Notebook a JSON string con indentación de 2 espacios.
 * El output es válido para parseNotebook().
 */
function serializeNotebook(notebook) {
    return JSON.stringify(notebook, null, 2);
}
/**
 * Serializa a JSON compacto (sin indentación) para almacenamiento eficiente.
 */
function serializeNotebookCompact(notebook) {
    return JSON.stringify(notebook);
}
//# sourceMappingURL=serializer.js.map