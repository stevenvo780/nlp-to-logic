import type { ArgumentationFramework, ComputeOptions, Semantics } from './types';
export declare function groundedExtension(af: ArgumentationFramework): Set<string>;
export declare function isComplete(af: ArgumentationFramework, set: Set<string>): boolean;
export declare function isStable(af: ArgumentationFramework, set: Set<string>): boolean;
export declare function lazyAdmissibleSets(af: ArgumentationFramework): Generator<Set<string>>;
export declare function preferredExtensions(af: ArgumentationFramework, options: Required<ComputeOptions>): Set<string>[];
export declare function completeExtensions(af: ArgumentationFramework, options: Required<ComputeOptions>): Set<string>[];
export declare function stableExtensions(af: ArgumentationFramework, options: Required<ComputeOptions>): Set<string>[];
export declare function semiStableExtensions(af: ArgumentationFramework, options: Required<ComputeOptions>): Set<string>[];
export declare function computeExtensions(af: ArgumentationFramework, semantics: Semantics, options?: ComputeOptions): Set<string>[];
//# sourceMappingURL=extensions.d.ts.map