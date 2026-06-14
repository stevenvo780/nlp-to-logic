"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotStore = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
function defaultRootDir() {
    return path_1.default.join(os_1.default.homedir(), '.st-snapshots');
}
class SnapshotStore {
    rootDir;
    constructor(opts) {
        this.rootDir = opts?.rootDir ?? defaultRootDir();
    }
    filePath(id) {
        return path_1.default.join(this.rootDir, `${id}.json`);
    }
    async save(snapshot) {
        await fs_1.promises.mkdir(this.rootDir, { recursive: true });
        await fs_1.promises.writeFile(this.filePath(snapshot.id), JSON.stringify(snapshot, null, 2), 'utf8');
    }
    async load(id) {
        try {
            const raw = await fs_1.promises.readFile(this.filePath(id), 'utf8');
            return JSON.parse(raw);
        }
        catch {
            return undefined;
        }
    }
    async list() {
        let entries;
        try {
            entries = await fs_1.promises.readdir(this.rootDir);
        }
        catch {
            return [];
        }
        const summaries = [];
        for (const entry of entries) {
            if (!entry.endsWith('.json'))
                continue;
            try {
                const raw = await fs_1.promises.readFile(path_1.default.join(this.rootDir, entry), 'utf8');
                const snap = JSON.parse(raw);
                summaries.push({
                    id: snap.id,
                    createdAt: snap.createdAt,
                    message: snap.message,
                    tags: snap.tags,
                });
            }
            catch {
                // skip malformed files
            }
        }
        summaries.sort((a, b) => {
            const ta = new Date(a.createdAt).getTime();
            const tb = new Date(b.createdAt).getTime();
            return tb - ta;
        });
        return summaries;
    }
    async delete(id) {
        try {
            await fs_1.promises.unlink(this.filePath(id));
        }
        catch {
            // no-op if file doesn't exist
        }
    }
    async diff(idA, idB) {
        const [snapA, snapB] = await Promise.all([this.load(idA), this.load(idB)]);
        if (snapA === undefined)
            throw new Error(`Snapshot not found: ${idA}`);
        if (snapB === undefined)
            throw new Error(`Snapshot not found: ${idB}`);
        const declsA = snapA.state.declarations;
        const declsB = snapB.state.declarations;
        const keyOf = (d) => `${d.kind}::${d.name}`;
        const mapA = new Map(declsA.map((d) => [keyOf(d), d]));
        const mapB = new Map(declsB.map((d) => [keyOf(d), d]));
        const addedDeclarations = [];
        const removedDeclarations = [];
        for (const [k, d] of mapB) {
            if (!mapA.has(k))
                addedDeclarations.push(d);
        }
        for (const [k, d] of mapA) {
            if (!mapB.has(k))
                removedDeclarations.push(d);
        }
        const formsByProfile = (snap) => {
            const m = new Map();
            for (const ef of snap.state.evaluatedFormulas) {
                m.set(ef.formula, ef.profile);
            }
            return m;
        };
        const formsA = formsByProfile(snapA);
        const formsB = formsByProfile(snapB);
        const modifiedFormulas = [];
        for (const [formula, profileB] of formsB) {
            const profileA = formsA.get(formula);
            if (profileA !== undefined && profileA !== profileB) {
                modifiedFormulas.push({ formula, before: profileA, after: profileB });
            }
        }
        const profileChanged = snapA.state.activeProfile !== snapB.state.activeProfile
            ? { from: snapA.state.activeProfile, to: snapB.state.activeProfile }
            : undefined;
        return { addedDeclarations, removedDeclarations, modifiedFormulas, profileChanged };
    }
}
exports.SnapshotStore = SnapshotStore;
//# sourceMappingURL=store.js.map