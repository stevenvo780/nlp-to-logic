import type { Proof } from '../../types';
import type { CertSignature, CertStep, ProofCertificate } from './types';
interface GenerateOptions {
    profile?: string;
    axioms?: string[];
    sign?: {
        privateKey: CryptoKey;
        publicKey: string;
    };
}
interface InputCertificate {
    goal: string;
    profile?: string;
    axioms?: string[];
    steps: CertStep[];
}
/**
 * Convierte un `Proof` interno de ST en un certificado portable.
 *
 * Acepta también un "input certificate" plano (sin hash ni firma)
 * para flujos donde los pasos ya vienen construidos manualmente.
 */
export declare function generateCertificate(proof: Proof | InputCertificate, opts?: GenerateOptions): Promise<ProofCertificate>;
/**
 * Genera un par de claves para firmar certificados. Intenta
 * Ed25519 vía WebCrypto y cae a HMAC-SHA256 si el runtime no lo
 * soporta. El `publicKey` se devuelve también como hex para
 * embedderlo dentro del certificado.
 */
export declare function generateCertificateKeyPair(): Promise<{
    privateKey: CryptoKey;
    publicKey: CryptoKey;
    publicKeyHex: string;
    algorithm: 'Ed25519' | 'HMAC-SHA256';
}>;
export declare function signCertificate(cert: Omit<ProofCertificate, 'signature'>, privateKey: CryptoKey, publicKeyHex: string): Promise<CertSignature>;
export declare function verifyCertificateSignature(cert: ProofCertificate): Promise<boolean>;
export {};
//# sourceMappingURL=generate.d.ts.map