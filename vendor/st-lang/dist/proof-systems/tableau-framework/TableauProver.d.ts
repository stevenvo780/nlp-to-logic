import type { Tableau, TableauBranch, Rule, ClosureCondition } from './types';
export declare class TableauProver<F> {
    private rules;
    private closureConditions;
    registerRule(rule: Rule<F>): void;
    registerClosureCondition(check: ClosureCondition<F>): void;
    prove(root: TableauBranch<F>, maxDepth?: number): Tableau<F>;
    private checkClosure;
}
//# sourceMappingURL=TableauProver.d.ts.map