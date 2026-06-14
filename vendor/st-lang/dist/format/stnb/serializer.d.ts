/**
 * Serializer del formato .stnb — Notebook → JSON string
 */
import type { Notebook } from './types';
/**
 * Serializa un Notebook a JSON string con indentación de 2 espacios.
 * El output es válido para parseNotebook().
 */
export declare function serializeNotebook(notebook: Notebook): string;
/**
 * Serializa a JSON compacto (sin indentación) para almacenamiento eficiente.
 */
export declare function serializeNotebookCompact(notebook: Notebook): string;
//# sourceMappingURL=serializer.d.ts.map