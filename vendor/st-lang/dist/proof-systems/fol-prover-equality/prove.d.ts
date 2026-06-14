import type { Formula } from '../../types';
import type { FOLClause } from '../fol-prover/types';
import type { EqualityProveOptions, EqualityProveResult } from './types';
declare function rewriteEqualityClause(c: FOLClause): FOLClause;
export declare function proveWithEquality(premises: Formula[], goal: Formula, opts?: EqualityProveOptions): EqualityProveResult;
export { rewriteEqualityClause };
//# sourceMappingURL=prove.d.ts.map