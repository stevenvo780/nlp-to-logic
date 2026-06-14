import type { ProofCertificate } from './types';
/**
 * Normaliza una fórmula textual: trim + colapsar whitespace
 * interno a un solo espacio. Idempotente.
 */
export declare function normalizeFormula(formula: string): string;
/**
 * Serializa el certificado a su forma canónica determinística
 * (JSON con claves ordenadas alfabéticamente y sin whitespace).
 * Excluye `hash` y `signature` para permitir calcular el hash y
 * la firma sobre exactamente la misma representación.
 */
export declare function canonicalize(cert: Omit<ProofCertificate, 'hash' | 'signature'>): string;
/**
 * SHA-256 hex del certificado canonicalizado (sin hash ni firma).
 */
export declare function hashCertificate(cert: Omit<ProofCertificate, 'hash' | 'signature'>): Promise<string>;
//# sourceMappingURL=canonical.d.ts.map