/**
 * Executor del formato .stnb
 * Ejecuta cells de tipo "code" usando la API de ST y captura los outputs.
 */
import type { Notebook, CodeCell, CellOutput } from './types';
export interface ExecuteOptions {
    /** Si es true, una cell con error detiene la ejecución. Default: false */
    stopOnError?: boolean;
    /** Timeout por cell en ms. Default: 5000 */
    cellTimeoutMs?: number;
}
export interface ExecuteResult {
    notebook: Notebook;
    cellsExecuted: number;
    errors: Array<{
        cellId: string;
        message: string;
    }>;
}
/**
 * Ejecuta todas las cells de tipo "code" de un notebook en orden.
 * Devuelve una copia del notebook con los outputs actualizados.
 */
export declare function executeNotebook(notebook: Notebook, options?: ExecuteOptions): ExecuteResult;
/**
 * Ejecuta una sola cell de código y devuelve sus outputs.
 */
export declare function executeCell(cell: CodeCell, defaultProfile: string): CellOutput[];
//# sourceMappingURL=executor.d.ts.map