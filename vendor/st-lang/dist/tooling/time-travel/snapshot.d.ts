import { STSnapshot, STSnapshotState } from './types';
interface CaptureOptions {
    parentId?: string;
    tags?: string[];
    message?: string;
}
export declare function captureSnapshot(state: STSnapshotState, opts?: CaptureOptions): STSnapshot;
export {};
//# sourceMappingURL=snapshot.d.ts.map