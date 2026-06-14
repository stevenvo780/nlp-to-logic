import type { ProofPackage } from '../proof-exchange';
/** A proof known by a peer node, including its origin and reception time. */
export interface KnownProofRecord {
    proof: ProofPackage;
    signature: string;
    sourceId: string;
    receivedAt: string;
}
/**
 * A simulated P2P node in the gossip network.
 * Tracks its peers, the proofs it has received, trusted keys, and revocations.
 */
export interface PeerNode {
    id: string;
    publicKey: string;
    peers: Set<string>;
    knownProofs: Map<string, KnownProofRecord>;
    trustedKeys: Set<string>;
    blacklist: Set<string>;
    revoked: Map<string, string>;
}
/** A message queued for delivery between two nodes in the simulated network. */
export interface NetworkMessage {
    kind: 'announce' | 'request' | 'response' | 'revoke';
    from: string;
    to: string;
    payload: unknown;
    timestamp: string;
}
/** Payload for an `announce` message: broadcasts a proof to a peer. */
export interface AnnouncePayload {
    proofHash: string;
    proof: ProofPackage;
    signature: string;
    signerPublicKey: string;
}
/** Payload for a `request` message: asks a peer for a specific proof by hash. */
export interface RequestPayload {
    proofHash: string;
}
/** Payload for a `response` message: delivers (or declines) a requested proof. */
export interface ResponsePayload {
    proofHash: string;
    proof: ProofPackage | null;
    signature: string | null;
    signerPublicKey: string | null;
}
/** Payload for a `revoke` message: invalidates a proof network-wide. */
export interface RevokePayload {
    proofHash: string;
    reason: string;
    signerPublicKey: string;
}
/**
 * Computes a deterministic (non-cryptographic) hash for a `ProofPackage`,
 * used as the network-level identifier within the simulation.
 * Cryptographic integrity is provided by the signatures in `proof-exchange`.
 */
export declare function proofHash(pkg: ProofPackage): string;
/** Describes two proofs with the same statement but different hashes — a network conflict. */
export interface ProofConflict {
    proofHashA: string;
    proofHashB: string;
    statementsMatch: boolean;
}
export declare class GossipNetwork {
    private readonly nodes;
    private readonly queue;
    private droppedCount;
    private deliveredCount;
    addNode(node: PeerNode): void;
    hasNode(id: string): boolean;
    getNode(id: string): PeerNode | undefined;
    listNodes(): PeerNode[];
    connect(nodeA: string, nodeB: string): void;
    disconnect(nodeA: string, nodeB: string): void;
    private requireNode;
    private enqueue;
    publish(fromNode: string, proof: ProofPackage, signature: string): NetworkMessage[];
    request(fromNode: string, hash: string): NetworkMessage[];
    revokeProof(fromNode: string, hash: string, reason: string): NetworkMessage[];
    blacklistKey(nodeId: string, publicKey: string): void;
    tick(): {
        delivered: number;
        dropped: number;
    };
    private handleMessage;
    private handleAnnounce;
    private handleRequest;
    private handleResponse;
    private handleRevoke;
    proofPropagation(hash: string): {
        receivedBy: Set<string>;
        coverage: number;
    };
    drain(maxTicks?: number): {
        ticks: number;
        delivered: number;
        dropped: number;
    };
    totals(): {
        delivered: number;
        dropped: number;
        pending: number;
    };
}
/**
 * Creates a new `PeerNode` with empty peer, proof, blacklist, and revocation sets.
 * @param params.trustedKeys - Optional initial set of trusted signer public keys.
 */
export declare function createPeerNode(params: {
    id: string;
    publicKey: string;
    trustedKeys?: Iterable<string>;
}): PeerNode;
/**
 * Scans all nodes in the network for proofs with the same `(formula, profile)` but
 * different hashes, and returns them as conflict pairs sorted lexicographically.
 */
export declare function detectConflicts(network: GossipNetwork): ProofConflict[];
/**
 * Performs a direct anti-entropy sync between two nodes, transferring all proofs
 * each is missing from the other (respecting blacklists and revocations).
 * @returns The number of proofs sent in each direction.
 */
export declare function syncPeers(network: GossipNetwork, nodeA: string, nodeB: string): {
    sentAtoB: number;
    sentBtoA: number;
};
//# sourceMappingURL=index.d.ts.map