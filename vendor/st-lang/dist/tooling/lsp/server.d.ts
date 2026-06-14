import { Readable, Writable } from 'stream';
import { type IncomingMessage } from './protocol';
import { type JsonRpcNotification, type JsonRpcResponse } from './types';
export type OutgoingMessage = JsonRpcResponse | JsonRpcNotification;
/**
 * Implementa el Language Server Protocol mínimo para archivos `.st`.
 *
 * Diseñado para que la lógica de dispatch sea testeable sin streams: usa
 * `dispatch()` directamente o llama `listen(stdin, stdout)` para correrlo
 * conectado a procesos.
 */
export declare class STLanguageServer {
    private readonly documents;
    private initialized;
    private shutdownRequested;
    private emit;
    constructor(emit?: (message: OutgoingMessage) => void);
    /** Conecta el server a streams (típicamente process.stdin / process.stdout). */
    listen(stdin: Readable, stdout: Writable): void;
    /**
     * Procesa un mensaje entrante. Devuelve la respuesta (para requests) o
     * `null` (para notificaciones o cuando el método no produce respuesta).
     * Las notificaciones emitidas como efecto (publishDiagnostics) salen
     * por el callback `emit` configurado en el constructor o por `listen()`.
     */
    dispatch(message: IncomingMessage): JsonRpcResponse | null;
    private handleRequest;
    private handleInitialize;
    private handleHover;
    private handleDefinition;
    private handleCompletion;
    private handleDocumentSymbol;
    private handleNotification;
    private onDidOpen;
    private onDidChange;
    private onDidSave;
    private onDidClose;
    private publishDiagnostics;
    private publish;
    private respond;
    private error;
    /** True si el cliente ya envió `initialize`. Útil para tests. */
    isInitialized(): boolean;
    /** True si el cliente pidió shutdown. */
    isShutdownRequested(): boolean;
}
//# sourceMappingURL=server.d.ts.map