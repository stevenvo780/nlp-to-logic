import { FOLTerm, FOLLiteral, FOLClause } from './types';
type Subst = Map<string, FOLTerm>;
export declare function unify(t1: FOLTerm, t2: FOLTerm, sigma?: Subst): Subst | null;
export declare function applyTerm(t: FOLTerm, s: Subst): FOLTerm;
export declare function applyLiteral(lit: FOLLiteral, s: Subst): FOLLiteral;
export declare function applyClause(c: FOLClause, s: Subst): FOLClause;
export declare function substToRecord(s: Subst): Record<string, string>;
export {};
//# sourceMappingURL=unify.d.ts.map