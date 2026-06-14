import type { Proof } from '../../types';
export interface ProofPackage {
    version: '1.0';
    formula: string;
    profile: string;
    proof: Proof;
    metadata: {
        author?: string;
        timestamp: string;
        tags?: string[];
    };
}
export declare function canonicalize(pkg: ProofPackage): string;
export declare function hashProof(pkg: ProofPackage): Promise<string>;
export declare function generateKeyPair(): Promise<{
    publicKey: CryptoKey;
    privateKey: CryptoKey;
}>;
export declare function signProof(pkg: ProofPackage, privateKey: CryptoKey): Promise<{
    signature: string;
    algorithm: 'Ed25519' | 'HMAC-SHA256';
}>;
export declare function verifyProof(pkg: ProofPackage, signature: string, publicKey: CryptoKey | string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map