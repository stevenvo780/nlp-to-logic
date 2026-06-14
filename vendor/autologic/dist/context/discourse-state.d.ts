import { LogicNode } from '../formula/ast';
export declare class DiscourseState {
    private prevStates;
    private statementCounter;
    registerStatement(node: LogicNode): string;
    getLastStatementId(): string | undefined;
    resolvePronoun(pronoun: string): string | undefined;
}
export declare const globalDrt: DiscourseState;
//# sourceMappingURL=discourse-state.d.ts.map