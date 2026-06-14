import type { CoverageReport, TestCase, TestSuite } from './types';
export declare function runWithCoverage<T>(suite: TestSuite<T>, runner: (c: TestCase<T>) => Promise<boolean>): Promise<CoverageReport>;
//# sourceMappingURL=coverage.d.ts.map