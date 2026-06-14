import type { SmtCommand, SmtSort, SmtTerm } from './ast';
/** Cita un identificador si no es un simple-symbol válido. */
export declare function quoteSymbol(name: string): string;
/** Emite un sort SMT-LIB. */
export declare function emitSort(sort: SmtSort): string;
/** Emite un término SMT-LIB. */
export declare function emitTerm(term: SmtTerm): string;
/** Emite un único comando SMT-LIB. */
export declare function emitCommand(cmd: SmtCommand): string;
/** Emite un script entero (1 comando por línea). */
export declare function emitSmtLib(commands: SmtCommand[]): string;
//# sourceMappingURL=emitter.d.ts.map