import type { CrossProductOptions, TestCase, TestSuite } from './types';
export declare function crossProduct<T1, T2>(s1: TestSuite<T1>, s2: TestSuite<T2>, opts?: CrossProductOptions): TestSuite<{
    a: T1;
    b: T2;
}>;
export declare function parameterize<T, P>(suite: TestSuite<T>, params: P[]): TestSuite<{
    input: T;
    param: P;
}>;
export declare function filter<T>(suite: TestSuite<T>, pred: (c: TestCase<T>) => boolean): TestSuite<T>;
export declare function filterByTags<T>(suite: TestSuite<T>, tags: string[]): TestSuite<T>;
export declare function tag<T>(suite: TestSuite<T>, tagFn: (c: TestCase<T>) => string[]): TestSuite<T>;
export declare function makeSuite<T>(name: string, cases: TestCase<T>[]): TestSuite<T>;
//# sourceMappingURL=combinators.d.ts.map