"use strict";
// ============================================================
// ST Provenance Ledger — DAG de teoremas/lemas/axiomas + auditoría
//
// Determinístico, in-memory. La identidad de un nodo se deriva de
// (statement, dependencies, kind) — el mismo enunciado con las
// mismas deps recibe siempre el mismo id, lo que permite usar el
// ledger como tabla de contenido compartible.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvenanceLedger = void 0;
exports.auditTheorem = auditTheorem;
exports.provenanceToCertificate = provenanceToCertificate;
const crypto_1 = require("crypto");
/**
 * Normaliza el statement antes de hashear: trim + colapsar whitespace.
 * Asegura que "P -> Q" y "P  ->  Q" produzcan el mismo id.
 */
function normalize(statement) {
    return statement.trim().replace(/\s+/g, ' ');
}
/**
 * Calcula el id determinístico del nodo. Incluye kind para evitar
 * colisiones entre, por ejemplo, una `definition` y un `axiom` con
 * la misma cadena.
 */
function computeId(statement, kind, dependencies) {
    const canonical = JSON.stringify({
        statement: normalize(statement),
        kind,
        dependencies: [...dependencies].sort(),
    });
    return (0, crypto_1.createHash)('sha256').update(canonical).digest('hex').slice(0, 32);
}
class ProvenanceLedger {
    nodes = new Map();
    /**
     * Añade un nodo al ledger. Devuelve el id determinístico.
     *
     * Si el id ya existe se preserva el nodo previo y se devuelve el
     * mismo id (idempotente). Falla si una dependencia no existe.
     */
    add(node) {
        if (node.kind === 'axiom' && node.dependencies.length > 0) {
            throw new Error(`axiom "${node.statement}" no puede tener dependencias`);
        }
        for (const dep of node.dependencies) {
            if (!this.nodes.has(dep)) {
                throw new Error(`dependencia inexistente: ${dep}`);
            }
        }
        const id = computeId(node.statement, node.kind, node.dependencies);
        if (this.nodes.has(id)) {
            return id;
        }
        this.nodes.set(id, {
            id,
            statement: normalize(node.statement),
            kind: node.kind,
            dependencies: [...node.dependencies],
            metadata: { ...node.metadata },
            proof: node.proof,
            trust: node.trust,
        });
        return id;
    }
    get(id) {
        const n = this.nodes.get(id);
        if (!n)
            return undefined;
        // Devolvemos copia defensiva para que el caller no mute el ledger.
        return {
            ...n,
            dependencies: [...n.dependencies],
            metadata: { ...n.metadata },
        };
    }
    // --- Auditoría --------------------------------------------------
    /**
     * Walk recursivo de dependencias. Devuelve los nodos en orden
     * topológico (deps antes que el nodo). Cada nodo aparece una sola
     * vez aunque sea alcanzado por múltiples caminos.
     */
    dependencyChain(id) {
        const root = this.nodes.get(id);
        if (!root)
            return [];
        const visited = new Set();
        const out = [];
        const walk = (curr) => {
            if (visited.has(curr))
                return;
            visited.add(curr);
            const node = this.nodes.get(curr);
            if (!node)
                return;
            for (const dep of node.dependencies)
                walk(dep);
            out.push({ ...node, dependencies: [...node.dependencies], metadata: { ...node.metadata } });
        };
        walk(id);
        return out;
    }
    /**
     * Cuenta trust por categoría sobre el cierre transitivo (incluye al root).
     */
    trustChain(id) {
        const chain = this.dependencyChain(id);
        const acc = { verified: 0, admitted: 0, external: 0 };
        for (const node of chain) {
            acc[node.trust]++;
        }
        return acc;
    }
    /**
     * Conjunto de IDs de axiomas alcanzables desde `id` (cierre).
     * Útil para "¿qué postulados base sostienen este teorema?".
     */
    axiomsUsed(id) {
        const chain = this.dependencyChain(id);
        const out = new Set();
        for (const node of chain) {
            if (node.kind === 'axiom')
                out.add(node.id);
        }
        return out;
    }
    /**
     * true sólo si todos los nodos del cierre transitivo (incluido el root)
     * tienen trust='verified'. Un solo `admitted` o `external` lo descalifica.
     */
    isFullyVerified(id) {
        const chain = this.dependencyChain(id);
        if (chain.length === 0)
            return false;
        return chain.every((n) => n.trust === 'verified');
    }
    // --- Queries de grafo -------------------------------------------
    /** Cierre transitivo de ancestros (deps directas + indirectas), sin el propio nodo. */
    ancestors(id) {
        const out = new Set();
        const root = this.nodes.get(id);
        if (!root)
            return out;
        const walk = (curr) => {
            const node = this.nodes.get(curr);
            if (!node)
                return;
            for (const dep of node.dependencies) {
                if (!out.has(dep)) {
                    out.add(dep);
                    walk(dep);
                }
            }
        };
        walk(id);
        return out;
    }
    /** Cierre transitivo de descendientes (quien depende de este nodo), sin el propio nodo. */
    descendants(id) {
        const out = new Set();
        if (!this.nodes.has(id))
            return out;
        let changed = true;
        while (changed) {
            changed = false;
            for (const node of this.nodes.values()) {
                if (out.has(node.id) || node.id === id)
                    continue;
                for (const dep of node.dependencies) {
                    if (dep === id || out.has(dep)) {
                        out.add(node.id);
                        changed = true;
                        break;
                    }
                }
            }
        }
        return out;
    }
    /**
     * Detecta ciclos. Devuelve la lista de ciclos como arrays de IDs.
     *
     * Bajo construcción normal `add()` impide ciclos (toda dep debe existir
     * antes), pero la importación cruda de un ledger podría introducirlos
     * — esta función lo verifica explícitamente.
     */
    findCircular() {
        const cycles = [];
        const WHITE = 0, GRAY = 1, BLACK = 2;
        const color = new Map();
        const stack = [];
        const dfs = (curr) => {
            color.set(curr, GRAY);
            stack.push(curr);
            const node = this.nodes.get(curr);
            if (node) {
                for (const dep of node.dependencies) {
                    const c = color.get(dep) ?? WHITE;
                    if (c === GRAY) {
                        const idx = stack.indexOf(dep);
                        if (idx >= 0)
                            cycles.push(stack.slice(idx).concat(dep));
                    }
                    else if (c === WHITE) {
                        dfs(dep);
                    }
                }
            }
            stack.pop();
            color.set(curr, BLACK);
        };
        for (const id of this.nodes.keys()) {
            if ((color.get(id) ?? WHITE) === WHITE)
                dfs(id);
        }
        return cycles;
    }
    // --- Estadísticas -----------------------------------------------
    totalNodes() {
        return this.nodes.size;
    }
    axiomCount() {
        let n = 0;
        for (const node of this.nodes.values())
            if (node.kind === 'axiom')
                n++;
        return n;
    }
    /** Longitud (en nodos) de la cadena más larga de dependencias. */
    longestChain() {
        const memo = new Map();
        const depth = (curr) => {
            const cached = memo.get(curr);
            if (cached !== undefined)
                return cached;
            const node = this.nodes.get(curr);
            if (!node || node.dependencies.length === 0) {
                memo.set(curr, 1);
                return 1;
            }
            let best = 0;
            for (const dep of node.dependencies) {
                const d = depth(dep);
                if (d > best)
                    best = d;
            }
            const result = best + 1;
            memo.set(curr, result);
            return result;
        };
        let max = 0;
        for (const id of this.nodes.keys()) {
            const d = depth(id);
            if (d > max)
                max = d;
        }
        return max;
    }
    // --- Serialización ---------------------------------------------
    /**
     * Exporta el ledger a JSON determinístico (claves ordenadas, nodos
     * ordenados por id). Apto para hashing y para diff.
     */
    exportLedger() {
        const ordered = Array.from(this.nodes.values()).sort((a, b) => (a.id < b.id ? -1 : 1));
        const serializable = ordered.map((n) => ({
            id: n.id,
            statement: n.statement,
            kind: n.kind,
            dependencies: [...n.dependencies].sort(),
            metadata: n.metadata,
            proof: n.proof,
            trust: n.trust,
        }));
        const payload = { version: '1.0', nodes: serializable };
        return canonicalJson(payload);
    }
    /**
     * Reemplaza el contenido del ledger por el contenido del JSON.
     * Tolera reordenamiento de nodos: hace dos pasadas para resolver
     * dependencias forward (en caso de que el JSON no esté topológicamente
     * ordenado, aunque exportLedger siempre lo deja así).
     */
    importLedger(json) {
        const parsed = JSON.parse(json);
        if (!parsed || parsed.version !== '1.0' || !Array.isArray(parsed.nodes)) {
            throw new Error('formato de ledger inválido');
        }
        this.nodes.clear();
        const pending = [...parsed.nodes];
        let progress = true;
        while (pending.length > 0 && progress) {
            progress = false;
            for (let i = pending.length - 1; i >= 0; i--) {
                const node = pending[i];
                if (!node)
                    continue;
                if (node.dependencies.every((d) => this.nodes.has(d))) {
                    this.nodes.set(node.id, {
                        ...node,
                        dependencies: [...node.dependencies],
                        metadata: { ...node.metadata },
                    });
                    pending.splice(i, 1);
                    progress = true;
                }
            }
        }
        if (pending.length > 0) {
            // Restauramos los pendientes tal cual; las dependencias huérfanas o
            // ciclos se detectarán con findCircular() o get() del consumidor.
            for (const node of pending) {
                this.nodes.set(node.id, {
                    ...node,
                    dependencies: [...node.dependencies],
                    metadata: { ...node.metadata },
                });
            }
        }
    }
    /**
     * Hash SHA-256 del ledger canonicalizado. Si dos ledgers tienen el
     * mismo hash, son idénticos en contenido. Devuelve Promise para
     * dejar la puerta abierta a un hash async (WebCrypto) en runtime
     * sin Node `crypto` — la implementación actual es síncrona.
     */
    hashLedger() {
        const canonical = this.exportLedger();
        return Promise.resolve((0, crypto_1.createHash)('sha256').update(canonical).digest('hex'));
    }
}
exports.ProvenanceLedger = ProvenanceLedger;
function canonicalJson(value) {
    return stringify(value);
}
function stringify(value) {
    if (value === null)
        return 'null';
    if (typeof value === 'boolean')
        return value ? 'true' : 'false';
    if (typeof value === 'number') {
        if (!isFinite(value))
            throw new Error('non-finite number in ledger');
        return String(value);
    }
    if (typeof value === 'string')
        return JSON.stringify(value);
    if (Array.isArray(value))
        return '[' + value.map(stringify).join(',') + ']';
    if (typeof value === 'object') {
        const obj = value;
        const keys = Object.keys(obj).sort();
        const pairs = [];
        for (const k of keys) {
            const v = obj[k];
            if (v === undefined)
                continue;
            pairs.push(JSON.stringify(k) + ':' + stringify(v));
        }
        return '{' + pairs.join(',') + '}';
    }
    return 'null';
}
// --- auditoría a nivel de teorema -------------------------------
/**
 * Genera un reporte humano-legible sobre la confianza en `theoremId`.
 *
 * Estimación de riesgo:
 * - `low`: 100% verified.
 * - `medium`: al menos 1 admitted o external pero <30% del DAG.
 * - `high`: >=30% admitted+external, o un axioma fundamental marcado como external.
 */
function auditTheorem(theoremId, ledger) {
    const root = ledger.get(theoremId);
    if (!root) {
        throw new Error(`teorema no encontrado en el ledger: ${theoremId}`);
    }
    const chain = ledger.dependencyChain(theoremId);
    const trustClassification = ledger.trustChain(theoremId);
    const externalDependencies = chain.filter((n) => n.trust === 'external');
    const admittedDependencies = chain.filter((n) => n.trust === 'admitted');
    const axiomList = ledger.axiomsUsed(theoremId);
    const totalNodes = chain.length;
    const unverified = trustClassification.admitted + trustClassification.external;
    const ratio = totalNodes > 0 ? unverified / totalNodes : 0;
    let estimatedRisk;
    if (unverified === 0) {
        estimatedRisk = 'low';
    }
    else if (ratio >= 0.3) {
        estimatedRisk = 'high';
    }
    else {
        // Si un axioma raíz es external/admitted la confianza es estructuralmente baja.
        const hasUntrustedAxiom = chain.some((n) => n.kind === 'axiom' && (n.trust === 'external' || n.trust === 'admitted'));
        estimatedRisk = hasUntrustedAxiom ? 'high' : 'medium';
    }
    return {
        rootTheorem: root.statement,
        trustClassification,
        externalDependencies,
        admittedDependencies,
        axiomList,
        totalNodes,
        estimatedRisk,
    };
}
// --- bridge con el formato `ProofCertificate` -------------------
/**
 * Convierte un nodo + su cadena a una forma compatible con el
 * certificado de prueba existente. No reemplaza al generador real:
 * sirve para que el agente pueda exportar el contexto de proveniencia
 * cuando publica un teorema.
 */
function provenanceToCertificate(node, ledger) {
    const chain = ledger.dependencyChain(node.id);
    return {
        version: '1.0',
        goal: node.statement,
        profile: node.metadata.profile,
        axioms: chain.filter((n) => n.kind === 'axiom').map((n) => n.statement),
        provenance: {
            kind: node.kind,
            trust: node.trust,
            provedBy: node.metadata.provedBy,
            provedAt: node.metadata.provedAt,
            tool: node.metadata.tool,
            chainLength: chain.length,
            dependencies: chain.map((n) => ({
                id: n.id,
                statement: n.statement,
                kind: n.kind,
                trust: n.trust,
            })),
        },
    };
}
//# sourceMappingURL=ledger.js.map