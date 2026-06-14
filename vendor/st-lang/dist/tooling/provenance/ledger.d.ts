import type { AuditReport, ProvenanceMetadata, ProvenanceNode, TrustLevel } from './types';
export declare class ProvenanceLedger {
    private readonly nodes;
    /**
     * Añade un nodo al ledger. Devuelve el id determinístico.
     *
     * Si el id ya existe se preserva el nodo previo y se devuelve el
     * mismo id (idempotente). Falla si una dependencia no existe.
     */
    add(node: Omit<ProvenanceNode, 'id'>): string;
    get(id: string): ProvenanceNode | undefined;
    /**
     * Walk recursivo de dependencias. Devuelve los nodos en orden
     * topológico (deps antes que el nodo). Cada nodo aparece una sola
     * vez aunque sea alcanzado por múltiples caminos.
     */
    dependencyChain(id: string): ProvenanceNode[];
    /**
     * Cuenta trust por categoría sobre el cierre transitivo (incluye al root).
     */
    trustChain(id: string): {
        verified: number;
        admitted: number;
        external: number;
    };
    /**
     * Conjunto de IDs de axiomas alcanzables desde `id` (cierre).
     * Útil para "¿qué postulados base sostienen este teorema?".
     */
    axiomsUsed(id: string): Set<string>;
    /**
     * true sólo si todos los nodos del cierre transitivo (incluido el root)
     * tienen trust='verified'. Un solo `admitted` o `external` lo descalifica.
     */
    isFullyVerified(id: string): boolean;
    /** Cierre transitivo de ancestros (deps directas + indirectas), sin el propio nodo. */
    ancestors(id: string): Set<string>;
    /** Cierre transitivo de descendientes (quien depende de este nodo), sin el propio nodo. */
    descendants(id: string): Set<string>;
    /**
     * Detecta ciclos. Devuelve la lista de ciclos como arrays de IDs.
     *
     * Bajo construcción normal `add()` impide ciclos (toda dep debe existir
     * antes), pero la importación cruda de un ledger podría introducirlos
     * — esta función lo verifica explícitamente.
     */
    findCircular(): string[][];
    totalNodes(): number;
    axiomCount(): number;
    /** Longitud (en nodos) de la cadena más larga de dependencias. */
    longestChain(): number;
    /**
     * Exporta el ledger a JSON determinístico (claves ordenadas, nodos
     * ordenados por id). Apto para hashing y para diff.
     */
    exportLedger(): string;
    /**
     * Reemplaza el contenido del ledger por el contenido del JSON.
     * Tolera reordenamiento de nodos: hace dos pasadas para resolver
     * dependencias forward (en caso de que el JSON no esté topológicamente
     * ordenado, aunque exportLedger siempre lo deja así).
     */
    importLedger(json: string): void;
    /**
     * Hash SHA-256 del ledger canonicalizado. Si dos ledgers tienen el
     * mismo hash, son idénticos en contenido. Devuelve Promise para
     * dejar la puerta abierta a un hash async (WebCrypto) en runtime
     * sin Node `crypto` — la implementación actual es síncrona.
     */
    hashLedger(): Promise<string>;
}
/**
 * Genera un reporte humano-legible sobre la confianza en `theoremId`.
 *
 * Estimación de riesgo:
 * - `low`: 100% verified.
 * - `medium`: al menos 1 admitted o external pero <30% del DAG.
 * - `high`: >=30% admitted+external, o un axioma fundamental marcado como external.
 */
export declare function auditTheorem(theoremId: string, ledger: ProvenanceLedger): AuditReport;
/**
 * Convierte un nodo + su cadena a una forma compatible con el
 * certificado de prueba existente. No reemplaza al generador real:
 * sirve para que el agente pueda exportar el contexto de proveniencia
 * cuando publica un teorema.
 */
export declare function provenanceToCertificate(node: ProvenanceNode, ledger: ProvenanceLedger): unknown;
export type { ProvenanceMetadata, TrustLevel };
//# sourceMappingURL=ledger.d.ts.map