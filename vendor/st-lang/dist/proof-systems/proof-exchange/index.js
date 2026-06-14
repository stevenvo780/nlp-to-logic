"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalize = canonicalize;
exports.hashProof = hashProof;
exports.generateKeyPair = generateKeyPair;
exports.signProof = signProof;
exports.verifyProof = verifyProof;
function canonicalizeValue(value) {
    if (value === null)
        return 'null';
    if (typeof value === 'boolean')
        return value ? 'true' : 'false';
    if (typeof value === 'number') {
        if (!isFinite(value))
            throw new Error(`Non-finite number in proof package: ${value}`);
        if (Object.is(value, -0))
            return '0';
        return String(value);
    }
    if (typeof value === 'string')
        return JSON.stringify(value);
    if (Array.isArray(value)) {
        return '[' + value.map(canonicalizeValue).join(',') + ']';
    }
    const sortedKeys = Object.keys(value).sort();
    const pairs = sortedKeys
        .filter((k) => value[k] !== undefined)
        .map((k) => JSON.stringify(k) + ':' + canonicalizeValue(value[k]));
    return '{' + pairs.join(',') + '}';
}
function canonicalize(pkg) {
    return canonicalizeValue(pkg);
}
const subtle = globalThis.crypto.subtle;
async function hashProof(pkg) {
    const canonical = canonicalize(pkg);
    const encoded = new TextEncoder().encode(canonical);
    const hashBuffer = await subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function generateKeyPair() {
    try {
        const pair = await subtle.generateKey({ name: 'Ed25519' }, true, [
            'sign',
            'verify',
        ]);
        return {
            publicKey: pair.publicKey,
            privateKey: pair.privateKey,
        };
    }
    catch {
        const key = await subtle.generateKey({ name: 'HMAC', hash: 'SHA-256', length: 256 }, true, [
            'sign',
            'verify',
        ]);
        return { publicKey: key, privateKey: key };
    }
}
async function signProof(pkg, privateKey) {
    const canonical = canonicalize(pkg);
    const data = new TextEncoder().encode(canonical);
    const algorithm = privateKey.algorithm.name === 'Ed25519' ? 'Ed25519' : 'HMAC-SHA256';
    const algoParam = algorithm === 'Ed25519' ? 'Ed25519' : 'HMAC';
    const sigBuffer = await subtle.sign(algoParam, privateKey, data);
    const sigArray = Array.from(new Uint8Array(sigBuffer));
    const signature = sigArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return { signature, algorithm };
}
function hexToUint8Array(hex) {
    if (hex.length % 2 !== 0)
        throw new Error('Invalid hex string');
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return result;
}
async function verifyProof(pkg, signature, publicKey) {
    try {
        const canonical = canonicalize(pkg);
        const data = new TextEncoder().encode(canonical);
        const sigBytes = hexToUint8Array(signature);
        if (typeof publicKey === 'string') {
            const keyBytes = hexToUint8Array(publicKey);
            const importedKey = await subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
            return await subtle.verify('HMAC', importedKey, sigBytes, data);
        }
        const algoName = publicKey.algorithm.name;
        const algoParam = algoName === 'Ed25519' ? 'Ed25519' : 'HMAC';
        return await subtle.verify(algoParam, publicKey, sigBytes, data);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=index.js.map