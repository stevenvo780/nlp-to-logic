export type LogicOperation = 'AND' | 'OR' | 'IMPLIES' | 'IFF' | 'NOT';
export type QuantifierType = 'FORALL' | 'EXISTS' | 'EXACTLY_N';
export type ModalOperator = 'K' | 'B' | 'O' | 'P' | 'F' | 'BOX' | 'DIA' | 'ALWAYS' | 'EVENTUALLY' | 'NEXT';
export type TemporalBinaryOp = 'UNTIL';
export type MathOp = 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MOD' | 'EQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE';
export interface BaseNode {
    type: string;
}
export interface AtomNode extends BaseNode {
    type: 'Atom';
    id: string;
    text: string;
}
export interface ConnectiveNode extends BaseNode {
    type: 'Connective';
    operator: LogicOperation;
    left: LogicNode;
    right?: LogicNode;
}
export interface QuantifierNode extends BaseNode {
    type: 'Quantifier';
    operator: QuantifierType;
    variables: string[];
    exactCount?: number;
    child: LogicNode;
}
export interface ModalNode extends BaseNode {
    type: 'Modal';
    operator: ModalOperator;
    agent?: string;
    child: LogicNode;
}
export interface TemporalNode extends BaseNode {
    type: 'TemporalBinary';
    operator: TemporalBinaryOp;
    left: LogicNode;
    right: LogicNode;
}
export interface PredicateNode extends BaseNode {
    type: 'Predicate';
    name: string;
    args: LogicNode[];
}
export interface ObjectNode extends BaseNode {
    type: 'Object';
    name: string;
}
export interface MathNode extends BaseNode {
    type: 'Math';
    operator: MathOp;
    left: LogicNode;
    right: LogicNode;
}
export interface ProbabilityNode extends BaseNode {
    type: 'Probability';
    value: number;
    child: LogicNode;
}
export interface RefNode extends BaseNode {
    type: 'Ref';
    targetId: string;
}
export type LogicNode = AtomNode | ConnectiveNode | QuantifierNode | ModalNode | TemporalNode | PredicateNode | ObjectNode | MathNode | ProbabilityNode | RefNode;
export declare const AST: {
    atom(id: string, text: string): AtomNode;
    and(left: LogicNode, right: LogicNode): ConnectiveNode;
    or(left: LogicNode, right: LogicNode): ConnectiveNode;
    implies(left: LogicNode, right: LogicNode): ConnectiveNode;
    not(child: LogicNode): ConnectiveNode;
    forall(variables: string[], child: LogicNode): QuantifierNode;
    exists(variables: string[], child: LogicNode): QuantifierNode;
    exactlyN(variables: string[], count: number, child: LogicNode): QuantifierNode;
    modal(operator: ModalOperator, child: LogicNode, agent?: string): ModalNode;
    temporalUntil(left: LogicNode, right: LogicNode): TemporalNode;
    predicate(name: string, args: LogicNode[]): PredicateNode;
    obj(name: string): ObjectNode;
    math(operator: MathOp, left: LogicNode, right: LogicNode): MathNode;
    probability(value: number, child: LogicNode): ProbabilityNode;
    ref(targetId: string): RefNode;
};
//# sourceMappingURL=ast.d.ts.map