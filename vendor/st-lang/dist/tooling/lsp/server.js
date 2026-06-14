"use strict";
// ============================================================
// ST LSP — Server v1
// ============================================================
//
// Soporta JSON-RPC sobre stdin/stdout con framing Content-Length.
// Implementa textDocument/didOpen,didChange,didSave,didClose,
// hover, definition, completion y publishDiagnostics.
Object.defineProperty(exports, "__esModule", { value: true });
exports.STLanguageServer = void 0;
const api_1 = require("../../api");
const typecheck_1 = require("../../runtime/typecheck");
const protocol_1 = require("./protocol");
const types_1 = require("./types");
const SERVER_NAME = 'st-lsp';
const SERVER_VERSION = '1.0.0';
const DIAGNOSTICS_SOURCE = 'st';
/**
 * Implementa el Language Server Protocol mínimo para archivos `.st`.
 *
 * Diseñado para que la lógica de dispatch sea testeable sin streams: usa
 * `dispatch()` directamente o llama `listen(stdin, stdout)` para correrlo
 * conectado a procesos.
 */
class STLanguageServer {
    documents = new Map();
    initialized = false;
    shutdownRequested = false;
    emit;
    constructor(emit) {
        this.emit = emit ?? (() => undefined);
    }
    /** Conecta el server a streams (típicamente process.stdin / process.stdout). */
    listen(stdin, stdout) {
        const sendToStream = (message) => {
            stdout.write((0, protocol_1.encodeMessage)(message));
        };
        // Re-cableamos el sink: tanto las respuestas directas como las
        // notificaciones que el server emite (p.ej. publishDiagnostics) deben
        // salir por el mismo stdout.
        this.emit = sendToStream;
        let buffer = Buffer.alloc(0);
        stdin.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
            const { messages, remainder } = (0, protocol_1.parseFrames)(buffer);
            buffer = remainder;
            for (const message of messages) {
                const response = this.dispatch(message);
                if (response)
                    sendToStream(response);
            }
        });
    }
    /**
     * Procesa un mensaje entrante. Devuelve la respuesta (para requests) o
     * `null` (para notificaciones o cuando el método no produce respuesta).
     * Las notificaciones emitidas como efecto (publishDiagnostics) salen
     * por el callback `emit` configurado en el constructor o por `listen()`.
     */
    dispatch(message) {
        if ((0, protocol_1.isRequest)(message)) {
            return this.handleRequest(message);
        }
        if ((0, protocol_1.isNotification)(message)) {
            this.handleNotification(message);
            return null;
        }
        return null;
    }
    // ── Request handlers ─────────────────────────────────────
    handleRequest(request) {
        try {
            switch (request.method) {
                case 'initialize':
                    return this.respond(request.id, this.handleInitialize());
                case 'initialized':
                    // Es una notificación en spec, pero algunos clientes la mandan como
                    // request; aceptamos ambos.
                    return this.respond(request.id, null);
                case 'shutdown':
                    this.shutdownRequested = true;
                    return this.respond(request.id, null);
                case 'exit':
                    return this.respond(request.id, null);
                case 'textDocument/hover':
                    return this.respond(request.id, this.handleHover(request.params));
                case 'textDocument/definition':
                    return this.respond(request.id, this.handleDefinition(request.params));
                case 'textDocument/completion':
                    return this.respond(request.id, this.handleCompletion(request.params));
                case 'textDocument/documentSymbol':
                    return this.respond(request.id, this.handleDocumentSymbol(request.params));
                default:
                    return this.error(request.id, types_1.JSON_RPC_ERROR_CODES.MethodNotFound, `Método no soportado: ${request.method}`);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return this.error(request.id, types_1.JSON_RPC_ERROR_CODES.InternalError, message);
        }
    }
    handleInitialize() {
        this.initialized = true;
        const capabilities = {
            textDocumentSync: types_1.TextDocumentSyncKind.Full,
            hoverProvider: true,
            definitionProvider: true,
            completionProvider: {
                triggerCharacters: [' ', '.', '(', '{', ':'],
                resolveProvider: false,
            },
            documentSymbolProvider: true,
        };
        return { capabilities, serverInfo: { name: SERVER_NAME, version: SERVER_VERSION } };
    }
    handleHover(params) {
        const tp = parseTextDocumentPosition(params);
        if (!tp)
            return null;
        const doc = this.documents.get(tp.uri);
        if (!doc)
            return null;
        // Convertimos LSP (0-based) → ST (1-based).
        const info = (0, api_1.hover)(doc.text, tp.position.line + 1, tp.position.character + 1, tp.uri);
        if (!info)
            return null;
        const range = info.range
            ? toLspRange({
                line: info.range.line,
                column: info.range.column,
                endLine: info.range.endLine,
                endColumn: info.range.endColumn,
            })
            : undefined;
        return {
            contents: { kind: 'markdown', value: info.content },
            range,
        };
    }
    handleDefinition(params) {
        const tp = parseTextDocumentPosition(params);
        if (!tp)
            return null;
        const doc = this.documents.get(tp.uri);
        if (!doc)
            return null;
        const word = getWordAtPosition(doc.text, tp.position);
        if (!word)
            return null;
        const loc = (0, api_1.gotoDefinition)(doc.text, word, tp.uri);
        if (!loc)
            return null;
        const range = toLspRange({
            line: loc.line,
            column: loc.column,
            endLine: loc.endLine,
            endColumn: loc.endColumn,
        });
        return { uri: tp.uri, range };
    }
    handleCompletion(params) {
        // Por ahora no usamos la posición para filtrar — devolvemos todas las
        // keywords/snippets de ST y dejamos que el cliente filtre por prefijo.
        void params;
        const items = (0, api_1.completion)().map(toLspCompletionItem);
        // Añadimos los operadores Unicode comunes que el agente puede querer
        // insertar y que no vienen en la lista del handler (handleCompletion del
        // ProtocolHandler ya cubre keywords y snippets; sumamos operadores).
        for (const op of UNICODE_OPERATORS) {
            items.push({
                label: op.label,
                kind: types_1.CompletionItemKind.Operator,
                detail: op.detail,
                insertText: op.label,
                insertTextFormat: types_1.InsertTextFormat.PlainText,
            });
        }
        return { items, isIncomplete: false };
    }
    handleDocumentSymbol(params) {
        if (!isObject(params))
            return [];
        const td = params.textDocument;
        if (!isObject(td) || typeof td.uri !== 'string')
            return [];
        const uri = td.uri;
        const doc = this.documents.get(uri);
        if (!doc)
            return [];
        return (0, api_1.symbols)(doc.text, uri).map((s) => ({
            name: s.name,
            kind: mapSymbolKind(s.kind),
            detail: s.detail,
            location: {
                uri,
                range: toLspRange({
                    line: s.location.line,
                    column: s.location.column,
                    endLine: s.location.endLine,
                    endColumn: s.location.endColumn,
                }),
            },
        }));
    }
    // ── Notification handlers ────────────────────────────────
    handleNotification(notification) {
        switch (notification.method) {
            case 'initialized':
                // No-op: confirmación del cliente tras initialize.
                break;
            case 'textDocument/didOpen':
                this.onDidOpen(notification.params);
                break;
            case 'textDocument/didChange':
                this.onDidChange(notification.params);
                break;
            case 'textDocument/didSave':
                this.onDidSave(notification.params);
                break;
            case 'textDocument/didClose':
                this.onDidClose(notification.params);
                break;
            case 'exit':
                // Liberamos estado: en proceso real esto cierra el daemon.
                this.documents.clear();
                break;
            default:
                // Ignoramos otras notificaciones (workspace/didChangeConfiguration, etc).
                break;
        }
    }
    onDidOpen(params) {
        if (!isObject(params))
            return;
        const td = params.textDocument;
        if (!isTextDocumentItem(td))
            return;
        this.documents.set(td.uri, { uri: td.uri, version: td.version, text: td.text });
        this.publishDiagnostics(td.uri, td.version, td.text);
    }
    onDidChange(params) {
        if (!isObject(params))
            return;
        const td = params.textDocument;
        const changes = params.contentChanges;
        if (!isVersionedTextDocumentIdentifier(td))
            return;
        if (!Array.isArray(changes) || changes.length === 0)
            return;
        const existing = this.documents.get(td.uri);
        if (!existing)
            return;
        // v1: solo Full sync. Tomamos el último cambio con `text` completo.
        const last = changes[changes.length - 1];
        if (typeof last.text !== 'string')
            return;
        existing.text = last.text;
        existing.version = td.version;
        this.publishDiagnostics(td.uri, td.version, last.text);
    }
    onDidSave(params) {
        if (!isObject(params))
            return;
        const td = params.textDocument;
        if (!isObject(td) || typeof td.uri !== 'string')
            return;
        const uri = td.uri;
        const doc = this.documents.get(uri);
        if (!doc)
            return;
        this.publishDiagnostics(uri, doc.version, doc.text);
    }
    onDidClose(params) {
        if (!isObject(params))
            return;
        const td = params.textDocument;
        if (!isObject(td) || typeof td.uri !== 'string')
            return;
        const uri = td.uri;
        this.documents.delete(uri);
        // Limpiamos diagnostics del cliente.
        this.publish({
            jsonrpc: '2.0',
            method: 'textDocument/publishDiagnostics',
            params: { uri, diagnostics: [] },
        });
    }
    // ── Helpers ──────────────────────────────────────────────
    publishDiagnostics(uri, version, text) {
        const diagnostics = [];
        // 1) Parse diagnostics (errores de sintaxis + warnings/info del parser).
        const parsed = (0, api_1.parse)(text, uri);
        for (const d of parsed.diagnostics) {
            if (d.severity === 'error' || d.severity === 'warning') {
                diagnostics.push(toLspDiagnostic(d));
            }
        }
        // 2) Type-check diagnostics si el parse fue exitoso. Usamos el perfil
        //    declarado en el script (statement `logic X.Y`) o cadena vacía.
        if (parsed.ok && parsed.program) {
            const profile = inferProfile(parsed.program);
            try {
                const typeErrors = (0, typecheck_1.typeCheck)(parsed.program, profile, uri);
                for (const te of typeErrors) {
                    diagnostics.push(typeErrorToLspDiagnostic(te));
                }
            }
            catch {
                // Si el typeCheck falla en algún statement exótico, no bloqueamos
                // el flujo de diagnostics — sólo perdemos esa ronda.
            }
        }
        this.publish({
            jsonrpc: '2.0',
            method: 'textDocument/publishDiagnostics',
            params: { uri, version, diagnostics },
        });
    }
    publish(notification) {
        this.emit(notification);
    }
    respond(id, result) {
        return { jsonrpc: '2.0', id, result };
    }
    error(id, code, message) {
        return { jsonrpc: '2.0', id, error: { code, message } };
    }
    /** True si el cliente ya envió `initialize`. Útil para tests. */
    isInitialized() {
        return this.initialized;
    }
    /** True si el cliente pidió shutdown. */
    isShutdownRequested() {
        return this.shutdownRequested;
    }
}
exports.STLanguageServer = STLanguageServer;
// ── Validadores de params ───────────────────────────────────
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function isTextDocumentItem(value) {
    if (!isObject(value))
        return false;
    return (typeof value.uri === 'string' &&
        typeof value.languageId === 'string' &&
        typeof value.version === 'number' &&
        typeof value.text === 'string');
}
function isVersionedTextDocumentIdentifier(value) {
    if (!isObject(value))
        return false;
    return typeof value.uri === 'string' && typeof value.version === 'number';
}
function parseTextDocumentPosition(params) {
    if (!isObject(params))
        return null;
    const td = params.textDocument;
    const pos = params.position;
    if (!isObject(td) || typeof td.uri !== 'string')
        return null;
    if (!isObject(pos))
        return null;
    const line = pos.line;
    const character = pos.character;
    if (typeof line !== 'number' || typeof character !== 'number')
        return null;
    return { uri: td.uri, position: { line, character } };
}
function toLspRange(loc) {
    const startLine = Math.max(0, loc.line - 1);
    const startCol = Math.max(0, loc.column - 1);
    const endLine = loc.endLine !== undefined ? Math.max(0, loc.endLine - 1) : startLine;
    const endCol = loc.endColumn !== undefined ? Math.max(0, loc.endColumn - 1) : startCol + 1;
    return {
        start: { line: startLine, character: startCol },
        end: { line: endLine, character: endCol },
    };
}
function toLspDiagnostic(d) {
    const start = {
        line: Math.max(0, (d.line ?? 1) - 1),
        character: Math.max(0, (d.column ?? 1) - 1),
    };
    const end = {
        line: Math.max(0, (d.endLine ?? d.line ?? 1) - 1),
        character: Math.max(start.character + 1, (d.endColumn ?? (d.column ?? 1) + 1) - 1),
    };
    const messageWithSuggestion = d.suggestion
        ? `${d.message}\n\nSugerencia: ${d.suggestion}`
        : d.message;
    return {
        range: { start, end },
        severity: mapDiagnosticSeverity(d.severity),
        code: d.code,
        source: DIAGNOSTICS_SOURCE,
        message: messageWithSuggestion,
    };
}
function mapDiagnosticSeverity(s) {
    switch (s) {
        case 'error':
            return types_1.DiagnosticSeverity.Error;
        case 'warning':
            return types_1.DiagnosticSeverity.Warning;
        case 'info':
            return types_1.DiagnosticSeverity.Information;
        case 'hint':
            return types_1.DiagnosticSeverity.Hint;
        default:
            return types_1.DiagnosticSeverity.Information;
    }
}
function toLspCompletionItem(item) {
    const isSnippet = /\$\{[^}]+\}/.test(item.insertText);
    return {
        label: item.label,
        kind: mapCompletionKind(item.kind),
        detail: item.detail,
        documentation: item.documentation ? { kind: 'markdown', value: item.documentation } : undefined,
        insertText: item.insertText,
        insertTextFormat: isSnippet ? types_1.InsertTextFormat.Snippet : types_1.InsertTextFormat.PlainText,
    };
}
function mapCompletionKind(kind) {
    switch (kind) {
        case 'keyword':
            return types_1.CompletionItemKind.Keyword;
        case 'snippet':
            return types_1.CompletionItemKind.Snippet;
        case 'value':
            return types_1.CompletionItemKind.Value;
        case 'function':
            return types_1.CompletionItemKind.Function;
        case 'variable':
            return types_1.CompletionItemKind.Variable;
        case 'operator':
            return types_1.CompletionItemKind.Operator;
        default:
            return types_1.CompletionItemKind.Text;
    }
}
function mapSymbolKind(kind) {
    // SymbolKind LSP: 1=File, 5=Class, 6=Method, 7=Property, 11=Interface,
    // 12=Function, 13=Variable, 14=Constant, ...
    switch (kind) {
        case 'axiom':
            return 14; // Constant
        case 'theorem':
            return 11; // Interface
        case 'claim':
            return 13; // Variable
        case 'definition':
            return 6; // Method
        case 'function':
            return 12; // Function
        case 'passage':
            return 7; // Property
        case 'source':
            return 1; // File
        case 'interpretation':
            return 13; // Variable
        case 'formula':
            return 13;
        case 'variable':
            return 13;
        default:
            return 13;
    }
}
// ── Helpers de palabras ─────────────────────────────────────
const WORD_CHAR = /[a-zA-Z0-9_.]/;
function getWordAtPosition(text, position) {
    const lines = text.split('\n');
    if (position.line < 0 || position.line >= lines.length)
        return null;
    const line = lines[position.line];
    const col = position.character;
    if (col < 0 || col > line.length)
        return null;
    let start = col;
    while (start > 0 && WORD_CHAR.test(line[start - 1]))
        start--;
    let end = col;
    while (end < line.length && WORD_CHAR.test(line[end]))
        end++;
    const word = line.substring(start, end).replace(/^\.+|\.+$/g, '');
    return word.length > 0 ? word : null;
}
// ── Inferencia de perfil y conversión de TypeError ────────
function inferProfile(program) {
    for (const stmt of program.statements) {
        if (stmt.kind === 'logic_decl') {
            return stmt.profile;
        }
    }
    return '';
}
function typeErrorToLspDiagnostic(te) {
    const start = {
        line: Math.max(0, te.location.line - 1),
        character: Math.max(0, te.location.column - 1),
    };
    const endLine = te.location.endLine !== undefined ? Math.max(0, te.location.endLine - 1) : start.line;
    const endCol = te.location.endColumn !== undefined
        ? Math.max(0, te.location.endColumn - 1)
        : start.character + 1;
    const msg = te.suggestion ? `${te.message}\n\nSugerencia: ${te.suggestion}` : te.message;
    return {
        range: { start, end: { line: endLine, character: endCol } },
        severity: te.severity === 'error' ? types_1.DiagnosticSeverity.Error : types_1.DiagnosticSeverity.Warning,
        code: te.code,
        source: DIAGNOSTICS_SOURCE,
        message: msg,
    };
}
// ── Operadores Unicode adicionales para completion ─────────
const UNICODE_OPERATORS = [
    { label: '∧', detail: 'Conjunción (and)' },
    { label: '∨', detail: 'Disyunción (or)' },
    { label: '→', detail: 'Implicación' },
    { label: '¬', detail: 'Negación' },
    { label: '↔', detail: 'Bicondicional' },
    { label: '∀', detail: 'Cuantificador universal' },
    { label: '∃', detail: 'Cuantificador existencial' },
    { label: '□', detail: 'Necesidad modal' },
    { label: '◇', detail: 'Posibilidad modal' },
];
//# sourceMappingURL=server.js.map