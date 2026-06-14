import { ProtocolRequest, ProtocolResponse } from '../types';
export declare class ProtocolHandler {
    handle(request: ProtocolRequest): ProtocolResponse;
    private handleParse;
    private handleCheck;
    private handleRun;
    private handleHover;
    /** Extrae la palabra (identificador, con soporte dot notation) en la posición de columna dada */
    private getWordAtColumn;
    private getStaticHoverInfo;
    private handleSymbols;
    private handleGotoDefinition;
    private handleCompletion;
    private handleRender;
    private getStatementHoverInfo;
    private renderOutput;
    private requireParamsObject;
    private requireStringParam;
    private optionalStringParam;
    private requireIntegerParam;
}
//# sourceMappingURL=handler.d.ts.map