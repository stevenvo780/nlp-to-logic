"use strict";
/**
 * Executor del formato .stnb
 * Ejecuta cells de tipo "code" usando la API de ST y captura los outputs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeNotebook = executeNotebook;
exports.executeCell = executeCell;
const api_1 = require("../../api");
/**
 * Construye el fuente ST completo para una cell, prefijando el profile si corresponde.
 */
function buildCellSource(cell, defaultProfile) {
    const profile = cell.profile ?? defaultProfile;
    const profileLine = `logic ${profile}\n`;
    if (cell.source.trimStart().startsWith('logic ')) {
        return cell.source;
    }
    return profileLine + cell.source;
}
/**
 * Ejecuta todas las cells de tipo "code" de un notebook en orden.
 * Devuelve una copia del notebook con los outputs actualizados.
 */
function executeNotebook(notebook, options = {}) {
    const { stopOnError = false } = options;
    const errors = [];
    let cellsExecuted = 0;
    const updatedCells = notebook.cells.map((cell) => {
        if (cell.type !== 'code') {
            return cell;
        }
        const startTime = Date.now();
        let outputs = [];
        try {
            const source = buildCellSource(cell, notebook.metadata.profile);
            const result = (0, api_1.evaluate)(source);
            const executionTime = Date.now() - startTime;
            cellsExecuted++;
            if (result.ok) {
                outputs = [
                    {
                        type: 'result',
                        data: {
                            valid: true,
                            stdout: result.stdout,
                            results: result.results,
                        },
                        metadata: { executionTime },
                    },
                ];
            }
            else {
                const errorMsg = result.stderr || result.stdout || 'Unknown error';
                outputs = [
                    {
                        type: 'error',
                        data: {
                            valid: false,
                            message: errorMsg,
                            diagnostics: result.diagnostics,
                        },
                        metadata: { executionTime },
                    },
                ];
                errors.push({ cellId: cell.id, message: errorMsg });
                if (stopOnError) {
                    // return partial — this cell gets the error output but loop breaks after
                }
            }
        }
        catch (e) {
            const executionTime = Date.now() - startTime;
            const message = e.message;
            outputs = [
                {
                    type: 'error',
                    data: { valid: false, message },
                    metadata: { executionTime },
                },
            ];
            errors.push({ cellId: cell.id, message });
        }
        return { ...cell, outputs };
    });
    const updatedNotebook = {
        ...notebook,
        metadata: {
            ...notebook.metadata,
            updatedAt: new Date().toISOString(),
        },
        cells: updatedCells,
    };
    return { notebook: updatedNotebook, cellsExecuted, errors };
}
/**
 * Ejecuta una sola cell de código y devuelve sus outputs.
 */
function executeCell(cell, defaultProfile) {
    const startTime = Date.now();
    try {
        const source = buildCellSource(cell, defaultProfile);
        const result = (0, api_1.evaluate)(source);
        const executionTime = Date.now() - startTime;
        if (result.ok) {
            return [
                {
                    type: 'result',
                    data: { valid: true, stdout: result.stdout, results: result.results },
                    metadata: { executionTime },
                },
            ];
        }
        else {
            return [
                {
                    type: 'error',
                    data: {
                        valid: false,
                        message: result.stderr || result.stdout,
                        diagnostics: result.diagnostics,
                    },
                    metadata: { executionTime },
                },
            ];
        }
    }
    catch (e) {
        const executionTime = Date.now() - startTime;
        return [
            {
                type: 'error',
                data: { valid: false, message: e.message },
                metadata: { executionTime },
            },
        ];
    }
}
//# sourceMappingURL=executor.js.map