import { STSnapshot, SnapshotSummary, SnapshotDiff } from './types';
export declare class SnapshotStore {
    private readonly rootDir;
    constructor(opts?: {
        rootDir?: string;
    });
    private filePath;
    save(snapshot: STSnapshot): Promise<void>;
    load(id: string): Promise<STSnapshot | undefined>;
    list(): Promise<SnapshotSummary[]>;
    delete(id: string): Promise<void>;
    diff(idA: string, idB: string): Promise<SnapshotDiff>;
}
//# sourceMappingURL=store.d.ts.map