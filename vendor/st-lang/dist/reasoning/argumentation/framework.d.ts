import type { ArgumentationFramework } from './types';
export declare function createFramework(args: Iterable<string>, attacks: Iterable<[string, string]>): ArgumentationFramework;
export declare function attackersOf(af: ArgumentationFramework, arg: string): Set<string>;
export declare function attackedBy(af: ArgumentationFramework, arg: string): Set<string>;
export declare function attackedBySet(af: ArgumentationFramework, set: Set<string>): Set<string>;
export declare function isConflictFree(af: ArgumentationFramework, set: Set<string>): boolean;
export declare function defends(af: ArgumentationFramework, set: Set<string>, arg: string): boolean;
export declare function hasAttack(af: ArgumentationFramework, from: string, to: string): boolean;
export declare function isAdmissible(af: ArgumentationFramework, set: Set<string>): boolean;
export declare function characteristicFunction(af: ArgumentationFramework, set: Set<string>): Set<string>;
export declare function setsEqual(a: Set<string>, b: Set<string>): boolean;
export declare function isSubset(a: Set<string>, b: Set<string>): boolean;
//# sourceMappingURL=framework.d.ts.map