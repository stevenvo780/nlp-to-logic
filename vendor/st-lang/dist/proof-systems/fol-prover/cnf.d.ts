import { Formula } from '../../types';
import { FOLClause } from './types';
export declare function negate(f: Formula): Formula;
export interface CNFArtifacts {
    clauses: FOLClause[];
    skolemized: Formula;
}
export declare function skolemize(formula: Formula): Formula;
export declare function toCNF(formula: Formula): FOLClause[];
//# sourceMappingURL=cnf.d.ts.map