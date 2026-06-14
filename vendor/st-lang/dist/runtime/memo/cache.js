"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DerivationCache = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const hash_1 = require("./hash");
function defaultPersistPath() {
    return path_1.default.join(os_1.default.homedir(), '.st-cache', 'derivations.json');
}
class DerivationCache {
    maxEntries;
    persistPath;
    ttlMs;
    store = new Map();
    hits = 0;
    misses = 0;
    evictions = 0;
    constructor(opts) {
        this.maxEntries = opts?.maxEntries ?? 1000;
        this.persistPath = opts?.persistPath !== undefined ? opts.persistPath : null;
        this.ttlMs = opts?.ttlMs !== undefined ? opts.ttlMs : null;
    }
    get(formula) {
        const key = (0, hash_1.hashFormula)(formula);
        const entry = this.store.get(key);
        if (entry === undefined) {
            this.misses++;
            return undefined;
        }
        if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            this.misses++;
            return undefined;
        }
        this.hits++;
        this.lruPromote(key, entry);
        return entry.result;
    }
    set(formula, result) {
        const key = (0, hash_1.hashFormula)(formula);
        if (this.store.has(key)) {
            this.store.delete(key);
        }
        else if (this.store.size >= this.maxEntries) {
            this.evictLru();
        }
        const expiresAt = this.ttlMs !== null ? Date.now() + this.ttlMs : null;
        this.store.set(key, { result, expiresAt });
    }
    clear() {
        this.store.clear();
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
    }
    stats() {
        return {
            hits: this.hits,
            misses: this.misses,
            evictions: this.evictions,
            size: this.store.size,
        };
    }
    async loadFromDisk() {
        const filePath = this.persistPath ?? defaultPersistPath();
        let raw;
        try {
            raw = await fs_1.promises.readFile(filePath, 'utf-8');
        }
        catch {
            return;
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            return;
        }
        if (!Array.isArray(parsed))
            return;
        const now = Date.now();
        for (const item of parsed) {
            if (!item || typeof item !== 'object')
                continue;
            const record = item;
            const rawKey = record['key'];
            if (typeof rawKey !== 'string' || rawKey === '')
                continue;
            if (!record['result'] || typeof record['result'] !== 'object')
                continue;
            const rawExpires = record['expiresAt'];
            const expiresAt = typeof rawExpires === 'number' ? rawExpires : null;
            if (expiresAt !== null && now > expiresAt)
                continue;
            const key = rawKey;
            if (!this.store.has(key) && this.store.size < this.maxEntries) {
                this.store.set(key, { result: record['result'], expiresAt });
            }
        }
    }
    async saveToDisk() {
        const filePath = this.persistPath ?? defaultPersistPath();
        const dir = path_1.default.dirname(filePath);
        await fs_1.promises.mkdir(dir, { recursive: true });
        const entries = [];
        for (const [key, entry] of this.store) {
            entries.push({ key, result: entry.result, expiresAt: entry.expiresAt });
        }
        await fs_1.promises.writeFile(filePath, JSON.stringify(entries), 'utf-8');
    }
    lruPromote(key, entry) {
        this.store.delete(key);
        this.store.set(key, entry);
    }
    evictLru() {
        const firstKey = this.store.keys().next().value;
        if (firstKey !== undefined) {
            this.store.delete(firstKey);
            this.evictions++;
        }
    }
}
exports.DerivationCache = DerivationCache;
//# sourceMappingURL=cache.js.map