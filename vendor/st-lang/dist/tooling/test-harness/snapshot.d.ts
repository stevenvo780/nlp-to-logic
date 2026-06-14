import type { Snapshot, SnapshotComparison } from './types';
export declare function snapshotHash(input: unknown, output: unknown): string;
export declare function takeSnapshot(input: unknown, output: unknown): Snapshot;
export declare function compareSnapshot(snap: Snapshot, current: unknown): SnapshotComparison;
//# sourceMappingURL=snapshot.d.ts.map