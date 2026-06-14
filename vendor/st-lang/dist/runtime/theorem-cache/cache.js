"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheoremCache = void 0;
exports.tryReuseProof = tryReuseProof;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const crypto_1 = require("crypto");
const canonical_1 = require("./canonical");
const pattern_1 = require("./pattern");
function defaultPersistPath() {
    return path_1.default.join(os_1.default.homedir(), '.st-theorem-cache', 'theorems.json');
}
function defaultHash(input) {
    return (0, crypto_1.createHash)('sha1').update(input).digest('hex');
}
class TheoremCache {
    maxEntries;
    persistPath;
    hashFn;
    entries = new Map();
    hits = 0;
    misses = 0;
    constructor(opts) {
        this.maxEntries = opts?.maxEntries ?? 10000;
        this.persistPath = opts?.persistPath ?? defaultPersistPath();
        this.hashFn = opts?.hashFn ?? defaultHash;
    }
    /**
     * Canonicaliza una fórmula a forma estable (placeholders).
     */
    canonicalize(formula) {
        return (0, canonical_1.canonicalize)(formula).canonical;
    }
    /**
     * Almacena un teorema; retorna el id asignado. Si ya existe una
     * entrada con el mismo (formula canónica, profile), la reemplaza
     * y la promueve a MRU.
     */
    store(theorem) {
        const normalized = theorem.normalizedFormula && theorem.normalizedFormula.length > 0
            ? theorem.normalizedFormula
            : this.canonicalize(theorem.formula);
        const id = this.hashFn(`${theorem.profile}::${normalized}`);
        const full = { ...theorem, normalizedFormula: normalized, id };
        if (this.entries.has(id)) {
            this.entries.delete(id);
        }
        else if (this.entries.size >= this.maxEntries) {
            this.evictLru();
        }
        this.entries.set(id, { theorem: full });
        return id;
    }
    /**
     * Devuelve el teorema cacheado para una fórmula+profile dados, o
     * `undefined` si no existe. Incrementa hits/misses.
     */
    retrieve(formula, profile) {
        const normalized = this.canonicalize(formula);
        const id = this.hashFn(`${profile}::${normalized}`);
        const entry = this.entries.get(id);
        if (entry === undefined) {
            this.misses++;
            return undefined;
        }
        this.hits++;
        // LRU promote.
        this.entries.delete(id);
        this.entries.set(id, entry);
        return entry.theorem;
    }
    /**
     * Retorna todos los teoremas que matchean el patrón dado.
     *
     * El patrón usa metavariables `?x`. Ej: `?x -> ?x` matchea cualquier
     * teorema cacheado cuya fórmula sea `<id> -> <id>` (mismo lado).
     *
     * El matching opera sobre la fórmula original (no la canónica), de
     * modo que el caller puede inspeccionar los nombres reales.
     */
    retrieveByPattern(pattern) {
        const out = [];
        for (const { theorem } of this.entries.values()) {
            if ((0, pattern_1.matchPattern)(pattern, theorem.formula) !== undefined) {
                out.push(theorem);
            }
        }
        return out;
    }
    /**
     * Comprueba si existe una entrada para (formula, profile). NO afecta
     * los contadores hits/misses.
     */
    exists(formula, profile) {
        const normalized = this.canonicalize(formula);
        const id = this.hashFn(`${profile}::${normalized}`);
        return this.entries.has(id);
    }
    remove(id) {
        return this.entries.delete(id);
    }
    clear() {
        this.entries.clear();
        this.hits = 0;
        this.misses = 0;
    }
    async saveToDisk() {
        const dir = path_1.default.dirname(this.persistPath);
        await fs_1.promises.mkdir(dir, { recursive: true });
        const payload = [];
        for (const { theorem } of this.entries.values())
            payload.push(theorem);
        await fs_1.promises.writeFile(this.persistPath, JSON.stringify(payload), 'utf-8');
    }
    /**
     * Carga teoremas desde disco. Devuelve cuántas entradas cargó.
     * No-op silencioso si el archivo no existe.
     */
    async loadFromDisk() {
        let raw;
        try {
            raw = await fs_1.promises.readFile(this.persistPath, 'utf-8');
        }
        catch {
            return 0;
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            return 0;
        }
        if (!Array.isArray(parsed))
            return 0;
        let loaded = 0;
        for (const item of parsed) {
            if (!item || typeof item !== 'object')
                continue;
            const t = item;
            if (typeof t.id !== 'string' ||
                typeof t.formula !== 'string' ||
                typeof t.normalizedFormula !== 'string' ||
                typeof t.profile !== 'string' ||
                !t.metadata ||
                typeof t.metadata !== 'object') {
                continue;
            }
            if (this.entries.has(t.id))
                continue;
            if (this.entries.size >= this.maxEntries)
                break;
            this.entries.set(t.id, { theorem: t });
            loaded++;
        }
        return loaded;
    }
    stats() {
        let bytes = 0;
        for (const { theorem } of this.entries.values()) {
            bytes += JSON.stringify(theorem).length;
        }
        return {
            entries: this.entries.size,
            hits: this.hits,
            misses: this.misses,
            storedBytes: bytes,
        };
    }
    evictLru() {
        const firstKey = this.entries.keys().next().value;
        if (firstKey !== undefined)
            this.entries.delete(firstKey);
    }
}
exports.TheoremCache = TheoremCache;
/**
 * Intenta reusar la prueba de un teorema cacheado para un target
 * dado. Si las fórmulas son canónicamente equivalentes (misma
 * estructura, identificadores en el mismo orden), calcula la
 * substitución y reemplaza los nombres en la prueba (cuando la
 * prueba es un string o un objeto JSON que la admita textualmente).
 *
 * Para pruebas opacas no-string, devuelve la prueba original sin
 * tocar — el caller es responsable de re-instanciar.
 */
function tryReuseProof(theorem, targetFormula) {
    const substitution = (0, canonical_1.computeSubstitution)(theorem.formula, targetFormula);
    if (substitution === undefined) {
        return { reusable: false };
    }
    let reusedProof = theorem.proof;
    if (typeof theorem.proof === 'string') {
        reusedProof = (0, canonical_1.applySubstitution)(theorem.proof, substitution);
    }
    else if (theorem.proof && typeof theorem.proof === 'object') {
        // Substitución textual sobre la serialización JSON.
        try {
            const serialized = JSON.stringify(theorem.proof);
            const rewritten = (0, canonical_1.applySubstitution)(serialized, substitution);
            reusedProof = JSON.parse(rewritten);
        }
        catch {
            reusedProof = theorem.proof;
        }
    }
    return { reusable: true, substitution, reusedProof };
}
//# sourceMappingURL=cache.js.map