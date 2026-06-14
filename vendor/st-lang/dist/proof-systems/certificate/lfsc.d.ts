import type { ProofCertificate } from './types';
/**
 * Exporta un certificado al subset LFSC. La salida es texto
 * S-expression con keywords `:foo` para los campos.
 */
export declare function exportLFSC(cert: ProofCertificate): string;
/**
 * Importa un certificado desde su forma LFSC. Devuelve `{ error }`
 * en caso de fallo de parseo en lugar de lanzar — para que el
 * caller decida.
 */
export declare function importLFSC(input: string): ProofCertificate | {
    error: string;
};
//# sourceMappingURL=lfsc.d.ts.map