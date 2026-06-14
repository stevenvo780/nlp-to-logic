import { canonicalize } from './canonical';
import type { CertRuleChecker, ProofCertificate, VerificationResult } from './types';
/**
 * Verifica un certificado en modo check-only.
 *
 * Las reglas custom (parámetro `rules`) se prueban PRIMERO; si no
 * está la regla, se busca en `STANDARD_RULES`. Esto permite a
 * profiles externos extender el conjunto sin tocar el core.
 */
export declare function verifyCertificate(cert: ProofCertificate, rules?: Map<string, CertRuleChecker>): Promise<VerificationResult>;
/**
 * Helper para construir un certificado "a mano" a partir de pasos
 * crudos: rellena `hash` (y opcionalmente firma) y normaliza
 * fórmulas.
 *
 * Acepta un objeto similar a `ProofCertificate` sin `hash`; las
 * fórmulas se normalizan in-place vía `canonicalize`.
 */
export { canonicalize };
//# sourceMappingURL=verify.d.ts.map