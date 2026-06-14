import { JsonRpcRequest, JsonRpcNotification, JsonRpcResponse } from './types';
export type IncomingMessage = JsonRpcRequest | JsonRpcNotification | JsonRpcResponse;
export interface FramedParseResult {
    messages: IncomingMessage[];
    remainder: Buffer;
}
/**
 * Codifica un mensaje JSON-RPC con framing Content-Length de LSP.
 * Devuelve un Buffer listo para escribir a stdout.
 */
export declare function encodeMessage(message: JsonRpcResponse | JsonRpcNotification): Buffer;
/**
 * Acumula chunks entrantes y extrae todos los mensajes completos. Lo que
 * sobra (header parcial o body parcial) vuelve en `remainder` para reintentar
 * en la siguiente entrega.
 */
export declare function parseFrames(buffer: Buffer): FramedParseResult;
export declare function isRequest(message: IncomingMessage): message is JsonRpcRequest;
export declare function isNotification(message: IncomingMessage): message is JsonRpcNotification;
//# sourceMappingURL=protocol.d.ts.map